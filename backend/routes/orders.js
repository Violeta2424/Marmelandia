const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all orders (admin only)
router.get('/', [auth, admin], async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product', 'name price imageUrl')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name price imageUrl');

    if (!order) {
      return res.status(404).json({ message: 'Замовлення не знайдено' });
    }

    // Check if user is admin or order owner
    if (order.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ заборонено' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      contactPhone,
      contactEmail,
      notes
    } = req.body;

    // Calculate total amount and verify product availability
    let totalAmount = 0;
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: 'Товар не знайдено' });
      }
      if (!product.inStock) {
        return res.status(400).json({ message: `Товар ${product.name} відсутній на складі` });
      }
      item.price = product.price;
      totalAmount += product.price * item.quantity;
    }

    const order = new Order({
      user: req.user.userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      contactPhone,
      contactEmail,
      notes
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Update order status (admin only)
router.put('/:id/status', [auth, admin], async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Замовлення не знайдено' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Cancel order
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Замовлення не знайдено' });
    }

    // Check if user is order owner
    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Доступ заборонено' });
    }

    // Check if order can be cancelled
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Замовлення не може бути скасовано' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router; 