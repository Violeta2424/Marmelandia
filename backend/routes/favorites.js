const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const auth = require('../middleware/auth');

// GET /api/favorites - Отримати улюблені товари
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate('product');
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/favorites/add - Додати товар до улюблених
router.post('/add', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const favorite = new Favorite({
      user: req.user._id,
      product: productId
    });
    
    await favorite.save();
    await favorite.populate('product');
    
    res.status(201).json(favorite);
  } catch (error) {
    // Якщо товар вже в улюблених (порушення унікального індексу)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Товар вже в улюблених' });
    }
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/favorites/remove - Видалити товар з улюблених
router.delete('/remove', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const result = await Favorite.findOneAndDelete({
      user: req.user._id,
      product: productId
    });
    
    if (!result) {
      return res.status(404).json({ message: 'Товар не знайдено в улюблених' });
    }
    
    res.json({ message: 'Товар видалено з улюблених' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 