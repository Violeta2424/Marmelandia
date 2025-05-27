import { API_URL, getAuthHeaders } from './config.js';

// Отримати улюблені товари користувача
export const getFavorites = async () => {
  try {
    const response = await fetch(`${API_URL}/favorites`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Помилка завантаження улюблених товарів');
    return await response.json();
  } catch (error) {
    console.error('Помилка при отриманні улюблених товарів:', error);
    throw error;
  }
};

// Додати товар до улюблених
export const addToFavorites = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/favorites/add`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    });
    if (!response.ok) throw new Error('Помилка додавання до улюблених');
    return await response.json();
  } catch (error) {
    console.error('Помилка при додаванні до улюблених:', error);
    throw error;
  }
};

// Видалити товар з улюблених
export const removeFromFavorites = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/favorites/remove`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    });
    if (!response.ok) throw new Error('Помилка видалення з улюблених');
    return await response.json();
  } catch (error) {
    console.error('Помилка при видаленні з улюблених:', error);
    throw error;
  }
}; 