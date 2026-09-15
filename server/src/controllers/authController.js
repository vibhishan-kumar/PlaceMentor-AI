import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../services/prismaClient.js';
import { env } from '../config/env.js';
import { validateRegistration, validateLogin } from '../utils/validators.js';

/**
 * Generate JWT token for user
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
};

/**
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const validation = validateRegistration(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors[0],
        errors: validation.errors
      });
    }

    const {
      name,
      email,
      password,
      phone,
      program,
      department,
      graduationYear,
      skills,
      preferredDomain,
      experienceLevel
    } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this University of Hyderabad email already exists. Please log in.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Format skills to string if array
    const formattedSkills = Array.isArray(skills)
      ? skills.join(', ')
      : (skills || '').toString();

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        phone: phone ? phone.trim() : null,
        program: program.trim(),
        department: department.trim(),
        graduationYear: parseInt(graduationYear, 10),
        skills: formattedSkills.trim(),
        preferredDomain: preferredDomain || 'Software Development',
        experienceLevel: experienceLevel || 'Fresher'
      }
    });

    const token = generateToken(newUser);

    // Safe user response (no passwordHash)
    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      program: newUser.program,
      department: newUser.department,
      graduationYear: newUser.graduationYear,
      skills: newUser.skills,
      preferredDomain: newUser.preferredDomain,
      experienceLevel: newUser.experienceLevel,
      createdAt: newUser.createdAt
    };

    return res.status(201).json({
      success: true,
      message: 'Student registration successful. Welcome to PlaceMentor AI!',
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const validation = validateLogin(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors[0],
        errors: validation.errors
      });
    }

    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Find student by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      program: user.program,
      department: user.department,
      graduationYear: user.graduationYear,
      skills: user.skills,
      preferredDomain: user.preferredDomain,
      experienceLevel: user.experienceLevel,
      createdAt: user.createdAt
    };

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
};
