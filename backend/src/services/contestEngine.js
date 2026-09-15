import { query, run } from '../config/db.js';

export async function getContestDetails(contestId, userId = null) {
  const contests = await query(`SELECT * FROM contests WHERE id = ?`, [contestId]);
  if (!contests || contests.length === 0) return null;
  const contest = contests[0];

  const problems = await query(`
    SELECT cp.point_value, cp.order_index, p.id, p.title, p.slug, p.difficulty, p.topic
    FROM contest_problems cp
    JOIN problems p ON cp.problem_id = p.id
    WHERE cp.contest_id = ?
    ORDER BY cp.order_index ASC
  `, [contestId]);

  const participants = await query(`
    SELECT cp.*, u.username, pr.avatar
    FROM contest_participants cp
    JOIN users u ON cp.user_id = u.id
    JOIN profiles pr ON u.id = pr.user_id
    WHERE cp.contest_id = ?
    ORDER BY cp.score DESC, cp.penalty_minutes ASC
  `, [contestId]);

  // If user is logged in, find their standing
  let userParticipation = null;
  if (userId) {
    const userRow = participants.find(p => p.user_id === Number(userId));
    if (userRow) userParticipation = userRow;
  }

  return {
    ...contest,
    problems,
    leaderboard: participants.map((p, idx) => ({
      rank: idx + 1,
      user_id: p.user_id,
      username: p.username,
      avatar: p.avatar,
      score: p.score,
      penalty_minutes: p.penalty_minutes,
      rating_delta: p.rating_delta,
      is_virtual: p.is_virtual
    })),
    user_participation: userParticipation
  };
}

export async function submitContestProblem(contestId, userId, problemId, isAccepted, elapsedMinutes) {
  let participant = await query(`
    SELECT * FROM contest_participants WHERE contest_id = ? AND user_id = ?
  `, [contestId, userId]);

  if (!participant || participant.length === 0) {
    await run(`
      INSERT INTO contest_participants (contest_id, user_id, score, penalty_minutes, is_virtual)
      VALUES (?, ?, 0, 0, 0)
    `, [contestId, userId]);
  }

  if (isAccepted) {
    const cp = await query(`
      SELECT point_value FROM contest_problems WHERE contest_id = ? AND problem_id = ?
    `, [contestId, problemId]);
    const pts = cp[0]?.point_value || 100;

    await run(`
      UPDATE contest_participants
      SET score = score + ?,
          penalty_minutes = penalty_minutes + ?
      WHERE contest_id = ? AND user_id = ?
    `, [pts, elapsedMinutes, contestId, userId]);
  } else {
    // Penalty for wrong attempt (+5 mins)
    await run(`
      UPDATE contest_participants
      SET penalty_minutes = penalty_minutes + 5
      WHERE contest_id = ? AND user_id = ?
    `, [contestId, userId]);
  }
}
