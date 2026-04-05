"""Auth-related Pydantic models."""

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.schemas.sanitize import strip_str


class SignupRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)

    @field_validator("name", mode="before")
    @classmethod
    def clean_name(cls, v: str) -> str:
        return strip_str(v)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserMeResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    model_config = {"from_attributes": True}


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ForgotPasswordResponse(BaseModel):
    message: str = "If an account exists for that email, password reset instructions have been issued."


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., min_length=10, max_length=512)
    new_password: str = Field(..., min_length=8, max_length=128)

    @field_validator("token", mode="before")
    @classmethod
    def strip_token(cls, v: str) -> str:
        return strip_str(v)
