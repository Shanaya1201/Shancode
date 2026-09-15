import express from 'express';
import { optionalAuthMiddleware } from '../../config/jwt.js';
import { getUserPatternProgress } from '../../services/patternMastery.js';

const router = express.Router();

// Get all patterns and current user's mastery levels
router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id || 1; // Default demo user if guest
    const patterns = await getUserPatternProgress(userId);
    return res.json({ success: true, patterns });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
