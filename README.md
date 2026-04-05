# Hyglow

Production-oriented SaaS starter: **Next.js** (App Router, Tailwind), **FastAPI** (JWT, RBAC, SQLAlchemy), and **Neon PostgreSQL** (via Alembic). The frontend uses a small **BFF** (`/api/v1/*`) so JWTs can live in **HTTP-only cookies**.

## Security warning

If you pasted a real Neon connection string or password into a chat or ticket, **rotate the database password in the Neon console** and treat the old secret as compromised. This repo only uses placeholders in `.env.example`.

## Repository layout

| Path | Purpose |
|------|---------|
| `backend/` | FastAPI app, SQLAlchemy models, Alembic migrations |
| `frontend/` | Next.js UI, marketing pages, dashboard, auth proxy routes |

## Prerequisites

- Python 3.12+
- Node.js 20+
- PostgreSQL (Neon in production, or local — see below)

### Local PostgreSQL (macOS + Homebrew, no Docker)

This repo can use a **dedicated dev cluster** on **port 5435** (data in `.pgdata/`, gitignored):

```bash
brew install postgresql@16
chmod +x scripts/init-local-postgres.sh scripts/start-local-postgres.sh
./scripts/init-local-postgres.sh   # once; creates .pgdata and database `hyglow`
./scripts/start-local-postgres.sh  # after reboot if Postgres stopped
```

Point `backend/.env` at:

`DATABASE_URL=postgresql+psycopg://hyglow@127.0.0.1:5435/hyglow`

Then `cd backend && alembic upgrade head`.

Stop the dev server: `$(brew --prefix postgresql@16)/bin/pg_ctl -D .pgdata stop` (from repo root).

**Note:** If your shell exports `DATABASE_URL` (e.g. to an old value), it overrides `.env` — run `unset DATABASE_URL` before `alembic` or `uvicorn`.

## Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env: DATABASE_URL, JWT_SECRET, CORS_ORIGINS, FRONTEND_BASE_URL (for password-reset links in logs)
alembic upgrade head
```

Create the first **Super Admin** (one-time, if no user exists with that email):

```bash
export SUPER_ADMIN_EMAIL="you@company.com"
export SUPER_ADMIN_PASSWORD="a-strong-password"
export SUPER_ADMIN_NAME="Your Name"
PYTHONPATH=. python scripts/bootstrap_super_admin.py
```

If that email **already signed up** as a normal user, promote instead:

```bash
export TARGET_EMAIL="you@company.com"
PYTHONPATH=. python scripts/promote_to_super_admin.py
```

**Password reset (no SMTP yet):** `POST /api/v1/auth/forgot-password` logs the full reset URL at **INFO** in the API terminal when `LOG_PASSWORD_RESET_LINKS` is true (default). Set `LOG_PASSWORD_RESET_LINKS=false` in production once you send email.

Run the API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- OpenAPI docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health: `GET /health`

### API surface (prefix `/api/v1`)

- **Auth:** `POST /auth/signup`, `POST /auth/login`, `GET /auth/me`, `POST /auth/forgot-password`, `POST /auth/reset-password`
- **Users (Admin / Super Admin):** `GET/POST /users`, `GET/PATCH/DELETE /users/{id}`
- **Employees (Admin: all; Manager: own team):** `GET/POST /employees`, `GET/PATCH/DELETE /employees/{id}`
- **Roles (Admin):** `GET /roles`

### Roles

| Role | Capabilities (summary) |
|------|-------------------------|
| **Super Admin** | Full user + employee management; can assign any role including Super Admin |
| **Admin** | Users + employees; cannot assign Super Admin |
| **Manager** | CRUD employees where `manager_id` is their user id |
| **User** | Personal dashboard only (no employee APIs) |

## Frontend setup

```bash
cd frontend
cp .env.example .env.local
# Set BACKEND_URL to your API origin (e.g. http://127.0.0.1:8000)
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). Sign up creates a **User**; use the Super Admin account to promote roles in **Dashboard → Users**.

### SEO

Marketing routes use the App Router `metadata` API plus **next-seo** JSON-LD (`OrganizationJsonLd`, `SoftwareApplicationJsonLd`, `FAQJsonLd`).

## Deployment

### Frontend (Vercel)

1. Import the `frontend/` directory as a Vercel project (or monorepo root with **Root Directory** = `frontend`).
2. Environment variables:
   - `BACKEND_URL` — public URL of your FastAPI service (no trailing slash).
   - `NEXT_PUBLIC_SITE_URL` — canonical site URL for JSON-LD and links.
3. Ensure the API’s `CORS_ORIGINS` includes your Vercel domain.

### Backend (Render / Railway / Fly / Docker)

- **Docker:** `docker build -t hyglow-api ./backend` then run with `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`, `PORT`.
- **Render/Railway:** start command similar to `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- Use Neon’s **pooled** connection string for serverless workers.

## Environment variables (cheat sheet)

| Variable | Where | Purpose |
|----------|--------|---------|
| `DATABASE_URL` | Backend | PostgreSQL URL (SQLAlchemy will accept `postgresql://` or `postgresql+psycopg://`) |
| `JWT_SECRET` | Backend | Symmetric key for JWT signing |
| `CORS_ORIGINS` | Backend | Comma-separated browser origins |
| `BACKEND_URL` | Frontend (server) | Upstream FastAPI URL for Route Handlers |
| `NEXT_PUBLIC_SITE_URL` | Frontend | Canonical URL for structured data |

## Push to GitHub

This project’s Git root is **`HYGLOWTECH/`** (not your home folder). Branch **`main`** already has your commits.

**Your repo:** [https://github.com/Nishant8405006745/Hyglowtech](https://github.com/Nishant8405006745/Hyglowtech)

The remote is usually already set. From **Terminal** (on your Mac, not a headless tool):

```bash
cd ~/Desktop/HYGLOWTECH
git remote -v
# Should show: origin https://github.com/Nishant8405006745/Hyglowtech.git
git push -u origin main
```

If `git push` asks for a password, GitHub **does not use your account password**. Use a **Personal Access Token**:

1. Open [GitHub → Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens).
2. **Generate new token (classic)** → enable scope **`repo`** → copy the token once.
3. When Git asks for **Password**, paste the **token**. Username is `Nishant8405006745`.

**Easier option — GitHub Desktop:** [Download GitHub Desktop](https://desktop.github.com/) → **File → Add Local Repository** → choose `Desktop/HYGLOWTECH` → **Publish repository** and pick `Nishant8405006745/Hyglowtech`.

**SSH (no HTTPS password):** Add your public key at [GitHub → SSH keys](https://github.com/settings/keys). This repo can use a **dedicated key** so your other GitHub repos keep using their usual key:

1. One-time setup (already done if you used the Cursor-generated key): `~/.ssh/hyglowtech_github_push` + `Host github.com-hyglow` in `~/.ssh/config`.
2. Show the public key: `cat ~/.ssh/hyglowtech_github_push.pub` — paste **all one line** into GitHub → **New SSH key**.
3. Remote should use the alias: `git@github.com-hyglow:Nishant8405006745/Hyglowtech.git`  
   Then: `cd ~/Desktop/HYGLOWTECH && git push -u origin main`

Or use the default host: `git remote set-url origin git@github.com:Nishant8405006745/Hyglowtech.git` if your main `~/.ssh` key is already registered with GitHub.

**Do not commit secrets:** `backend/.env`, `frontend/.env.local`, and `.pgdata/` stay gitignored. Configure production env vars on GitHub/Vercel/hosting only.

## License

Use and modify for your product; no warranty implied.
