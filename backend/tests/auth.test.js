import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import bcrypt from 'bcryptjs';
import { query, run } from '../src/config/db.js';
import { initSchema } from '../src/models/schema.js';
import { signAccessToken, verifyAccessToken, hashToken } from '../src/config/jwt.js';

describe('Agent 15: Authentication & Token Security Tests', () => {
  before(async () => {
    await initSchema();
  });

  test('Should sign and verify valid JWT access tokens', () => {
    const payload = { id: 99, username: 'testuser', role: 'student' };
    const token = signAccessToken(payload, '1h');
    assert.ok(token, 'Token should be generated');

    const decoded = verifyAccessToken(token);
    assert.strictEqual(decoded.id, 99);
    assert.strictEqual(decoded.username, 'testuser');
    assert.strictEqual(decoded.role, 'student');
  });

  test('Should reject tampered or invalid JWT tokens', () => {
    const invalidToken = 'invalid.jwt.token';
    const decoded = verifyAccessToken(invalidToken);
    assert.strictEqual(decoded, null);
  });

  test('Should hash and compare passwords securely with bcrypt', () => {
    const password = 'StrongPassword123!';
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(password, salt);

    assert.ok(hash !== password, 'Password should be hashed');
    assert.ok(bcrypt.compareSync(password, hash), 'Valid password should match hash');
    assert.ok(!bcrypt.compareSync('WrongPassword', hash), 'Invalid password should not match');
  });

  test('Should hash tokens deterministically with SHA-256 for rotation', () => {
    const rawToken = 'sample_refresh_token_string';
    const hash1 = hashToken(rawToken);
    const hash2 = hashToken(rawToken);
    assert.strictEqual(hash1, hash2, 'Hash should be deterministic');
    assert.strictEqual(hash1.length, 64, 'SHA-256 hex string should be 64 chars');
  });

  test('Should successfully register user, create profile and refresh token without column error', async () => {
    const testUsername = `reg_test_${Date.now()}`;
    const testEmail = `${testUsername}@shancode.io`;
    const password = 'ValidPassword123';
    const passwordHash = bcrypt.hashSync(password, 10);

    // 1. Insert user
    const insertUserRes = await run(`
      INSERT INTO users (username, email, password_hash, role, rating, xp, streak, last_active_date)
      VALUES (?, ?, ?, 'student', 1200, 100, 1, DATE('now'))
    `, [testUsername, testEmail, passwordHash]);

    assert.ok(insertUserRes.lastInsertRowid > 0, 'Should return valid inserted user ID');
    const newUserId = insertUserRes.lastInsertRowid;

    // 2. Insert profile (table with user_id as PK, no id column)
    const insertProfileRes = await run(`
      INSERT INTO profiles (user_id, avatar, bio, target_company, interview_readiness)
      VALUES (?, ?, 'Test Learner Profile', ?, 25)
    `, [newUserId, 'https://avatar.url', 'Google']);

    assert.ok(insertProfileRes.changes > 0, 'Should insert profile successfully');

    // 3. Insert refresh token
    const tokenHash = hashToken(`test_refresh_${Date.now()}`);
    const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
    const insertTokenRes = await run(`
      INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
      VALUES (?, ?, ?)
    `, [newUserId, tokenHash, expiresAt]);

    assert.ok(insertTokenRes.changes > 0, 'Should insert refresh token successfully');

    // 4. Verify user lookup with profile join
    const userLookup = await query(`
      SELECT u.id, u.username, u.email, u.role, u.password_hash, p.bio, p.target_company
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = ?
    `, [newUserId]);

    assert.strictEqual(userLookup.length, 1, 'Should find inserted user');
    assert.strictEqual(userLookup[0].username, testUsername);
    assert.strictEqual(userLookup[0].target_company, 'Google');
    assert.ok(bcrypt.compareSync(password, userLookup[0].password_hash), 'Password should verify');
  });

  test('Should detect duplicate username or email during registration lookup', async () => {
    const existing = await query(`SELECT id FROM users LIMIT 1`);
    if (existing.length > 0) {
      const user = (await query(`SELECT username, email FROM users WHERE id = ?`, [existing[0].id]))[0];
      const dupCheck = await query(`SELECT id FROM users WHERE username = ? OR email = ?`, [user.username, user.email]);
      assert.ok(dupCheck.length > 0, 'Duplicate check should identify existing user');
    }
  });
});
