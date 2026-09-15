# Shancode Backend: Render Deployment Guide

This guide documents the configuration and steps for deploying the Shancode Express backend on Render (Web Service) connected to Supabase PostgreSQL.

## 1. Render Service Overview
- Service Type: Web Service
- Root Directory: backend
- Runtime: Node
- Build Command: npm install
- Start Command: npm start
- Health Check Path: /api/v1/health

## 2. Required Environment Variables
- NODE_ENV: production
- PORT: 10000
- SUPABASE_DB_URL: postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
- SUPABASE_URL: https://[REF].supabase.co
- SUPABASE_ANON_KEY: [ANON_KEY]
- SUPABASE_SERVICE_ROLE_KEY: [SERVICE_KEY]
- JWT_SECRET: [SECRET]
- JWT_REFRESH_SECRET: [REFRESH_SECRET]
- FRONTEND_URL: https://shancode.vercel.app,http://localhost:5173
- EXECUTION_TIMEOUT_MS: 3500
- JUDGE_SERVICE_URL: (Optional) Isolated judge worker endpoint
- GEMINI_API_KEY: (Optional) Socratic AI API key
