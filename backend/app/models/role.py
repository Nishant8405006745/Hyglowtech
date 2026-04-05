"""Role catalog — Super Admin, Admin, Manager, User."""

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    role_name: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)

    users: Mapped[list["User"]] = relationship("User", back_populates="role_rel")
