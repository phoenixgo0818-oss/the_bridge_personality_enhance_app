"""
SQLite database setup. Creates tables on startup if they don't exist.
Phase 1: single user (user_id=1). No auth yet.

SQLite stores everything in one file (bridge.db). No separate DB server needed.
"""
import sqlite3
from pathlib import Path

# Path to DB file: backend/bridge.db (relative to this file's location)
DB_PATH = Path(__file__).resolve().parent.parent / "bridge.db"


def get_connection():
    """
    Open a connection to the SQLite database.
    row_factory=sqlite3.Row lets us access columns by name: row['current_self']
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """
    Create tables if they don't exist.
    Runs on app startup so a fresh clone can run without manual DB setup.
    """
    conn = get_connection()
    try:
        conn.executescript("""
            -- One row per user; Phase 1 has exactly one user (id=1)
            CREATE TABLE IF NOT EXISTS user_profile (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                user_id INTEGER NOT NULL DEFAULT 1,
                current_self TEXT NOT NULL DEFAULT '',
                future_self TEXT NOT NULL DEFAULT '',
                updated_at TEXT
            );
            INSERT OR IGNORE INTO user_profile (id, user_id, current_self, future_self, updated_at)
            VALUES (1, 1, '', '', datetime('now'));

            -- One brick per user per day; UNIQUE enforces "one brick per day" in the DB
            CREATE TABLE IF NOT EXISTS bricks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL DEFAULT 1,
                date TEXT NOT NULL,
                brick_text TEXT NOT NULL,
                laid INTEGER NOT NULL DEFAULT 0,
                created_at TEXT,
                UNIQUE(user_id, date)
            );
        """)
        conn.commit()
    finally:
        conn.close()
