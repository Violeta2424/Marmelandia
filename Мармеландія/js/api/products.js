import { API_URL, getAuthHeaders } from './config.js';

// Отримання всіх продуктів з можливістю фільтрації
export async function getProducts(filters = {}) {
    try {
        // Формуємо query параметри для фільтрації
        const queryParams = new URLSearchParams();
        
        if (filters.typeId) {
            // Якщо передано масив типів, додаємо кожен
            if (Array.isArray(filters.typeId)) {
                filters.typeId.forEach(type => {
                    queryParams.append('typeId', type);
                });
            } else {
                queryParams.append('typeId', filters.typeId);
            }
        }
        
        if (filters.flavorId) {
            // Якщо передано масив смаків, додаємо кожен
            if (Array.isArray(filters.flavorId)) {
                filters.flavorId.forEach(flavor => {
                    queryParams.append('flavorId', flavor);
                });
            } else {
                queryParams.append('flavorId', filters.flavorId);
            }
        }
        
        if (filters.maxPrice) {
            queryParams.append('maxPrice', filters.maxPrice);
        }
        
        if (filters.search) {
            queryParams.append('search', filters.search);
        }

        const url = `${API_URL}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Помилка отримання продуктів');
        }

        const products = await response.json();
        
        // Фільтруємо продукти на стороні клієнта, якщо сервер не підтримує фільтрацію
        return products.filter(product => {
            // Перевірка за типом
            if (filters.typeId && Array.isArray(filters.typeId)) {
                if (!filters.typeId.includes(product.typeId)) return false;
            } else if (filters.typeId && product.typeId !== filters.typeId) {
                return false;
            }
            
            // Перевірка за смаком
            if (filters.flavorId && Array.isArray(filters.flavorId)) {
                if (!product.flavorId.some(flavor => filters.flavorId.includes(flavor))) return false;
            } else if (filters.flavorId && !product.flavorId.includes(filters.flavorId)) {
                return false;
            }
            
            // Перевірка за ціною
            if (filters.maxPrice && product.price > filters.maxPrice) return false;
            
            // Перевірка за пошуком
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const nameMatch = product.name.toLowerCase().includes(searchLower);
                const descMatch = product.description.toLowerCase().includes(searchLower);
                if (!nameMatch && !descMatch) return false;
            }
            
            return true;
        });
    } catch (error) {
        console.error('Помилка при отриманні продуктів:', error);
        throw error;
    }
}

// Отримання рекомендованих продуктів
export async function getRecommendedProducts() {
    try {
        const response = await fetch(`${API_URL}/products/recommended`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Помилка отримання рекомендованих продуктів');
        }

        return await response.json();
    } catch (error) {
        console.error('Помилка при отриманні рекомендованих продуктів:', error);
        throw error;
    }
}

// Отримати товар за ID
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Товар не знайдено');
    return await response.json();
  } catch (error) {
    console.error('Помилка при отриманні товару:', error);
    throw error;
  }
};

// Отримати товари за категорією
export const getProductsByCategory = async (category) => {
  try {
    const response = await fetch(`${API_URL}/products/category/${category}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Помилка завантаження товарів категорії');
    return await response.json();
  } catch (error) {
    console.error('Помилка при отриманні товарів категорії:', error);
    throw error;
  }
};

// Admin functions
export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка створення товару');
  }

  return data;
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка оновлення товару');
  }

  return data;
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка видалення товару');
  }

  return data;
}; 