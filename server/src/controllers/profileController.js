import prisma from '../services/prismaClient.js';
import { aiService } from '../services/ai/aiProvider.js';

/**
 * GET /api/profile
 * Get student profile with placement statistics
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        program: true,
        department: true,
        graduationYear: true,
        skills: true,
        preferredDomain: true,
        experienceLevel: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            chats: true,
            resumes: true
          }
        }
      }
    });

    const aiStatus = aiService.getProviderStatus();

    return res.status(200).json({
      success: true,
      profile: {
        ...user,
        aiStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/profile
 * Update student profile information
 */
export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      program,
      department,
      graduationYear,
      skills,
      preferredDomain,
      experienceLevel
    } = req.body;

    const dataToUpdate = {};

    if (name && name.trim().length >= 2) dataToUpdate.name = name.trim();
    if (phone !== undefined) dataToUpdate.phone = phone ? phone.trim() : null;
    if (program && program.trim()) dataToUpdate.program = program.trim();
    if (department && department.trim()) dataToUpdate.department = department.trim();
    if (graduationYear) dataToUpdate.graduationYear = parseInt(graduationYear, 10);
    if (skills !== undefined) {
      dataToUpdate.skills = Array.isArray(skills) ? skills.join(', ') : skills.toString();
    }
    if (preferredDomain) dataToUpdate.preferredDomain = preferredDomain.trim();
    if (experienceLevel) dataToUpdate.experienceLevel = experienceLevel.trim();

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        program: true,
        department: true,
        graduationYear: true,
        skills: true,
        preferredDomain: true,
        experienceLevel: true,
        updatedAt: true
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Student profile updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/profile/ai-status
 * Check system AI provider configuration
 */
export const getAIStatus = (req, res) => {
  return res.status(200).json({
    success: true,
    aiStatus: aiService.getProviderStatus()
  });
};
