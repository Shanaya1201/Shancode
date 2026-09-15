import { GeminiAIProvider } from './aiProviders/geminiProvider.js';
import { SocraticFallbackProvider } from './aiProviders/socraticFallbackProvider.js';
import { query } from '../config/db.js';

let activeProvider = null;

export function getAIProvider() {
  if (activeProvider) return activeProvider;

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim().length > 10) {
    activeProvider = new GeminiAIProvider(geminiKey);
  } else {
    activeProvider = new SocraticFallbackProvider();
  }
  return activeProvider;
}

/**
 * Sanitize prompt against injection attacks
 */
function sanitizeInput(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/ignore\s+all\s+previous\s+instructions/gi, '[filtered]')
    .replace(/you\s+are\s+now\s+a/gi, '[filtered]')
    .replace(/system\s*:\s*/gi, '[filtered]')
    .slice(0, 2000); // 2000 char budget
}

/**
 * Unified AI Tutor Orchestrator with Grounded Retrieval
 */
export async function askAiTutor({
  question,
  codeContext,
  problemId,
  problemTitle,
  conceptId,
  conceptTitle,
  failedTestDiff,
  language = 'python',
  mode = 'general'
}) {
  const provider = getAIProvider();
  const cleanQuestion = sanitizeInput(question);
  const cleanCode = sanitizeInput(codeContext);

  // Grounding: Fetch real problem details from database if problemId is provided
  let groundedProblem = null;
  if (problemId) {
    const problems = await query(`SELECT * FROM problems WHERE id = ?`, [problemId]);
    if (problems && problems.length > 0) {
      groundedProblem = problems[0];
    }
  }

  // Grounding: Fetch real concept details from database if conceptId is provided
  let groundedConcept = null;
  if (conceptId) {
    const concepts = await query(`SELECT * FROM concepts WHERE id = ?`, [conceptId]);
    if (concepts && concepts.length > 0) {
      groundedConcept = concepts[0];
    }
  }

  try {
    if (mode === 'debug_submission' || failedTestDiff) {
      return await provider.debugCode({
        problem: groundedProblem || { title: problemTitle || 'DSA Problem' },
        userCode: cleanCode,
        failedTestDiff,
        language
      });
    }

    if (mode === 'explain_concept' || mode === 'intuition') {
      return await provider.explainConcept({
        concept: groundedConcept || { title: conceptTitle || 'DSA Concept' },
        learnerLevel: 'intermediate'
      });
    }

    if (mode === 'hint') {
      return await provider.generateHint({
        problem: groundedProblem || { title: problemTitle || 'Problem', topic: 'Algorithms', description: '' },
        userCode: cleanCode,
        tier: 1
      });
    }

    if (mode === 'complexity') {
      return await provider.explainComplexity({
        code: cleanCode,
        language,
        algorithmName: problemTitle || conceptTitle
      });
    }

    // Default question answering
    return await provider.answerQuestion({
      question: cleanQuestion || 'How do I approach this algorithm?',
      context: {
        problem: groundedProblem ? { title: groundedProblem.title, difficulty: groundedProblem.difficulty, topic: groundedProblem.topic } : problemTitle,
        concept: groundedConcept ? { title: groundedConcept.title } : conceptTitle,
        code: cleanCode,
        language
      }
    });
  } catch (err) {
    console.error('AI Tutor provider error, falling back to Socratic engine:', err.message);
    const fallback = new SocraticFallbackProvider();
    return await fallback.answerQuestion({
      question: cleanQuestion,
      context: { problemTitle, conceptTitle }
    });
  }
}
