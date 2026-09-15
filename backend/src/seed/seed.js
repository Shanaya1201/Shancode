import bcrypt from 'bcryptjs';
import { getDb, run, exec, query } from '../config/db.js';
import { initSchema } from '../models/schema.js';
import { SECTIONS, PATTERNS, CONCEPTS, PROBLEMS, ACHIEVEMENTS, CONTESTS } from './seedData.js';

export async function seedDatabase() {
  console.log('🚀 Initializing Shancode Database Schema...');
  await initSchema();

  console.log('🌱 Seeding Sections...');
  for (const s of SECTIONS) {
    await run(`
      INSERT OR REPLACE INTO sections (id, title, slug, description, icon, order_index)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [s.id, s.title, s.slug, s.description, s.icon, s.order_index]);
  }

  console.log('🌱 Seeding Patterns & Levels...');
  for (const p of PATTERNS) {
    await run(`
      INSERT OR REPLACE INTO patterns (id, name, slug, description, total_levels, icon)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [p.id, p.name, p.slug, p.description, p.total_levels, p.icon]);

    if (p.levels) {
      for (const lvl of p.levels) {
        await run(`
          INSERT OR REPLACE INTO pattern_levels (pattern_id, level_number, title, required_count, difficulty)
          VALUES (?, ?, ?, ?, ?)
        `, [p.id, lvl.level_number, lvl.title, lvl.required_count, lvl.difficulty]);
      }
    }
  }

  console.log('🌱 Seeding Concepts & Quizzes...');
  for (const c of CONCEPTS) {
    await run(`
      INSERT OR REPLACE INTO concepts (
        id, section_id, title, slug, summary, intuition, when_to_use, visual_svg,
        code_samples_json, common_mistakes_json, video_url, video_source, order_index
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      c.id, c.section_id, c.title, c.slug, c.summary, c.intuition, c.when_to_use, c.visual_svg,
      JSON.stringify(c.code_samples), JSON.stringify(c.common_mistakes), c.video_url, c.video_source, c.order_index
    ]);

    if (c.quiz) {
      const qRes = await run(`
        INSERT OR REPLACE INTO quizzes (id, concept_id, title, passing_score)
        VALUES (?, ?, ?, 80)
      `, [c.id, c.id, c.quiz.title]);

      for (const q of c.quiz.questions) {
        await run(`
          INSERT INTO quiz_questions (quiz_id, question, options_json, correct_option_index, explanation)
          VALUES (?, ?, ?, ?, ?)
        `, [c.id, q.question, JSON.stringify(q.options), q.correct_option_index, q.explanation]);
      }
    }
  }

  console.log('🌱 Seeding Problems, Hints & Test Cases...');
  for (const p of PROBLEMS) {
    await run(`
      INSERT OR REPLACE INTO problems (
        id, title, slug, difficulty, topic, pattern_id, concept_id, description,
        examples_json, constraints_json, starter_code_json, solution_json,
        acceptance_rate, company_tags_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      p.id, p.title, p.slug, p.difficulty, p.topic, p.pattern_id, p.concept_id, p.description,
      JSON.stringify(p.examples), JSON.stringify(p.constraints), JSON.stringify(p.starter_code),
      JSON.stringify(p.solution), 72, JSON.stringify(p.company_tags)
    ]);

    // Test cases
    if (p.test_cases) {
      for (const tc of p.test_cases) {
        await run(`
          INSERT INTO test_cases (problem_id, input_data, expected_output, is_sample)
          VALUES (?, ?, ?, ?)
        `, [p.id, tc.input_data, tc.expected_output, tc.is_sample]);
      }
    }

    // Hints
    if (p.hints) {
      for (const h of p.hints) {
        await run(`
          INSERT INTO hints (problem_id, tier, hint_text)
          VALUES (?, ?, ?)
        `, [p.id, h.tier, h.text]);
      }
    }
  }

  console.log('🌱 Seeding Achievements...');
  for (const a of ACHIEVEMENTS) {
    await run(`
      INSERT OR REPLACE INTO achievements (code, title, description, icon, xp_reward)
      VALUES (?, ?, ?, ?, ?)
    `, [a.code, a.title, a.description, a.icon, a.xp_reward]);
  }

  console.log('🌱 Seeding Contests...');
  for (const c of CONTESTS) {
    await run(`
      INSERT OR REPLACE INTO contests (id, title, slug, description, start_time, end_time, duration_minutes, is_rated, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [c.id, c.title, c.slug, c.description, c.start_time, c.end_time, c.duration_minutes, c.is_rated, c.status]);

    await run(`
      INSERT OR REPLACE INTO contest_problems (contest_id, problem_id, point_value, order_index)
      VALUES (?, 1, 100, 1), (?, 2, 200, 2), (?, 3, 300, 3)
    `, [c.id, c.id, c.id]);
  }

  console.log('🌱 Creating Demo Learner (Sushmita) & Profiles...');
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('shancode123', salt);

  await run(`
    INSERT OR REPLACE INTO users (id, username, email, password_hash, role, rating, xp, streak, last_active_date)
    VALUES (1, 'sushmita', 'sushmita@shancode.io', ?, 'student', 1620, 1450, 14, DATE('now')),
           (2, 'admin', 'admin@shancode.io', ?, 'admin', 2150, 9200, 45, DATE('now'))
  `, [passwordHash, passwordHash]);

  await run(`
    INSERT OR REPLACE INTO profiles (user_id, avatar, bio, target_company, interview_readiness, github_url)
    VALUES (1, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80', 'Aspiring Senior Software Engineer targeting FAANG & Tier-1 Tech', 'Google', 78, 'https://github.com/Shanaya1201'),
           (2, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', 'Shancode Lead Architect & Instructor', 'Meta', 95, 'https://github.com/Shanaya1201')
  `);

  // Seed sample concept progress for Sushmita
  await run(`
    INSERT OR REPLACE INTO concept_progress (user_id, concept_id, video_progress_pct, video_resume_sec, quiz_passed, completed, repetition_stage, next_review_at)
    VALUES (1, 1, 100, 0, 1, 1, 3, DATETIME('now', '+3 days')),
           (1, 2, 85, 240, 1, 1, 2, DATETIME('now', '+1 days')),
           (1, 4, 68, 180, 0, 0, 0, NULL)
  `);

  // Seed sample submissions for Sushmita
  await run(`
    INSERT OR REPLACE INTO submissions (id, user_id, problem_id, language, code, verdict, runtime_ms, memory_kb, passed_tests, total_tests)
    VALUES (1, 1, 1, 'python', 'def twoSum(nums, target):\\n  seen={}\\n  for i,n in enumerate(nums):\\n    if target-n in seen: return [seen[target-n], i]\\n    seen[n]=i', 'Accepted', 48, 14200, 3, 3),
           (2, 1, 2, 'python', 'def isPalindrome(s):\\n  clean = [c.lower() for c in s if c.isalnum()]\\n  return clean == clean[::-1]', 'Accepted', 36, 15100, 3, 3),
           (3, 1, 6, 'python', 'def maxSubArray(nums):\\n  m = c = nums[0]\\n  for x in nums[1:]: c = max(x, c+x); m = max(m, c)\\n  return m', 'Accepted', 52, 16200, 3, 3)
  `);

  // Seed sample discussions
  await run(`
    INSERT OR REPLACE INTO discussions (id, user_id, problem_id, concept_id, title, body, tags_json, upvotes)
    VALUES (1, 1, 1, NULL, 'Intuitive explanation for why Hash Map is O(1) average lookup in Two Sum', 'Here is why trading O(N) space for O(N) time gives the optimal tradeoff in interviews...', '["Arrays", "HashMap", "Optimization"]', 38),
           (2, 2, NULL, 2, 'Common Pitfalls when updating Two Pointers in 3Sum problems', 'Remember to skip duplicate elements for both left and right pointers after finding a triplet!', '["TwoPointers", "BestPractices"]', 52)
  `);

  console.log('✅ Shancode Database Seeded Successfully for Learner Sushmita!');
}

if (process.argv[1].endsWith('seed.js')) {
  seedDatabase().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });
}
