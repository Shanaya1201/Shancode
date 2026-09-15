import express from 'express';
import { optionalAuthMiddleware } from '../../config/jwt.js';
import { askAiTutor } from '../../services/aiTutor.js';

const router = express.Router();

router.post('/chat', optionalAuthMiddleware, async (req, res) => {
  try {
    const { question, codeContext, problemTitle, conceptTitle, failedTestDiff, mode } = req.body;
    const response = await askAiTutor({
      question,
      codeContext,
      problemTitle,
      conceptTitle,
      failedTestDiff,
      mode
    });
    return res.json({ success: true, ...response });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
