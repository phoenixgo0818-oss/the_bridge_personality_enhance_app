"""
Bricks API: daily brick CRUD and streak.

Endpoints: GET/POST /bricks/today, PATCH /bricks/today/laid, GET /bricks/streak, GET /bricks
"""
import sqlite3
from datetime import date, timedelta
from fastapi import APIRouter, HTTPException

from app.database import get_connection
from app.models import BrickCreate

router = APIRouter(prefix="/bricks", tags=["bricks"])
USER_ID = 1  # Phase 1: single user


def _today() -> str:
    """ISO date string (YYYY-MM-DD) for today. Used for brick lookups."""
    return date.today().isoformat()


@router.get("/today")
def get_today_brick():
    """
    GET /bricks/today - Returns today's brick or null if none.
    Frontend uses this to decide: show add-form or show brick + mark-as-laid.
    """
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT id, date, brick_text, laid FROM bricks WHERE user_id = ? AND date = ?",
            (USER_ID, _today()),
        ).fetchone()
        if not row:
            return None
        # SQLite stores 0/1; we convert to bool for JSON
        return {
            "id": row["id"],
            "date": row["date"],
            "brick_text": row["brick_text"],
            "laid": bool(row["laid"]),
        }
    finally:
        conn.close()


@router.post("/today")
def create_today_brick(body: BrickCreate):
    """
    POST /bricks/today - Creates a brick for today.
    Returns 409 if a brick already exists (UNIQUE constraint triggers IntegrityError).
    """
    text = body.brick_text.strip()
    conn = get_connection()
    try:
        conn.execute(
            """INSERT INTO bricks (user_id, date, brick_text, laid, created_at)
               VALUES (?, ?, ?, 0, datetime('now'))""",
            (USER_ID, _today(), text),
        )
        conn.commit()
        row = conn.execute("SELECT last_insert_rowid()").fetchone()
        bid = row[0]
        return {"id": bid, "date": _today(), "brick_text": text, "laid": False}
    except sqlite3.IntegrityError:
        # UNIQUE(user_id, date) violated = duplicate brick for today
        raise HTTPException(status_code=409, detail="One brick per day; today already has a brick")
    finally:
        conn.close()


@router.patch("/today/laid")
def mark_today_laid():
    """
    PATCH /bricks/today/laid - Marks today's brick as laid (done).
    Returns 404 if there is no brick for today.
    """
    conn = get_connection()
    try:
        cur = conn.execute(
            "UPDATE bricks SET laid = 1 WHERE user_id = ? AND date = ?",
            (USER_ID, _today()),
        )
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="No brick for today to mark as laid")
        return {"ok": True}
    finally:
        conn.close()


@router.get("/streak")
def get_streak():
    """
    GET /bricks/streak - Consecutive days (ending today) with at least one brick laid.
    Algorithm: start from today, walk backward while each day has a laid brick.
    """
    conn = get_connection()
    try:
        rows = conn.execute(
            """SELECT date FROM bricks WHERE user_id = ? AND laid = 1 ORDER BY date DESC""",
            (USER_ID,),
        ).fetchall()
    finally:
        conn.close()

    dates_with_laid = {r["date"] for r in rows}
    streak = 0
    d = date.today()
    while d.isoformat() in dates_with_laid:
        streak += 1
        d -= timedelta(days=1)
    return {"streak_days": streak}


@router.get("")
def list_bricks(limit: int = 30):
    """
    GET /bricks?limit=30 - Returns the most recent bricks (for history view).
    Not used in Phase 1 UI; available for future features.
    """
    conn = get_connection()
    try:
        rows = conn.execute(
            """SELECT id, date, brick_text, laid FROM bricks WHERE user_id = ?
               ORDER BY date DESC LIMIT ?""",
            (USER_ID, limit),
        ).fetchall()
        return [
            {
                "id": r["id"],
                "date": r["date"],
                "brick_text": r["brick_text"],
                "laid": bool(r["laid"]),
            }
            for r in rows
        ]
    finally:
        conn.close()
