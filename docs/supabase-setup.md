# Shancode Supabase Integration & Production Setup Guide

This guide explains how to connect your **Shancode** application to a **Supabase PostgreSQL** cloud database, execute migrations, configure Row Level Security (RLS), and safely manage API keys.

---

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in or create an account.
2. Click **New project**.
3. Fill in the project details:
   - **Name**: `shancode-db`
   - **Database Password**: Choose a strong password (save this!).
   - **Region**: Select a region close to your primary users.
4. Click **Create new project** and wait ~2 minutes for the database to provision.

---

## 2. Obtain Your Supabase Keys & Connection String

Navigate to **Project Settings** in your Supabase dashboard:

### A. API Keys (`Project Settings` -> `API`)
- **Project URL**: `https://<your-project-ref>.supabase.co`
- **anon (public)** key: Safe to expose in the browser / Vite frontend.
- **service_role (secret)** key: **Privileged server key** — NEVER expose in frontend code or commit to Git.

### B. Database Connection String (`Project Settings` -> `Database`)
Under **Connection string**, select **URI**:
- **Transaction Pooler** (Recommended for serverless / pooled queries on port 6543):
  ```text
  postgresql://postgres.<project-ref>:<db-password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true
  ```
- **Direct Connection** (Session mode on port 5432):
  ```text
  postgresql://postgres.<project-ref>:<db-password>@aws-0-<region>.pooler.supabase.com:5432/postgres
  ```

---

## 3. Configure Your Environment Variables

Create `.env` in the root directory (or in `backend/` and `frontend/`):

```bash
# Backend Configuration (.env)
PORT=5000
NODE_ENV=production
JWT_SECRET=your_super_secure_jwt_secret_key_2026

# Supabase Production PostgreSQL Configuration
SUPABASE_DB_URL=postgresql://postgres.<project-ref>:<db-password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Frontend Configuration (frontend/.env)
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> [!CAUTION]
> **Key Security Rule**:
> - `SUPABASE_ANON_KEY` and `VITE_SUPABASE_ANON_KEY` are safe for frontend clients.
> - `SUPABASE_SERVICE_ROLE_KEY` has full administrative access and **MUST NEVER** be placed in frontend code or Git repositories.

---

## 4. Run Supabase Database Migrations

You can run the provided migrations using the **Supabase Dashboard SQL Editor** or the **Supabase CLI**.

### Option A: Using the Supabase Dashboard SQL Editor (Quickest)
1. Open your project on [supabase.com](https://supabase.com).
2. Click on **SQL Editor** in the left sidebar.
3. Open and run the following migration scripts in order:
   - [`supabase/migrations/20260915_001_initial_schema.sql`](file:///d:/shancode/supabase/migrations/20260915_001_initial_schema.sql)
   - [`supabase/migrations/20260915_002_rls_policies.sql`](file:///d:/shancode/supabase/migrations/20260915_002_rls_policies.sql)
   - [`supabase/migrations/20260915_003_functions_and_triggers.sql`](file:///d:/shancode/supabase/migrations/20260915_003_functions_and_triggers.sql)
   - [`supabase/migrations/20260915_004_seed_data.sql`](file:///d:/shancode/supabase/migrations/20260915_004_seed_data.sql)

### Option B: Using Supabase CLI
```bash
# Login to Supabase
npx supabase login

# Link to your remote project
npx supabase link --project-ref <your-project-ref>

# Push all migrations
npx supabase db push
```

---

## 5. Verifying Database Connection & Health

Start the backend server:
```bash
cd backend
npm run dev
```

Run the automated test suite against the database:
```bash
cd backend
npm test
```

You should see:
```text
✔ Agent 15: Socratic AI Tutor Tests
✔ Agent 15: Authentication & Token Security Tests
✔ Agent 15: Code Execution Sandbox Tests
ℹ tests 11, suites 3, pass 11, fail 0
```

---

## 6. Row Level Security (RLS) Summary

| Table | Policy | Description |
|---|---|---|
| `sections`, `concepts`, `quizzes` | Public Read | Accessible to all users & guests |
| `problems`, `hints` | Public Read | Problem catalog accessible to all |
| `concept_progress` | User Isolation | Users can only read/write their own progress (`auth.uid() = user_id`) |
| `submissions` | User Isolation | Code submissions private to the author |
| `user_skills`, `xp_transactions` | User Isolation | Analytics & gamification private to user |
| `discussions`, `comments` | Public Read / Authenticated Write | Anyone can read; authenticated users can post |
| `profiles` | Public Read / Owner Update | Anyone can see avatar/bio; only owner can edit |
