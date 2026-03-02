"""
The Bridge – FastAPI app.
Phase 1: profile + daily brick + streak. Single user, SQLite.

This is the entry point: it creates the app, wires middleware, and mounts routers.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import bricks, profile


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Runs when the app starts (before handling requests) and when it shuts down.
    We use it to create the SQLite tables if they don't exist.
    """
    init_db()
    yield  # App runs here; after yield = shutdown logic (none for now)


app = FastAPI(
    title="The Bridge",
    description="Daily practice app – bridge the gap between current and future self.",
    lifespan=lifespan,
)

# CORS: allows the frontend (localhost:5173) to call this API from the browser.
# Without this, the browser would block cross-origin requests for security.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers: profile endpoints under /profile, brick endpoints under /bricks
app.include_router(profile.router)
app.include_router(bricks.router)


@app.get("/")
def root():
    """Health check: confirms the API is running."""
    return {"app": "The Bridge", "phase": 1}
