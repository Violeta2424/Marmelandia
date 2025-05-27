import { API_URL, getAuthHeaders } from './config';

export const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка створення замовлення');
  }

  return data;
};

export const getMyOrders = async () => {
  const response = await fetch(`${API_URL}/orders/my-orders`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка отримання замовлень');
  }

  return data;
};

export const getOrder = async (id) => {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка отримання замовлення');
  }

  return data;
};

export const cancelOrder = async (id) => {
  const response = await fetch(`${API_URL}/orders/${id}/cancel`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка скасування замовлення');
  }

  return data;
};

// Admin functions
export const getAllOrders = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/orders?${queryParams}`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка отримання замовлень');
  }

  return data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/orders/${id}/status`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка оновлення статусу замовлення');
  }

  return data;
}; 