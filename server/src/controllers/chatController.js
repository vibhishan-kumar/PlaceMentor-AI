import prisma from '../services/prismaClient.js';
import { aiService } from '../services/ai/aiProvider.js';
import { parseResumeFile } from '../services/resumeParser.js';

/**
 * GET /api/chats
 * List all chats for current student, ordered by most recent update
 */
export const getUserChats = async (req, res, next) => {
  try {
    const chats = await prisma.chat.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { messages: true }
        }
      }
    });

    return res.status(200).json({
      success: true,
      chats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/chats
 * Create a new chat session
 */
export const createChat = async (req, res, next) => {
  try {
    const { title } = req.body;

    const chat = await prisma.chat.create({
      data: {
        userId: req.user.id,
        title: title ? title.trim() : 'New Chat'
      }
    });

    return res.status(201).json({
      success: true,
      chat: {
        ...chat,
        messages: []
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/chats/:id
 * Get single chat with all its messages
 */
export const getChatById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const chat = await prisma.chat.findFirst({
      where: {
        id,
        userId: req.user.id
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat conversation not found.'
      });
    }

    return res.status(200).json({
      success: true,
      chat
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/chats/:id/messages
 * Send a user message and receive AI placement assistance
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { id: chatId } = req.params;
    const rawContent = req.body.content || '';
    const file = req.file;

    if (!rawContent.trim() && !file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message or attach a resume file.'
      });
    }

    const promptText = rawContent.trim() || 'Please evaluate this resume for campus placements and ATS compatibility.';

    // Verify chat ownership
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: req.user.id
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat conversation not found.'
      });
    }

    let userStoredContent = promptText;
    let aiPromptContent = promptText;
    let extractedResumeText = '';

    // Handle resume attachment
    if (file) {
      try {
        extractedResumeText = await parseResumeFile(file.path, file.mimetype);
        await prisma.resume.create({
          data: {
            userId: req.user.id,
            fileName: file.originalname,
            storedName: file.filename,
            mimeType: file.mimetype,
            fileSize: file.size,
            filePath: file.path,
            extractedText: extractedResumeText,
            targetCompany: req.body.targetCompany || null,
            targetRole: req.body.targetRole || null
          }
        });

        userStoredContent = `📎 **Attached Resume:** \`${file.originalname}\`\n\n${promptText}`;
        aiPromptContent = `${promptText}\n\n---\n[STUDENT ATTACHED RESUME CONTENT]:\n${extractedResumeText}\n---\nPlease provide an objective ATS evaluation, strengths, weaknesses, and concrete recommendations for this student.`;
      } catch (parseErr) {
        console.error('Failed to parse in-chat resume:', parseErr);
        userStoredContent = `📎 **Attached Resume:** \`${file.originalname}\` (Error reading file: ${parseErr.message})\n\n${promptText}`;
      }
    }

    // 1. Save user message to database
    const userMessage = await prisma.message.create({
      data: {
        chatId,
        role: 'USER',
        content: userStoredContent
      }
    });

    // 2. Prepare message history for AI context
    const previousMessages = chat.messages.map((m) => ({
      role: m.role,
      content: m.content
    }));
    previousMessages.push({
      role: 'USER',
      content: aiPromptContent
    });

    // 3. Generate AI placement response
    let aiResponseText = '';
    try {
      aiResponseText = await aiService.generateResponse(previousMessages, req.user);
    } catch (aiError) {
      aiResponseText = aiError.message || 'Unable to generate a response right now. Please try again.';
    }

    // 4. Save AI assistant message to database
    const assistantMessage = await prisma.message.create({
      data: {
        chatId,
        role: 'ASSISTANT',
        content: aiResponseText
      }
    });

    // 5. If this was the first message in the chat, set title instantly from prompt
    let updatedTitle = chat.title;
    if (chat.messages.length === 0 || chat.title === 'New Chat') {
      const words = promptText.trim().split(/\s+/);
      updatedTitle = words.slice(0, 5).join(' ');
      if (updatedTitle.length > 35) {
        updatedTitle = updatedTitle.slice(0, 35) + '...';
      }
    }

    // Update chat title and timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        title: updatedTitle,
        updatedAt: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      userMessage,
      assistantMessage,
      chatTitle: updatedTitle
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/chats/:id
 * Rename a chat
 */
export const renameChat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Chat title cannot be empty.'
      });
    }

    // Check ownership
    const chat = await prisma.chat.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat conversation not found.'
      });
    }

    const updated = await prisma.chat.update({
      where: { id },
      data: { title: title.trim() }
    });

    return res.status(200).json({
      success: true,
      message: 'Chat renamed successfully.',
      chat: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/chats/:id
 * Delete a chat and its messages
 */
export const deleteChat = async (req, res, next) => {
  try {
    const { id } = req.params;

    const chat = await prisma.chat.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat conversation not found.'
      });
    }

    await prisma.chat.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Chat deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
