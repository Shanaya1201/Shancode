# Shancode 🚀

> **Learn the concept. Master the pattern. Solve the problem.**

Shancode is a next-generation full-stack coding education platform and algorithmic problem-solving environment. Unlike traditional platforms that throw learners straight into problems, Shancode pioneers a **concept-first** pedagogy:

$$\text{Learn Concept} \longrightarrow \text{AI Tutor} \longrightarrow \text{Pattern Mastery} \longrightarrow \text{Comprehension Quiz} \longrightarrow \text{Problem IDE} \longrightarrow \text{Spaced Revision}$$

---

## 🌟 Key Features

### 1. Concept-First Curriculum & Interactive Skill Tree
- **15 Structured DSA Sections**: From Big-O Complexity to Advanced Tries & Graphs.
- **Interactive Visual Skill Tree**: Visual DAG dependency graph displaying prerequisites and unlock states.
- **Deep Concept Walkthroughs**: Intuition, mathematical proofs, when-to-use interview signals, animated visual SVGs, and multi-language syntax samples (Python, JavaScript, C++, Java).

### 2. Socratic AI Coding & DSA Tutor
- Step-by-step guidance without immediately spoiling solutions.
- Line-by-line code explanation and submission diagnosis.
- Socratic hint prompts and edge-case reminders.

### 3. Pattern Mastery Mode (Killer Feature)
- Progression through pattern levels (Level 1 Foundation $\rightarrow$ Level 4 Hard Mastery).
- Focus on mastering the reusable algorithmic archetype rather than memorizing individual problems.

### 4. Professional LeetCode-Style Split IDE
- **Syntax Highlighting & Line Numbers**: Clean dark-mode editor.
- **Isolated Code Execution Sandbox**: Subprocess and Docker-isolated execution with strict timeouts, memory limits, and multi-case diff evaluation.
- **3-Tier Progressive Hint System**: Directional $\rightarrow$ Observation $\rightarrow$ Algorithm.
- **Solution Analyzer**: Full intuition, algorithm breakdown, and time/space complexity analysis.

### 5. Spaced Repetition & Retention Engine
- Schedules concept revisions based on the **Ebbinghaus Forgetting Curve** (1d, 3d, 7d, 14d, 30d).

### 6. FAANG Interview Readiness Track
- Company-targeted problem tracks (Google, Amazon, Meta, Microsoft, Apple, Netflix).
- Dynamic Interview Readiness calculation.

### 7. Rated Contests & Live Arena
- Weekly & Biweekly contests with countdown clocks, penalty trackers, and live ELO leaderboards.

---

## 🏗️ Architecture & Tech Stack

```text
shancode/
├── backend/
│   ├── src/
│   │   ├── config/          # DB abstraction (sql.js / PostgreSQL) & JWT
│   │   ├── models/          # 20+ tables relational database schema
│   │   ├── routes/v1/       # REST API endpoints (Auth, Learn, Problems, Submissions, Contests, Admin)
│   │   ├── services/        # Sandbox Runner, AI Tutor, Analytics, Spaced Repetition, Contest Engine
│   │   ├── seed/            # Comprehensive curriculum and problem dataset
│   │   └── server.js        # Express API Gateway
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Split IDE, Video Player, AI Tutor Drawer, Modals
│   │   ├── context/         # AuthContext with demo quick-switches
│   │   ├── pages/           # Home, Learn, ConceptView, Problems, ProblemIDE, Patterns, Contests, Progress, Discuss, Admin
│   │   └── styles/          # Dark-mode CSS tokens, animations, glassmorphism
│   └── Dockerfile
├── docker-compose.yml       # Full stack container orchestration
├── .github/workflows/ci.yml # Automated CI pipeline
└── README.md
```

- **Frontend**: React 19 + Vite + Vanilla CSS Custom Design Tokens + Lucide Icons + Canvas Confetti.
- **Backend**: Node.js + Express + TypeScript/ESM + `sql.js` (WebAssembly SQLite) / PostgreSQL + JWT + Bcrypt.
- **Execution Sandbox**: Subprocess runner with timeout watchdog & Docker container support.

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Node.js 18+
- Python 3.9+ (for Python problem execution)
- Git

### 1. Clone & Install
```bash
git clone https://github.com/Shanaya1201/Shancode.git
cd Shancode

# Setup root and dependencies
npm run setup
```

### 2. Seed Database
```bash
npm run seed
```

### 3. Start Development Servers
```bash
# Runs backend on http://localhost:5000 and frontend on http://localhost:5173
npm run dev
```

Alternatively, run separately:
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

---

## 🐳 Docker Deployment

To launch the complete Shancode platform in Docker:
```bash
docker-compose up --build
```
- Frontend available at: `http://localhost:3000`
- Backend API available at: `http://localhost:5000`

---

## 🧪 Demo Credentials

Shancode includes built-in quick demo accounts:
- **Learner Account**: `sushmita` / `shancode123`
- **Admin Account**: `admin` / `shancode123`

---

## 🛡️ License
MIT © 2026 Shancode Team.
