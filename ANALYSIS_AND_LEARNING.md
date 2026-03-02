# The Bridge – Analysis, Next Steps & Learning Guide

## 1. Plan analysis (summary)

| Aspect | Assessment |
|--------|------------|
| **Clarity** | Very clear phases, deliverables, and tech choices. Good for learning. |
| **Scope** | Phase 1 is well-scoped; later phases (5–6) are ambitious—plan to split into smaller milestones. |
| **Tech fit** | React + Vite + TS + FastAPI + SQLite is a strong, standard stack for learning and production. |
| **Risk** | OpenAI cost and dependency; Phase 1 can work **without** AI so you validate the product first. |
| **Monetization** | Freemium at $4.99/mo is reasonable; defer implementation until after core value is proven. |

**Recommendation:** Build Phase 1 first with **no AI, no auth**. Use a single “local user” (e.g. `user_id = 1`). Add auth in Phase 7 when you deploy.

---

## 2. Suggested next steps (in order)

1. **Scaffold project** – Monorepo or two folders: `backend/` (FastAPI) and `frontend/` (React + Vite + TypeScript + Tailwind).
2. **Phase 1 – Backend**  
   - SQLite DB with `user_profile` and `bricks` tables.  
   - FastAPI: CRUD for profile (current_self, future_self), create/get brick for today, list bricks, “mark laid”.  
   - No auth: assume one user (e.g. `user_id = 1`).
3. **Phase 1 – Frontend**  
   - Profile editor (two textareas, save).  
   - “Today’s brick” (input + “Mark as laid”).  
   - Streak counter (computed from consecutive days with `laid = true`).
4. **Run locally** – Backend on `http://localhost:8000`, frontend on `http://localhost:5173`, frontend calls backend API.
5. **Use it daily** – You as user; refine UX before adding Phase 2.

---

## 3. Learning tips

- **One concept per commit:** e.g. “Add bricks table,” “Add streak calculation,” “Add ProfileEditor component.”
- **Read the docs:** FastAPI tutorial, React “Thinking in React,” SQLite with Python (e.g. `sqlite3` or SQLAlchemy).
- **Console and network:** Use browser DevTools (Network tab) and FastAPI’s `/docs` to see request/response and status codes.
- **Types everywhere:** In TS, type props and API responses; in Python, use Pydantic for every request/response.
- **DB in code:** Define schema in migrations or in code (e.g. `CREATE TABLE IF NOT EXISTS`); avoid manual DB edits so the app is reproducible.

---

## 4. Questions to use with other LLMs (copy-paste ready)

Use these with another LLM or tutor to go deeper. Each is scoped so the answer can be short and actionable.

### Phase 1 – Core MVP

- “In a FastAPI app using SQLite, how do I define a single function that creates the database and tables on startup if they don’t exist, without using an ORM?”
- “In React with TypeScript, what’s the cleanest way to load user profile from an API on mount and show it in two controlled textareas, with a save button that sends a PUT request?”
- “How do I compute a ‘streak’ (consecutive days) from a list of dates in JavaScript? Assume the list is sorted by date descending and each date has at most one entry.”
- “What’s the right HTTP status code and response shape when a client tries to create a second brick for the same calendar day and we only allow one brick per day?”

### Phase 2 – Profile & personalization

- “What’s a simple way to do database migrations in a small FastAPI + SQLite project without Alembic? I want to add a new table and a few columns.”
- “In React, how do I build a multi-step onboarding form (e.g. 4 steps) with ‘Next’/‘Back’ and optional skip, and only submit at the last step?”
- “How do I validate and store an optional ‘birth time’ (time only) in Python with Pydantic and SQLite?”

### Phase 3 – OpenAI

- “How do I call the OpenAI Chat Completions API from FastAPI with an async endpoint, and return the assistant’s message text? Include reading the API key from environment variables.”
- “What’s a minimal way to cache a string value in Redis (e.g. with Upstash) with a 24-hour TTL, and use it from Python?”
- “How do I structure a system prompt and user prompt so GPT suggests one short ‘daily action’ based on current_self, future_self, and the last 5 brick texts?”

### Phase 4 – Load & backpack

- “How do I draw a simple line chart in React showing a value per day for the last 7 days, using Recharts?”
- “In SQLite, how do I write a query that returns the last 7 days of load levels for a user, with 0 for days that have no entry?”

### Phase 6 – Monetization

- “What’s the minimal flow to add a Stripe subscription (monthly) to a React app and store the result in my backend? I only need to know if the user is subscribed, not full billing history.”
- “Where should I check ‘is premium’ – only in the frontend, only in the backend, or both? And how do I avoid leaking premium-only API responses to free users?”

### Phase 7 – Deployment

- “What’s the smallest production setup to run a FastAPI app and a PostgreSQL database, with secrets in environment variables? Compare Render, Railway, and one cloud (e.g. AWS or Azure) in 3 short paragraphs.”
- “How do I deploy a Vite React app to Vercel so it talks to my backend API on another domain, and what do I need to set for CORS?”

---

## 5. Phase 1 – Definition of done (checklist)

- [ ] Backend runs at `http://localhost:8000`; `/docs` shows Swagger UI.
- [ ] `user_profile` table: id, current_self, future_self (and optionally user_id for future multi-user).
- [ ] `bricks` table: id, user_id, date, brick_text, laid (boolean).
- [ ] API: GET/PUT profile; POST brick (for today); PATCH brick (mark laid); GET bricks (e.g. last 30 days) or GET streak.
- [ ] Frontend: edit and save profile; add today’s brick; mark brick laid; display current streak.
- [ ] Streak = number of consecutive days (ending today) where at least one brick is laid.
- [ ] You can use the app locally for one full day without errors.

---

## 6. Optional: simplify Phase 1 even more

If one week feels tight:

- **Day 1–2:** Backend only: SQLite + FastAPI endpoints, test with Swagger or `curl`.
- **Day 3–4:** Frontend only: CRA/Vite app, static profile + brick form, mock data or direct API calls.
- **Day 5:** Connect frontend to backend; fix CORS and wiring.
- **Day 6–7:** Streak logic, polish, use it yourself.

You can do Phase 1 without Tailwind (plain CSS or a single CSS file) and add Tailwind in Phase 2 to reduce cognitive load.

---

*Next: scaffold backend and frontend in this repo and implement the Phase 1 API and UI.*

---

## 7. What you have right now (Phase 1)

### 7.1 High-level architecture

- **Monorepo layout**
  - `backend/` – FastAPI + SQLite + Pydantic.
  - `frontend/` – React + TypeScript + Vite + Tailwind.
- **Single-user mode**
  - No auth, no multi-user logic yet.
  - All data is stored as if there is exactly one user with `user_id = 1`.
  - This keeps the mental model simple while you learn.

**Reasoning:** You first want to learn the “shape” of a full app (DB → API → UI) without being distracted by login, tokens, or user management. Single-user mode lets you feel the product daily and still be easy to extend later.

### 7.2 Backend: FastAPI + SQLite

- **Key files**
  - `backend/app/main.py` – Creates the FastAPI app, wires CORS, includes routers, runs `init_db()` on startup.
  - `backend/app/database.py` – Handles SQLite connection and creates tables if they do not exist.
  - `backend/app/models.py` – Pydantic models for requests/responses (profile, brick, streak).
  - `backend/app/routers/profile.py` – Endpoints for getting/updating your “two selves” text.
  - `backend/app/routers/bricks.py` – Endpoints for today’s brick, marking it laid, listing bricks, and computing the streak.

- **Database schema (SQLite, via `database.py`)**
  - `user_profile`
    - `id` – primary key, always `1` in Phase 1.
    - `user_id` – always `1` (future-proof for multi-user).
    - `current_self` – text: “Who am I today?”.
    - `future_self` – text: “Who do I want to become?”.
    - `updated_at` – timestamp.
  - `bricks`
    - `id` – primary key.
    - `user_id` – `1`.
    - `date` – ISO date string like `2026-02-26`.
    - `brick_text` – your small action for that day.
    - `laid` – integer 0/1 (false/true).
    - `created_at` – timestamp.
    - `UNIQUE(user_id, date)` – at most **one brick per day** per user.

**Reasoning:**

- **SQLite** is extremely simple to start with (no server needed) but maps nicely to PostgreSQL later.
- **Creating tables in `init_db()`** ensures your app is reproducible: running the app on a new machine auto-creates the DB.
- **`UNIQUE(user_id, date)`** encodes the business rule “one brick per day” in the database, not only in code, so bugs can’t silently create duplicates.
- **Pydantic models** give you type-checked request/response bodies and clear validation errors; this mirrors TypeScript on the frontend.

### 7.3 Backend: API surface (Phase 1)

All endpoints currently assume `user_id = 1`.

- **Profile**
  - `GET /profile`
    - Returns `{ current_self, future_self }`.
    - Used by the frontend to pre-fill the two textareas.
  - `PUT /profile`
    - Accepts JSON body `{ current_self, future_self }`.
    - Updates the single `user_profile` row and returns the saved data.

- **Bricks**
  - `GET /bricks/today`
    - Returns `null` (no brick yet) or `{ id, date, brick_text, laid }` for today.
  - `POST /bricks/today`
    - Body: `{ brick_text }`.
    - Inserts the brick for **today**; if a brick already exists for today, returns HTTP `409 Conflict`.
  - `PATCH /bricks/today/laid`
    - Marks today’s brick as `laid = 1`.
    - Returns 404 if there is no brick for today.
  - `GET /bricks/streak`
    - Returns `{ streak_days }`.
    - Logic: start from **today**, count backwards as long as there is a day with `laid = 1`.
  - `GET /bricks?limit=30`
    - Returns the most recent bricks (up to 30) for potential history views.

**Reasoning:**

- This API is intentionally **minimal but complete**:
  - Enough to support your daily practice loop.
  - Small enough that you can understand each endpoint end-to-end.
- In the future you can:
  - Add more fields to bricks (e.g. notes, load).
  - Add `/users`, `/onboarding`, `/suggest-brick` without breaking the current flow.

### 7.4 Frontend: React + Vite + Tailwind

- **Key files**
  - `frontend/vite.config.ts`
    - Sets up React plugin.
    - Configures dev server and a **proxy**:
      - Requests to `/api/*` are forwarded to `http://localhost:8000`.
      - This avoids CORS headaches during development.
  - `frontend/src/api.ts`
    - A small typed API client (`api.getProfile()`, `api.createTodayBrick()`, etc.).
    - Central place to handle fetch, JSON, and errors.
  - `frontend/src/App.tsx`
    - Top-level component.
    - Loads `profile`, `todayBrick`, and `streak` in parallel on mount.
    - Renders:
      - `StreakCounter`
      - `ProfileEditor`
      - `TodayBrick`
  - `frontend/src/ProfileEditor.tsx`
    - Two controlled textareas for “Who am I today?” and “Who do I want to become?”.
    - Calls `api.updateProfile` on Save, shows small “Saved” / “Error” states.
  - `frontend/src/TodayBrick.tsx`
    - If there is **no brick** today: input + “Add brick” button.
    - If there **is a brick**: shows the text and a “Mark as laid” button (or “✓ Laid”).
  - `frontend/src/StreakCounter.tsx`
    - Simple pill showing `N day(s) streak`.

- **Styling**
  - Tailwind is wired via `index.css` + `tailwind.config.js`.
  - The UI is deliberately **minimal, calm, and readable** (neutral “stone” colors + amber accent).

**Reasoning:**

- The frontend mirrors your mental model of the app:
  - **One screen** that shows everything you need for daily use.
  - **Three main components** aligned with your concept: Bridge (two selves), Brick, Streak.
- Using a **thin API client (`api.ts`)**:
  - Gives you a single place to see all backend interactions.
  - Makes it easier to update endpoints or add auth headers later.
- Tailwind is kept **lightweight** for now—just enough utility classes to build a clean layout without deep design work.

### 7.5 Dev experience and commands

- **Backend**
  - Virtualenv and dependencies defined in `backend/requirements.txt`.
  - Run with:
    - `uvicorn app.main:app --reload --host 0.0.0.0`
  - CORS allows `http://localhost:5173` so the frontend can talk to the backend via `/api`.

- **Frontend**
  - Dependencies in `frontend/package.json`.
  - `npm run dev` now uses `vite --host` so it binds to all interfaces:
    - This avoids the “localhost refused to connect” issue you saw.
  - The dev server runs on `http://localhost:5173` and proxies `/api` to the backend.

**Reasoning:**

- You now have a **smooth dev loop**:
  - Start backend once.
  - Start frontend once.
  - Refresh browser and see changes almost immediately.
- This loop is what you’ll reuse for all future phases (onboarding, AI, load tracking, etc.).

### 7.6 How this sets you up for the next phases

- **Phase 2 (onboarding + personalization)**
  - Add new tables/columns (e.g. `user_personalization`) alongside `user_profile`.
  - Create new routes like `/onboarding` using the same router pattern.
  - Add new React components/screens, still calling `api.*` functions.

- **Phase 3+ (OpenAI, load, monetization)**
  - Reuse the existing request flow (frontend → `api.ts` → FastAPI).
  - Keep your prompts and AI logic inside new FastAPI routes, so the frontend stays simple.

The important thing: you already have a **working vertical slice** (DB → API → UI → you using it). Everything else (AI, profiles, monetization) will be built on this same shape.

---

*Next: decide what to build in Phase 2 (onboarding + personalization), and we will outline the exact tables, endpoints, and React screens to add.*
