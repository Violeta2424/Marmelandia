const express = require('express');
const router = express.Router();
const Type = require('../models/Type');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET /api/types - Отримати всі типи
router.get('/', async (req, res) => {
  try {
    const types = await Type.find();
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/types/:id - Отримати тип за ID
router.get('/:id', async (req, res) => {
  try {
    const type = await Type.findById(req.params.id);
    if (!type) {
      return res.status(404).json({ message: 'Тип не знайдено' });
    }
    res.json(type);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/types - Створити новий тип (тільки адмін)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const type = new Type(req.body);
    await type.save();
    res.status(201).json(type);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/types/:id - Оновити тип (тільки адмін)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const type = await Type.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!type) {
      return res.status(404).json({ message: 'Тип не знайдено' });
    }
    res.json(type);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/types/:id - Видалити тип (тільки адмін)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const type = await Type.findByIdAndDelete(req.params.id);
    if (!type) {
      return res.status(404).json({ message: 'Тип не знайдено' });
    }
    res.json({ message: 'Тип видалено' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 