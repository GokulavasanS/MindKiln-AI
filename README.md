# MindKiln AI

**Turn messy thoughts into structured execution.**

MVP: User enters a vague goal → receives a structured, prioritized execution plan (no auth, no database).

---

## Run locally

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

Create `.env` in `backend/` (copy from `.env.example`):

```
OPENROUTER_API_KEY=sk-or-v1-your-key
```

Get a key at [OpenRouter](https://openrouter.ai/keys). Then:

```bash
uvicorn main:app --reload --port 8000
```

API: `http://localhost:8000`. Docs: `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173`. Vite proxies `/generate-plan` and `/health` to the backend.

---

## Deploy

### Backend (Railway)

1. Create a project at [Railway](https://railway.app). Add a new service.
2. Connect your repo and set **Root Directory** to `backend`.
3. **Variables**: add `OPENROUTER_API_KEY` (and optionally `CORS_ORIGINS` with your Vercel URL, e.g. `https://mindkiln-ai.vercel.app`).
4. **Settings → Deploy**: Build command leave empty or `pip install -r requirements.txt`. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
5. Deploy and copy the public URL (e.g. `https://your-app.up.railway.app`).

### Frontend (Vercel)

1. Push the repo to GitHub and import the repo in [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. **Environment variables**: add `VITE_API_URL` = your Railway backend URL (e.g. `https://your-app.up.railway.app`). No trailing slash.
4. Deploy. Vercel will run `npm run build` and serve the app.

---

## Example test

**Input (POST `/generate-plan`):**

```json
{
  "goal": "I need to prepare for a software engineering interview but I feel overwhelmed"
}
```

**Example output (structure only; actual text may vary):**

```json
{
  "goal_summary": "Structured preparation for a software engineering interview with clear steps.",
  "priority_level": "High",
  "estimated_total_time": "2 weeks",
  "execution_plan": [
    {
      "step_number": 1,
      "title": "List target companies and job levels",
      "description": "Write down 5–10 companies and whether you're aiming for mid/senior. Focus on roles that match your experience.",
      "estimated_time": "1 hour",
      "priority": "High"
    },
    {
      "step_number": 2,
      "title": "Brush up on data structures and algorithms",
      "description": "Practice arrays, hash maps, trees, and graphs. Use one resource (e.g. LeetCode or a book) consistently.",
      "estimated_time": "3–5 days",
      "priority": "High"
    }
  ],
  "first_action_to_take_now": "Spend the next 30 minutes writing a short list of 5 companies you want to apply to and the job level (e.g. mid-level backend)."
}
```

---

## Project layout

- **backend/** – FastAPI, `POST /generate-plan`, OpenRouter + LLaMA, retry on invalid JSON.
- **frontend/** – React (Vite), Tailwind, single dashboard with GoalInput, PlanDisplay, LoadingSpinner.

No auth, no database, no external APIs beyond OpenRouter.
