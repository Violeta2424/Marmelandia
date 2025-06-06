const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ заборонено. Потрібні права адміністратора.' });
    }
    
    next();
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
}; 