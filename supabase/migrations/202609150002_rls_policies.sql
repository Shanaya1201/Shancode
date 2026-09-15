-- ==============================================================================
-- SHANCODE PLATFORM: Supabase PostgreSQL Row Level Security (RLS) Migration (002)
-- ==============================================================================

-- 1. Enable RLS on all sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pattern_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hint_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrity_logs ENABLE ROW LEVEL SECURITY;

-- Enable RLS on public catalog tables (public read-only)
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE hints ENABLE ROW LEVEL SECURITY;
ALTER TABLE contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- PUBLIC READ POLICIES (Accessible to all users & anon clients)
-- ==============================================================================

CREATE POLICY "Public Read Sections" ON sections FOR SELECT USING (true);
CREATE POLICY "Public Read Concepts" ON concepts FOR SELECT USING (true);
CREATE POLICY "Public Read Concept Dependencies" ON concept_dependencies FOR SELECT USING (true);
CREATE POLICY "Public Read Quizzes" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Public Read Quiz Questions" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Public Read Patterns" ON patterns FOR SELECT USING (true);
CREATE POLICY "Public Read Pattern Levels" ON pattern_levels FOR SELECT USING (true);
CREATE POLICY "Public Read Problems" ON problems FOR SELECT USING (true);
CREATE POLICY "Public Read Sample Test Cases" ON test_cases FOR SELECT USING (is_sample = 1);
CREATE POLICY "Public Read Contests" ON contests FOR SELECT USING (true);
CREATE POLICY "Public Read Contest Problems" ON contest_problems FOR SELECT USING (true);
CREATE POLICY "Public Read Contest Participants" ON contest_participants FOR SELECT USING (true);
CREATE POLICY "Public Read Achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public Read Profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Discussions" ON discussions FOR SELECT USING (true);
CREATE POLICY "Public Read Discussion Comments" ON discussion_comments FOR SELECT USING (true);

-- ==============================================================================
-- USER-SPECIFIC POLICIES (Owner Isolation with Strict WITH CHECK Clauses)
-- ==============================================================================

-- Concept Progress
CREATE POLICY "Users Read Own Concept Progress" ON concept_progress 
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users Insert Own Concept Progress" ON concept_progress 
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users Update Own Concept Progress" ON concept_progress 
  FOR UPDATE USING (auth.uid()::text = user_id::text) WITH CHECK (auth.uid()::text = user_id::text);

-- Submissions
CREATE POLICY "Users Read Own Submissions" ON submissions 
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users Insert Own Submissions" ON submissions 
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Notifications
CREATE POLICY "Users Read Own Notifications" ON notifications 
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users Insert Own Notifications" ON notifications 
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users Update Own Notifications" ON notifications 
  FOR UPDATE USING (auth.uid()::text = user_id::text) WITH CHECK (auth.uid()::text = user_id::text);

-- Profiles
CREATE POLICY "Users Insert Own Profile" ON profiles 
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users Update Own Profile" ON profiles 
  FOR UPDATE USING (auth.uid()::text = user_id::text) WITH CHECK (auth.uid()::text = user_id::text);

-- User Pattern Mastery
CREATE POLICY "Users Read Own Pattern Mastery" ON user_pattern_mastery 
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users Insert Own Pattern Mastery" ON user_pattern_mastery 
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users Update Own Pattern Mastery" ON user_pattern_mastery 
  FOR UPDATE USING (auth.uid()::text = user_id::text) WITH CHECK (auth.uid()::text = user_id::text);

-- Hint Usages
CREATE POLICY "Users Read Own Hint Usages" ON hint_usages 
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users Insert Own Hint Usages" ON hint_usages 
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- User Skills & Progress
CREATE POLICY "Users Read Own Skills" ON user_skills 
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users Insert Own Skills" ON user_skills 
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users Update Own Skills" ON user_skills 
  FOR UPDATE USING (auth.uid()::text = user_id::text) WITH CHECK (auth.uid()::text = user_id::text);

-- Daily Goals
CREATE POLICY "Users Read Own Daily Goals" ON daily_goals 
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users Insert Own Daily Goals" ON daily_goals 
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users Update Own Daily Goals" ON daily_goals 
  FOR UPDATE USING (auth.uid()::text = user_id::text) WITH CHECK (auth.uid()::text = user_id::text);

-- XP Transactions
CREATE POLICY "Users Read Own XP Transactions" ON xp_transactions 
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- User Achievements
CREATE POLICY "Users Read Own Achievements" ON user_achievements 
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Contest Participation Registration
CREATE POLICY "Users Register Contest" ON contest_participants 
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Discussions & Comments creation and updates
CREATE POLICY "Authenticated Users Create Discussions" ON discussions 
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users Update Own Discussions" ON discussions 
  FOR UPDATE USING (auth.uid()::text = user_id::text) WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Authenticated Users Create Comments" ON discussion_comments 
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users Update Own Comments" ON discussion_comments 
  FOR UPDATE USING (auth.uid()::text = user_id::text) WITH CHECK (auth.uid()::text = user_id::text);

-- ==============================================================================
-- SERVICE ROLE / BACKEND BYPASS NOTE
-- (The Supabase Service Role Key bypasses RLS automatically by design in PostgreSQL)
-- ==============================================================================
