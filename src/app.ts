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

// Default public route for browser testing
app.get('/', (_req, res) => {
  res.status(200).send(`
    <html>
      <body style="font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f8fafc; color: #0f172a;">
        <div style="text-align: center; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);">
          <h1 style="color: #10b981; margin-bottom: 0.5rem;">🚀 Backend Deployed Successfully!</h1>
          <p style="color: #64748b; margin-top: 0;">The API server is running normally.</p>
          <p style="font-size: 0.875rem; color: #94a3b8; margin-top: 2rem;">Version 1.0.0</p>
        </div>
      </body>
    </html>
  `);
});

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
