const express = require('express');
const router = express.Router();
const db = require('../sequelize/models'); // Adjust path if your models are elsewhere relative to this file

/**
 * @route   POST /api/therapists
 * @desc    Add a new therapist
 * @access  Public // Or protected, depending on your auth setup
 */
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({ msg: 'Please provide a name for the therapist.' });
    }

    // Check if therapist already exists (optional)
    const existingTherapist = await db.Therapist.findOne({ where: { name } });
    if (existingTherapist) {
      return res.status(400).json({ msg: 'A therapist with this name already exists.' });
    }

    const newTherapist = await db.Therapist.create({
      name
    });

    res.status(201).json(newTherapist);
  } catch (err) {
    console.error('Error adding therapist:', err.message);
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map(e => e.message);
      return res.status(400).json({ msg: 'Validation error', errors: messages });
    }
    res.status(500).send('Server Error');
  }
});

// You can add other therapist-related routes here (GET, PUT, DELETE)
// For example:
// router.get('/', async (req, res) => { ... }); // Get all therapists
// router.get('/:id', async (req, res) => { ... }); // Get therapist by ID

module.exports = router;