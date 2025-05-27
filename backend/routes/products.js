const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET /api/products - Отримати всі товари
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/recommended - Отримати рекомендовані товари
router.get('/recommended', async (req, res) => {
  try {
    const products = await Product.find().limit(6);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id - Отримати товар за ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Товар не знайдено' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/category/:category - Отримати товари за категорією
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category })
      .populate('type')
      .populate('flavors')
      .sort('name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products - Створити новий товар (тільки адмін)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/products/:id - Оновити товар (тільки адмін)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Товар не знайдено' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/products/:id - Видалити товар (тільки адмін)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Товар не знайдено' });
    }
    res.json({ message: 'Товар видалено' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 
