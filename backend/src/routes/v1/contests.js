import express from 'express';
import { query } from '../../config/db.js';
import { optionalAuthMiddleware, authMiddleware } from '../../config/jwt.js';
import { getContestDetails, submitContestProblem } from '../../services/contestEngine.js';

const router = express.Router();

// Get all contests (upcoming, active, past)
router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const contests = await query(`SELECT * FROM contests ORDER BY start_time DESC`);
    return res.json({ success: true, contests });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Get contest details and live leaderboard
router.get('/:id', optionalAuthMiddleware, async (req, res) => {
  try {
    const contestId = Number(req.params.id);
    const userId = req.user?.id || null;
    const contest = await getContestDetails(contestId, userId);

    if (!contest) {
      return res.status(404).json({ success: false, error: 'Contest not found' });
    }

    return res.json({ success: true, contest });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Submit contest problem
router.post('/:id/submit', authMiddleware, async (req, res) => {
  try {
    const contestId = Number(req.params.id);
    const userId = req.user.id;
    const { problem_id, is_accepted, elapsed_minutes } = req.body;

    await submitContestProblem(contestId, userId, problem_id, is_accepted, elapsed_minutes || 10);
    return res.json({ success: true, message: 'Contest standing updated' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
