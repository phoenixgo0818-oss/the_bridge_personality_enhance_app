"""
Pydantic models for API request/response.

Pydantic validates incoming JSON and outgoing responses. FastAPI uses these
to auto-generate OpenAPI docs and return clear validation errors.
"""
from pydantic import BaseModel, Field


# ----- Profile -----
class ProfileUpdate(BaseModel):
    """PUT /profile body: fields the client sends to update the profile."""
    current_self: str = Field("", description="Who am I today?")
    future_self: str = Field("", description="Who do I want to become?")


class ProfileResponse(BaseModel):
    """Response shape for GET /profile."""
    current_self: str
    future_self: str


# ----- Bricks -----
class BrickCreate(BaseModel):
    """POST /bricks/today body: ... = required field."""
    brick_text: str = Field(..., min_length=1, max_length=500)


class BrickUpdate(BaseModel):
    """Reserved for future PATCH /bricks/:id (not used in Phase 1)."""
    laid: bool = True


class BrickResponse(BaseModel):
    """Response shape for a single brick."""
    id: int
    date: str
    brick_text: str
    laid: bool

    class Config:
        from_attributes = True  # Allow creating from ORM/dict-like objects


class StreakResponse(BaseModel):
    """GET /bricks/streak response."""
    streak_days: int
