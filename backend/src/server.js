import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { initSchema } from './models/schema.js';
import { getDb } from './config/db.js';
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
const PORT = parseInt(process.env.PORT || '5000', 10);
const isProduction = process.env.NODE_ENV === 'production';

// Production Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Configurable Dynamic CORS
const defaultOrigins = ['http://localhost:5173', 'http://localhost:3000', 'https://shancode.vercel.app'];
const configuredOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(s => s.trim()).filter(Boolean)
  : defaultOrigins;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || !isProduction || configuredOrigins.includes('*') || configuredOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Allow Vercel preview domains if main domain is configured
      const isVercelPreview = origin.endsWith('.vercel.app') && configuredOrigins.some(o => o.includes('vercel.app'));
      if (isVercelPreview) {
        callback(null, true);
      } else {
        callback(new Error('CORS request blocked by Shancode CORS policy'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Safe Healthcheck Endpoints (Does not expose internal credentials or database passwords)
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Shancode API Gateway',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
};

app.get('/api/health', healthHandler);
app.get('/api/v1/health', healthHandler);

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

// Global Safe Error Handler
app.use((err, req, res, next) => {
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ success: false, error: 'CORS origin denied' });
  }
  console.error('Server error:', err.message || err);
  res.status(500).json({
    success: false,
    error: isProduction ? 'Internal Server Error' : (err.message || 'Internal Server Error')
  });
});

let serverInstance = null;

// Initialize schema and start server
async function startServer() {
  try {
    await initSchema();
    serverInstance = app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n======================================================`);
      console.log(`🚀 Shancode Backend running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
      console.log(`📖 Health Check: http://localhost:${PORT}/api/v1/health`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('Failed to start Shancode server:', err);
    process.exit(1);
  }
}

// Graceful Shutdown
function gracefulShutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down Shancode server gracefully...`);
  if (serverInstance) {
    serverInstance.close(async () => {
      console.log('HTTP server closed.');
      try {
        const dbObj = await getDb();
        if (dbObj.type === 'pg' && dbObj.pool) {
          await dbObj.pool.end();
          console.log('PostgreSQL connection pool drained.');
        }
      } catch (e) {}
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();

export default app;
