import express from 'express';
import bcrypt from 'bcryptjs';
import { query, run } from '../../config/db.js';
import { 
  signAccessToken, 
  signRefreshToken, 
  verifyRefreshToken, 
  hashToken, 
  authMiddleware 
} from '../../config/jwt.js';
import { rateLimit } from '../../middleware/rateLimit.js';

const router = express.Router();

// Strict rate limiter for auth endpoints (15 attempts per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
});

// Password validation rule
function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 8) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
}

// Register new user
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password, target_company } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: 'Username, email, and password are required' });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, error: 'Invalid email address format' });
    }

    // Validate username format
    if (cleanUsername.length < 3 || cleanUsername.length > 30 || !/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
      return res.status(400).json({ success: false, error: 'Username must be 3-30 alphanumeric characters (underscores and dashes allowed)' });
    }

    // Validate password complexity
    if (!validatePassword(password)) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters long and contain both letters and numbers' });
    }

    const existing = await query(`SELECT id FROM users WHERE username = ? OR email = ?`, [cleanUsername, cleanEmail]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, error: 'Username or email is already registered' });
    }

    const salt = bcrypt.genSaltSync(12);
    const passwordHash = bcrypt.hashSync(password, salt);

    const result = await run(`
      INSERT INTO users (username, email, password_hash, role, rating, xp, streak, last_active_date)
      VALUES (?, ?, ?, 'student', 1200, 100, 1, DATE('now'))
    `, [cleanUsername, cleanEmail, passwordHash]);

    const userId = result.lastInsertRowid;

    // Create default profile
    await run(`
      INSERT INTO profiles (user_id, avatar, bio, target_company, interview_readiness)
      VALUES (?, ?, 'Learner on Shancode', ?, 20)
    `, [userId, `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`, target_company || 'Google']);

    // Issue tokens
    const accessToken = signAccessToken({ id: userId, username: cleanUsername, role: 'student' });
    const rawRefreshToken = signRefreshToken({ id: userId, username: cleanUsername });
    const hashedRefresh = hashToken(rawRefreshToken);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await run(`
      INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
      VALUES (?, ?, ?)
    `, [userId, hashedRefresh, expiresAt]);

    // Initial welcome notification
    await run(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (?, 'Welcome to Shancode! 🚀', 'Begin your concept-first DSA journey from the Roadmap.', 'system')
    `, [userId]);

    return res.status(201).json({
      success: true,
      token: accessToken,
      accessToken,
      refreshToken: rawRefreshToken,
      user: { id: userId, username: cleanUsername, email: cleanEmail, role: 'student', rating: 1200, xp: 100, streak: 1 }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error during registration' });
  }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({ success: false, error: 'Email/Username and password are required' });
    }

    const identifier = emailOrUsername.trim();
    const users = await query(`
      SELECT u.*, p.avatar, p.bio, p.target_company, p.interview_readiness, p.github_url
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.email = ? OR u.username = ?
    `, [identifier.toLowerCase(), identifier]);

    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid username/email or password' });
    }

    const user = users[0];

    // Check account lockout
    if (user.lockout_until) {
      const lockoutTime = new Date(user.lockout_until).getTime();
      if (Date.now() < lockoutTime) {
        const remainingMinutes = Math.ceil((lockoutTime - Date.now()) / (60 * 1000));
        return res.status(423).json({
          success: false,
          error: `Account is temporarily locked due to repeated failed login attempts. Please try again in ${remainingMinutes} minute(s).`
        });
      }
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      const failedAttempts = (user.failed_login_attempts || 0) + 1;
      let lockoutDate = null;
      if (failedAttempts >= 5) {
        lockoutDate = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        await run(`
          INSERT INTO integrity_logs (user_id, event_type, details)
          VALUES (?, 'login_lockout', 'Account locked for 15 minutes after 5 consecutive failed login attempts')
        `, [user.id]);
      }

      await run(`
        UPDATE users 
        SET failed_login_attempts = ?, lockout_until = ?
        WHERE id = ?
      `, [failedAttempts, lockoutDate, user.id]);

      return res.status(401).json({
        success: false,
        error: failedAttempts >= 5 
          ? 'Account locked for 15 minutes due to 5 failed login attempts.' 
          : `Invalid credentials. (${5 - failedAttempts} attempt(s) remaining)`
      });
    }

    // Reset failed login attempts on successful authentication
    await run(`UPDATE users SET failed_login_attempts = 0, lockout_until = NULL WHERE id = ?`, [user.id]);

    // Update streak logic
    const today = new Date().toISOString().split('T')[0];
    if (user.last_active_date !== today) {
      await run(`UPDATE users SET streak = streak + 1, last_active_date = DATE('now') WHERE id = ?`, [user.id]);
      user.streak += 1;
    }

    const accessToken = signAccessToken({ id: user.id, username: user.username, role: user.role });
    const rawRefreshToken = signRefreshToken({ id: user.id, username: user.username });
    const hashedRefresh = hashToken(rawRefreshToken);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await run(`
      INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
      VALUES (?, ?, ?)
    `, [user.id, hashedRefresh, expiresAt]);

    delete user.password_hash;
    delete user.failed_login_attempts;
    delete user.lockout_until;

    return res.json({
      success: true,
      token: accessToken,
      accessToken,
      refreshToken: rawRefreshToken,
      user
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error during login' });
  }
});

// Refresh Access Token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, error: 'Refresh token is required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
    }

    const hashedToken = hashToken(refreshToken);
    const storedTokens = await query(`
      SELECT * FROM refresh_tokens 
      WHERE user_id = ? AND token_hash = ? AND revoked = 0
    `, [decoded.id, hashedToken]);

    if (!storedTokens || storedTokens.length === 0) {
      return res.status(401).json({ success: false, error: 'Refresh token revoked or not found' });
    }

    // Revoke old refresh token (token rotation)
    await run(`UPDATE refresh_tokens SET revoked = 1 WHERE id = ?`, [storedTokens[0].id]);

    // Fetch user role
    const users = await query(`SELECT role FROM users WHERE id = ?`, [decoded.id]);
    const role = users[0]?.role || 'student';

    // Issue new token pair
    const newAccessToken = signAccessToken({ id: decoded.id, username: decoded.username, role });
    const newRefreshToken = signRefreshToken({ id: decoded.id, username: decoded.username });
    const newHashedRefresh = hashToken(newRefreshToken);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await run(`
      INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
      VALUES (?, ?, ?)
    `, [decoded.id, newHashedRefresh, expiresAt]);

    return res.json({
      success: true,
      accessToken: newAccessToken,
      token: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    console.error('Refresh token error:', err);
    return res.status(500).json({ success: false, error: 'Failed to refresh token' });
  }
});

// Logout
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      const hashedToken = hashToken(refreshToken);
      await run(`UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = ?`, [hashedToken]);
    } else {
      // Invalidate all active refresh tokens for user
      await run(`UPDATE refresh_tokens SET revoked = 1 WHERE user_id = ?`, [req.user.id]);
    }
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
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

// Change Password
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Current password and new password are required' });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({ success: false, error: 'New password must be at least 8 characters long and contain letters and numbers' });
    }

    const users = await query(`SELECT password_hash FROM users WHERE id = ?`, [req.user.id]);
    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const isMatch = bcrypt.compareSync(currentPassword, users[0].password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Incorrect current password' });
    }

    const salt = bcrypt.genSaltSync(12);
    const newHash = bcrypt.hashSync(newPassword, salt);

    await run(`UPDATE users SET password_hash = ? WHERE id = ?`, [newHash, req.user.id]);

    // Invalidate previous sessions
    await run(`UPDATE refresh_tokens SET revoked = 1 WHERE user_id = ?`, [req.user.id]);

    return res.json({ success: true, message: 'Password updated successfully. Please log in with your new credentials.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
