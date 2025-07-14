const express = require('express');
const router = express.Router();
const db = require('../sequelize/models'); // Import Sequelize models

/**
 * @route   GET /api/stos
 * @desc    Get all STOs or filter by programId
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { programId } = req.query;

    // Build the where clause for filtering by programId
    const whereClause = programId ? { programId } : {};

    const stos = await db.STO.findAll({
      where: whereClause,
      include: [
        {
          model: db.Program,
          as: 'program', // Include associated Program
        },
      ],
      order: [['createdAt', 'DESC']], // Optional: Order by creation date
    });

    res.json(stos);
  } catch (err) {
    console.error('Error fetching STOs:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/stos/:id
 * @desc    Get an STO by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const stoId = parseInt(req.params.id, 10);

    // Validate STO ID
    if (isNaN(stoId)) {
      return res.status(400).json({ msg: 'Invalid STO ID format.' });
    }

    const sto = await db.STO.findByPk(stoId, {
      include: [
        {
          model: db.Program,
          as: 'program', // Include associated Program
        },
      ],
    });

    if (!sto) {
      return res.status(404).json({ msg: 'STO not found.' });
    }

    res.json(sto);
  } catch (err) {
    console.error('Error fetching STO by ID:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/stos
 * @desc    Create a new STO
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, description, programId, status, startDate, masteredDate, trialStructure } = req.body;

    // Basic validation
    if (!name || !programId || !status) {
      return res.status(400).json({ msg: 'Please provide a name, program ID, and status for the STO.' });
    }

    // Validate status
    const validStatuses = ['in_progress', 'mastered', 'pending'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` });
    }

    // Check if the programId is valid
    const program = await db.Program.findByPk(programId);
    if (!program) {
      return res.status(404).json({ msg: 'Program not found. Please provide a valid program ID.' });
    }

    // Create the STO
    const newSTO = await db.STO.create({
      name,
      description: description || null,
      programId,
      status,
      startDate: startDate || null,
      masteredDate: masteredDate || null,
      trialStructure: trialStructure || null,
    });

    res.status(201).json(newSTO);
  } catch (err) {
    console.error('Error creating STO:', err.message);

    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map((e) => e.message);
      return res.status(400).json({ msg: 'Validation error', errors: messages });
    }

    res.status(500).send('Server Error');
  }
});

module.exports = router;