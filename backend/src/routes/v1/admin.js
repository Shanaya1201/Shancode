import express from 'express';
import { query, run } from '../../config/db.js';
import { authMiddleware, requireAdmin } from '../../config/jwt.js';

const router = express.Router();

// Admin System Metrics & Analytics
router.get('/metrics', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const totalUsers = (await query(`SELECT COUNT(*) as cnt FROM users`))[0].cnt;
    const totalProblems = (await query(`SELECT COUNT(*) as cnt FROM problems`))[0].cnt;
    const totalConcepts = (await query(`SELECT COUNT(*) as cnt FROM concepts`))[0].cnt;
    const totalSubmissions = (await query(`SELECT COUNT(*) as cnt FROM submissions`))[0].cnt;

    const difficultConcepts = await query(`
      SELECT c.title, c.slug, s.title as section_title, 
             AVG(cp.video_progress_pct) as avg_progress,
             SUM(cp.quiz_passed) as passed_quizzes
      FROM concepts c
      JOIN sections s ON c.section_id = s.id
      LEFT JOIN concept_progress cp ON c.id = cp.concept_id
      GROUP BY c.id
      ORDER BY avg_progress ASC LIMIT 5
    `);

    const failedProblems = await query(`
      SELECT p.title, p.difficulty, p.topic, 
             COUNT(s.id) as total_attempts,
             SUM(CASE WHEN s.verdict = 'Accepted' THEN 1 ELSE 0 END) as accepted_attempts
      FROM problems p
      LEFT JOIN submissions s ON p.id = s.problem_id
      GROUP BY p.id
      ORDER BY total_attempts DESC LIMIT 5
    `);

    return res.json({
      success: true,
      metrics: {
        total_users: totalUsers,
        total_problems: totalProblems,
        total_concepts: totalConcepts,
        total_submissions: totalSubmissions,
        difficult_concepts: difficultConcepts,
        failed_problems: failedProblems
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Admin problem creator
router.post('/problems', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const {
      title, slug, difficulty, topic, pattern_id, concept_id,
      description, examples, constraints, starter_code, solution, company_tags, test_cases
    } = req.body;

    const probRes = await run(`
      INSERT INTO problems (
        title, slug, difficulty, topic, pattern_id, concept_id, description,
        examples_json, constraints_json, starter_code_json, solution_json, company_tags_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title, slug, difficulty, topic, pattern_id || null, concept_id || null, description,
      JSON.stringify(examples || []), JSON.stringify(constraints || []),
      JSON.stringify(starter_code || {}), JSON.stringify(solution || {}),
      JSON.stringify(company_tags || [])
    ]);

    const problemId = probRes.lastInsertRowid;

    if (test_cases && Array.isArray(test_cases)) {
      for (const tc of test_cases) {
        await run(`
          INSERT INTO test_cases (problem_id, input_data, expected_output, is_sample)
          VALUES (?, ?, ?, ?)
        `, [problemId, tc.input_data, tc.expected_output, tc.is_sample ? 1 : 0]);
      }
    }

    return res.status(201).json({ success: true, id: problemId, message: 'Problem created successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Admin list all users
router.get('/users', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const users = await query(`
      SELECT u.id, u.username, u.email, u.role, u.rating, u.xp, u.streak, u.created_at, p.target_company
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      ORDER BY u.id DESC
    `);
    return res.json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
