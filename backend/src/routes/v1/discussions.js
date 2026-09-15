import express from 'express';
import { query, run, safeJsonParse } from '../../config/db.js';
import { optionalAuthMiddleware, authMiddleware } from '../../config/jwt.js';
import { rateLimit } from '../../middleware/rateLimit.js';

const router = express.Router();

const postLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'You are posting too quickly. Please wait a minute.'
});

function sanitizeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

// Get discussion list
router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const { problem_id, concept_id, tag } = req.query;
    let sql = `
      SELECT d.*, u.username, pr.avatar,
             (SELECT COUNT(*) FROM discussion_comments dc WHERE dc.discussion_id = d.id) as comments_count
      FROM discussions d
      JOIN users u ON d.user_id = u.id
      JOIN profiles pr ON u.id = pr.user_id
      WHERE 1=1
    `;
    const params = [];

    if (problem_id) {
      sql += ` AND d.problem_id = ?`;
      params.push(problem_id);
    }
    if (concept_id) {
      sql += ` AND d.concept_id = ?`;
      params.push(concept_id);
    }

    sql += ` ORDER BY d.created_at DESC LIMIT 50`;

    const discussions = await query(sql, params);
    let results = discussions.map(d => ({
      ...d,
      tags: safeJsonParse(d.tags_json, [])
    }));

    if (tag) {
      results = results.filter(d => d.tags.includes(tag));
    }

    return res.json({ success: true, discussions: results });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Create discussion post
router.post('/', authMiddleware, postLimiter, async (req, res) => {
  try {
    const { title, body, problem_id, concept_id, tags } = req.body;
    if (!title || !body) {
      return res.status(400).json({ success: false, error: 'Title and body are required' });
    }

    const cleanTitle = sanitizeHtml(title);
    const cleanBody = sanitizeHtml(body);

    const result = await run(`
      INSERT INTO discussions (user_id, problem_id, concept_id, title, body, tags_json)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [req.user.id, problem_id || null, concept_id || null, cleanTitle, cleanBody, JSON.stringify(tags || [])]);

    return res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Upvote discussion
router.post('/:id/upvote', authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await run(`UPDATE discussions SET upvotes = upvotes + 1 WHERE id = ?`, [id]);
    return res.json({ success: true, message: 'Upvoted' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Get comments for discussion
router.get('/:id/comments', optionalAuthMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const comments = await query(`
      SELECT c.*, u.username, pr.avatar
      FROM discussion_comments c
      JOIN users u ON c.user_id = u.id
      JOIN profiles pr ON u.id = pr.user_id
      WHERE c.discussion_id = ?
      ORDER BY c.created_at ASC
    `, [id]);

    return res.json({ success: true, comments });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Add comment
router.post('/:id/comments', authMiddleware, postLimiter, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { body } = req.body;
    if (!body) {
      return res.status(400).json({ success: false, error: 'Comment body is required' });
    }

    const cleanBody = sanitizeHtml(body);

    await run(`
      INSERT INTO discussion_comments (discussion_id, user_id, body)
      VALUES (?, ?, ?)
    `, [id, req.user.id, cleanBody]);

    return res.status(201).json({ success: true, message: 'Comment added' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
