## MindKiln AI

**Turn messy thoughts into clear execution.**

Stage 2: AI Execution Coach with authentication, MongoDB, saved plans, and progress tracking.

---

### Run locally

#### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

Create `.env` in `backend/` (or copy from `.env.example` if present):

```bash
OPENROUTER_API_KEY=sk-or-v1-your-key
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=mindkiln
JWT_SECRET_KEY=your-very-secret-key
CORS_ORIGINS=http://localhost:5173
```

Get a key at [OpenRouter](https://openrouter.ai/keys).

Then start FastAPI:

```bash
uvicorn main:app --reload --port 8000
```

API docs: `http://localhost:8000/docs`.

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173`. Vite proxies `/health`, `/auth`, `/generate-plan`, `/plans`, and `/steps` to the backend during local development.

---

### API overview (Stage 2)

- `POST /auth/register` – create an account with email + password.
- `POST /auth/login` – obtain a JWT access token.
- `POST /generate-plan` – generate an execution plan (authenticated), persist goal + plan, and return:

  ```json
  {
    "goal_summary": "",
    "reality_check": "",
    "reframe": "",
    "priority_level": "",
    "estimated_total_time": "",
    "execution_plan": [
      {
        "step_id": "uuid",
        "step_number": 1,
        "title": "",
        "description": "",
        "estimated_time": "",
        "priority": "",
        "completed": false
      }
    ],
    "first_action_to_take_now": ""
  }
  ```

- `GET /plans` – list all plans for the authenticated user (id, goal text, summary, timestamps).
- `GET /plans/{id}` – return a single plan with original goal and full execution structure.
- `PATCH /steps/{step_id}` – mark a step as completed/incomplete.

All protected endpoints expect an `Authorization: Bearer <token>` header using the JWT from `/auth/login`.

---

### Project layout

- **backend/** – FastAPI, OpenRouter + LLaMA, JWT auth, MongoDB (via PyMongo), plan persistence.
- **frontend/** – React (Vite), Tailwind, routing with:
  - Landing page (`/`) – “Turn messy thoughts into clear execution.”
  - Workspace dashboard (`/app`) – Goal input + AI thinking workspace.
  - Plan history (`/history`) – previously saved goals and plans.

Plans are saved per user with step-level completion tracking.
