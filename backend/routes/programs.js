const express = require('express');
const router = express.Router();
const db = require('../sequelize/models'); // Import Sequelize models

/**
 * @route   GET /api/programs
 * @desc    Get all programs
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const programs = await db.Program.findAll({
      include: [
        {
          model: db.STO,
          as: 'stos', // Include associated STOs
        },
      ],
      order: [['createdAt', 'DESC']], // Optional: Order by creation date
    });
    res.json(programs);
  } catch (err) {
    console.error('Error fetching programs:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/programs/:id
 * @desc    Get a program by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const programId = parseInt(req.params.id, 10);

    // Validate program ID
    if (isNaN(programId)) {
      return res.status(400).json({ msg: 'Invalid program ID format.' });
    }

    const program = await db.Program.findByPk(programId, {
      include: [
        {
          model: db.STO,
          as: 'stos', // Include associated STOs
        },
      ],
    });

    if (!program) {
      return res.status(404).json({ msg: 'Program not found.' });
    }

    res.json(program);
  } catch (err) {
    console.error('Error fetching program by ID:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/programs
 * @desc    Create a new program
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, status, description } = req.body;

    // Basic validation
    if (!name || !status) {
      return res.status(400).json({ msg: 'Please provide a name and status for the program.' });
    }

    // Validate status
    const validStatuses = ['running', 'pending', 'done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` });
    }

    // Create the program
    const newProgram = await db.Program.create({
      name,
      status,
      description: description || null, // Default to null if no description is provided
    });

    res.status(201).json(newProgram);
  } catch (err) {
    console.error('Error creating program:', err.message);

    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map((e) => e.message);
      return res.status(400).json({ msg: 'Validation error', errors: messages });
    }

    res.status(500).send('Server Error');
  }
});

module.exports = router;