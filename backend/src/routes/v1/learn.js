import express from 'express';
import { query, run, withTransaction, safeJsonParse } from '../../config/db.js';
import { authMiddleware, optionalAuthMiddleware } from '../../config/jwt.js';
import { advanceSpacedRepetition, getDueSpacedRevisions } from '../../services/analytics.js';

const router = express.Router();

/**
 * Check if a concept is unlocked for a user based on sequential order and prerequisite graph
 */
async function checkConceptUnlocked(userId, conceptId) {
  if (!userId) {
    // Guest users can preview concept 1
    return { unlocked: conceptId === 1, prerequisites: [] };
  }

  // Check explicit prerequisite dependencies
  const prereqs = await query(`
    SELECT cd.prerequisite_id, c.title, c.slug, COALESCE(cp.completed, 0) as completed
    FROM concept_dependencies cd
    JOIN concepts c ON cd.prerequisite_id = c.id
    LEFT JOIN concept_progress cp ON cp.concept_id = cd.prerequisite_id AND cp.user_id = ?
    WHERE cd.concept_id = ?
  `, [userId, conceptId]);

  if (prereqs && prereqs.length > 0) {
    const uncompleted = prereqs.filter(p => !p.completed);
    return {
      unlocked: uncompleted.length === 0,
      prerequisites: prereqs
    };
  }

  // If no explicit graph prereqs, check sequential previous concept in section
  const currentConcept = (await query(`SELECT id, section_id, order_index FROM concepts WHERE id = ?`, [conceptId]))[0];
  if (!currentConcept) return { unlocked: false, prerequisites: [] };

  if (currentConcept.section_id === 1 && currentConcept.order_index === 1) {
    return { unlocked: true, prerequisites: [] };
  }

  // Check previous concept in same section or previous section completion
  if (currentConcept.order_index > 1) {
    const prevConcept = (await query(`
      SELECT c.id, c.title, c.slug, COALESCE(cp.completed, 0) as completed
      FROM concepts c
      LEFT JOIN concept_progress cp ON cp.concept_id = c.id AND cp.user_id = ?
      WHERE c.section_id = ? AND c.order_index = ?
    `, [userId, currentConcept.section_id, currentConcept.order_index - 1]))[0];

    if (prevConcept) {
      return {
        unlocked: Boolean(prevConcept.completed),
        prerequisites: [prevConcept]
      };
    }
  }

  return { unlocked: true, prerequisites: [] };
}

// Get full DSA Roadmap with user progress and unlock status
router.get('/roadmap', optionalAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id || 0;
    const sections = await query(`SELECT * FROM sections ORDER BY order_index ASC`);
    const concepts = await query(`SELECT * FROM concepts ORDER BY section_id ASC, order_index ASC`);

    let progressMap = {};
    if (userId) {
      const userProgress = await query(`SELECT * FROM concept_progress WHERE user_id = ?`, [userId]);
      userProgress.forEach(p => {
        progressMap[p.concept_id] = p;
      });
    }

    let previousCompleted = true; // Section 1 Concept 1 is always unlocked

    const roadmapData = sections.map(sec => {
      const secConcepts = concepts
        .filter(c => c.section_id === sec.id)
        .map(c => {
          const prog = progressMap[c.id];
          let status = 'locked';
          const isCompleted = Boolean(prog?.completed);

          if (previousCompleted || isCompleted) {
            if (isCompleted) {
              status = 'completed';
            } else if (prog?.video_progress_pct > 0 || prog?.notes) {
              status = 'in_progress';
            } else {
              status = 'available';
            }
          }

          previousCompleted = isCompleted;

          return {
            id: c.id,
            title: c.title,
            slug: c.slug,
            summary: c.summary,
            order_index: c.order_index,
            status,
            unlocked: status !== 'locked',
            video_progress_pct: prog?.video_progress_pct || 0,
            quiz_passed: Boolean(prog?.quiz_passed),
            completed: isCompleted
          };
        });

      const completedCount = secConcepts.filter(c => c.completed).length;
      const progressPct = secConcepts.length > 0 ? Math.round((completedCount / secConcepts.length) * 100) : 0;

      return {
        ...sec,
        concepts_count: secConcepts.length,
        completed_count: completedCount,
        progress_pct: progressPct,
        concepts: secConcepts
      };
    });

    return res.json({ success: true, roadmap: roadmapData });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Get concept details by slug or ID
router.get('/concepts/:slugOrId', optionalAuthMiddleware, async (req, res) => {
  try {
    const param = req.params.slugOrId;
    const userId = req.user?.id || 0;

    let concepts;
    if (!isNaN(Number(param))) {
      concepts = await query(`SELECT * FROM concepts WHERE id = ?`, [Number(param)]);
    } else {
      concepts = await query(`SELECT * FROM concepts WHERE slug = ?`, [param]);
    }

    if (!concepts || concepts.length === 0) {
      return res.status(404).json({ success: false, error: 'Concept not found' });
    }

    const concept = concepts[0];
    const section = (await query(`SELECT * FROM sections WHERE id = ?`, [concept.section_id]))[0];

    // Check unlocking status
    const unlockStatus = await checkConceptUnlocked(userId, concept.id);

    // Fetch quiz & questions
    const quizRow = (await query(`SELECT * FROM quizzes WHERE concept_id = ?`, [concept.id]))[0];
    let quiz = null;
    if (quizRow) {
      const questions = await query(`SELECT * FROM quiz_questions WHERE quiz_id = ?`, [quizRow.id]);
      quiz = {
        id: quizRow.id,
        title: quizRow.title,
        passing_score: quizRow.passing_score,
        questions: questions.map(q => ({
          id: q.id,
          question: q.question,
          options: safeJsonParse(q.options_json, []),
          correct_option_index: q.correct_option_index,
          explanation: q.explanation
        }))
      };
    }

    // Fetch related problems unlocked by this concept
    const relatedProblems = await query(`
      SELECT id, title, slug, difficulty, topic, acceptance_rate 
      FROM problems 
      WHERE concept_id = ?
    `, [concept.id]);

    // Fetch user progress
    let userProgress = null;
    if (userId) {
      const progRows = await query(`SELECT * FROM concept_progress WHERE user_id = ? AND concept_id = ?`, [userId, concept.id]);
      if (progRows && progRows.length > 0) {
        userProgress = progRows[0];
      }
    }

    return res.json({
      success: true,
      unlocked: unlockStatus.unlocked,
      prerequisites: unlockStatus.prerequisites,
      concept: {
        ...concept,
        code_samples: safeJsonParse(concept.code_samples_json, {}),
        common_mistakes: safeJsonParse(concept.common_mistakes_json, []),
        section,
        quiz,
        related_problems: relatedProblems,
        user_progress: userProgress || {
          video_progress_pct: 0,
          video_resume_sec: 0,
          quiz_passed: 0,
          completed: 0,
          notes: ''
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Update video watch progress & timestamp tracking
router.post('/concepts/:id/video-progress', authMiddleware, async (req, res) => {
  try {
    const conceptId = Number(req.params.id);
    const userId = req.user.id;
    const { progress_pct, resume_sec } = req.body;

    const completedFlag = progress_pct >= 90 ? 1 : 0;

    await run(`
      INSERT INTO concept_progress (user_id, concept_id, video_progress_pct, video_resume_sec, completed, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, concept_id) DO UPDATE SET
        video_progress_pct = MAX(concept_progress.video_progress_pct, excluded.video_progress_pct),
        video_resume_sec = excluded.video_resume_sec,
        completed = CASE WHEN excluded.video_progress_pct >= 90 AND concept_progress.quiz_passed = 1 THEN 1 ELSE concept_progress.completed END,
        updated_at = CURRENT_TIMESTAMP
    `, [userId, conceptId, progress_pct || 0, resume_sec || 0, completedFlag]);

    return res.json({ success: true, message: 'Video progress recorded' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Submit Quiz answers
router.post('/concepts/:id/quiz-submit', authMiddleware, async (req, res) => {
  try {
    const conceptId = Number(req.params.id);
    const userId = req.user.id;
    const { answers } = req.body; // { questionId: selectedIndex }

    const quizRow = (await query(`SELECT * FROM quizzes WHERE concept_id = ?`, [conceptId]))[0];
    if (!quizRow) {
      return res.status(404).json({ success: false, error: 'No quiz for this concept' });
    }

    const questions = await query(`SELECT * FROM quiz_questions WHERE quiz_id = ?`, [quizRow.id]);
    let correctCount = 0;
    const feedback = [];

    questions.forEach(q => {
      const userSelected = answers[q.id];
      const isCorrect = userSelected === q.correct_option_index;
      if (isCorrect) correctCount++;
      feedback.push({
        question_id: q.id,
        is_correct: isCorrect,
        correct_index: q.correct_option_index,
        explanation: q.explanation
      });
    });

    const scorePct = Math.round((correctCount / Math.max(1, questions.length)) * 100);
    const passed = scorePct >= quizRow.passing_score;

    if (passed) {
      await withTransaction(async (tx) => {
        await tx.run(`
          INSERT INTO concept_progress (user_id, concept_id, quiz_passed, completed, updated_at)
          VALUES (?, ?, 1, 1, CURRENT_TIMESTAMP)
          ON CONFLICT(user_id, concept_id) DO UPDATE SET
            quiz_passed = 1,
            completed = 1,
            updated_at = CURRENT_TIMESTAMP
        `, [userId, conceptId]);

        // Award XP and log transaction
        await tx.run(`UPDATE users SET xp = xp + 50 WHERE id = ?`, [userId]);
        await tx.run(`
          INSERT INTO xp_transactions (user_id, amount, source, reference_id)
          VALUES (?, 50, 'quiz_pass', ?)
        `, [userId, `quiz_${conceptId}`]);
      });

      // Trigger spaced repetition schedule
      await advanceSpacedRepetition(userId, conceptId, true);
    }

    return res.json({
      success: true,
      score_pct: scorePct,
      passed,
      correct_count: correctCount,
      total_questions: questions.length,
      feedback
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Save personal notes for a concept
router.post('/concepts/:id/notes', authMiddleware, async (req, res) => {
  try {
    const conceptId = Number(req.params.id);
    const userId = req.user.id;
    const { notes } = req.body;

    await run(`
      INSERT INTO concept_progress (user_id, concept_id, notes, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, concept_id) DO UPDATE SET
        notes = excluded.notes,
        updated_at = CURRENT_TIMESTAMP
    `, [userId, conceptId, notes || '']);

    return res.json({ success: true, message: 'Notes saved successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Get Spaced Repetition Due Revisions
router.get('/spaced-repetition/due', authMiddleware, async (req, res) => {
  try {
    const dueReviews = await getDueSpacedRevisions(req.user.id);
    return res.json({ success: true, due_reviews: dueReviews });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
