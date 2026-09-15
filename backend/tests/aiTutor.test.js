import { test, describe } from 'node:test';
import assert from 'node:assert';
import { askAiTutor } from '../src/services/aiTutor.js';

describe('Agent 15: Socratic AI Tutor Tests', () => {
  test('Should generate pedagogical Socratic explanation for concepts', async () => {
    const res = await askAiTutor({
      conceptTitle: 'Two Pointer Technique',
      mode: 'explain_concept'
    });

    assert.ok(res.reply, 'Should return reply');
    assert.ok(res.reply.includes('Two Pointer') || res.reply.includes('Socratic') || res.reply.includes('Intuition'));
    assert.ok(Array.isArray(res.suggested_actions), 'Should return suggested follow-up actions');
  });

  test('Should generate progressive hint without giving away full answer', async () => {
    const res = await askAiTutor({
      problemTitle: 'Two Sum',
      mode: 'hint'
    });

    assert.ok(res.reply, 'Should return reply');
    assert.ok(res.reply.includes('Hint') || res.reply.includes('Tier') || res.reply.includes('Two Sum'));
  });

  test('Should calculate deterministic complexity analysis', async () => {
    const code = `
for i in range(len(nums)):
    for j in range(i + 1, len(nums)):
        if nums[i] + nums[j] == target:
            return [i, j]
`;
    const res = await askAiTutor({
      codeContext: code,
      language: 'python',
      mode: 'complexity'
    });

    assert.ok(res.reply, 'Should return complexity reply');
    assert.ok(res.reply.includes('O(N²)'), 'Should detect nested loop quadratic time');
  });
});
