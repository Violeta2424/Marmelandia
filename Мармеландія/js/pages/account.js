import { getCurrentUser, updateProfile, logout } from '../api/auth';
import { getMyOrders, cancelOrder } from '../api/orders';
import { getFavorites, removeFromFavorites } from '../api/favorites';
import { getMyFeedback } from '../api/feedback';
import { validateName, validatePhone, validateEmail } from '../utils/validation';

document.addEventListener('DOMContentLoaded', async () => {
  const profileSection = document.getElementById('profileSection');
  const ordersSection = document.getElementById('ordersSection');
  const favoritesSection = document.getElementById('favoritesSection');
  const feedbackSection = document.getElementById('feedbackSection');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');

  let currentUser = null;

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

  const loadUserProfile = async () => {
    try {
      currentUser = await getCurrentUser();
      displayProfile(currentUser);
    } catch (error) {
      console.error('Помилка завантаження профілю:', error);
      window.location.href = '/login.html';
    }
  };

  const displayProfile = (user) => {
    if (!profileSection) return;

    profileSection.innerHTML = `
      <h2>Профіль</h2>
      <form id="profileForm">
        <div class="form-group">
          <label for="name">Ім'я</label>
          <input type="text" id="name" name="name" value="${user.name}" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" value="${user.email}" readonly>
        </div>
        <div class="form-group">
          <label for="phone">Телефон</label>
          <input type="tel" id="phone" name="phone" value="${user.phone || ''}" required>
        </div>
        <button type="submit">Зберегти зміни</button>
      </form>
      <button id="logoutBtn" class="logout-button">Вийти</button>
    `;

    const profileForm = document.getElementById('profileForm');
    const logoutBtn = document.getElementById('logoutBtn');

    profileForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = e.target.name.value;
      const phone = e.target.phone.value;

      if (!validateName(name)) {
        showError('Ім\'я має бути не менше 2 символів');
        return;
      }
      if (!validatePhone(phone)) {
        showError('Невірний формат номера телефону');
        return;
      }

      try {
        const updatedUser = await updateProfile({ name, phone });
        currentUser = updatedUser;
        showSuccess('Профіль оновлено успішно');
      } catch (error) {
        showError(error.message);
      }
    });

    logoutBtn?.addEventListener('click', () => {
      logout();
      window.location.href = '/login.html';
    });
  };

  const loadOrders = async () => {
    if (!ordersSection) return;

    try {
      const orders = await getMyOrders();
      displayOrders(orders);
    } catch (error) {
      console.error('Помилка завантаження замовлень:', error);
      ordersSection.innerHTML = '<p class="error">Помилка завантаження замовлень</p>';
    }
  };

  const displayOrders = (orders) => {
    if (!ordersSection) return;

    if (orders.length === 0) {
      ordersSection.innerHTML = '<p>У вас ще немає замовлень</p>';
      return;
    }

    ordersSection.innerHTML = `
      <h2>Мої замовлення</h2>
      <div class="orders-list">
        ${orders.map(order => `
          <div class="order-card">
            <div class="order-header">
              <span>Замовлення #${order._id}</span>
              <span class="order-status ${order.status}">${order.status}</span>
            </div>
            <div class="order-items">
              ${order.items.map(item => `
                <div class="order-item">
                  <img src="${item.product.imageUrl}" alt="${item.product.name}">
                  <span>${item.product.name}</span>
                  <span>${item.quantity} шт.</span>
                  <span>${item.price} грн</span>
                </div>
              `).join('')}
            </div>
            <div class="order-footer">
              <span>Сума: ${order.totalAmount} грн</span>
              ${order.status === 'pending' ? `
                <button class="cancel-order" data-id="${order._id}">
                  Скасувати
                </button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Add event listeners for cancel buttons
    const cancelButtons = ordersSection.querySelectorAll('.cancel-order');
    cancelButtons.forEach(button => {
      button.addEventListener('click', async () => {
        try {
          await cancelOrder(button.dataset.id);
          loadOrders(); // Reload orders after cancellation
          showSuccess('Замовлення скасовано');
        } catch (error) {
          showError(error.message);
        }
      });
    });
  };

  const loadFavorites = async () => {
    if (!favoritesSection) return;

    try {
      const favorites = await getFavorites();
      displayFavorites(favorites);
    } catch (error) {
      console.error('Помилка завантаження обраного:', error);
      favoritesSection.innerHTML = '<p class="error">Помилка завантаження обраного</p>';
    }
  };

  const displayFavorites = (favorites) => {
    if (!favoritesSection) return;

    if (favorites.length === 0) {
      favoritesSection.innerHTML = '<p>У вас ще немає обраних товарів</p>';
      return;
    }

    favoritesSection.innerHTML = `
      <h2>Обране</h2>
      <div class="favorites-list">
        ${favorites.map(product => `
          <div class="favorite-card">
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price} грн</p>
            <button class="remove-favorite" data-id="${product._id}">
              Видалити з обраного
            </button>
          </div>
        `).join('')}
      </div>
    `;

    // Add event listeners for remove buttons
    const removeButtons = favoritesSection.querySelectorAll('.remove-favorite');
    removeButtons.forEach(button => {
      button.addEventListener('click', async () => {
        try {
          await removeFromFavorites(button.dataset.id);
          loadFavorites(); // Reload favorites after removal
        } catch (error) {
          showError(error.message);
        }
      });
    });
  };

  const loadFeedback = async () => {
    if (!feedbackSection) return;

    try {
      const feedback = await getMyFeedback();
      displayFeedback(feedback);
    } catch (error) {
      console.error('Помилка завантаження відгуків:', error);
      feedbackSection.innerHTML = '<p class="error">Помилка завантаження відгуків</p>';
    }
  };

  const displayFeedback = (feedback) => {
    if (!feedbackSection) return;

    if (feedback.length === 0) {
      feedbackSection.innerHTML = '<p>У вас ще немає відгуків</p>';
      return;
    }

    feedbackSection.innerHTML = `
      <h2>Мої відгуки</h2>
      <div class="feedback-list">
        ${feedback.map(item => `
          <div class="feedback-card">
            <div class="feedback-header">
              <span>${item.subject}</span>
              <span class="feedback-status ${item.status}">${item.status}</span>
            </div>
            <p>${item.message}</p>
            ${item.rating ? `
              <div class="rating">
                ${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}
              </div>
            ` : ''}
            <div class="feedback-date">
              ${new Date(item.createdAt).toLocaleDateString()}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  };

  // Initialize page
  await loadUserProfile();
  await loadOrders();
  await loadFavorites();
  await loadFeedback();
}); 