import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import { safeJsonParse, query, run } from '../src/config/db.js';
import { initSchema } from '../src/models/schema.js';

describe('Regression & Dialect Compatibility: JSON Parsing & Learn Endpoints', () => {
  before(async () => {
    await initSchema();
  });

  describe('safeJsonParse Unit Tests', () => {
    test('Should return fallback for null, undefined, and empty string', () => {
      assert.deepStrictEqual(safeJsonParse(null, []), []);
      assert.deepStrictEqual(safeJsonParse(undefined, {}), {});
      assert.deepStrictEqual(safeJsonParse('', []), []);
      assert.deepStrictEqual(safeJsonParse('   ', {}), {});
      assert.strictEqual(safeJsonParse(null), null);
    });

    test('Should pass-through objects and arrays already parsed (PostgreSQL/pg behavior)', () => {
      const arr = ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'];
      assert.strictEqual(safeJsonParse(arr, []), arr);

      const obj = { python: 'def solve(): pass', javascript: 'function solve() {}' };
      assert.strictEqual(safeJsonParse(obj, {}), obj);
    });

    test('Should correctly parse valid JSON strings (SQLite behavior)', () => {
      const arrJson = '["O(1)", "O(log N)", "O(N)", "O(N²)"]';
      assert.deepStrictEqual(safeJsonParse(arrJson, []), ['O(1)', 'O(log N)', 'O(N)', 'O(N²)']);

      const objJson = '{"python": "code", "javascript": "jsCode"}';
      assert.deepStrictEqual(safeJsonParse(objJson, {}), { python: 'code', javascript: 'jsCode' });
    });

    test('Should safely recover from malformed JSON strings without throwing 500', () => {
      // Stringified array without brackets (common coercion failure)
      const malformed1 = '(O(1),O(log N),O(N))';
      assert.deepStrictEqual(safeJsonParse(malformed1, []), []);

      // Object stringification failure
      const malformed2 = '[object Object]';
      assert.deepStrictEqual(safeJsonParse(malformed2, {}), {});

      // Corrupted JSON
      const malformed3 = '{"unclosed": ';
      assert.deepStrictEqual(safeJsonParse(malformed3, { default: true }), { default: true });
    });
  });

  describe('Concept & Quiz Data Handling', () => {
    test('Should handle quiz question options when stored as JSON string or array', () => {
      const rawPgQuestion = {
        id: 1,
        question: 'What is the time complexity of binary search?',
        options_json: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'], // PostgreSQL returns parsed array
        correct_option_index: 1,
        explanation: 'Halves search space'
      };

      const optionsFromPg = safeJsonParse(rawPgQuestion.options_json, []);
      assert.ok(Array.isArray(optionsFromPg));
      assert.strictEqual(optionsFromPg.length, 4);
      assert.strictEqual(optionsFromPg[1], 'O(log N)');

      const rawSqliteQuestion = {
        id: 1,
        question: 'What is the time complexity of binary search?',
        options_json: '["O(1)", "O(log N)", "O(N)", "O(N²)"]', // SQLite returns string
        correct_option_index: 1,
        explanation: 'Halves search space'
      };

      const optionsFromSqlite = safeJsonParse(rawSqliteQuestion.options_json, []);
      assert.ok(Array.isArray(optionsFromSqlite));
      assert.strictEqual(optionsFromSqlite.length, 4);
      assert.strictEqual(optionsFromSqlite[1], 'O(log N)');
    });

    test('Should handle concept code_samples and common_mistakes for both dialects', () => {
      // Postgres simulation (objects/arrays)
      const pgConcept = {
        code_samples_json: { python: 'def analyze(n): return sum(range(n))' },
        common_mistakes_json: ['Confusing auxiliary space with total space']
      };

      const pgCode = safeJsonParse(pgConcept.code_samples_json, {});
      const pgMistakes = safeJsonParse(pgConcept.common_mistakes_json, []);
      assert.strictEqual(typeof pgCode, 'object');
      assert.ok(pgCode.python);
      assert.ok(Array.isArray(pgMistakes));
      assert.strictEqual(pgMistakes.length, 1);

      // SQLite simulation (JSON strings)
      const sqliteConcept = {
        code_samples_json: '{"python": "def analyze(n): return sum(range(n))"}',
        common_mistakes_json: '["Confusing auxiliary space with total space"]'
      };

      const sqliteCode = safeJsonParse(sqliteConcept.code_samples_json, {});
      const sqliteMistakes = safeJsonParse(sqliteConcept.common_mistakes_json, []);
      assert.strictEqual(typeof sqliteCode, 'object');
      assert.ok(sqliteCode.python);
      assert.ok(Array.isArray(sqliteMistakes));
      assert.strictEqual(sqliteMistakes.length, 1);
    });

    test('Should query concept and format response without throwing errors', async () => {
      // Ensure section and concept exist in SQLite test database
      await run(`
        INSERT OR IGNORE INTO sections (id, title, slug, description, icon, order_index)
        VALUES (1, 'Foundations', 'foundations', 'Fundamentals', 'Cpu', 1)
      `);

      await run(`
        INSERT OR IGNORE INTO concepts (
          id, section_id, title, slug, summary, intuition, when_to_use, visual_svg,
          code_samples_json, common_mistakes_json, video_url, video_source, order_index
        ) VALUES (
          1, 1, 'Time & Space Complexity', 'time-space-complexity',
          'Complexity summary', 'Intuition', 'When to use', '<svg></svg>',
          '{"python": "def test(): pass"}', '["Mistake 1"]', 'http://video', 'youtube', 1
        )
      `);

      await run(`
        INSERT OR IGNORE INTO quizzes (id, concept_id, title, passing_score)
        VALUES (1, 1, 'Complexity Quiz', 80)
      `);

      await run(`
        INSERT OR IGNORE INTO quiz_questions (id, quiz_id, question, options_json, correct_option_index, explanation)
        VALUES (1, 1, 'What is BST search complexity?', '["O(1)", "O(log N)", "O(N)"]', 1, 'Logarithmic')
      `);

      const concepts = await query(`SELECT * FROM concepts WHERE slug = ?`, ['time-space-complexity']);
      assert.strictEqual(concepts.length, 1);

      const concept = concepts[0];
      const questions = await query(`SELECT * FROM quiz_questions WHERE quiz_id = ?`, [1]);

      const formattedQuestions = questions.map(q => ({
        id: q.id,
        question: q.question,
        options: safeJsonParse(q.options_json, []),
        correct_option_index: q.correct_option_index,
        explanation: q.explanation
      }));

      const formattedConcept = {
        ...concept,
        code_samples: safeJsonParse(concept.code_samples_json, {}),
        common_mistakes: safeJsonParse(concept.common_mistakes_json, []),
        quiz: {
          questions: formattedQuestions
        }
      };

      assert.strictEqual(formattedConcept.title, concept.title);
      assert.ok(formattedConcept.code_samples);
      assert.ok(Array.isArray(formattedConcept.common_mistakes));
      assert.ok(Array.isArray(formattedConcept.quiz.questions[0].options));
    });
  });

  describe('Problems & Discussions Dialect Compatibility', () => {
    test('Should parse problem JSON fields correctly for both PG and SQLite', () => {
      const pgProblem = {
        id: 1,
        title: 'Two Sum',
        examples_json: [{ input: 'nums = [2,7]', output: '[0,1]' }],
        constraints_json: ['2 <= nums.length <= 10^4'],
        starter_code_json: { python: 'class Solution: pass' },
        solution_json: { intuition: 'Use hash map' },
        company_tags_json: ['Google', 'Meta']
      };

      assert.deepStrictEqual(safeJsonParse(pgProblem.examples_json, []), [{ input: 'nums = [2,7]', output: '[0,1]' }]);
      assert.deepStrictEqual(safeJsonParse(pgProblem.constraints_json, []), ['2 <= nums.length <= 10^4']);
      assert.deepStrictEqual(safeJsonParse(pgProblem.starter_code_json, {}), { python: 'class Solution: pass' });
      assert.deepStrictEqual(safeJsonParse(pgProblem.solution_json, {}), { intuition: 'Use hash map' });
      assert.deepStrictEqual(safeJsonParse(pgProblem.company_tags_json, []), ['Google', 'Meta']);

      const sqliteProblem = {
        id: 1,
        title: 'Two Sum',
        examples_json: '[{"input": "nums = [2,7]", "output": "[0,1]"}]',
        constraints_json: '["2 <= nums.length <= 10^4"]',
        starter_code_json: '{"python": "class Solution: pass"}',
        solution_json: '{"intuition": "Use hash map"}',
        company_tags_json: '["Google", "Meta"]'
      };

      assert.deepStrictEqual(safeJsonParse(sqliteProblem.examples_json, []), [{ input: 'nums = [2,7]', output: '[0,1]' }]);
      assert.deepStrictEqual(safeJsonParse(sqliteProblem.constraints_json, []), ['2 <= nums.length <= 10^4']);
      assert.deepStrictEqual(safeJsonParse(sqliteProblem.starter_code_json, {}), { python: 'class Solution: pass' });
      assert.deepStrictEqual(safeJsonParse(sqliteProblem.solution_json, {}), { intuition: 'Use hash map' });
      assert.deepStrictEqual(safeJsonParse(sqliteProblem.company_tags_json, []), ['Google', 'Meta']);
    });

    test('Should parse discussion tags correctly for both PG and SQLite', () => {
      const pgDiscussion = { tags_json: ['Dynamic Programming', 'Optimization'] };
      assert.deepStrictEqual(safeJsonParse(pgDiscussion.tags_json, []), ['Dynamic Programming', 'Optimization']);

      const sqliteDiscussion = { tags_json: '["Dynamic Programming", "Optimization"]' };
      assert.deepStrictEqual(safeJsonParse(sqliteDiscussion.tags_json, []), ['Dynamic Programming', 'Optimization']);
    });
  });

  describe('Code Runner Security & Environment Isolation', () => {
    test('Should isolate child execution environment from server secrets', async () => {
      // Simulate attempting to read SUPABASE_DB_URL from execution
      process.env.SUPABASE_DB_URL = 'postgresql://secret_user:secret_pass@db.supabase.co:5432/postgres';
      process.env.JWT_SECRET = 'super_secret_jwt_key_that_must_not_leak';

      const { executeCode } = await import('../src/services/codeRunner.js');
      const testCode = `
import os
print("SECRET_DB=" + str(os.environ.get("SUPABASE_DB_URL", "NOT_FOUND")))
print("SECRET_JWT=" + str(os.environ.get("JWT_SECRET", "NOT_FOUND")))
`;

      const result = await executeCode({
        language: 'python',
        sourceCode: testCode,
        testCases: [{ input_data: '', expected_output: '' }]
      });

      const output = result.outputs?.[0]?.stdout || '';
      assert.ok(!output.includes('secret_pass'), 'Database password must never be exposed to user code');
      assert.ok(!output.includes('super_secret_jwt_key'), 'JWT Secret must never be exposed to user code');
      assert.ok(output.includes('NOT_FOUND') || !output.includes('supabase.co'), 'Server secrets must be unaccessible');
    });
  });
});
