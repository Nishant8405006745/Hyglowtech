"""Application configuration loaded from environment variables."""

from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Hyglow"
    database_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    cors_origins: str = "http://localhost:3000"
    # Used to build reset links when email is not configured (see password reset flow).
    frontend_base_url: str = "http://localhost:3000"
    # Set false in production once you send reset links via email instead of server logs.
    log_password_reset_links: bool = True

    @field_validator("database_url")
    @classmethod
    def sqlalchemy_url(cls, v: str) -> str:
        """Normalize Neon URLs for SQLAlchemy + psycopg3."""
        if v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+psycopg://", 1)
        return v

    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
