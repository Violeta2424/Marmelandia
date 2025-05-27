import { API_URL, getAuthHeaders } from './config';

export const submitFeedback = async (feedbackData) => {
  const response = await fetch(`${API_URL}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(feedbackData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка надсилання відгуку');
  }

  return data;
};

export const getMyFeedback = async () => {
  const response = await fetch(`${API_URL}/feedback/my-feedback`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка отримання відгуків');
  }

  return data;
};

// Admin functions
export const getAllFeedback = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/feedback?${queryParams}`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка отримання відгуків');
  }

  return data;
};

export const updateFeedbackStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/feedback/${id}/status`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка оновлення статусу відгуку');
  }

  return data;
};

export const deleteFeedback = async (id) => {
  const response = await fetch(`${API_URL}/feedback/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка видалення відгуку');
  }

  return data;
}; 