import { exec } from '../config/db.js';

export async function initSchema() {
  const schemaSql = `
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'student', -- 'student', 'moderator', 'admin'
      rating INTEGER DEFAULT 1200,
      xp INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 0,
      last_active_date TEXT,
      failed_login_attempts INTEGER DEFAULT 0,
      lockout_until DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Refresh tokens for JWT rotation and session invalidation
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token_hash TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      revoked INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- User profiles
    CREATE TABLE IF NOT EXISTS profiles (
      user_id INTEGER PRIMARY KEY,
      avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      bio TEXT DEFAULT 'Aspiring Software Engineer & DSA Enthusiast',
      target_company TEXT DEFAULT 'Google',
      interview_readiness INTEGER DEFAULT 25,
      github_url TEXT DEFAULT '',
      linkedin_url TEXT DEFAULT '',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Curriculum sections
    CREATE TABLE IF NOT EXISTS sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      icon TEXT,
      order_index INTEGER NOT NULL
    );

    -- Concepts / Lessons
    CREATE TABLE IF NOT EXISTS concepts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      summary TEXT,
      intuition TEXT,
      when_to_use TEXT,
      visual_svg TEXT,
      code_samples_json TEXT, -- { cpp, java, python, js }
      common_mistakes_json TEXT, -- array of strings
      video_url TEXT,
      video_source TEXT DEFAULT 'youtube',
      order_index INTEGER NOT NULL,
      FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
    );

    -- Concept prerequisites / dependencies
    CREATE TABLE IF NOT EXISTS concept_dependencies (
      concept_id INTEGER NOT NULL,
      prerequisite_id INTEGER NOT NULL,
      PRIMARY KEY (concept_id, prerequisite_id),
      FOREIGN KEY (concept_id) REFERENCES concepts(id) ON DELETE CASCADE,
      FOREIGN KEY (prerequisite_id) REFERENCES concepts(id) ON DELETE CASCADE
    );

    -- Concept Quizzes
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      concept_id INTEGER UNIQUE NOT NULL,
      title TEXT,
      passing_score INTEGER DEFAULT 80,
      FOREIGN KEY (concept_id) REFERENCES concepts(id) ON DELETE CASCADE
    );

    -- Quiz Questions
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER NOT NULL,
      question TEXT NOT NULL,
      options_json TEXT NOT NULL, -- JSON array of strings
      correct_option_index INTEGER NOT NULL,
      explanation TEXT,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    );

    -- Concept Learning Progress
    CREATE TABLE IF NOT EXISTS concept_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      concept_id INTEGER NOT NULL,
      video_progress_pct INTEGER DEFAULT 0,
      video_resume_sec INTEGER DEFAULT 0,
      rewatch_count INTEGER DEFAULT 0,
      quiz_passed INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 0,
      notes TEXT DEFAULT '',
      last_reviewed_at DATETIME,
      next_review_at DATETIME,
      repetition_stage INTEGER DEFAULT 0, -- 0 to 5
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, concept_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (concept_id) REFERENCES concepts(id) ON DELETE CASCADE
    );

    -- Algorithmic Patterns
    CREATE TABLE IF NOT EXISTS patterns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      total_levels INTEGER DEFAULT 4,
      icon TEXT
    );

    -- Pattern Levels
    CREATE TABLE IF NOT EXISTS pattern_levels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pattern_id INTEGER NOT NULL,
      level_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      required_count INTEGER NOT NULL,
      difficulty TEXT NOT NULL,
      FOREIGN KEY (pattern_id) REFERENCES patterns(id) ON DELETE CASCADE
    );

    -- User Pattern Mastery
    CREATE TABLE IF NOT EXISTS user_pattern_mastery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      pattern_id INTEGER NOT NULL,
      current_level INTEGER DEFAULT 1,
      mastery_pct INTEGER DEFAULT 0,
      solved_count INTEGER DEFAULT 0,
      unlocked_badge INTEGER DEFAULT 0,
      UNIQUE(user_id, pattern_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (pattern_id) REFERENCES patterns(id) ON DELETE CASCADE
    );

    -- Problems
    CREATE TABLE IF NOT EXISTS problems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      difficulty TEXT NOT NULL, -- 'Easy', 'Medium', 'Hard'
      topic TEXT NOT NULL,
      pattern_id INTEGER,
      concept_id INTEGER,
      description TEXT NOT NULL,
      examples_json TEXT NOT NULL, -- array of { input, output, explanation }
      constraints_json TEXT NOT NULL, -- array of strings
      starter_code_json TEXT NOT NULL, -- { python, javascript, cpp, java }
      solution_json TEXT NOT NULL, -- { intuition, algorithm, time_complexity, space_complexity, code }
      acceptance_rate INTEGER DEFAULT 65,
      company_tags_json TEXT DEFAULT '[]', -- ['Google', 'Amazon', 'Meta']
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pattern_id) REFERENCES patterns(id) ON DELETE SET NULL,
      FOREIGN KEY (concept_id) REFERENCES concepts(id) ON DELETE SET NULL
    );

    -- Problem Test Cases
    CREATE TABLE IF NOT EXISTS test_cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      problem_id INTEGER NOT NULL,
      input_data TEXT NOT NULL,
      expected_output TEXT NOT NULL,
      is_sample INTEGER DEFAULT 0, -- 1 if sample, 0 if hidden
      FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
    );

    -- Code Submissions
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      problem_id INTEGER NOT NULL,
      language TEXT NOT NULL,
      code TEXT NOT NULL,
      verdict TEXT NOT NULL, -- 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'
      runtime_ms INTEGER DEFAULT 0,
      memory_kb INTEGER DEFAULT 0,
      passed_tests INTEGER DEFAULT 0,
      total_tests INTEGER DEFAULT 0,
      failed_case_diff_json TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
    );

    -- Tiered Progressive Hints
    CREATE TABLE IF NOT EXISTS hints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      problem_id INTEGER NOT NULL,
      tier INTEGER NOT NULL, -- 1 (Directional), 2 (Observation), 3 (Algorithm)
      hint_text TEXT NOT NULL,
      FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
    );

    -- Hint Usages Tracking
    CREATE TABLE IF NOT EXISTS hint_usages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      problem_id INTEGER NOT NULL,
      hint_tier INTEGER NOT NULL,
      used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
    );

    -- User Skills Breakdown
    CREATE TABLE IF NOT EXISTS user_skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      topic TEXT NOT NULL,
      score INTEGER DEFAULT 0, -- 0-100
      attempted_count INTEGER DEFAULT 0,
      solved_count INTEGER DEFAULT 0,
      hint_count INTEGER DEFAULT 0,
      avg_attempts REAL DEFAULT 1.0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, topic),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Contests
    CREATE TABLE IF NOT EXISTS contests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      start_time DATETIME NOT NULL,
      end_time DATETIME NOT NULL,
      duration_minutes INTEGER DEFAULT 90,
      is_rated INTEGER DEFAULT 1,
      status TEXT DEFAULT 'upcoming'
    );

    -- Contest Problems Association
    CREATE TABLE IF NOT EXISTS contest_problems (
      contest_id INTEGER NOT NULL,
      problem_id INTEGER NOT NULL,
      point_value INTEGER DEFAULT 100,
      order_index INTEGER NOT NULL,
      PRIMARY KEY (contest_id, problem_id),
      FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE,
      FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
    );

    -- Contest Participants
    CREATE TABLE IF NOT EXISTS contest_participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contest_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      score INTEGER DEFAULT 0,
      finish_time_seconds INTEGER DEFAULT 0,
      penalty_minutes INTEGER DEFAULT 0,
      rank INTEGER DEFAULT 0,
      rating_delta INTEGER DEFAULT 0,
      is_virtual INTEGER DEFAULT 0,
      UNIQUE(contest_id, user_id),
      FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Discussions
    CREATE TABLE IF NOT EXISTS discussions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      problem_id INTEGER,
      concept_id INTEGER,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      tags_json TEXT DEFAULT '[]',
      upvotes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Discussion Comments
    CREATE TABLE IF NOT EXISTS discussion_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discussion_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      body TEXT NOT NULL,
      upvotes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Notifications
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'system',
      link TEXT,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Gamification: Achievements
    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      xp_reward INTEGER DEFAULT 100
    );

    -- Gamification: User Achievements
    CREATE TABLE IF NOT EXISTS user_achievements (
      user_id INTEGER NOT NULL,
      achievement_id INTEGER NOT NULL,
      unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, achievement_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
    );

    -- Gamification: XP Transactions (Ledger)
    CREATE TABLE IF NOT EXISTS xp_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      source TEXT NOT NULL, -- 'problem_solve', 'quiz_pass', 'streak_bonus', 'achievement'
      reference_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Daily Goals
    CREATE TABLE IF NOT EXISTS daily_goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      target_problems INTEGER DEFAULT 3,
      solved_problems INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 0,
      UNIQUE(user_id, date),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Integrity & Audit Logs
    CREATE TABLE IF NOT EXISTS integrity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      problem_id INTEGER,
      event_type TEXT NOT NULL, -- 'paste_abuse', 'tab_switch', 'rapid_solve', 'login_lockout'
      details TEXT,
      logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Indexes for optimal performance
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
    CREATE INDEX IF NOT EXISTS idx_problems_slug ON problems(slug);
    CREATE INDEX IF NOT EXISTS idx_problems_pattern ON problems(pattern_id);
    CREATE INDEX IF NOT EXISTS idx_problems_topic ON problems(topic);
    CREATE INDEX IF NOT EXISTS idx_concepts_slug ON concepts(slug);
    CREATE INDEX IF NOT EXISTS idx_concepts_section ON concepts(section_id);
    CREATE INDEX IF NOT EXISTS idx_concept_progress_user ON concept_progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_problem ON submissions(problem_id);
    CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);
    CREATE INDEX IF NOT EXISTS idx_discussions_problem ON discussions(problem_id);
    CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON xp_transactions(user_id);
  `;

  await exec(schemaSql);
}
