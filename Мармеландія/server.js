const express = require('express');
const history = require('connect-history-api-fallback');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5173;

// Секретний ключ для JWT
const JWT_SECRET = 'your-secret-key';

// Тимчасове зберігання користувачів (в реальному проекті це має бути база даних)
const users = [];

// Налаштування CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5000'],
  credentials: true
}));

// Парсинг JSON
app.use(express.json());

// Middleware для обробки SPA маршрутизації
app.use(history());

// Статичні файли
app.use(express.static(path.join(__dirname)));

// API маршрути для авторизації
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Знаходимо користувача (в реальному проекті це був би пошук в базі даних)
  const user = users.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    return res.status(400).json({ message: 'Невірна електронна пошта або пароль' });
  }
  
  // Генеруємо JWT токен
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  // Перевіряємо чи існує користувач
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Користувач з такою поштою вже існує' });
  }
  
  // Створюємо нового користувача
  const user = {
    id: users.length + 1,
    email,
    password,
    name
  };
  
  users.push(user);
  
  // Генеруємо JWT токен
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
});

// Базовий роут для перевірки роботи API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Маршрути для HTML файлів
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/pages/:page', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, 'pages', page));
});

app.get('/categories/:category', (req, res) => {
  const category = req.params.category;
  res.sendFile(path.join(__dirname, 'categories', category));
});

// Обробка 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Обробка помилок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Щось пішло не так!',
    message: err.message 
  });
});

app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
}); 