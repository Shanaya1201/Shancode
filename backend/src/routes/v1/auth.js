import express from 'express';
import bcrypt from 'bcryptjs';
import { query, run } from '../../config/db.js';
import { signToken, authMiddleware } from '../../config/jwt.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, target_company } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: 'Username, email, and password are required' });
    }

    const existing = await query(`SELECT id FROM users WHERE username = ? OR email = ?`, [username.trim(), email.trim()]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, error: 'Username or email is already registered' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const result = await run(`
      INSERT INTO users (username, email, password_hash, role, rating, xp, streak, last_active_date)
      VALUES (?, ?, ?, 'student', 1200, 100, 1, DATE('now'))
    `, [username.trim(), email.trim(), passwordHash]);

    const userId = result.lastInsertRowid;

    // Create default profile
    await run(`
      INSERT INTO profiles (user_id, avatar, bio, target_company, interview_readiness)
      VALUES (?, ?, 'Learner on Shancode', ?, 20)
    `, [userId, `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`, target_company || 'Google']);

    // Create welcome notification
    await run(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (?, 'Welcome to Shancode! 🚀', 'Begin your concept-first DSA journey from the Roadmap.', 'system')
    `, [userId]);

    const token = signToken({ id: userId, username, role: 'student' });
    return res.status(201).json({
      success: true,
      token,
      user: { id: userId, username, email, role: 'student', rating: 1200, xp: 100, streak: 1 }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({ success: false, error: 'Email/Username and password are required' });
    }

    const users = await query(`
      SELECT u.*, p.avatar, p.bio, p.target_company, p.interview_readiness, p.github_url
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.email = ? OR u.username = ?
    `, [emailOrUsername.trim(), emailOrUsername.trim()]);

    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Update streak logic
    const today = new Date().toISOString().split('T')[0];
    if (user.last_active_date !== today) {
      await run(`UPDATE users SET streak = streak + 1, last_active_date = DATE('now') WHERE id = ?`, [user.id]);
      user.streak += 1;
    }

    const token = signToken({ id: user.id, username: user.username, role: user.role });
    delete user.password_hash;

    return res.json({ success: true, token, user });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error during login' });
  }
});

// Get current user profile (/me)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const users = await query(`
      SELECT u.id, u.username, u.email, u.role, u.rating, u.xp, u.streak, u.last_active_date,
             p.avatar, p.bio, p.target_company, p.interview_readiness, p.github_url
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = ?
    `, [req.user.id]);

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.json({ success: true, user: users[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { avatar, bio, target_company, github_url } = req.body;
    await run(`
      UPDATE profiles
      SET avatar = COALESCE(?, avatar),
          bio = COALESCE(?, bio),
          target_company = COALESCE(?, target_company),
          github_url = COALESCE(?, github_url)
      WHERE user_id = ?
    `, [avatar, bio, target_company, github_url, req.user.id]);

    return res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
