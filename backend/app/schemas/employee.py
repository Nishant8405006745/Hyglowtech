"""Employee CRUD schemas."""

from pydantic import BaseModel, Field, field_validator

from app.schemas.sanitize import strip_str


class EmployeeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)

    @field_validator("name", mode="before")
    @classmethod
    def clean_name(cls, v: str) -> str:
        return strip_str(v)


class EmployeeCreate(EmployeeBase):
    manager_id: int | None = None


class EmployeeUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=255)
    manager_id: int | None = None

    @field_validator("name", mode="before")
    @classmethod
    def clean_name(cls, v: str | None) -> str | None:
        if v is None:
            return None
        s = strip_str(v)
        return s or None


class EmployeeResponse(BaseModel):
    id: int
    name: str
    manager_id: int | None

    model_config = {"from_attributes": True}
