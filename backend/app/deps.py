"""FastAPI dependencies: DB session, JWT user, role guards."""

from collections.abc import Callable, Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.orm import Session, joinedload

from app.constants import ALL_ROLES
from app.database import get_db
from app.models.user import User
from app.security import decode_token

security = HTTPBearer(auto_error=False)


def get_current_user(
    db: Session = Depends(get_db),
    creds: HTTPAuthorizationCredentials | None = Depends(security),
) -> User:
    if creds is None or not creds.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = decode_token(creds.credentials)
        sub = payload.get("sub")
        if sub is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user_id = int(sub)
    except (JWTError, ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = (
        db.query(User)
        .options(joinedload(User.role_rel))
        .filter(User.id == user_id)
        .first()
    )
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if user.role_rel is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is missing a role assignment. Contact an administrator.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def require_roles(*allowed_role_names: str) -> Callable[[User], User]:
    """Return a dependency that ensures the current user's role is one of `allowed_role_names`."""

    allowed = set(allowed_role_names)
    invalid = allowed - set(ALL_ROLES)
    if invalid:
        raise ValueError(f"Unknown role names in require_roles: {invalid}")

    def _dep(user: User = Depends(get_current_user)) -> User:
        role_name = user.role_rel.role_name
        if role_name not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions for this resource",
            )
        return user

    return _dep


def user_role_name(user: User) -> str:
    return user.role_rel.role_name
