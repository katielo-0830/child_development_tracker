import express from 'express';
const router = express.Router();
import db from '../sequelize/models/index.js';

/**
 * @route   GET /api/sessions
 * @desc    Get all sessions
 * @access  Public // Or protected, depending on your auth setup
 */
router.get('/', async (req, res) => {
  try {
    const sessions = await db.Session.findAll({
      order: [['date', 'DESC'], ['startTime', 'DESC']], // Order by date descendingly, then by startTime
      include: [
        {
          model: db.Therapist,
          through: { attributes: [] }, // This removes the join table attributes from the result
          as: 'therapists', // Make sure this matches your association alias
        }
      ]
    });
    res.json(sessions);
  } catch (err) {
    console.error('Error getting sessions:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/sessions
 * @desc    Create a new session
 * @access  Public // Or protected, depending on your auth setup
 */
router.post('/', async (req, res) => {
  try {
    const { date, startTime, endTime, notes, therapistIds } = req.body;
    
    // Basic validation
    if (!date || !startTime || !endTime) {
      return res.status(400).json({ 
        msg: 'Please provide date, start time, and end time for the session.' 
      });
    }

    // Additional validation (optional)
    // Check if startTime is before endTime
    if (startTime >= endTime) {
      return res.status(400).json({ 
        msg: 'Start time must be before end time.' 
      });
    }

    // Create session transaction to handle session creation and therapist association
    const result = await db.sequelize.transaction(async (t) => {
      // Create the session
      const newSession = await db.Session.create({
        date,
        startTime,
        endTime,
        notes: notes || '' // Default to empty string if notes is not provided
      }, { transaction: t });
      
      // If therapist IDs were provided, associate them with the session
      if (therapistIds && Array.isArray(therapistIds) && therapistIds.length > 0) {
        // Check if all therapist IDs exist
        const therapists = await db.Therapist.findAll({
          where: { id: therapistIds },
          transaction: t
        });
        
        if (therapists.length !== therapistIds.length) {
          throw new Error('One or more therapist IDs are invalid');
        }
        
        // Associate therapists with the session
        await newSession.setTherapists(therapistIds, { transaction: t });
      }
      
      // Fetch the full session data with associated therapists to return
      return await db.Session.findByPk(newSession.id, {
        include: [
          {
            model: db.Therapist,
            through: { attributes: [] },
            as: 'therapists', // Make sure this matches your association alias
          }
        ],
        transaction: t
      });
    });
    
    res.status(201).json(result);
  } catch (err) {
    console.error('Error creating session:', err.message);
    
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map(e => e.message);
      return res.status(400).json({ msg: 'Validation error', errors: messages });
    }
    
    if (err.message === 'One or more therapist IDs are invalid') {
      return res.status(400).json({ msg: err.message });
    }
    
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/sessions/:id
 * @desc    Get a specific session by ID
 * @access  Public // Or protected, depending on your auth setup
 */
router.get('/:id', async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id, 10);

    // Check if sessionId is a valid number
    if (isNaN(sessionId)) {
      return res.status(400).json({ msg: 'Invalid session ID format.' });
    }

    const session = await db.Session.findByPk(sessionId, {
      include: [
        {
          model: db.Therapist,
          through: { attributes: [] },
          as: 'therapists', // Make sure this matches your association alias
        }
      ]
    });

    if (!session) {
      return res.status(404).json({ msg: 'Session not found.' });
    }

    res.json(session);
  } catch (err) {
    console.error('Error getting session by ID:', err.message);
    res.status(500).send('Server Error');
  }
});

export default router;