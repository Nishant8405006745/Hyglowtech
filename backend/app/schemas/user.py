"""User CRUD schemas."""

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.schemas.sanitize import strip_str


class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr

    @field_validator("name", mode="before")
    @classmethod
    def clean_name(cls, v: str) -> str:
        return strip_str(v)


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)
    role_name: str = Field(..., min_length=1, max_length=64)

    @field_validator("role_name", mode="before")
    @classmethod
    def clean_role(cls, v: str) -> str:
        return strip_str(v)


class UserUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=255)
    email: EmailStr | None = None
    password: str | None = Field(None, min_length=8, max_length=128)
    role_name: str | None = Field(None, min_length=1, max_length=64)

    @field_validator("name", "role_name", mode="before")
    @classmethod
    def strip_optional(cls, v: str | None) -> str | None:
        if v is None:
            return None
        s = strip_str(v)
        return s or None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    model_config = {"from_attributes": True}


class RoleAssignRequest(BaseModel):
    role_name: str = Field(..., min_length=1, max_length=64)

    @field_validator("role_name", mode="before")
    @classmethod
    def clean_role(cls, v: str) -> str:
        return strip_str(v)
