import { test, describe } from 'node:test';
import assert from 'node:assert';
import { runCodeAgainstTestCases } from '../src/services/codeRunner.js';

describe('Agent 15: Code Execution Sandbox Tests', () => {
  test('Should execute valid Python code and return Accepted', async () => {
    const pythonCode = `
def twoSum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in seen:
            return [seen[diff], i]
        seen[n] = i
    return []
`;
    const testCases = [
      { input_data: '[2,7,11,15]\n9', expected_output: '[0, 1]' },
      { input_data: '[3,2,4]\n6', expected_output: '[1, 2]' }
    ];

    const result = await runCodeAgainstTestCases('python', pythonCode, testCases);
    assert.strictEqual(result.verdict, 'Accepted', 'Expected solution to be Accepted');
    assert.strictEqual(result.passed_tests, 2);
    assert.strictEqual(result.total_tests, 2);
    assert.ok(result.runtime_ms >= 0);
  });

  test('Should catch Wrong Answer in Python code', async () => {
    const buggyCode = `
def twoSum(nums, target):
    return [0, 0] # Intentional bug
`;
    const testCases = [
      { input_data: '[2,7,11,15]\n9', expected_output: '[0, 1]' }
    ];

    const result = await runCodeAgainstTestCases('python', buggyCode, testCases);
    assert.strictEqual(result.verdict, 'Wrong Answer');
    assert.strictEqual(result.passed_tests, 0);
    assert.ok(result.failed_case);
  });

  test('Should handle Time Limit Exceeded gracefully for infinite loops', async () => {
    const infiniteLoopCode = `
def twoSum(nums, target):
    while True:
        pass
`;
    const testCases = [
      { input_data: '[2,7,11,15]\n9', expected_output: '[0, 1]' }
    ];

    const result = await runCodeAgainstTestCases('python', infiniteLoopCode, testCases);
    assert.strictEqual(result.verdict, 'Time Limit Exceeded');
  });

  test('Should execute JavaScript code correctly', async () => {
    const jsCode = `
function isPalindrome(s) {
    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return clean === clean.split('').reverse().join('');
}
`;
    const testCases = [
      { input_data: '"A man, a plan, a canal: Panama"', expected_output: 'true' },
      { input_data: '"race a car"', expected_output: 'false' }
    ];

    const result = await runCodeAgainstTestCases('javascript', jsCode, testCases);
    assert.strictEqual(result.verdict, 'Accepted');
    assert.strictEqual(result.passed_tests, 2);
  });
});
