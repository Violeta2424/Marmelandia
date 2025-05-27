const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all feedback (admin only)
router.get('/', [auth, admin], async (req, res) => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const feedback = await Feedback.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Feedback.countDocuments(query);

    res.json({
      feedback,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Get user's feedback
router.get('/my-feedback', auth, async (req, res) => {
  try {
    const feedback = await Feedback.find({ user: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Submit new feedback
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, type, rating } = req.body;

    const feedback = new Feedback({
      name,
      email,
      subject,
      message,
      type: type || 'contact',
      rating,
      user: req.user ? req.user.userId : null
    });

    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Update feedback status (admin only)
router.put('/:id/status', [auth, admin], async (req, res) => {
  try {
    const { status } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!feedback) {
      return res.status(404).json({ message: 'Відгук не знайдено' });
    }

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Delete feedback (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Відгук не знайдено' });
    }
    res.json({ message: 'Відгук успішно видалено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router; 