/**
=============================================================================
Express.js Main Application Gateway (MVC Architecture): backend/server.js
=============================================================================
*/

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import analysisRoutes from './Routes/analysisRoutes.js';
import statsRoutes from './Routes/statsRoutes.js';
import { errorHandler } from './Middlewares/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Connect to MongoDB
connectDB();

// 2. Global Middlewares
app.use(cors());
app.use(express.json());

// 3. Static Client Build File Serving (pointing to ../frontend/dist)
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
} else {
  app.use(express.static(path.join(__dirname, '..')));
}

// 4. API Routes
app.use('/api', analysisRoutes);
app.use('/api', statsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    architecture: 'Clean Monorepo (backend/, frontend/, python_ml/)',
    expressPort: PORT
  });
});

// 5. SPA Fallback Routing
app.get('*', (req, res) => {
  if (fs.existsSync(path.join(frontendDistPath, 'index.html'))) {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  }
});

// 6. Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`🚀 Express Backend Server running on http://localhost:${PORT}`);
  console.log(`   React Frontend UI : http://localhost:${PORT}`);
  console.log(`   Text Analysis API : POST http://localhost:${PORT}/api/analyze`);
  console.log(`   Stats API         : GET  http://localhost:${PORT}/api/stats`);
  console.log(`=============================================================\n`);
});
