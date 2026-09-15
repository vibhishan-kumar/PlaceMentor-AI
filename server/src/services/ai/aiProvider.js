import { env } from '../../config/env.js';
import { GeminiProvider } from './geminiProvider.js';
import { GroqProvider } from './groqProvider.js';

class AIProviderService {
  constructor() {
    this.providerName = env.AI_PROVIDER || 'gemini';
    this.gemini = new GeminiProvider(env.GEMINI_API_KEY, env.GEMINI_MODEL);
    this.groq = new GroqProvider(env.GROQ_API_KEY, env.GROQ_MODEL);
  }

  getActiveProvider() {
    if (this.providerName === 'groq') {
      return this.groq;
    }
    // Default is Gemini
    return this.gemini;
  }

  getProviderStatus() {
    return {
      activeProvider: this.providerName,
      isConfigured: this.getActiveProvider().isConfigured(),
      model: this.providerName === 'groq' ? env.GROQ_MODEL : env.GEMINI_MODEL,
      availableProviders: ['gemini', 'groq']
    };
  }

  /**
   * Multi-turn chat conversation
   */
  async generateResponse(messages, studentProfile = {}) {
    const provider = this.getActiveProvider();
    if (!provider.isConfigured()) {
      const keyName = this.providerName === 'groq' ? 'GROQ_API_KEY' : 'GEMINI_API_KEY';
      return `### PlaceMentor AI Setup Notice
Welcome! The active AI provider is set to **${this.providerName.toUpperCase()}**, but **${keyName}** is not yet set in your environment file (\`.env\`).

To enable real-time AI placement assistance:
1. Open \`.env\` in your project root or server folder.
2. Set your **${keyName}** (e.g. from [Google AI Studio](https://aistudio.google.com/) for Gemini or [Groq Console](https://console.groq.com/) for Groq).
3. Restart the server.

Once added, I will be ready to help you with technical rounds, DSA problems, mock interviews, and career strategies!`;
    }

    try {
      return await provider.generateResponse(messages, studentProfile);
    } catch (error) {
      console.error(`[${this.providerName.toUpperCase()} Error]:`, error);
      throw new Error('Unable to generate a response right now. Please check your API key or try again.');
    }
  }

  /**
   * Chat title generation
   */
  async generateTitle(firstMessage) {
    const provider = this.getActiveProvider();
    if (!provider.isConfigured()) {
      const words = firstMessage.trim().split(/\s+/).slice(0, 5).join(' ');
      return words || 'New Placement Chat';
    }

    try {
      return await provider.generateTitle(firstMessage);
    } catch (error) {
      console.warn('Title generation fallback:', error.message);
      return firstMessage.trim().split(/\s+/).slice(0, 5).join(' ') || 'New Placement Chat';
    }
  }

  /**
   * Resume analysis
   */
  async analyzeResume(resumeText, targetCompany = '', targetRole = '', jobDescription = '') {
    const provider = this.getActiveProvider();
    if (!provider.isConfigured()) {
      const keyName = this.providerName === 'groq' ? 'GROQ_API_KEY' : 'GEMINI_API_KEY';
      throw new Error(`AI Provider (${this.providerName.toUpperCase()}) requires ${keyName} to be configured in .env to perform resume analysis.`);
    }

    try {
      return await provider.analyzeResume(resumeText, targetCompany, targetRole, jobDescription);
    } catch (error) {
      console.error(`[${this.providerName.toUpperCase()} Resume Analysis Error]:`, error);
      throw new Error('Unable to analyze resume with the AI provider right now. Please check your API configuration or try again.');
    }
  }

  /**
   * Job Description analysis
   */
  async analyzeJobDescription(jobDescription) {
    const provider = this.getActiveProvider();
    if (!provider.isConfigured()) {
      const keyName = this.providerName === 'groq' ? 'GROQ_API_KEY' : 'GEMINI_API_KEY';
      throw new Error(`AI Provider (${this.providerName.toUpperCase()}) requires ${keyName} to be configured in .env to analyze job descriptions.`);
    }

    try {
      return await provider.analyzeJobDescription(jobDescription);
    } catch (error) {
      console.error(`[${this.providerName.toUpperCase()} JD Analysis Error]:`, error);
      throw new Error('Unable to analyze the job description right now. Please try again.');
    }
  }
}

export const aiService = new AIProviderService();
