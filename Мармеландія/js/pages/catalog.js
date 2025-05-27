import { getProducts, getProduct } from '../api/products';
import { addToCart, getCartItemsCount } from '../utils/cart';
import { addToFavorites, removeFromFavorites } from '../api/favorites';

document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('productsContainer');
  const categoryFilter = document.getElementById('categoryFilter');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const paginationContainer = document.getElementById('pagination');
  const cartCount = document.getElementById('cartCount');

  let currentPage = 1;
  let totalPages = 1;

  const updateCartCounter = () => {
    const count = getCartItemsCount();
    if (cartCount) {
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? 'block' : 'none';
    }
  };

  const createProductCard = (product) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
      <h3 class="product-name">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <p class="product-price">${product.price} грн</p>
      <div class="product-actions">
        <button class="add-to-cart" data-id="${product._id}">
          Додати в кошик
        </button>
        <button class="toggle-favorite ${product.isFavorite ? 'active' : ''}" data-id="${product._id}">
          ❤
        </button>
      </div>
    `;

    const addToCartBtn = card.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', async () => {
      try {
        addToCart(product);
        updateCartCounter();
        addToCartBtn.textContent = 'Додано ✓';
        setTimeout(() => {
          addToCartBtn.textContent = 'Додати в кошик';
        }, 2000);
      } catch (error) {
        console.error('Помилка додавання в кошик:', error);
      }
    });

    const favoriteBtn = card.querySelector('.toggle-favorite');
    favoriteBtn.addEventListener('click', async () => {
      try {
        if (favoriteBtn.classList.contains('active')) {
          await removeFromFavorites(product._id);
          favoriteBtn.classList.remove('active');
        } else {
          await addToFavorites(product._id);
          favoriteBtn.classList.add('active');
        }
      } catch (error) {
        console.error('Помилка роботи з обраним:', error);
      }
    });

    return card;
  };

  const loadProducts = async () => {
    try {
      const params = {
        page: currentPage,
        category: categoryFilter.value,
        search: searchInput.value,
        sort: sortSelect.value
      };

      const { products, totalPages: total } = await getProducts(params);
      totalPages = total;

      productsContainer.innerHTML = '';
      products.forEach(product => {
        productsContainer.appendChild(createProductCard(product));
      });

      updatePagination();
    } catch (error) {
      console.error('Помилка завантаження товарів:', error);
      productsContainer.innerHTML = '<p class="error">Помилка завантаження товарів</p>';
    }
  };

  const updatePagination = () => {
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.className = `pagination-button ${currentPage === i ? 'active' : ''}`;
      button.addEventListener('click', () => {
        currentPage = i;
        loadProducts();
      });
      paginationContainer.appendChild(button);
    }
  };

  // Event listeners
  categoryFilter?.addEventListener('change', () => {
    currentPage = 1;
    loadProducts();
  });

  searchInput?.addEventListener('input', debounce(() => {
    currentPage = 1;
    loadProducts();
  }, 500));

  sortSelect?.addEventListener('change', () => {
    currentPage = 1;
    loadProducts();
  });

  // Initial load
  loadProducts();
  updateCartCounter();
});

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
} 