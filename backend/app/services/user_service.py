"""User persistence helpers."""

from sqlalchemy.orm import Session, joinedload

from app.constants import ROLE_SUPER_ADMIN, USER_ADMIN_ROLES
from app.models.role import Role
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.security import hash_password


def get_user_by_email(db: Session, email: str) -> User | None:
    return (
        db.query(User)
        .options(joinedload(User.role_rel))
        .filter(User.email == email.lower().strip())
        .first()
    )


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return (
        db.query(User)
        .options(joinedload(User.role_rel))
        .filter(User.id == user_id)
        .first()
    )


def list_users(db: Session) -> list[User]:
    return db.query(User).options(joinedload(User.role_rel)).order_by(User.id).all()


def resolve_role(db: Session, role_name: str) -> Role | None:
    return db.query(Role).filter(Role.role_name == role_name).first()


def create_user(db: Session, data: UserCreate) -> User:
    role = resolve_role(db, data.role_name)
    if role is None:
        raise ValueError("Unknown role_name")
    user = User(
        name=data.name,
        email=str(data.email).lower().strip(),
        hashed_password=hash_password(data.password),
        role_id=role.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return get_user_by_id(db, user.id)  # type: ignore[return-value]


def update_user(
    db: Session,
    target: User,
    data: UserUpdate,
    *,
    actor_role: str,
) -> User:
    if data.name is not None:
        target.name = data.name
    if data.email is not None:
        target.email = str(data.email).lower().strip()
    if data.password is not None:
        target.hashed_password = hash_password(data.password)
    if data.role_name is not None:
        if data.role_name == ROLE_SUPER_ADMIN and actor_role != ROLE_SUPER_ADMIN:
            raise PermissionError("Only Super Admin can assign Super Admin role")
        role = resolve_role(db, data.role_name)
        if role is None:
            raise ValueError("Unknown role_name")
        target.role_id = role.id
    db.add(target)
    db.commit()
    db.refresh(target)
    return get_user_by_id(db, target.id)  # type: ignore[return-value]


def delete_user(db: Session, target: User) -> None:
    db.delete(target)
    db.commit()


def can_actor_modify_target(actor: User, target: User) -> bool:
    """Admins cannot delete or demote the last Super Admin arbitrarily — keep simple rules."""
    ar = actor.role_rel.role_name
    tr = target.role_rel.role_name
    if ar not in USER_ADMIN_ROLES:
        return False
    if tr == ROLE_SUPER_ADMIN and ar != ROLE_SUPER_ADMIN:
        return False
    return True
