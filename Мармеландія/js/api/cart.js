import { API_URL, getAuthHeaders } from './config.js';

// Отримати кошик користувача
export const getCart = async () => {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Помилка завантаження кошика');
    return await response.json();
  } catch (error) {
    console.error('Помилка при отриманні кошика:', error);
    throw error;
  }
};

// Додати товар до кошика
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await fetch(`${API_URL}/cart/add`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity })
    });
    if (!response.ok) throw new Error('Помилка додавання товару');
    return await response.json();
  } catch (error) {
    console.error('Помилка при додаванні товару:', error);
    throw error;
  }
};

// Оновити кількість товару
export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await fetch(`${API_URL}/cart/update`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity })
    });
    if (!response.ok) throw new Error('Помилка оновлення кількості');
    return await response.json();
  } catch (error) {
    console.error('Помилка при оновленні кількості:', error);
    throw error;
  }
};

// Видалити товар з кошика
export const removeFromCart = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/cart/remove`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    });
    if (!response.ok) throw new Error('Помилка видалення товару');
    return await response.json();
  } catch (error) {
    console.error('Помилка при видаленні товару:', error);
    throw error;
  }
};

// Очистити кошик
export const clearCart = async () => {
  try {
    const response = await fetch(`${API_URL}/cart/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Помилка очищення кошика');
    return await response.json();
  } catch (error) {
    console.error('Помилка при очищенні кошика:', error);
    throw error;
  }
}; 