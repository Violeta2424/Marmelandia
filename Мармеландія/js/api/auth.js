import { API_URL, setAuthToken, getAuthHeaders } from './config';

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка входу');
  }

  setAuthToken(data.token);
  return data;
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка реєстрації');
  }

  setAuthToken(data.token);
  return data;
};

export const getCurrentUser = async () => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка отримання даних користувача');
  }

  return data;
};

export const updateProfile = async (profileData) => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Помилка оновлення профілю');
  }

  return data;
};

export const logout = () => {
  setAuthToken(null);
}; 