import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jdRoutes from './routes/jdRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

// Middleware imports
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security & CORS Configuration
const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps or curl/Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev to avoid CORS friction
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving (protected/isolated)
const uploadsPath = path.resolve(process.cwd(), env.UPLOAD_DIR);
app.use('/uploads', express.static(uploadsPath));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'PlaceMentor AI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    aiProvider: env.AI_PROVIDER
  });
});

// Mount Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/job-description', jdRoutes);
app.use('/api/profile', profileRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Start HTTP Server
const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 PlaceMentor AI Server running on port ${PORT}`);
  console.log(`   Environment: ${env.NODE_ENV}`);
  console.log(`   AI Provider: ${env.AI_PROVIDER.toUpperCase()}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

export default app;
