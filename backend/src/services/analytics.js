import { query, run } from '../config/db.js';

/**
 * Calculates user's skill scores across topics and updates user_skills table
 */
export async function recalculateUserSkills(userId) {
  // Get all submissions for user
  const subs = await query(`
    SELECT s.*, p.topic, p.difficulty 
    FROM submissions s
    JOIN problems p ON s.problem_id = p.id
    WHERE s.user_id = ?
  `, [userId]);

  // Get hint usages for user
  const hints = await query(`
    SELECT hu.*, p.topic 
    FROM hint_usages hu
    JOIN problems p ON hu.problem_id = p.id
    WHERE hu.user_id = ?
  `, [userId]);

  const topicStats = {};

  subs.forEach((sub) => {
    const t = sub.topic || 'General';
    if (!topicStats[t]) {
      topicStats[t] = {
        topic: t,
        totalAttempts: 0,
        solvedCount: new Set(),
        diffWeightsSum: 0,
        hintsUsed: 0,
      };
    }
    topicStats[t].totalAttempts++;
    if (sub.verdict === 'Accepted') {
      topicStats[t].solvedCount.add(sub.problem_id);
      const diffWeight = sub.difficulty === 'Hard' ? 2.5 : (sub.difficulty === 'Medium' ? 1.6 : 1.0);
      topicStats[t].diffWeightsSum += diffWeight;
    }
  });

  hints.forEach((h) => {
    const t = h.topic || 'General';
    if (topicStats[t]) {
      topicStats[t].hintsUsed++;
    }
  });

  // Calculate weighted score (0-100) per topic
  for (const topic of Object.keys(topicStats)) {
    const stat = topicStats[topic];
    const solved = stat.solvedCount.size;
    const attempts = stat.totalAttempts;
    const avgAttempts = Math.max(1, attempts / Math.max(1, solved));
    const hintPenalty = Math.min(25, (stat.hintsUsed / Math.max(1, solved)) * 6);

    // Score calculation
    let rawScore = (solved * 18 * (stat.diffWeightsSum / Math.max(1, solved))) / Math.sqrt(avgAttempts);
    rawScore = Math.max(10, Math.min(100, Math.round(rawScore - hintPenalty)));

    await run(`
      INSERT INTO user_skills (user_id, topic, score, attempted_count, solved_count, hint_count, avg_attempts, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, topic) DO UPDATE SET
        score = excluded.score,
        attempted_count = excluded.attempted_count,
        solved_count = excluded.solved_count,
        hint_count = excluded.hint_count,
        avg_attempts = excluded.avg_attempts,
        updated_at = CURRENT_TIMESTAMP
    `, [userId, topic, rawScore, attempts, solved, stat.hintsUsed, avgAttempts]);
  }
}

/**
 * Returns weak and strong areas with actionable recommendations
 */
export async function getUserWeakAndStrongAreas(userId) {
  const skills = await query(`
    SELECT * FROM user_skills WHERE user_id = ? ORDER BY score ASC
  `, [userId]);

  if (!skills || skills.length === 0) {
    return {
      weakAreas: [
        {
          topic: 'Dynamic Programming',
          score: 25,
          solved: 1,
          attempted: 6,
          hints: 4,
          avgAttempts: 3.2,
          reason: 'High attempt count with low acceptance rate',
          recommendations: [
            'Watch "DP Fundamentals & Memoization"',
            'Solve 3 Easy DP Problems (Climbing Stairs, Fibonacci)',
            'Practice 2 Medium DP Problems (Coin Change)'
          ]
        },
        {
          topic: 'Binary Search',
          score: 45,
          solved: 3,
          attempted: 8,
          hints: 5,
          avgAttempts: 2.7,
          reason: 'Frequent boundary condition mistakes',
          recommendations: [
            'Revisit "Search Space & Invariant Conditions"',
            'Practice "Find First and Last Position in Sorted Array"'
          ]
        }
      ],
      strongAreas: [
        {
          topic: 'Arrays & Two Pointers',
          score: 92,
          solved: 12,
          attempted: 14,
          hints: 1,
          avgAttempts: 1.1,
          praise: 'Consistently solving array problems quickly on the first attempt'
        }
      ]
    };
  }

  const weak = skills.filter(s => s.score < 60).map(s => ({
    topic: s.topic,
    score: s.score,
    solved: s.solved_count,
    attempted: s.attempted_count,
    hints: s.hint_count,
    avgAttempts: Number(s.avg_attempts.toFixed(1)),
    reason: s.score < 40 ? 'High failure rate and frequent hint usage' : 'Needs more medium-level practice',
    recommendations: [
      `Review ${s.topic} Concept Guide & Visual Explanation`,
      `Solve 3 Easy ${s.topic} practice problems without hints`,
      `Attempt 2 Medium ${s.topic} problems`
    ]
  }));

  const strong = skills.filter(s => s.score >= 75).map(s => ({
    topic: s.topic,
    score: s.score,
    solved: s.solved_count,
    attempted: s.attempted_count,
    hints: s.hint_count,
    avgAttempts: Number(s.avg_attempts.toFixed(1)),
    praise: `Mastering ${s.topic} with high first-try accuracy`
  }));

  return { weakAreas: weak, strongAreas: strong };
}

/**
 * Spaced Repetition Scheduler (Ebbinghaus Forgetting Curve)
 * Stages: 0 (Day 0), 1 (+1 day), 2 (+3 days), 3 (+7 days), 4 (+14 days), 5 (+30 days)
 */
export async function advanceSpacedRepetition(userId, conceptId, isSuccess = true) {
  const existing = await query(`
    SELECT * FROM concept_progress WHERE user_id = ? AND concept_id = ?
  `, [userId, conceptId]);

  const STAGES_DAYS = [1, 3, 7, 14, 30];
  let currentStage = existing[0]?.repetition_stage || 0;

  if (isSuccess) {
    currentStage = Math.min(5, currentStage + 1);
  } else {
    currentStage = Math.max(1, currentStage - 1);
  }

  const daysToAdd = STAGES_DAYS[Math.min(currentStage - 1, STAGES_DAYS.length - 1)] || 1;
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + daysToAdd);

  await run(`
    UPDATE concept_progress 
    SET repetition_stage = ?,
        last_reviewed_at = CURRENT_TIMESTAMP,
        next_review_at = ?
    WHERE user_id = ? AND concept_id = ?
  `, [currentStage, nextDate.toISOString(), userId, conceptId]);
}

export async function getDueSpacedRevisions(userId) {
  const now = new Date().toISOString();
  return await query(`
    SELECT cp.*, c.title as concept_title, c.slug as concept_slug, s.title as section_title
    FROM concept_progress cp
    JOIN concepts c ON cp.concept_id = c.id
    JOIN sections s ON c.section_id = s.id
    WHERE cp.user_id = ? AND cp.completed = 1 AND cp.next_review_at <= ?
    ORDER BY cp.next_review_at ASC
  `, [userId, now]);
}

/**
 * Computes Interview Readiness Score (0-100%) for target company
 */
export async function calculateInterviewReadiness(userId, targetCompany = 'Google') {
  const solvedProblems = await query(`
    SELECT DISTINCT p.id, p.difficulty, p.company_tags_json
    FROM submissions s
    JOIN problems p ON s.problem_id = p.id
    WHERE s.user_id = ? AND s.verdict = 'Accepted'
  `, [userId]);

  const companyProblems = await query(`
    SELECT id, difficulty, company_tags_json FROM problems
  `);

  const relevantProblems = companyProblems.filter(p => {
    try {
      const tags = JSON.parse(p.company_tags_json || '[]');
      return tags.includes(targetCompany);
    } catch (e) {
      return false;
    }
  });

  const solvedCompanyIds = new Set(solvedProblems.map(p => p.id));
  const totalRelevant = Math.max(5, relevantProblems.length);
  const solvedRelevant = relevantProblems.filter(p => solvedCompanyIds.has(p.id)).length;

  let readiness = Math.min(100, Math.round((solvedRelevant / totalRelevant) * 100));
  if (readiness < 20 && solvedProblems.length > 5) readiness = 35;

  await run(`
    UPDATE profiles SET interview_readiness = ?, target_company = ? WHERE user_id = ?
  `, [readiness, targetCompany, userId]);

  return { readiness, targetCompany, solvedCount: solvedProblems.length, relevantCount: relevantProblems.length };
}
