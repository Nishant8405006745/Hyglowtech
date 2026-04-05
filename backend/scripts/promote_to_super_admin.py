#!/usr/bin/env python3
"""
Promote an existing user to Super Admin by email (no password change).

  cd backend && source .venv/bin/activate
  export TARGET_EMAIL="you@company.com"
  PYTHONPATH=. python scripts/promote_to_super_admin.py
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.constants import ROLE_SUPER_ADMIN
from app.database import SessionLocal
from app.services import user_service


def main() -> None:
    email = os.environ.get("TARGET_EMAIL", "").strip().lower()
    if not email:
        print("Set TARGET_EMAIL", file=sys.stderr)
        sys.exit(1)

    db = SessionLocal()
    try:
        u = user_service.get_user_by_email(db, email)
        if u is None:
            print("No user with that email. Create one first (signup or bootstrap_super_admin).", file=sys.stderr)
            sys.exit(1)
        role = user_service.resolve_role(db, ROLE_SUPER_ADMIN)
        if role is None:
            print("Super Admin role missing — run migrations.", file=sys.stderr)
            sys.exit(1)
        u.role_id = role.id
        db.add(u)
        db.commit()
        print("Promoted to Super Admin:", email)
    finally:
        db.close()


if __name__ == "__main__":
    main()
