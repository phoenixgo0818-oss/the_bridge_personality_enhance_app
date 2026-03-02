# The Bridge

A daily practice app that helps you bridge the gap between your current self and your future self, one brick at a time.

**Phase 1 (MVP):** Profile (current self / future self), daily brick, mark as laid, streak counter. Single user, SQLite, no auth.

---

## Quick start

### 1. Backend (FastAPI + SQLite)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at **http://localhost:8000**. API docs: **http://localhost:8000/docs**.

### 2. Frontend (React + Vite + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**. It proxies `/api/*` to the backend.

### 3. Use it

1. Open http://localhost:5173
2. Fill “Who am I today?” and “Who do I want to become?” → Save
3. Add today’s brick (one small action)
4. In the evening, click “Mark as laid”
5. Streak = consecutive days with at least one brick laid

---

## Project layout

- `backend/` – FastAPI app, SQLite, `/profile` and `/bricks` APIs
- `frontend/` – React + TypeScript + Vite + Tailwind
- `ANALYSIS_AND_LEARNING.md` – Analysis, next steps, learning tips, and copy-paste questions for other LLMs

---

## Next steps (from your plan)

- **Phase 2:** Onboarding + personalization data (birthday, MBTI, region, etc.)
- **Phase 3:** OpenAI integration (suggest brick, sentiment, weekly insights)
- **Phase 4:** Load tracking + backpack visualization
- **Phase 5–8:** Enhanced AI, monetization, deployment, scale

See `ANALYSIS_AND_LEARNING.md` for detailed next steps and learning questions.
