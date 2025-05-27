const express = require('express');
const router = express.Router();
const Flavor = require('../models/Flavor');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET /api/flavors - Отримати всі смаки
router.get('/', async (req, res) => {
  try {
    const flavors = await Flavor.find();
    res.json(flavors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/flavors/:id - Отримати смак за ID
router.get('/:id', async (req, res) => {
  try {
    const flavor = await Flavor.findById(req.params.id);
    if (!flavor) {
      return res.status(404).json({ message: 'Смак не знайдено' });
    }
    res.json(flavor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/flavors/allergenic - Отримати алергенні смаки
router.get('/allergenic', async (req, res) => {
  try {
    const flavors = await Flavor.find({ isActive: true, isAllergenic: true });
    res.json(flavors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/flavors - Створити новий смак (тільки адмін)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const flavor = new Flavor(req.body);
    await flavor.save();
    res.status(201).json(flavor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/flavors/:id - Оновити смак (тільки адмін)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const flavor = await Flavor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!flavor) {
      return res.status(404).json({ message: 'Смак не знайдено' });
    }
    res.json(flavor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/flavors/:id - Видалити смак (тільки адмін)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const flavor = await Flavor.findByIdAndDelete(req.params.id);
    if (!flavor) {
      return res.status(404).json({ message: 'Смак не знайдено' });
    }
    res.json({ message: 'Смак видалено' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 