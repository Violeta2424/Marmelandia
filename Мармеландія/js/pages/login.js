import { login, register } from '../api/auth';
import { validateEmail, validatePassword, validateName, validatePhone, getValidationError } from '../utils/validation';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');

  const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
  };

  const showSuccess = (message) => {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
  };

  const validateLoginForm = (email, password) => {
    if (!validateEmail(email)) {
      showError('Невірний формат електронної пошти');
      return false;
    }
    if (!validatePassword(password)) {
      showError('Пароль має бути не менше 6 символів');
      return false;
    }
    return true;
  };

  const validateRegisterForm = (name, email, password, phone) => {
    if (!validateName(name)) {
      showError('Ім\'я має бути не менше 2 символів');
      return false;
    }
    if (!validateEmail(email)) {
      showError('Невірний формат електронної пошти');
      return false;
    }
    if (!validatePassword(password)) {
      showError('Пароль має бути не менше 6 символів');
      return false;
    }
    if (!validatePhone(phone)) {
      showError('Невірний формат номера телефону');
      return false;
    }
    return true;
  };

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!validateLoginForm(email, password)) {
      return;
    }

    try {
      const data = await login(email, password);
      showSuccess('Вхід успішний!');
      window.location.href = '/account.html';
    } catch (error) {
      showError(error.message);
    }
  });

  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const phone = e.target.phone.value;

    if (!validateRegisterForm(name, email, password, phone)) {
      return;
    }

    try {
      const data = await register({ name, email, password, phone });
      showSuccess('Реєстрація успішна!');
      window.location.href = '/account.html';
    } catch (error) {
      showError(error.message);
    }
  });
}); 