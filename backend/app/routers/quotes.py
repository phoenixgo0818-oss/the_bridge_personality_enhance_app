"""
Quotes API: GET for golden sayings used on the landing page.
"""
from fastapi import APIRouter

from app.database import get_connection

router = APIRouter(prefix="/quotes", tags=["quotes"])


@router.get("")
def get_quotes():
    """
    GET /quotes - Returns all golden sayings for the landing page.
    Each item has quote_text, individual, nation.
    """
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT quote_text, individual, nation FROM quotes ORDER BY id"
        ).fetchall()
        return [
            {
                "quote_text": row["quote_text"],
                "individual": row["individual"],
                "nation": row["nation"],
            }
            for row in rows
        ]
    finally:
        conn.close()
