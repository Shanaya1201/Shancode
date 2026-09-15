import express from 'express';
import { query, run, safeJsonParse } from '../../config/db.js';
import { optionalAuthMiddleware, authMiddleware } from '../../config/jwt.js';

const router = express.Router();

// Get topic and pattern metadata counts for quick filtering
router.get('/meta/filters', async (req, res) => {
  try {
    const topics = await query(`
      SELECT topic, COUNT(*) as count 
      FROM problems 
      GROUP BY topic 
      ORDER BY count DESC
    `);
    const difficulties = await query(`
      SELECT difficulty, COUNT(*) as count 
      FROM problems 
      GROUP BY difficulty
    `);
    const patterns = await query(`
      SELECT pt.id, pt.name, pt.slug, COUNT(p.id) as count
      FROM patterns pt
      LEFT JOIN problems p ON p.pattern_id = pt.id
      GROUP BY pt.id, pt.name, pt.slug
      ORDER BY pt.id ASC
    `);

    return res.json({
      success: true,
      topics,
      difficulties,
      patterns
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Get problem list with multi-filters
router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const { difficulty, topic, pattern, company, status, search } = req.query;
    const userId = req.user?.id || 0;

    let sql = `
      SELECT p.id, p.title, p.slug, p.difficulty, p.topic, p.pattern_id, p.concept_id,
             p.acceptance_rate, p.company_tags_json,
             pt.name as pattern_name,
             c.title as concept_title, c.slug as concept_slug
      FROM problems p
      LEFT JOIN patterns pt ON p.pattern_id = pt.id
      LEFT JOIN concepts c ON p.concept_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (difficulty && difficulty !== 'All') {
      sql += ` AND p.difficulty = ?`;
      params.push(difficulty);
    }
    if (topic && topic !== 'All') {
      sql += ` AND p.topic = ?`;
      params.push(topic);
    }
    if (pattern && pattern !== 'All') {
      sql += ` AND pt.slug = ?`;
      params.push(pattern);
    }
    if (search) {
      sql += ` AND (p.title LIKE ? OR p.topic LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY p.id ASC`;

    const problems = await query(sql, params);

    // Fetch user submission status for each problem
    let userSubmissions = {};
    if (userId) {
      const subs = await query(`
        SELECT problem_id, verdict, MAX(submitted_at) as last_sub
        FROM submissions
        WHERE user_id = ?
        GROUP BY problem_id, verdict
      `, [userId]);

      subs.forEach(s => {
        if (!userSubmissions[s.problem_id] || s.verdict === 'Accepted') {
          userSubmissions[s.problem_id] = s.verdict === 'Accepted' ? 'solved' : 'attempted';
        }
      });
    }

    let results = problems.map(p => {
      const companyTags = safeJsonParse(p.company_tags_json, []);
      const userStatus = userSubmissions[p.id] || 'unsolved';
      return {
        ...p,
        company_tags: companyTags,
        status: userStatus
      };
    });

    // Filter by company if requested
    if (company && company !== 'All') {
      results = results.filter(p => p.company_tags.includes(company));
    }

    // Filter by status if requested
    if (status && status !== 'All') {
      results = results.filter(p => p.status === status.toLowerCase());
    }

    return res.json({
      success: true,
      total: results.length,
      problems: results
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Get single problem by slug or ID with starter code, constraints, sample test cases, hints, and concept link
router.get('/:slugOrId', optionalAuthMiddleware, async (req, res) => {
  try {
    const param = req.params.slugOrId;
    const userId = req.user?.id || 0;

    let problems;
    if (!isNaN(Number(param))) {
      problems = await query(`SELECT * FROM problems WHERE id = ?`, [Number(param)]);
    } else {
      problems = await query(`SELECT * FROM problems WHERE slug = ?`, [param]);
    }

    if (!problems || problems.length === 0) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }

    const problem = problems[0];

    // Get linked concept details
    let concept = null;
    let conceptCompleted = true;
    if (problem.concept_id) {
      const concepts = await query(`SELECT id, title, slug, summary FROM concepts WHERE id = ?`, [problem.concept_id]);
      if (concepts.length > 0) {
        concept = concepts[0];
        if (userId) {
          const prog = await query(`SELECT completed FROM concept_progress WHERE user_id = ? AND concept_id = ?`, [userId, concept.id]);
          conceptCompleted = prog[0]?.completed === 1;
        } else {
          conceptCompleted = false;
        }
      }
    }

    // Get sample test cases
    const sampleTests = await query(`
      SELECT id, input_data, expected_output, is_sample 
      FROM test_cases 
      WHERE problem_id = ? AND is_sample = 1
      ORDER BY id ASC
    `, [problem.id]);

    // Get hints (available tiers)
    const hints = await query(`
      SELECT id, tier, hint_text FROM hints WHERE problem_id = ? ORDER BY tier ASC
    `, [problem.id]);

    // Get user's unlocked hints for this problem
    let unlockedHints = [];
    if (userId) {
      const used = await query(`SELECT hint_tier FROM hint_usages WHERE user_id = ? AND problem_id = ?`, [userId, problem.id]);
      unlockedHints = used.map(u => u.hint_tier);
    }

    return res.json({
      success: true,
      problem: {
        id: problem.id,
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        topic: problem.topic,
        pattern_id: problem.pattern_id,
        description: problem.description,
        examples: safeJsonParse(problem.examples_json, []),
        constraints: safeJsonParse(problem.constraints_json, []),
        starter_code: safeJsonParse(problem.starter_code_json, {}),
        acceptance_rate: problem.acceptance_rate,
        company_tags: safeJsonParse(problem.company_tags_json, []),
        sample_tests: sampleTests,
        hints_count: hints.length,
        unlocked_hints: unlockedHints,
        concept: concept ? {
          ...concept,
          is_completed: conceptCompleted
        } : null
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Unlock progressive hint (tracks usage for skill scoring penalty)
router.post('/:id/unlock-hint', authMiddleware, async (req, res) => {
  try {
    const problemId = Number(req.params.id);
    const userId = req.user.id;
    const { tier } = req.body;

    const hint = await query(`SELECT * FROM hints WHERE problem_id = ? AND tier = ?`, [problemId, tier]);
    if (!hint || hint.length === 0) {
      return res.status(404).json({ success: false, error: 'Hint tier not found' });
    }

    // Record hint usage
    await run(`
      INSERT INTO hint_usages (user_id, problem_id, hint_tier)
      VALUES (?, ?, ?)
    `, [userId, problemId, tier]);

    return res.json({
      success: true,
      tier,
      hint_text: hint[0].hint_text
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// View full solution (Intuition, Algorithm, Complexity, Code)
router.get('/:id/solution', authMiddleware, async (req, res) => {
  try {
    const problemId = Number(req.params.id);
    const problems = await query(`SELECT solution_json FROM problems WHERE id = ?`, [problemId]);
    if (!problems || problems.length === 0) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }

    const sol = safeJsonParse(problems[0].solution_json, {});
    return res.json({ success: true, solution: sol });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
