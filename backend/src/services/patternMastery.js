import { query, run } from '../config/db.js';

export async function getUserPatternProgress(userId) {
  const patterns = await query(`SELECT * FROM patterns ORDER BY id ASC`);
  const results = [];

  for (const p of patterns) {
    const levels = await query(`
      SELECT * FROM pattern_levels WHERE pattern_id = ? ORDER BY level_number ASC
    `, [p.id]);

    const solvedProblems = await query(`
      SELECT DISTINCT p.id, p.difficulty 
      FROM submissions s
      JOIN problems p ON s.problem_id = p.id
      WHERE s.user_id = ? AND s.verdict = 'Accepted' AND p.pattern_id = ?
    `, [userId, p.id]);

    const totalProblems = await query(`
      SELECT id, difficulty FROM problems WHERE pattern_id = ?
    `, [p.id]);

    const solvedCount = solvedProblems.length;
    const totalCount = Math.max(1, totalProblems.length);
    const masteryPct = Math.min(100, Math.round((solvedCount / totalCount) * 100));

    // Determine current level
    let currentLevel = 1;
    let accumulatedRequired = 0;
    for (const lvl of levels) {
      accumulatedRequired += lvl.required_count;
      if (solvedCount >= accumulatedRequired) {
        currentLevel = Math.min(p.total_levels, lvl.level_number + 1);
      }
    }

    // Update user_pattern_mastery table
    await run(`
      INSERT INTO user_pattern_mastery (user_id, pattern_id, current_level, mastery_pct, solved_count, unlocked_badge)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, pattern_id) DO UPDATE SET
        current_level = excluded.current_level,
        mastery_pct = excluded.mastery_pct,
        solved_count = excluded.solved_count,
        unlocked_badge = CASE WHEN excluded.mastery_pct >= 80 THEN 1 ELSE user_pattern_mastery.unlocked_badge END
    `, [userId, p.id, currentLevel, masteryPct, solvedCount, masteryPct >= 80 ? 1 : 0]);

    results.push({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      icon: p.icon,
      total_levels: p.total_levels,
      current_level: currentLevel,
      mastery_pct: masteryPct,
      solved_count: solvedCount,
      total_problems: totalProblems.length,
      levels
    });
  }

  return results;
}
