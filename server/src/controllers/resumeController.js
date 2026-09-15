import fs from 'fs';
import path from 'path';
import prisma from '../services/prismaClient.js';
import { parseResumeFile } from '../services/resumeParser.js';
import { aiService } from '../services/ai/aiProvider.js';

/**
 * POST /api/resumes/upload
 * Upload a resume file, extract text, and save record
 */
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please upload a PDF, JPG, JPEG or PNG resume.'
      });
    }

    const { targetCompany, targetRole, jobDescription } = req.body;
    const file = req.file;

    // Extract text from file (PDF or OCR for image)
    let extractedText = '';
    try {
      extractedText = await parseResumeFile(file.path, file.mimetype);
    } catch (parseError) {
      // Clean up uploaded file if extraction completely fails
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return res.status(400).json({
        success: false,
        message: `Resume text extraction failed: ${parseError.message}`
      });
    }

    // Save Resume to database
    const resume = await prisma.resume.create({
      data: {
        userId: req.user.id,
        fileName: file.originalname,
        storedName: file.filename,
        mimeType: file.mimetype,
        fileSize: file.size,
        filePath: file.path,
        extractedText,
        targetCompany: targetCompany ? targetCompany.trim() : null,
        targetRole: targetRole ? targetRole.trim() : null,
        jobDescription: jobDescription ? jobDescription.trim() : null
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Resume uploaded and parsed successfully.',
      resume: {
        id: resume.id,
        fileName: resume.fileName,
        fileSize: resume.fileSize,
        mimeType: resume.mimeType,
        targetCompany: resume.targetCompany,
        targetRole: resume.targetRole,
        createdAt: resume.createdAt,
        textPreview: extractedText.slice(0, 300) + '...'
      }
    });
  } catch (error) {
    // Delete file if saved but failed during DB write
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    next(error);
  }
};

/**
 * POST /api/resumes/:id/analyze
 * Run AI evaluation on extracted resume text
 */
export const analyzeResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { targetCompany, targetRole, jobDescription } = req.body;

    // Verify ownership
    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found.'
      });
    }

    // Update target role/company if provided during analysis trigger
    const company = targetCompany || resume.targetCompany || '';
    const role = targetRole || resume.targetRole || '';
    const jd = jobDescription || resume.jobDescription || '';

    if (company !== resume.targetCompany || role !== resume.targetRole || jd !== resume.jobDescription) {
      await prisma.resume.update({
        where: { id },
        data: {
          targetCompany: company || null,
          targetRole: role || null,
          jobDescription: jd || null
        }
      });
    }

    // Call AI service
    const analysisResult = await aiService.analyzeResume(
      resume.extractedText,
      company,
      role,
      jd
    );

    // Save or update analysis record
    const existingAnalysis = await prisma.resumeAnalysis.findFirst({
      where: { resumeId: id }
    });

    const analysisData = {
      overallScore: Math.min(100, Math.max(0, parseInt(analysisResult.overallScore || '70', 10))),
      atsScore: Math.min(100, Math.max(0, parseInt(analysisResult.atsScore || '65', 10))),
      matchPercentage: analysisResult.matchPercentage ? Math.min(100, Math.max(0, parseInt(analysisResult.matchPercentage, 10))) : null,
      summary: analysisResult.summary || '',
      strengths: JSON.stringify(analysisResult.strengths || []),
      weaknesses: JSON.stringify(analysisResult.weaknesses || []),
      skillsAnalysis: JSON.stringify(analysisResult.skillsAnalysis || {}),
      projectAnalysis: JSON.stringify(analysisResult.projectAnalysis || {}),
      educationAnalysis: JSON.stringify(analysisResult.educationAnalysis || ''),
      experienceAnalysis: JSON.stringify(analysisResult.experienceAnalysis || ''),
      formattingIssues: JSON.stringify(analysisResult.formattingIssues || []),
      atsIssues: JSON.stringify(analysisResult.atsIssues || []),
      actionableSuggestions: JSON.stringify(analysisResult.actionableSuggestions || []),
      improvedResumeSuggestions: JSON.stringify(analysisResult.improvedResumeSuggestions || []),
      companyRoleAnalysis: analysisResult.companyRoleAnalysis ? JSON.stringify(analysisResult.companyRoleAnalysis) : null
    };

    let savedAnalysis;
    if (existingAnalysis) {
      savedAnalysis = await prisma.resumeAnalysis.update({
        where: { id: existingAnalysis.id },
        data: analysisData
      });
    } else {
      savedAnalysis = await prisma.resumeAnalysis.create({
        data: {
          resumeId: id,
          ...analysisData
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully.',
      analysis: {
        ...analysisResult,
        id: savedAnalysis.id,
        createdAt: savedAnalysis.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/resumes
 * List all uploaded resumes for the current student
 */
export const getUserResumes = async (req, res, next) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    const formattedResumes = resumes.map((r) => {
      const latestAnalysis = r.analyses[0];
      return {
        id: r.id,
        fileName: r.fileName,
        fileSize: r.fileSize,
        mimeType: r.mimeType,
        targetCompany: r.targetCompany,
        targetRole: r.targetRole,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        hasAnalysis: Boolean(latestAnalysis),
        overallScore: latestAnalysis ? latestAnalysis.overallScore : null,
        atsScore: latestAnalysis ? latestAnalysis.atsScore : null,
        matchPercentage: latestAnalysis ? latestAnalysis.matchPercentage : null
      };
    });

    return res.status(200).json({
      success: true,
      resumes: formattedResumes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/resumes/:id
 * Get full resume details and parsed analysis report
 */
export const getResumeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId: req.user.id
      },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found.'
      });
    }

    let parsedAnalysis = null;
    if (resume.analyses.length > 0) {
      const raw = resume.analyses[0];
      parsedAnalysis = {
        id: raw.id,
        overallScore: raw.overallScore,
        atsScore: raw.atsScore,
        matchPercentage: raw.matchPercentage,
        summary: raw.summary,
        strengths: JSON.parse(raw.strengths || '[]'),
        weaknesses: JSON.parse(raw.weaknesses || '[]'),
        skillsAnalysis: JSON.parse(raw.skillsAnalysis || '{}'),
        projectAnalysis: JSON.parse(raw.projectAnalysis || '{}'),
        educationAnalysis: JSON.parse(raw.educationAnalysis || '""'),
        experienceAnalysis: JSON.parse(raw.experienceAnalysis || '""'),
        formattingIssues: JSON.parse(raw.formattingIssues || '[]'),
        atsIssues: JSON.parse(raw.atsIssues || '[]'),
        actionableSuggestions: JSON.parse(raw.actionableSuggestions || '[]'),
        improvedResumeSuggestions: JSON.parse(raw.improvedResumeSuggestions || '[]'),
        companyRoleAnalysis: raw.companyRoleAnalysis ? JSON.parse(raw.companyRoleAnalysis) : null,
        createdAt: raw.createdAt
      };
    }

    return res.status(200).json({
      success: true,
      resume: {
        id: resume.id,
        fileName: resume.fileName,
        fileSize: resume.fileSize,
        mimeType: resume.mimeType,
        targetCompany: resume.targetCompany,
        targetRole: resume.targetRole,
        jobDescription: resume.jobDescription,
        createdAt: resume.createdAt,
        extractedTextSnippet: resume.extractedText.slice(0, 1000),
        analysis: parsedAnalysis
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/resumes/:id
 * Delete resume file and database record
 */
export const deleteResume = async (req, res, next) => {
  try {
    const { id } = req.params;

    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found.'
      });
    }

    // Delete file from disk if it exists
    if (resume.filePath && fs.existsSync(resume.filePath)) {
      try {
        fs.unlinkSync(resume.filePath);
      } catch (err) {
        console.warn('Could not delete resume file from disk:', err.message);
      }
    }

    // Delete from DB (cascades to ResumeAnalysis)
    await prisma.resume.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Resume and analysis report deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
