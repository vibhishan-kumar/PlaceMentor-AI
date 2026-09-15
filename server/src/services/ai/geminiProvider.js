import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  PLACEMENT_SYSTEM_PROMPT,
  RESUME_ANALYSIS_PROMPT,
  JD_ANALYSIS_PROMPT
} from './systemPrompts.js';

/**
 * Safely parse JSON from LLM output (strips markdown codeblocks if present)
 */
function extractAndParseJSON(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

export class GeminiProvider {
  constructor(apiKey, modelName = 'gemini-3.1-flash-lite') {
    this.apiKey = apiKey;
    this.modelName = modelName || 'gemini-3.1-flash-lite';
    if (this.apiKey) {
      this.client = new GoogleGenerativeAI(this.apiKey);
    }
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Helper to execute model operations with automatic fallback for deprecated model names
   */
  async _executeWithFallback(action) {
    try {
      return await action(this.modelName);
    } catch (error) {
      if (
        (error.status === 404 || error.message?.includes('not found') || error.message?.includes('no longer available')) &&
        this.modelName !== 'gemini-3.1-flash-lite'
      ) {
        console.warn(`[Gemini Provider] Model "${this.modelName}" returned 404/deprecated. Automatically falling back to "gemini-3.1-flash-lite"...`);
        this.modelName = 'gemini-3.1-flash-lite';
        return await action('gemini-3.1-flash-lite');
      }
      throw error;
    }
  }

  /**
   * Multi-turn chat conversation
   * @param {Array<{ role: string, content: string }>} messages
   * @param {object} studentProfile
   */
  async generateResponse(messages, studentProfile = {}) {
    if (!this.isConfigured()) {
      throw new Error('GEMINI_API_KEY is not configured in .env. Please add your key to proceed.');
    }

    // Format conversation history for Gemini
    let profileContext = '';
    if (studentProfile && studentProfile.name) {
      profileContext = `\n[Current Student Context: Name: ${studentProfile.name}, Program: ${studentProfile.program || 'N/A'}, Department: ${studentProfile.department || 'N/A'}, Graduation Year: ${studentProfile.graduationYear || 'N/A'}, Skills: ${studentProfile.skills || 'N/A'}, Preferred Domain: ${studentProfile.preferredDomain || 'N/A'}]\n`;
    }

    const formattedHistory = [];
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      const role = msg.role.toUpperCase() === 'USER' ? 'user' : 'model';
      formattedHistory.push({
        role,
        parts: [{ text: msg.content }]
      });
    }

    const lastMessage = messages[messages.length - 1];
    const userPromptWithContext = profileContext
      ? `${profileContext}\n${lastMessage.content}`
      : lastMessage.content;

    return await this._executeWithFallback(async (activeModel) => {
      const model = this.client.getGenerativeModel({
        model: activeModel,
        systemInstruction: PLACEMENT_SYSTEM_PROMPT
      });

      const chat = model.startChat({
        history: formattedHistory
      });

      const result = await chat.sendMessage(userPromptWithContext);
      const response = await result.response;
      return response.text();
    });
  }

  /**
   * Generate short 3-5 word chat title
   */
  async generateTitle(firstMessage) {
    if (!this.isConfigured()) {
      return 'Placement Discussion';
    }

    try {
      return await this._executeWithFallback(async (activeModel) => {
        const model = this.client.getGenerativeModel({ model: activeModel });
        const prompt = `Generate a concise, professional 3 to 5 word title for a placement/career chat starting with this question: "${firstMessage}". Output ONLY the title, no quotes, no period, nothing else.`;
        const result = await model.generateContent(prompt);
        const title = (await result.response).text().trim().replace(/^["']|["']$/g, '');
        return title.slice(0, 45) || 'Placement Discussion';
      });
    } catch (e) {
      console.warn('Could not generate chat title with Gemini:', e.message);
      return 'Placement Discussion';
    }
  }

  /**
   * Analyze extracted resume text
   */
  async analyzeResume(resumeText, targetCompany = '', targetRole = '', jobDescription = '') {
    if (!this.isConfigured()) {
      throw new Error('GEMINI_API_KEY is not configured in .env. Please add your key to proceed.');
    }

    const prompt = `${RESUME_ANALYSIS_PROMPT}

TARGET COMPANY: ${targetCompany || 'General Tech / Campus Placement'}
TARGET ROLE: ${targetRole || 'Software Development / Graduate Engineer Trainee'}
TARGET JOB DESCRIPTION:
${jobDescription || 'N/A - Standard placement preparation guidelines'}

---
RESUME TEXT CONTENT:
${resumeText}
`;

    return await this._executeWithFallback(async (activeModel) => {
      const model = this.client.getGenerativeModel({
        model: activeModel,
        generationConfig: { responseMimeType: 'application/json' }
      });

      const result = await model.generateContent(prompt);
      const text = (await result.response).text();
      return extractAndParseJSON(text);
    });
  }

  /**
   * Analyze pasted Job Description
   */
  async analyzeJobDescription(jobDescription) {
    if (!this.isConfigured()) {
      throw new Error('GEMINI_API_KEY is not configured in .env. Please add your key to proceed.');
    }

    const prompt = `${JD_ANALYSIS_PROMPT}

JOB DESCRIPTION CONTENT:
${jobDescription}
`;

    return await this._executeWithFallback(async (activeModel) => {
      const model = this.client.getGenerativeModel({
        model: activeModel,
        generationConfig: { responseMimeType: 'application/json' }
      });

      const result = await model.generateContent(prompt);
      const text = (await result.response).text();
      return extractAndParseJSON(text);
    });
  }
}
