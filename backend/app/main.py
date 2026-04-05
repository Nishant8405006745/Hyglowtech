"""
Hyglow API — FastAPI entrypoint.

Run locally: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000` from the `backend/` directory.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, OperationalError, ProgrammingError
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.routers import auth, employees, roles, users

logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Log once at startup if the database is unreachable (helps debug signup/login failures)."""
    from app.database import engine

    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Database connection OK")
    except Exception as e:
        logger.error(
            "Database unreachable: %s. Set DATABASE_URL in backend/.env and run: alembic upgrade head",
            e,
        )
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Hyglow SaaS API — JWT auth, RBAC, users & employees.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Role-based access is enforced per route via FastAPI dependencies (`require_roles`, `get_current_user`)
# in `app/deps.py` — the same gate pattern platforms often call "authorization middleware."


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    """Normalize validation errors — avoid leaking internal field paths in production if desired."""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "message": "Validation error"},
    )


@app.exception_handler(OperationalError)
async def sqlalchemy_operational_handler(request: Request, exc: OperationalError) -> JSONResponse:
    """DB down, wrong credentials, or missing DB — common cause of 'signup/signin failed'."""
    logger.warning("Database operational error: %s", exc)
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "detail": (
                "Database unavailable. In backend/.env set a valid DATABASE_URL (e.g. Neon), "
                "ensure PostgreSQL is reachable, then run: alembic upgrade head"
            ),
        },
    )


@app.exception_handler(ProgrammingError)
async def sqlalchemy_programming_handler(request: Request, exc: ProgrammingError) -> JSONResponse:
    """e.g. tables not created — migrations not applied."""
    logger.warning("Database programming error: %s", exc)
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "detail": "Database tables are missing. From the backend folder run: alembic upgrade head",
        },
    )


@app.exception_handler(IntegrityError)
async def sqlalchemy_integrity_handler(request: Request, exc: IntegrityError) -> JSONResponse:
    """Duplicate email, FK violations, etc. — avoids raw 500 Internal Server Error."""
    logger.warning("Integrity error: %s", exc)
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": "This record already exists or conflicts with existing data (e.g. email in use)."},
    )


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok", "app": settings.app_name}


@app.get("/health/db", tags=["health"])
def health_db(db: Session = Depends(get_db)) -> dict[str, str]:
    """Returns 200 only if a DB query succeeds (useful when /health is OK but auth fails)."""
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}


api_prefix = "/api/v1"
app.include_router(auth.router, prefix=api_prefix)
app.include_router(users.router, prefix=api_prefix)
app.include_router(employees.router, prefix=api_prefix)
app.include_router(roles.router, prefix=api_prefix)
