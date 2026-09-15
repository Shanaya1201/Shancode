import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { initSchema } from './models/schema.js';
import authRoutes from './routes/v1/auth.js';
import learnRoutes from './routes/v1/learn.js';
import problemsRoutes from './routes/v1/problems.js';
import submissionsRoutes from './routes/v1/submissions.js';
import patternsRoutes from './routes/v1/patterns.js';
import contestsRoutes from './routes/v1/contests.js';
import analyticsRoutes from './routes/v1/analytics.js';
import tutorRoutes from './routes/v1/tutor.js';
import discussionsRoutes from './routes/v1/discussions.js';
import adminRoutes from './routes/v1/admin.js';
import notificationsRoutes from './routes/v1/notifications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Shancode API Gateway',
    version: '1.0.0',
    tagline: 'Learn the concept. Master the pattern. Solve the problem.',
    timestamp: new Date().toISOString()
  });
});

// Mount Mobile-Ready Versioned REST APIs (/api/v1/*)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/learn', learnRoutes);
app.use('/api/v1/problems', problemsRoutes);
app.use('/api/v1/submissions', submissionsRoutes);
app.use('/api/v1/patterns', patternsRoutes);
app.use('/api/v1/contests', contestsRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/tutor', tutorRoutes);
app.use('/api/v1/discussions', discussionsRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/notifications', notificationsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Initialize schema and start server
async function startServer() {
  try {
    await initSchema();
    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 Shancode Backend Server running on http://localhost:${PORT}`);
      console.log(`📖 API Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('Failed to start Shancode server:', err);
    process.exit(1);
  }
}

startServer();
