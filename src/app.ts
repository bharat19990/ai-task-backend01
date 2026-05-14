import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './features/auth/auth.routes.js';
import postRoutes from './features/posts/post.routes.js';
import aiRoutes from './features/ai/ai.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware.js';

const app = express();

// CORS configuration - allows credentials (cookies) from frontend
app.use(
  cors({
    origin: (origin, callback) => callback(null, true), // Allows any origin dynamically
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/ai', aiRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
