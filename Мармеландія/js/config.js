// API URL
export const API_URL = 'http://localhost:5000/api';

// Функція для отримання заголовків авторизації
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}; 