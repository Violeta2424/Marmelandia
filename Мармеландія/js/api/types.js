import { API_URL, getAuthHeaders } from './config.js';

// Отримання всіх типів продуктів
export async function getTypes() {
    try {
        const response = await fetch(`${API_URL}/types`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Помилка отримання типів продуктів');
        }

        return await response.json();
    } catch (error) {
        console.error('Помилка при отриманні типів продуктів:', error);
        throw error;
    }
}

// Отримати тип за ID
export const getTypeById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/types/${id}`);
    if (!response.ok) throw new Error('Тип не знайдено');
    return await response.json();
  } catch (error) {
    console.error('Помилка при отриманні типу:', error);
    throw error;
  }
}; 