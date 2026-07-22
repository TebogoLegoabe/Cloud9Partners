# Cloud9 Partners

South Africa's car buying advisor — expert consulting and dealer quote comparison
for new and demo vehicles. *Every Rand. Every Deal. Every Time.*

## Stack

| Layer     | Tech                                              |
| --------- | ------------------------------------------------- |
| Frontend  | React 18 + TypeScript + Vite, React Router        |
| Backend   | Flask 3 + SQLAlchemy, gunicorn                    |
| Auth      | Supabase Auth (email/password, JWT)               |
| Database  | Supabase Postgres                                 |
| Payments  | PayFast (sandbox wired, Yoco planned)             |
| Hosting   | Railway (backend) + Vercel/Netlify (frontend)     |

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full plan: auth flow,
data model, roles, payments, deployment, and roadmap.

## Repository layout

```
frontend/   React + TypeScript app (landing page, signup wizard, dashboard)
backend/    Flask API (profiles, requests, quotes, admin approval, payments)
supabase/   schema.sql — run once in the Supabase SQL editor
docs/       Architecture and planning docs
```

## Local development

### 1. Supabase (one-time)

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL editor.
3. Grab from **Settings → API**: project URL, anon key, JWT secret.
4. Grab from **Settings → Database**: the connection string.

### 2. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows (source .venv/bin/activate on mac/linux)
pip install -r requirements.txt
copy .env.example .env         # then fill it in
python wsgi.py                 # runs on http://localhost:5000
```

Without a `DATABASE_URL` it falls back to a local SQLite file — fine for a quick
look, but use the Supabase connection string for real work. To create tables in
a fresh database:

```bash
python -c "from app import create_app; from app.extensions import db; app = create_app(); ctx = app.app_context(); ctx.push(); db.create_all()"
```

(Prefer running `supabase/schema.sql` on Supabase — it's the source of truth.)

### 3. Frontend

```bash
cd frontend
npm install
copy .env.example .env.local   # then fill it in
npm run dev                    # http://localhost:5173, /api proxied to :5000
```

The app runs without Supabase configured (auth-dependent features are disabled
and the wizard finishes in preview mode), so you can work on UI immediately.

## Deployment (summary)

- **Backend → Railway**: new project from this repo, root directory `backend/`.
  Set the env vars from `backend/.env.example`. `railway.json` provides the
  start command and health check (`/api/health`).
- **Frontend → Vercel**: root directory `frontend/`, framework Vite. Set
  `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_API_BASE_URL`
  (the Railway URL). Add the Vercel domain to `CORS_ORIGINS` on Railway.

Full steps in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#8-deployment).
