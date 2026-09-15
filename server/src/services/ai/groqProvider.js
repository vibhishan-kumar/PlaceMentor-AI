import Groq from 'groq-sdk';
import {
  PLACEMENT_SYSTEM_PROMPT,
  RESUME_ANALYSIS_PROMPT,
  JD_ANALYSIS_PROMPT
} from './systemPrompts.js';

function extractAndParseJSON(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

export class GroqProvider {
  constructor(apiKey, modelName = 'llama-3.3-70b-versatile') {
    this.apiKey = apiKey;
    this.modelName = modelName;
    if (this.apiKey) {
      this.client = new Groq({ apiKey: this.apiKey });
    }
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Multi-turn chat conversation
   */
  async generateResponse(messages, studentProfile = {}) {
    if (!this.isConfigured()) {
      throw new Error('GROQ_API_KEY is not configured in .env. Please add your key to proceed.');
    }

    let profileContext = '';
    if (studentProfile && studentProfile.name) {
      profileContext = `\n[Current Student Context: Name: ${studentProfile.name}, Program: ${studentProfile.program || 'N/A'}, Department: ${studentProfile.department || 'N/A'}, Graduation Year: ${studentProfile.graduationYear || 'N/A'}, Skills: ${studentProfile.skills || 'N/A'}, Preferred Domain: ${studentProfile.preferredDomain || 'N/A'}]\n`;
    }

    const groqMessages = [
      {
        role: 'system',
        content: PLACEMENT_SYSTEM_PROMPT + (profileContext ? `\n${profileContext}` : '')
      }
    ];

    for (const msg of messages) {
      groqMessages.push({
        role: msg.role.toUpperCase() === 'USER' ? 'user' : 'assistant',
        content: msg.content
      });
    }

    const completion = await this.client.chat.completions.create({
      model: this.modelName,
      messages: groqMessages,
      temperature: 0.6,
      max_tokens: 2048
    });

    return completion.choices[0]?.message?.content || '';
  }

  /**
   * Generate short 3-5 word chat title
   */
  async generateTitle(firstMessage) {
    if (!this.isConfigured()) {
      return 'Placement Discussion';
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: this.modelName,
        messages: [
          {
            role: 'system',
            content: 'You generate concise 3 to 5 word titles for placement conversations. Output only the title.'
          },
          {
            role: 'user',
            content: `Generate a 3-5 word title for this prompt: "${firstMessage}"`
          }
        ],
        temperature: 0.5,
        max_tokens: 20
      });

      const title = completion.choices[0]?.message?.content?.trim().replace(/^["']|["']$/g, '');
      return title?.slice(0, 45) || 'Placement Discussion';
    } catch (e) {
      console.warn('Could not generate title with Groq:', e.message);
      return 'Placement Discussion';
    }
  }

  /**
   * Analyze extracted resume text
   */
  async analyzeResume(resumeText, targetCompany = '', targetRole = '', jobDescription = '') {
    if (!this.isConfigured()) {
      throw new Error('GROQ_API_KEY is not configured in .env. Please add your key to proceed.');
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

    const completion = await this.client.chat.completions.create({
      model: this.modelName,
      messages: [
        {
          role: 'system',
          content: 'You are an expert ATS evaluator. You MUST reply ONLY with valid JSON conforming to the requested schema. No conversational prose.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2
    });

    const text = completion.choices[0]?.message?.content || '{}';
    return extractAndParseJSON(text);
  }

  /**
   * Analyze pasted Job Description
   */
  async analyzeJobDescription(jobDescription) {
    if (!this.isConfigured()) {
      throw new Error('GROQ_API_KEY is not configured in .env. Please add your key to proceed.');
    }

    const prompt = `${JD_ANALYSIS_PROMPT}

JOB DESCRIPTION CONTENT:
${jobDescription}
`;

    const completion = await this.client.chat.completions.create({
      model: this.modelName,
      messages: [
        {
          role: 'system',
          content: 'You are an expert placement analyst. You MUST reply ONLY with valid JSON conforming to the requested schema.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2
    });

    const text = completion.choices[0]?.message?.content || '{}';
    return extractAndParseJSON(text);
  }
}
