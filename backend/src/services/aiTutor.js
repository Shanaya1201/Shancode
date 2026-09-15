/**
 * Socratic AI DSA & Coding Tutor Service
 * Guides learners step-by-step without immediately spoiling full solutions.
 */

export async function askAiTutor({
  question,
  codeContext,
  problemTitle,
  conceptTitle,
  failedTestDiff,
  mode = 'general' // 'explain_concept', 'hint', 'line_by_line', 'debug_submission', 'general'
}) {
  const prompt = question ? question.toLowerCase() : '';

  if (mode === 'debug_submission' || failedTestDiff) {
    return generateDebugAdvice(failedTestDiff, codeContext, problemTitle);
  }

  if (mode === 'line_by_line' || prompt.includes('line by line') || prompt.includes('how does this work')) {
    return generateLineByLineExplanation(codeContext, problemTitle || conceptTitle);
  }

  if (mode === 'hint' || prompt.includes('hint') || prompt.includes('clue') || prompt.includes('stuck')) {
    return generateSocraticHint(problemTitle, conceptTitle, codeContext);
  }

  if (mode === 'explain_concept' || prompt.includes('intuition') || prompt.includes('why')) {
    return generateConceptIntuition(conceptTitle || problemTitle);
  }

  // Default intelligent pedagogical assistant response
  return {
    reply: `👋 **Shancode AI Tutor**: Great question regarding **${problemTitle || conceptTitle || 'Algorithms'}**!\n\n` +
           `Let's break down the underlying pattern rather than jumping to raw code:\n\n` +
           `1. **Identify the Invariant**: What property must remain true as your pointers/indices move?\n` +
           `2. **State & Window Boundaries**: If you are maintaining a subset or window, what condition dictates when you expand vs shrink?\n` +
           `3. **Edge Conditions**: Have you checked empty inputs, single element arrays, or negative values?\n\n` +
           `*💡 Pro-tip: Try printing or tracing the state on a small 4-element example! Ask me for a specific hint if you'd like a directional nudge.*`,
    suggested_actions: [
      'Give me a small directional hint',
      'Explain the time complexity intuition',
      'Walk me through an example test case'
    ]
  };
}

function generateDebugAdvice(failedDiff, code, problemTitle) {
  let advice = `🔍 **AI Submission Diagnosis for ${problemTitle || 'Problem'}**:\n\n`;
  if (failedDiff && failedDiff.diff) {
    advice += `**Failed Case Observed:**\n\`\`\`\n${failedDiff.diff}\n\`\`\`\n\n`;
  }
  advice += `**Key Observations to Inspect:**\n` +
            `• **Off-by-one errors**: Double check loop bounds (\`< vs <=\` or \`len - 1\`).\n` +
            `• **State Reset**: If your solution uses global state or a hash map, ensure it is reset per test case.\n` +
            `• **Type Mismatch**: Ensure your return type matches the expected format (e.g. array of indices vs values).\n\n` +
            `*Would you like me to inspect a specific line in your code?*`;

  return {
    reply: advice,
    suggested_actions: [
      'Explain what caused this difference',
      'Show the optimal boundary condition',
      'Provide a progressive hint'
    ]
  };
}

function generateLineByLineExplanation(code, title) {
  if (!code || code.trim().length === 0) {
    return {
      reply: `Please write or paste code in the editor first so I can provide a line-by-line explanation!`,
      suggested_actions: ['Load starter template']
    };
  }

  const lines = code.trim().split('\n');
  let breakdown = `📖 **Line-by-Line Breakdown for ${title || 'Solution'}**:\n\n`;
  
  lines.slice(0, 10).forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (trimmed.startsWith('//') || trimmed.startsWith('#')) return;

    let explanation = 'Initializes state variables and bounds.';
    if (trimmed.includes('for') || trimmed.includes('while')) {
      explanation = 'Iterates over elements maintaining the active search/window boundary.';
    } else if (trimmed.includes('if') || trimmed.includes('else')) {
      explanation = 'Evaluates target condition or handles edge branch.';
    } else if (trimmed.includes('return')) {
      explanation = 'Returns computed result once invariant condition holds.';
    } else if (trimmed.includes('set') || trimmed.includes('map') || trimmed.includes('dict') || trimmed.includes('{}')) {
      explanation = 'Allocates hash table for O(1) lookup frequency tracking.';
    }

    breakdown += `**Line ${idx + 1}** \`${trimmed}\`\n→ ${explanation}\n\n`;
  });

  return {
    reply: breakdown,
    suggested_actions: [
      'What is the Space Complexity of this approach?',
      'Can we optimize this to O(1) auxiliary space?'
    ]
  };
}

function generateSocraticHint(problemTitle, conceptTitle, code) {
  return {
    reply: `💡 **Socratic Directional Clue** for **${problemTitle || 'this problem'}**:\n\n` +
           `Instead of checking every possible pair (which is O(N²)), think about what information you already know as you scan through the array.\n\n` +
           `*Ask yourself:* If you are looking for \`target - current\`, is there a data structure that can tell you in **O(1)** time if you have already seen that remainder before?`,
    suggested_actions: [
      'I want a stronger algorithm hint',
      'What data structure should I use?',
      'Check my current code for bugs'
    ]
  };
}

function generateConceptIntuition(concept) {
  return {
    reply: `🧠 **Core Intuition for ${concept || 'This Concept'}**:\n\n` +
           `Most algorithmic patterns are shortcuts that eliminate redundant work.\n\n` +
           `• **Brute Force mindset**: "Try all combinations." (O(2ⁿ) or O(N²))\n` +
           `• **Pattern mindset**: "Once we know X, we never need to re-check anything before X."\n\n` +
           `Whenever an input is **sorted** or monotonic, two pointers or binary search lets you prune half the search space on every comparison!`,
    suggested_actions: [
      'Show practical code examples',
      'What are common interview pitfalls?',
      'Unlock practice problems'
    ]
  };
}
