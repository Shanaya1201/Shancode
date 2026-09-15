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
});
