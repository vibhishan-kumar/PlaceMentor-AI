import { aiService } from '../services/ai/aiProvider.js';

/**
 * POST /api/job-description/analyze
 * Analyze pasted job description and generate placement roadmap
 */
export const analyzeJobDescription = async (req, res, next) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length < 40) {
      return res.status(400).json({
        success: false,
        message: 'Please paste a detailed job description (at least 40 characters).'
      });
    }

    const analysis = await aiService.analyzeJobDescription(jobDescription.trim());

    return res.status(200).json({
      success: true,
      message: 'Job description analyzed successfully.',
      analysis
    });
  } catch (error) {
    next(error);
  }
};
