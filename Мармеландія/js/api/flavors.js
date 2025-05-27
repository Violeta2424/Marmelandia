import { API_URL, getAuthHeaders } from './config.js';

// Отримання всіх смаків
export async function getFlavors() {
    try {
        const response = await fetch(`${API_URL}/flavors`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Помилка отримання смаків');
        }

        return await response.json();
    } catch (error) {
        console.error('Помилка при отриманні смаків:', error);
        throw error;
    }
}

// Отримати алергенні смаки
export const getAllergenicFlavors = async () => {
  try {
    const response = await fetch(`${API_URL}/flavors/allergenic`);
    if (!response.ok) throw new Error('Помилка завантаження алергенних смаків');
    return await response.json();
  } catch (error) {
    console.error('Помилка при отриманні алергенних смаків:', error);
    throw error;
  }
};

// Отримати смак за ID
export const getFlavorById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/flavors/${id}`);
    if (!response.ok) throw new Error('Смак не знайдено');
    return await response.json();
  } catch (error) {
    console.error('Помилка при отриманні смаку:', error);
    throw error;
  }
}; 