import express from 'express';
import { query, run } from '../../config/db.js';
import { authMiddleware, optionalAuthMiddleware } from '../../config/jwt.js';
import { runCodeAgainstTestCases } from '../../services/codeRunner.js';
import { recalculateUserSkills } from '../../services/analytics.js';

const router = express.Router();

// Run code against custom test cases or sample test cases (No submission record created)
router.post('/run', optionalAuthMiddleware, async (req, res) => {
  try {
    const { language, code, problem_id, custom_test_cases } = req.body;
    if (!language || !code) {
      return res.status(400).json({ success: false, error: 'Language and code are required' });
    }

    let testCases = custom_test_cases;
    if (!testCases || testCases.length === 0) {
      testCases = await query(`
        SELECT input_data, expected_output FROM test_cases WHERE problem_id = ? AND is_sample = 1
      `, [problem_id || 1]);
    }

    if (!testCases || testCases.length === 0) {
      testCases = [{ input_data: '', expected_output: '' }];
    }

    const result = await runCodeAgainstTestCases(language, code, testCases);
    return res.json({ success: true, result });
  } catch (err) {
    console.error('Run code error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Submit code against all test cases and record official submission
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { problem_id, language, code, integrity_meta } = req.body;

    if (!problem_id || !language || !code) {
      return res.status(400).json({ success: false, error: 'problem_id, language, and code are required' });
    }

    const testCases = await query(`
      SELECT input_data, expected_output FROM test_cases WHERE problem_id = ? ORDER BY id ASC
    `, [problem_id]);

    if (!testCases || testCases.length === 0) {
      return res.status(404).json({ success: false, error: 'No test cases found for this problem' });
    }

    // Run in isolated sandbox
    const result = await runCodeAgainstTestCases(language, code, testCases);

    // Save submission to database
    const subRes = await run(`
      INSERT INTO submissions (
        user_id, problem_id, language, code, verdict, runtime_ms, memory_kb,
        passed_tests, total_tests, failed_case_diff_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      problem_id,
      language,
      code,
      result.verdict,
      result.runtime_ms,
      result.memory_kb,
      result.passed_tests,
      result.total_tests,
      result.failed_case ? JSON.stringify(result.failed_case) : null
    ]);

    // If accepted, update XP, daily goal & check for first problem solve achievement
    let xpGained = 0;
    if (result.verdict === 'Accepted') {
      const priorAccepted = await query(`
        SELECT id FROM submissions WHERE user_id = ? AND problem_id = ? AND verdict = 'Accepted' AND id != ?
      `, [userId, problem_id, subRes.lastInsertRowid]);

      // Only award first-time XP
      if (priorAccepted.length === 0) {
        xpGained = 50;
        await run(`UPDATE users SET xp = xp + ? WHERE id = ?`, [xpGained, userId]);

        // Daily goal update
        const today = new Date().toISOString().split('T')[0];
        await run(`
          INSERT INTO daily_goals (user_id, date, target_problems, solved_problems)
          VALUES (?, ?, 3, 1)
          ON CONFLICT(user_id, date) DO UPDATE SET
            solved_problems = daily_goals.solved_problems + 1,
            completed = CASE WHEN daily_goals.solved_problems + 1 >= daily_goals.target_problems THEN 1 ELSE 0 END
        `, [userId, today]);
      }
    }

    // Recalculate skill matrix
    await recalculateUserSkills(userId);

    // Anti-cheat / integrity log
    if (integrity_meta && (integrity_meta.paste_count > 5 || integrity_meta.tab_switches > 3)) {
      await run(`
        INSERT INTO integrity_logs (user_id, problem_id, event_type, details)
        VALUES (?, ?, 'suspicious_activity', ?)
      `, [userId, problem_id, JSON.stringify(integrity_meta)]);
    }

    return res.json({
      success: true,
      submission_id: subRes.lastInsertRowid,
      verdict: result.verdict,
      runtime_ms: result.runtime_ms,
      memory_kb: result.memory_kb,
      passed_tests: result.passed_tests,
      total_tests: result.total_tests,
      failed_case: result.failed_case,
      xp_gained: xpGained
    });
  } catch (err) {
    console.error('Submit code error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Get user submissions for a specific problem or all recent
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { problem_id } = req.query;

    let sql = `
      SELECT s.id, s.problem_id, s.language, s.verdict, s.runtime_ms, s.memory_kb,
             s.passed_tests, s.total_tests, s.submitted_at, p.title as problem_title, p.difficulty
      FROM submissions s
      JOIN problems p ON s.problem_id = p.id
      WHERE s.user_id = ?
    `;
    const params = [userId];

    if (problem_id) {
      sql += ` AND s.problem_id = ?`;
      params.push(problem_id);
    }

    sql += ` ORDER BY s.submitted_at DESC LIMIT 50`;

    const subs = await query(sql, params);
    return res.json({ success: true, submissions: subs });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
