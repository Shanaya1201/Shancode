-- ==============================================================================
-- SHANCODE PLATFORM: Supabase PostgreSQL Initial Schema Migration (001)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'moderator', 'admin')),
  rating INTEGER DEFAULT 1200,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  failed_login_attempts INTEGER DEFAULT 0,
  lockout_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. REFRESH TOKENS (Session Invalidation & JWT Rotation Ledger)
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USER PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  bio TEXT DEFAULT 'Aspiring Software Engineer & DSA Enthusiast',
  target_company VARCHAR(100) DEFAULT 'Google',
  interview_readiness INTEGER DEFAULT 25,
  github_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CURRICULUM SECTIONS
CREATE TABLE IF NOT EXISTS sections (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  order_index INTEGER NOT NULL
);

-- 5. CONCEPTS (Structured Lessons)
CREATE TABLE IF NOT EXISTS concepts (
  id BIGSERIAL PRIMARY KEY,
  section_id BIGINT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  summary TEXT,
  intuition TEXT,
  when_to_use TEXT,
  visual_svg TEXT,
  code_samples_json JSONB DEFAULT '{}'::jsonb,
  common_mistakes_json JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  video_source VARCHAR(50) DEFAULT 'youtube',
  order_index INTEGER NOT NULL
);

-- 6. CONCEPT PREREQUISITE GRAPH (Enforces Sequential Unlocking)
CREATE TABLE IF NOT EXISTS concept_dependencies (
  concept_id BIGINT NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  prerequisite_id BIGINT NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  PRIMARY KEY (concept_id, prerequisite_id)
);

-- 7. QUIZZES
CREATE TABLE IF NOT EXISTS quizzes (
  id BIGSERIAL PRIMARY KEY,
  concept_id BIGINT UNIQUE NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  title VARCHAR(255),
  passing_score INTEGER DEFAULT 80
);

-- 8. QUIZ QUESTIONS
CREATE TABLE IF NOT EXISTS quiz_questions (
  id BIGSERIAL PRIMARY KEY,
  quiz_id BIGINT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options_json JSONB NOT NULL,
  correct_option_index INTEGER NOT NULL,
  explanation TEXT
);

-- 9. CONCEPT PROGRESS (Spaced Repetition & Video Tracking)
CREATE TABLE IF NOT EXISTS concept_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  concept_id BIGINT NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  video_progress_pct INTEGER DEFAULT 0,
  video_resume_sec INTEGER DEFAULT 0,
  rewatch_count INTEGER DEFAULT 0,
  quiz_passed SMALLINT DEFAULT 0,
  completed SMALLINT DEFAULT 0,
  notes TEXT DEFAULT '',
  last_reviewed_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  repetition_stage INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, concept_id)
);

-- 10. ALGORITHMIC PATTERNS
CREATE TABLE IF NOT EXISTS patterns (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  total_levels INTEGER DEFAULT 4,
  icon VARCHAR(50)
);

-- 11. PATTERN LEVELS
CREATE TABLE IF NOT EXISTS pattern_levels (
  id BIGSERIAL PRIMARY KEY,
  pattern_id BIGINT NOT NULL REFERENCES patterns(id) ON DELETE CASCADE,
  level_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  required_count INTEGER NOT NULL,
  difficulty VARCHAR(20) NOT NULL
);

-- 12. USER PATTERN MASTERY
CREATE TABLE IF NOT EXISTS user_pattern_mastery (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pattern_id BIGINT NOT NULL REFERENCES patterns(id) ON DELETE CASCADE,
  current_level INTEGER DEFAULT 1,
  mastery_pct INTEGER DEFAULT 0,
  solved_count INTEGER DEFAULT 0,
  unlocked_badge SMALLINT DEFAULT 0,
  UNIQUE(user_id, pattern_id)
);

-- 13. PROBLEMS CATALOG
CREATE TABLE IF NOT EXISTS problems (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  topic VARCHAR(100) NOT NULL,
  pattern_id BIGINT REFERENCES patterns(id) ON DELETE SET NULL,
  concept_id BIGINT REFERENCES concepts(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  examples_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  constraints_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  starter_code_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  solution_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  acceptance_rate INTEGER DEFAULT 65,
  company_tags_json JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. TEST CASES
CREATE TABLE IF NOT EXISTS test_cases (
  id BIGSERIAL PRIMARY KEY,
  problem_id BIGINT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  input_data TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  is_sample SMALLINT DEFAULT 0
);

-- 15. SUBMISSIONS
CREATE TABLE IF NOT EXISTS submissions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id BIGINT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  language VARCHAR(30) NOT NULL,
  code TEXT NOT NULL,
  verdict VARCHAR(50) NOT NULL,
  runtime_ms INTEGER DEFAULT 0,
  memory_kb INTEGER DEFAULT 0,
  passed_tests INTEGER DEFAULT 0,
  total_tests INTEGER DEFAULT 0,
  failed_case_diff_json JSONB,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. PROGRESSIVE HINTS
CREATE TABLE IF NOT EXISTS hints (
  id BIGSERIAL PRIMARY KEY,
  problem_id BIGINT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  tier INTEGER NOT NULL CHECK (tier IN (1, 2, 3)),
  hint_text TEXT NOT NULL
);

-- 17. HINT USAGES
CREATE TABLE IF NOT EXISTS hint_usages (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id BIGINT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  hint_tier INTEGER NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. USER SKILLS BREAKDOWN (Bloom's Taxonomy)
CREATE TABLE IF NOT EXISTS user_skills (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic VARCHAR(100) NOT NULL,
  score INTEGER DEFAULT 0,
  attempted_count INTEGER DEFAULT 0,
  solved_count INTEGER DEFAULT 0,
  hint_count INTEGER DEFAULT 0,
  avg_attempts REAL DEFAULT 1.0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic)
);

-- 19. CONTESTS
CREATE TABLE IF NOT EXISTS contests (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 90,
  is_rated SMALLINT DEFAULT 1,
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'finished'))
);

-- 20. CONTEST PROBLEMS
CREATE TABLE IF NOT EXISTS contest_problems (
  contest_id BIGINT NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  problem_id BIGINT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  point_value INTEGER DEFAULT 100,
  order_index INTEGER NOT NULL,
  PRIMARY KEY (contest_id, problem_id)
);

-- 21. CONTEST PARTICIPANTS
CREATE TABLE IF NOT EXISTS contest_participants (
  id BIGSERIAL PRIMARY KEY,
  contest_id BIGINT NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  finish_time_seconds INTEGER DEFAULT 0,
  penalty_minutes INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 0,
  rating_delta INTEGER DEFAULT 0,
  is_virtual SMALLINT DEFAULT 0,
  UNIQUE(contest_id, user_id)
);

-- 22. DISCUSSIONS
CREATE TABLE IF NOT EXISTS discussions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id BIGINT REFERENCES problems(id) ON DELETE SET NULL,
  concept_id BIGINT REFERENCES concepts(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  tags_json JSONB DEFAULT '[]'::jsonb,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. DISCUSSION COMMENTS
CREATE TABLE IF NOT EXISTS discussion_comments (
  id BIGSERIAL PRIMARY KEY,
  discussion_id BIGINT NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'system',
  link TEXT,
  is_read SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. ACHIEVEMENTS & GAMIFICATION
CREATE TABLE IF NOT EXISTS achievements (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50) NOT NULL,
  xp_reward INTEGER DEFAULT 100
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id BIGINT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- 26. XP TRANSACTION LEDGER
CREATE TABLE IF NOT EXISTS xp_transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source VARCHAR(50) NOT NULL,
  reference_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 27. DAILY GOALS
CREATE TABLE IF NOT EXISTS daily_goals (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  target_problems INTEGER DEFAULT 3,
  solved_problems INTEGER DEFAULT 0,
  completed SMALLINT DEFAULT 0,
  UNIQUE(user_id, date)
);

-- 28. INTEGRITY & AUDIT LOGS
CREATE TABLE IF NOT EXISTS integrity_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  problem_id BIGINT REFERENCES problems(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL,
  details TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_problems_slug ON problems(slug);
CREATE INDEX IF NOT EXISTS idx_problems_topic ON problems(topic);
CREATE INDEX IF NOT EXISTS idx_problems_pattern ON problems(pattern_id);
CREATE INDEX IF NOT EXISTS idx_concepts_slug ON concepts(slug);
CREATE INDEX IF NOT EXISTS idx_concepts_section ON concepts(section_id);
CREATE INDEX IF NOT EXISTS idx_concept_progress_user ON concept_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_problem ON submissions(problem_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_discussions_problem ON discussions(problem_id);
CREATE INDEX IF NOT EXISTS idx_daily_goals_user_date ON daily_goals(user_id, date);
