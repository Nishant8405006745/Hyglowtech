"""Role catalog (for admin UI dropdowns)."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.constants import ROLE_ADMIN, ROLE_SUPER_ADMIN
from app.database import get_db
from app.deps import require_roles
from app.models.role import Role
from app.models.user import User
from app.schemas.role import RoleResponse

router = APIRouter(prefix="/roles", tags=["roles"])

_admin_only = require_roles(ROLE_SUPER_ADMIN, ROLE_ADMIN)


@router.get("", response_model=list[RoleResponse])
def list_roles(
    db: Session = Depends(get_db),
    _: User = Depends(_admin_only),
) -> list[Role]:
    return db.query(Role).order_by(Role.id).all()
