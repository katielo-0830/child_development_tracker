const express = require('express');
const router = express.Router();

// Import route modules
const programsRouter = require('./programs');
const sessionsRouter = require('./sessions');
const therapistsRouter = require('./therapists');
const stosRouter = require('./stos');
const trailsRouter = require('./trails');

// API routes
router.use('/api/programs', programsRouter);
router.use('/api/sessions', sessionsRouter);
router.use('/api/therapists', therapistsRouter);
router.use('/api/stos', stosRouter);
router.use('/api/trails', trailsRouter);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Default route
router.get('/', (req, res) => {
  res.json({
    message: 'Child Development Tracker API',
    endpoints: [
      '/api/programs',
      '/api/sessions',
      '/api/therapists',
      '/api/stos',
      '/api/trails'
    ]
  });
});

module.exports = router;
