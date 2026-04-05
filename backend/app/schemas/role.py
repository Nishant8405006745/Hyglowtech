"""Role list / public schemas."""

from pydantic import BaseModel


class RoleResponse(BaseModel):
    id: int
    role_name: str

    model_config = {"from_attributes": True}
