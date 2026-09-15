import express from 'express';
import { query, run } from '../../config/db.js';
import { authMiddleware } from '../../config/jwt.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await query(`
      SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20
    `, [req.user.id]);

    return res.json({ success: true, notifications });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/:id/read', authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await run(`UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`, [id, req.user.id]);
    return res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
