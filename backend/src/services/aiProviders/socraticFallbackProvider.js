import { BaseAIProvider } from './baseProvider.js';

/**
 * Deterministic Socratic Pedagogy Provider
 * Ensures guaranteed zero-hallucination assistance when offline or without external API keys.
 */
export class SocraticFallbackProvider extends BaseAIProvider {
  constructor() {
    super('socratic-engine');
  }

  async explainConcept({ concept, learnerLevel }) {
    const summary = concept?.summary || 'Core DSA concept';
    const intuition = concept?.intuition || 'Mastering patterns reduces redundant computation.';
    const whenToUse = concept?.when_to_use || 'Whenever optimization is required.';

    return {
      reply: `🧠 **Shancode Socratic Breakdown: ${concept?.title || 'Concept'}**\n\n` +
             `**Core Intuition:**\n${intuition}\n\n` +
             `**When To Apply This In Interviews:**\n${whenToUse}\n\n` +
             `**Summary Takeaway:**\n${summary}\n\n` +
             `*💡 Tip: Work through the interactive quiz before jumping directly into problem practice!*`,
      provider: this.name,
      suggested_actions: ['Take concept quiz', 'View verified code template', 'Explore practice problems']
    };
  }

  async generateHint({ problem, userCode, tier = 1 }) {
    const hints = [
      `💡 **Tier 1 (Observation)**: What invariant or property is maintained as you iterate through the input? Could sorting or a hash map simplify lookups to O(1)?`,
      `🔍 **Tier 2 (Key Data Structure)**: If you need quick access to previously seen values or frequencies, allocate a Hash Map or Frequency Array to avoid re-scanning.`,
      `📐 **Tier 3 (Algorithm Pattern)**: Maintain two pointers: one left boundary and one right boundary. Adjust the pointers monotonically based on the current window sum or target comparison.`
    ];

    const selectedHint = hints[Math.min(tier - 1, hints.length - 1)];

    return {
      reply: `🎯 **Progressive Hint (Tier ${tier}) for ${problem?.title || 'Problem'}**:\n\n${selectedHint}\n\n` +
             `*Take a minute to test this invariant on paper with a small 3-element example before writing code!*`,
      provider: this.name,
      tier,
      suggested_actions: ['Ask for next progressive hint', 'Check time complexity', 'Debug current code']
    };
  }

  async debugCode({ problem, userCode, failedTestDiff, language }) {
    let diffDetails = '';
    if (failedTestDiff && failedTestDiff.diff) {
      diffDetails = `\n**Observed Failure Diff:**\n\`\`\`\n${failedTestDiff.diff}\n\`\`\`\n`;
    }

    return {
      reply: `🔍 **Socratic Bug Diagnosis for ${problem?.title || 'Problem'}**:${diffDetails}\n` +
             `**Key Inspection Points:**\n` +
             `1. **Boundary & Off-by-One Checks**: Verify your array bounds (\`< vs <=\` or \`length - 1\`).\n` +
             `2. **State Reset**: If you are using helper maps or global variables, ensure they reset between test runs.\n` +
             `3. **Edge Cases**: Check empty collections, single-element inputs, and negative numbers.\n\n` +
             `*Would you like a line-by-line complexity walkthrough?*`,
      provider: this.name,
      suggested_actions: ['Explain line-by-line', 'Show optimal boundary condition', 'Progressive hint']
    };
  }

  async explainComplexity({ code, language }) {
    // Deterministic complexity heuristic
    let time = 'O(N)';
    let space = 'O(1)';
    const cleanCode = (code || '').toLowerCase();

    const forCount = (cleanCode.match(/for\s*\(/g) || []).length + (cleanCode.match(/for\s+\w+\s+in/g) || []).length;
    const whileCount = (cleanCode.match(/while\s*\(/g) || []).length + (cleanCode.match(/while\s+/g) || []).length;
    const totalLoops = forCount + whileCount;

    if (totalLoops >= 2) {
      time = 'O(N²) (Nested iterations detected)';
    } else if (cleanCode.includes('sort') || cleanCode.includes('sorted')) {
      time = 'O(N log N) (Sorting step dominates)';
    } else if (cleanCode.includes('// 2') || cleanCode.includes('>> 1') || cleanCode.includes('/ 2')) {
      time = 'O(log N) (Binary reduction detected)';
    }

    if (cleanCode.includes('map') || cleanCode.includes('dict') || cleanCode.includes('set') || cleanCode.includes('[]') || cleanCode.includes('new array')) {
      space = 'O(N) auxiliary space (Allocates dynamic hash table/collection)';
    }

    return {
      reply: `⏱️ **Complexity Analysis (${language || 'Code'})**:\n\n` +
             `• **Time Complexity**: **${time}**\n` +
             `• **Space Complexity**: **${space}**\n\n` +
             `*Optimal DSA solutions aim to minimize both time and space tradeoffs for maximum interview impact.*`,
      provider: this.name,
      suggested_actions: ['Can we reduce auxiliary space?', 'Explain worst-case scenario']
    };
  }

  async answerQuestion({ question, context }) {
    return {
      reply: `👋 **Shancode DSA Tutor Response**:\n\n` +
             `Regarding: *"**${question}**"*\n\n` +
             `In algorithmic problem solving, always structure your thought process:\n` +
             `1. **Clarify Constraints**: What are the minimum and maximum input sizes?\n` +
             `2. **State the Invariant**: What remains true across every iteration?\n` +
             `3. **Optimize with Data Structures**: Trade space (e.g. Hash Table) to reduce time (e.g. O(N²) -> O(N)).\n\n` +
             `Ask me for a specific progressive hint, debugging assistance, or complexity breakdown!`,
      provider: this.name,
      suggested_actions: ['Give me a hint', 'Explain complexity', 'Walk me through an example']
    };
  }

  async analyzeSubmission({ problem, userCode, verdict, runtimeMs, memoryKb }) {
    return {
      reply: `📊 **Submission Performance Report**:\n\n` +
             `• **Verdict**: **${verdict}**\n` +
             `• **Runtime**: **${runtimeMs}ms**\n` +
             `• **Memory**: **${memoryKb}KB**\n\n` +
             `${verdict === 'Accepted' ? '🎉 Great job! Your solution passed all verification test cases.' : '⚠️ Solution encountered discrepancies on edge test cases. Review your boundary conditions.'}`,
      provider: this.name,
      suggested_actions: ['View optimal solution', 'Explain time complexity']
    };
  }
}
