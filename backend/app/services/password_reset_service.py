"""Create and consume password reset tokens."""

import hashlib
import logging
import secrets
from datetime import UTC, datetime, timedelta

from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.password_reset_token import PasswordResetToken
from app.models.user import User
from app.security import hash_password

logger = logging.getLogger(__name__)

TOKEN_BYTES = 32
RESET_VALID_HOURS = 24


def _hash_token(raw: str) -> str:
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def request_reset(db: Session, email: str) -> None:
    """If user exists, invalidate old tokens and store a new one; log link for dev (no SMTP yet)."""
    normalized = email.lower().strip()
    user = db.query(User).filter(User.email == normalized).first()
    if user is None:
        return

    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.used_at.is_(None),
    ).delete(synchronize_session=False)

    raw = secrets.token_urlsafe(TOKEN_BYTES)
    token_hash = _hash_token(raw)
    expires = datetime.now(UTC) + timedelta(hours=RESET_VALID_HOURS)
    row = PasswordResetToken(user_id=user.id, token_hash=token_hash, expires_at=expires)
    db.add(row)
    db.commit()

    settings = get_settings()
    link = f"{settings.frontend_base_url.rstrip('/')}/reset-password?token={raw}"
    if settings.log_password_reset_links:
        logger.info("Password reset requested for %s — open: %s", normalized, link)
    else:
        logger.info("Password reset requested for %s (link not logged; configure email delivery)", normalized)


def reset_password(db: Session, raw_token: str, new_password: str) -> None:
    """Apply new password or raise ValueError with a safe message."""
    if len(new_password) < 8:
        raise ValueError("Password too short")
    th = _hash_token(raw_token.strip())
    row = (
        db.query(PasswordResetToken)
        .filter(PasswordResetToken.token_hash == th, PasswordResetToken.used_at.is_(None))
        .first()
    )
    if row is None:
        raise ValueError("Invalid or expired reset link")
    if row.expires_at < datetime.now(UTC):
        raise ValueError("Invalid or expired reset link")

    user = db.query(User).filter(User.id == row.user_id).first()
    if user is None:
        raise ValueError("Invalid or expired reset link")

    user.hashed_password = hash_password(new_password)
    row.used_at = datetime.now(UTC)
    db.add(user)
    db.add(row)
    db.commit()
