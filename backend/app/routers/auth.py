"""Signup, login, and current user profile."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.constants import ROLE_USER
from app.database import get_db
from app.deps import get_current_user
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    ResetPasswordRequest,
    SignupRequest,
    TokenResponse,
    UserMeResponse,
)
from app.schemas.user import UserCreate
from app.security import create_access_token, verify_password
from app.services import password_reset_service, user_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=UserMeResponse, status_code=status.HTTP_201_CREATED)
def signup(body: SignupRequest, db: Session = Depends(get_db)) -> UserMeResponse:
    if user_service.get_user_by_email(db, str(body.email)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    role = user_service.resolve_role(db, ROLE_USER)
    if role is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Default role is missing. Run database migrations: alembic upgrade head",
        )
    try:
        user = user_service.create_user(
            db,
            UserCreate(
                name=body.name,
                email=body.email,
                password=body.password,
                role_name=ROLE_USER,
            ),
        )
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        ) from None
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e

    if user.role_rel is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="User was created but role data failed to load. Check database integrity.",
        )
    return UserMeResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role_rel.role_name,
    )


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = user_service.get_user_by_email(db, str(body.email))
    if user is None or user.role_rel is None or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    token = create_access_token(
        str(user.id),
        extra_claims={"email": user.email, "role": user.role_rel.role_name},
    )
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserMeResponse)
def me(current: User = Depends(get_current_user)) -> UserMeResponse:
    return UserMeResponse(
        id=current.id,
        name=current.name,
        email=current.email,
        role=current.role_rel.role_name,
    )


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(body: ForgotPasswordRequest, db: Session = Depends(get_db)) -> ForgotPasswordResponse:
    """Always returns the same message to avoid email enumeration."""
    password_reset_service.request_reset(db, str(body.email))
    return ForgotPasswordResponse()


@router.post("/reset-password", status_code=status.HTTP_204_NO_CONTENT)
def reset_password_route(body: ResetPasswordRequest, db: Session = Depends(get_db)) -> None:
    try:
        password_reset_service.reset_password(db, body.token, body.new_password)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e
