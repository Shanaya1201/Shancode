/**
 * Base abstract class for Shancode AI Providers
 */
export class BaseAIProvider {
  constructor(name = 'base') {
    this.name = name;
  }

  async explainConcept({ concept, learnerLevel }) {
    throw new Error('explainConcept not implemented in provider ' + this.name);
  }

  async generateHint({ problem, userCode, previousHints, tier }) {
    throw new Error('generateHint not implemented in provider ' + this.name);
  }

  async debugCode({ problem, userCode, failedTestDiff, language }) {
    throw new Error('debugCode not implemented in provider ' + this.name);
  }

  async explainComplexity({ code, language, algorithmName }) {
    throw new Error('explainComplexity not implemented in provider ' + this.name);
  }

  async answerQuestion({ question, context, history }) {
    throw new Error('answerQuestion not implemented in provider ' + this.name);
  }

  async analyzeSubmission({ problem, userCode, verdict, runtimeMs, memoryKb }) {
    throw new Error('analyzeSubmission not implemented in provider ' + this.name);
  }
}
