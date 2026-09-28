from typing import Optional
from pydantic import BaseModel, Field, field_validator


class ComplaintCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10, max_length=5000)
    product_service: Optional[str] = None
    order_reference: Optional[str] = None
    channel: Optional[str] = "web"

    @field_validator("description")
    @classmethod
    def not_just_whitespace(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Complaint description cannot be empty or just spaces")
        return v