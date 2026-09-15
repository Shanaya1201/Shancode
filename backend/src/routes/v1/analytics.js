import express from 'express';
import { query } from '../../config/db.js';
import { optionalAuthMiddleware, authMiddleware } from '../../config/jwt.js';
import { getUserWeakAndStrongAreas, calculateInterviewReadiness } from '../../services/analytics.js';

const router = express.Router();

// Get comprehensive user progress dashboard analytics
router.get('/dashboard', optionalAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id || 1; // Default to demo user

    // Get user basic stats
    const users = await query(`
      SELECT u.id, u.username, u.xp, u.streak, u.rating, p.avatar, p.target_company, p.interview_readiness
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = ?
    `, [userId]);
    const user = users[0] || { id: 1, username: 'sushmita', xp: 1250, streak: 12, rating: 1540 };

    // Problems breakdown
    const solved = await query(`
      SELECT DISTINCT p.id, p.difficulty, p.topic
      FROM submissions s
      JOIN problems p ON s.problem_id = p.id
      WHERE s.user_id = ? AND s.verdict = 'Accepted'
    `, [userId]);

    const totalProblems = Number((await query(`SELECT COUNT(*) as cnt FROM problems`))[0]?.cnt || 0);
    const easySolved = solved.filter(p => p.difficulty === 'Easy').length;
    const medSolved = solved.filter(p => p.difficulty === 'Medium').length;
    const hardSolved = solved.filter(p => p.difficulty === 'Hard').length;

    // Concept & Video stats
    const totalConceptsCount = Number((await query(`SELECT COUNT(*) as total FROM concepts`))[0]?.total || 0);
    const conceptProg = await query(`SELECT completed, video_progress_pct FROM concept_progress WHERE user_id = ?`, [userId]);
    const conceptsCompleted = conceptProg.filter(c => c.completed === 1).length;
    const videosCompleted = conceptProg.filter(c => c.video_progress_pct >= 90).length;

    // Daily goal
    const today = new Date().toISOString().split('T')[0];
    const dailyGoals = await query(`SELECT * FROM daily_goals WHERE user_id = ? AND date = ?`, [userId, today]);
    const dailyGoal = dailyGoals[0] || { target_problems: 3, solved_problems: 1, completed: 0 };

    // Skill breakdown & weak areas
    const { weakAreas, strongAreas } = await getUserWeakAndStrongAreas(userId);
    const userSkills = await query(`SELECT * FROM user_skills WHERE user_id = ? ORDER BY score DESC`, [userId]);

    // Recent submissions
    const recentSubs = await query(`
      SELECT s.id, s.verdict, s.runtime_ms, s.submitted_at, p.title, p.difficulty
      FROM submissions s
      JOIN problems p ON s.problem_id = p.id
      WHERE s.user_id = ?
      ORDER BY s.submitted_at DESC LIMIT 5
    `, [userId]);

    return res.json({
      success: true,
      user,
      stats: {
        total_problems: totalProblems,
        total_solved: solved.length,
        easy_solved: easySolved,
        medium_solved: medSolved,
        hard_solved: hardSolved,
        concepts_total: totalConceptsCount,
        concepts_completed: conceptsCompleted,
        videos_completed: videosCompleted,
        first_attempt_accuracy: 74,
        overall_acceptance: 82,
        daily_goal: dailyGoal,
        interview_readiness: user.interview_readiness || 68
      },
      skills: userSkills.length > 0 ? userSkills : [
        { topic: 'Arrays', score: 92 },
        { topic: 'Strings', score: 85 },
        { topic: 'Hashing', score: 78 },
        { topic: 'Binary Search', score: 55 },
        { topic: 'Trees', score: 48 },
        { topic: 'Graphs', score: 35 },
        { topic: 'Dynamic Programming', score: 25 }
      ],
      weak_areas: weakAreas,
      strong_areas: strongAreas,
      recent_submissions: recentSubs
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Calculate and return interview readiness score for any company
router.post('/interview-readiness', authMiddleware, async (req, res) => {
  try {
    const { company } = req.body;
    const result = await calculateInterviewReadiness(req.user.id, company || 'Google');
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
