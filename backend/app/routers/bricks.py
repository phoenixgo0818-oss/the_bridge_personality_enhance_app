"""
Bricks API: daily action items (bricks) and streak.

Multiple action items per day. Streak counts only when ALL items for that day are laid.
Endpoints: GET/POST /bricks/today, PATCH /bricks/{id}/laid, GET /bricks/streak, GET /bricks
"""
from collections import defaultdict
from datetime import date, timedelta
from fastapi import APIRouter, HTTPException

from app.database import get_connection
from app.models import BrickCreate

router = APIRouter(prefix="/bricks", tags=["bricks"])
USER_ID = 1  # Phase 1: single user


def _today() -> str:
    """ISO date string (YYYY-MM-DD) for today. Used for brick lookups."""
    return date.today().isoformat()


def _row_to_brick(r) -> dict:
    """Convert DB row to API brick dict (SQLite 0/1 -> bool)."""
    return {
        "id": r["id"],
        "date": r["date"],
        "brick_text": r["brick_text"],
        "laid": bool(r["laid"]),
    }


@router.get("/today")
def get_today_bricks():
    """
    GET /bricks/today - Returns list of today's action items (bricks).
    Empty list if none. Frontend shows add-form + list of items with mark-as-laid each.
    """
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT id, date, brick_text, laid FROM bricks WHERE user_id = ? AND date = ? ORDER BY id",
            (USER_ID, _today()),
        ).fetchall()
        return [_row_to_brick(r) for r in rows]
    finally:
        conn.close()


@router.post("/today")
def create_today_brick(body: BrickCreate):
    """
    POST /bricks/today - Adds a new action item for today.
    Multiple items per day allowed.
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
    finally:
        conn.close()


@router.patch("/{brick_id}/laid")
def mark_brick_laid(brick_id: int):
    """
    PATCH /bricks/{id}/laid - Marks a specific action item as laid (done).
    Returns 404 if brick not found or not owned by user.
    """
    conn = get_connection()
    try:
        cur = conn.execute(
            "UPDATE bricks SET laid = 1 WHERE id = ? AND user_id = ?",
            (brick_id, USER_ID),
        )
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Brick not found")
        return {"ok": True}
    finally:
        conn.close()


@router.get("/streak")
def get_streak():
    """
    GET /bricks/streak - Consecutive days (ending today) where ALL action items are laid.
    A day counts only if it has at least one brick and every brick for that day has laid=1.
    """
    conn = get_connection()
    try:
        rows = conn.execute(
            """SELECT date, laid FROM bricks WHERE user_id = ? ORDER BY date""",
            (USER_ID,),
        ).fetchall()
    finally:
        conn.close()

    # Per day: collect all bricks and check if all are laid
    by_date = defaultdict(list)
    for r in rows:
        by_date[r["date"]].append(bool(r["laid"]))

    def day_complete(d: date) -> bool:
        key = d.isoformat()
        items = by_date.get(key, [])
        if not items:
            return False  # No items = day doesn't count
        return all(items)

    streak = 0
    d = date.today()
    while day_complete(d):
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
