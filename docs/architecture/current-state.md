# Shancode Platform: Current State Architecture Audit

**Audited By**: Agent 1 — Architect / Codebase Analyst  
**Date**: 2026-09-15  
**Version**: 1.0.0

---

## 1. Executive Summary

Shancode is a full-stack educational and competitive programming platform centered around the principle:  
**"Learn the concept. Master the pattern. Solve the problem."**

This audit reviews the current architecture across the frontend, backend, database layer, execution engine, AI tutor, security, tests, Docker, CI/CD, and Git repository state.

---

## 2. Component-Level Analysis

### 2.1 Backend Architecture
- **Framework**: Express.js (Node.js ES Modules)
- **API Architecture**: Versioned REST API mounted at `/api/v1/*`
- **Route Modules**:
  - `auth.js`: User registration, login, profile retrieval, avatar updates.
  - `learn.js`: Sections, concepts, quizzes, video progress, notes, prerequisites.
  - `problems.js`: Problem catalog, filtering, starter code, solutions, hint tiers.
  - `submissions.js`: Code execution submission dispatch, verdict logging, user submission history.
  - `patterns.js`: Algorithmic patterns and level tracking.
  - `contests.js`: Virtual and scheduled contests, leaderboards.
  - `analytics.js`: Skill breakdown, weakness radar, spaced repetition review list.
  - `tutor.js`: Socratic AI DSA tutor endpoints.
  - `discussions.js`: Problem-linked and concept-linked forum threads and comments.
  - `admin.js`: Content management endpoints for concepts, problems, quizzes.
  - `notifications.js`: System and streak notifications.

### 2.2 Database Layer
- **Engine**: Dual-mode support (SQLite via `sql.js` for local zero-dependency development, PostgreSQL via `pg` connection pooling for production).
- **Schema**: 19 relational tables including `users`, `profiles`, `sections`, `concepts`, `quizzes`, `quiz_questions`, `concept_progress`, `patterns`, `pattern_levels`, `user_pattern_mastery`, `problems`, `test_cases`, `submissions`, `hints`, `hint_usages`, `user_skills`, `contests`, `discussions`, `achievements`, and `integrity_logs`.
- **Status**: Schema contains solid relational definitions. Needs foreign key constraints verification, index optimization for frequent queries (`user_id`, `problem_id`, `slug`), and transaction support.

### 2.3 Authentication & Security
- **Current State**: Uses `bcryptjs` and `jsonwebtoken`.
- **Areas for Hardening**:
  - Add refresh token rotation mechanism and session invalidation.
  - Enforce server-side Role-Based Access Control (RBAC) middleware for `admin` routes.
  - Implement rate limiting on sensitive endpoints (`/api/v1/auth/login`, `/api/v1/submissions`).
  - Add input sanitization for user submissions and discussions.

### 2.4 Code Execution Sandbox
- **Engine**: `backend/src/services/codeRunner.js`
- **Execution Strategy**: Spawns isolated subprocess with timeouts (3.5s), memory limits, output buffer caps (64KB), and optional Docker runner.
- **Languages Supported**: Python (3.11), JavaScript (Node.js 20), C++ (g++), Java (OpenJDK).
- **Status**: Execution harness works synchronously; needs queue/worker resilience and strict sandboxing.

### 2.5 AI Tutor Architecture
- **Current State**: Rule-based template matching in `backend/src/services/aiTutor.js`.
- **Target State**: Pluggable provider system (`AIProvider`) supporting Gemini API and OpenAI with grounded RAG against verified Shancode lesson metadata, code context, and deterministic complexity validation.

### 2.6 Frontend Architecture
- **Framework**: React 19 + Vite 6 + React Router 7 + Lucide Icons + Canvas Confetti.
- **Styling**: Modern dark-mode glassmorphic theme using Vanilla CSS tokens (`frontend/src/index.css` and `App.css`).
- **Pages**:
  - `Home.jsx`: Landing page, feature overview, roadmap.
  - `Learn.jsx`: Concept roadmap and hierarchical module tracker.
  - `ConceptView.jsx`: Interactive lesson viewer with video player, intuition cards, quizzes, and notes.
  - `Problems.jsx`: Filterable problem catalog with difficulty, pattern, and company tags.
  - `ProblemIDE.jsx`: Split-pane IDE with Monaco-style controls, test case runner, progressive hints, and AI tutor modal.
  - `Progress.jsx`: Bloom's taxonomy analytics, radar charts, and review queues.
  - `PatternMastery.jsx`: Visual pattern tiers and level progression.
  - `Contests.jsx`: Live and virtual contest runner.
  - `Discuss.jsx`: Community forum.
  - `Admin.jsx`: Administrative management console.
  - `Profile.jsx`: User profile, statistics, target company readiness.

### 2.7 DevOps & CI/CD
- **Docker**: `backend/Dockerfile` and root `docker-compose.yml`.
- **CI**: `.github/workflows/ci.yml` running Node.js 20, Python 3.11, database verification, and frontend build.

---

## 3. Recommended Implementation Order

1. **Database & Schema Hardening** (Agent 2)
2. **Authentication, RBAC & Security** (Agent 3)
3. **DevOps & Environment Setup** (Agent 14)
4. **Curriculum Engine & Sequential Unlocking** (Agent 5)
5. **Problem Platform & Tiered Hints** (Agent 6)
6. **Frontend UX & Responsive Layouts** (Agent 4)
7. **AI Tutor Rebuild & Grounding** (Agent 9)
8. **Coding IDE & Execution Sandbox** (Agents 7 & 8)
9. **Analytics, Mastery & Gamification** (Agents 10 & 11)
10. **Community & Admin Platform** (Agents 12 & 13)
11. **QA, Security Testing & Final Release** (Agents 15 & 16)
