const express = require('express');
const router = express.Router();
const { Trail, STO, Session } = require('../sequelize/models');
const { Op } = require('sequelize');

// Get all trails
router.get('/', async (req, res) => {
  try {
    const trails = await Trail.findAll({
      include: [
        { model: STO, as: 'sto' },
        { model: Session, as: 'session' }
      ]
    });
    res.json(trails);
  } catch (error) {
    console.error('Error fetching trails:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get trail by ID
router.get('/:id', async (req, res) => {
  try {
    const trail = await Trail.findByPk(req.params.id, {
      include: [
        { model: STO, as: 'sto' },
        { model: Session, as: 'session' }
      ]
    });
    
    if (!trail) {
      return res.status(404).json({ error: 'Trail not found' });
    }
    
    res.json(trail);
  } catch (error) {
    console.error('Error fetching trail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new trail
router.post('/', async (req, res) => {
  try {
    const { stoId, sessionId, response } = req.body;
    
    // Validate required fields
    if (!stoId || !sessionId || !response) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if STO and Session exist
    const [sto, session] = await Promise.all([
      STO.findByPk(stoId),
      Session.findByPk(sessionId)
    ]);
    
    if (!sto || !session) {
      return res.status(404).json({ error: 'STO or Session not found' });
    }
    
    // Check if trail already exists for this STO and Session
    const existingTrail = await Trail.findOne({
      where: {
        stoId,
        sessionId
      }
    });
    
    if (existingTrail) {
      return res.status(409).json({ error: 'Trail already exists for this STO and Session' });
    }
    
    const trail = await Trail.create({
      stoId,
      sessionId,
      response
    });
    
    res.status(201).json(trail);
  } catch (error) {
    console.error('Error creating trail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a trail
router.put('/:id', async (req, res) => {
  try {
    const { response } = req.body;
    
    if (!response) {
      return res.status(400).json({ error: 'Response is required' });
    }
    
    const [updated] = await Trail.update(
      { response },
      { where: { id: req.params.id } }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Trail not found' });
    }
    
    const updatedTrail = await Trail.findByPk(req.params.id);
    res.json(updatedTrail);
  } catch (error) {
    console.error('Error updating trail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a trail
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Trail.destroy({
      where: { id: req.params.id }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Trail not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting trail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
