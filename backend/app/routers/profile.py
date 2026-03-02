"""
Profile API: GET/PUT for "Who am I today?" and "Who do I want to become?"

All routes are under /profile (prefix set below).
"""
from datetime import datetime
from fastapi import APIRouter, HTTPException

from app.database import get_connection
from app.models import ProfileUpdate

router = APIRouter(prefix="/profile", tags=["profile"])
USER_ID = 1  # Phase 1: single user; replace with auth user id later


@router.get("")
def get_profile():
    """
    GET /profile - Returns the user's current_self and future_self.
    Used by the frontend to pre-fill the two textareas.
    """
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT current_self, future_self FROM user_profile WHERE user_id = ?", (USER_ID,)
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Profile not found")
        # SQLite stores NULL as None; we return "" for display
        return {"current_self": row["current_self"] or "", "future_self": row["future_self"] or ""}
    finally:
        conn.close()


@router.put("")
def update_profile(body: ProfileUpdate):
    """
    PUT /profile - Updates the profile. FastAPI validates body as ProfileUpdate.
    """
    conn = get_connection()
    try:
        conn.execute(
            """UPDATE user_profile SET current_self = ?, future_self = ?, updated_at = ?
               WHERE user_id = ?""",
            (body.current_self, body.future_self, datetime.utcnow().isoformat(), USER_ID),
        )
        conn.commit()
        if conn.total_changes == 0:
            raise HTTPException(status_code=404, detail="Profile not found")
        return {"current_self": body.current_self, "future_self": body.future_self}
    finally:
        conn.close()
