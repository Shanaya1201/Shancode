import { query, run, withTransaction } from '../config/db.js';

/**
 * Gamification & Achievement Engine
 */
export async function awardXP(userId, amount, source, referenceId = null) {
  if (!userId || amount <= 0) return { success: false };

  return await withTransaction(async (tx) => {
    // Check if this referenceId was already rewarded (prevent duplicate awards)
    if (referenceId) {
      const existing = await tx.query(`
        SELECT id FROM xp_transactions 
        WHERE user_id = ? AND source = ? AND reference_id = ?
      `, [userId, source, referenceId]);

      if (existing && existing.length > 0) {
        return { success: false, reason: 'XP already awarded for this action' };
      }
    }

    // Award XP
    await tx.run(`UPDATE users SET xp = xp + ? WHERE id = ?`, [amount, userId]);

    // Record in ledger
    await tx.run(`
      INSERT INTO xp_transactions (user_id, amount, source, reference_id)
      VALUES (?, ?, ?, ?)
    `, [userId, amount, source, referenceId]);

    // Check achievement unlocks
    await checkAchievements(userId, tx);

    return { success: true, xpAwarded: amount };
  });
}

/**
 * Evaluates achievement criteria and unlocks eligible badges
 */
export async function checkAchievements(userId, txClient = null) {
  const q = txClient ? txClient.query.bind(txClient) : query;
  const r = txClient ? txClient.run.bind(txClient) : run;

  const userRow = (await q(`SELECT xp, streak FROM users WHERE id = ?`, [userId]))[0];
  if (!userRow) return [];

  const solvedCount = Number((await q(`
    SELECT COUNT(DISTINCT problem_id) as cnt FROM submissions WHERE user_id = ? AND verdict = 'Accepted'
  `, [userId]))[0]?.cnt || 0);

  const conceptCount = Number((await q(`
    SELECT COUNT(*) as cnt FROM concept_progress WHERE user_id = ? AND completed = 1
  `, [userId]))[0]?.cnt || 0);

  const allAchievements = await q(`SELECT * FROM achievements`);
  const unlockedRows = await q(`SELECT achievement_id FROM user_achievements WHERE user_id = ?`, [userId]);
  const unlockedIds = new Set(unlockedRows.map(u => u.achievement_id));

  const newlyUnlocked = [];

  for (const ach of allAchievements) {
    if (unlockedIds.has(ach.id)) continue;

    let shouldUnlock = false;
    if (ach.code === 'first_solve' && solvedCount >= 1) shouldUnlock = true;
    if (ach.code === 'five_solves' && solvedCount >= 5) shouldUnlock = true;
    if (ach.code === 'streak_7' && userRow.streak >= 7) shouldUnlock = true;
    if (ach.code === 'streak_30' && userRow.streak >= 30) shouldUnlock = true;
    if (ach.code === 'concept_master' && conceptCount >= 5) shouldUnlock = true;
    if (ach.code === 'xp_1000' && userRow.xp >= 1000) shouldUnlock = true;

    if (shouldUnlock) {
      await r(`
        INSERT INTO user_achievements (user_id, achievement_id)
        VALUES (?, ?)
      `, [userId, ach.id]);

      await r(`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (?, '🏆 Achievement Unlocked!', ?, 'achievement')
      `, [userId, `You earned the "${ach.title}" badge!`]);

      newlyUnlocked.push(ach);
    }
  }

  return newlyUnlocked;
}
