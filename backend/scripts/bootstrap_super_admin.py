#!/usr/bin/env python3
"""
Create the first Super Admin if none exists. Run from `backend/` after migrations:

  export DATABASE_URL="postgresql+psycopg://..."
  export SUPER_ADMIN_EMAIL="you@company.com"
  export SUPER_ADMIN_PASSWORD="secure-password"
  export SUPER_ADMIN_NAME="Owner"
  python -m scripts.bootstrap_super_admin
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.constants import ROLE_SUPER_ADMIN
from app.database import SessionLocal
from app.schemas.user import UserCreate
from app.services import user_service


def main() -> None:
    email = os.environ.get("SUPER_ADMIN_EMAIL", "").strip().lower()
    password = os.environ.get("SUPER_ADMIN_PASSWORD", "")
    name = os.environ.get("SUPER_ADMIN_NAME", "Super Admin").strip()
    if not email or not password:
        print("Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD", file=sys.stderr)
        sys.exit(1)

    db = SessionLocal()
    try:
        if user_service.get_user_by_email(db, email):
            print("User already exists:", email)
            return
        user_service.create_user(
            db,
            UserCreate(
                name=name,
                email=email,
                password=password,
                role_name=ROLE_SUPER_ADMIN,
            ),
        )
        print("Super Admin created:", email)
    finally:
        db.close()


if __name__ == "__main__":
    main()
