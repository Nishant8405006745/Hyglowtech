"""User management (Admin / Super Admin)."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.constants import ROLE_ADMIN, ROLE_SUPER_ADMIN, USER_ADMIN_ROLES
from app.database import get_db
from app.deps import get_current_user, require_roles
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.services import user_service

router = APIRouter(prefix="/users", tags=["users"])

_admin_user = require_roles(ROLE_SUPER_ADMIN, ROLE_ADMIN)


@router.get("", response_model=list[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    _: User = Depends(_admin_user),
) -> list[UserResponse]:
    users = user_service.list_users(db)
    return [
        UserResponse(id=u.id, name=u.name, email=u.email, role=u.role_rel.role_name)
        for u in users
    ]


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user_route(
    body: UserCreate,
    db: Session = Depends(get_db),
    actor: User = Depends(_admin_user),
) -> UserResponse:
    if user_service.get_user_by_email(db, str(body.email)):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Email already exists")
    try:
        if body.role_name == ROLE_SUPER_ADMIN and actor.role_rel.role_name != ROLE_SUPER_ADMIN:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Only Super Admin can assign Super Admin")
        u = user_service.create_user(db, body)
    except ValueError as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(e)) from e
    return UserResponse(id=u.id, name=u.name, email=u.email, role=u.role_rel.role_name)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
) -> UserResponse:
    u = user_service.get_user_by_id(db, user_id)
    if u is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    if actor.id != user_id and actor.role_rel.role_name not in USER_ADMIN_ROLES:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cannot view this user")
    return UserResponse(id=u.id, name=u.name, email=u.email, role=u.role_rel.role_name)


@router.patch("/{user_id}", response_model=UserResponse)
def update_user_route(
    user_id: int,
    body: UserUpdate,
    db: Session = Depends(get_db),
    actor: User = Depends(_admin_user),
) -> UserResponse:
    target = user_service.get_user_by_id(db, user_id)
    if target is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    if not user_service.can_actor_modify_target(actor, target):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cannot modify this user")
    try:
        u = user_service.update_user(
            db,
            target,
            body,
            actor_role=actor.role_rel.role_name,
        )
    except PermissionError as e:
        raise HTTPException(status.HTTP_403_FORBIDDEN, str(e)) from e
    except ValueError as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(e)) from e
    return UserResponse(id=u.id, name=u.name, email=u.email, role=u.role_rel.role_name)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_route(
    user_id: int,
    db: Session = Depends(get_db),
    actor: User = Depends(_admin_user),
) -> None:
    target = user_service.get_user_by_id(db, user_id)
    if target is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    if target.id == actor.id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Cannot delete yourself")
    if not user_service.can_actor_modify_target(actor, target):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cannot delete this user")
    user_service.delete_user(db, target)
