// === Основний JavaScript для сайту ===
import { API_URL, getAuthHeaders } from './api/config.js';
import { getProducts, getRecommendedProducts } from './api/products.js';
import { getTypes } from './api/types.js';
import { getFlavors } from './api/flavors.js';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from './api/cart.js';
import { getFavorites, addToFavorites, removeFromFavorites } from './api/favorites.js';
import { getMyOrders } from './api/orders.js';

// Глобальні змінні
let cart = { items: [] };
let originalProducts = []; // Зберігаємо оригінальний список товарів
let types = []; // Зберігаємо список типів
let flavors = []; // Зберігаємо список смаків

// Перевірка наявності SweetAlert2
let sweetAlertLoaded = false;
let sweetAlertInitialized = false;
let initializationAttempts = 0;
const MAX_INITIALIZATION_ATTEMPTS = 3;
const INITIALIZATION_TIMEOUT = 10000; // 10 seconds

// Функція для ініціалізації SweetAlert2
async function initializeSweetAlert() {
  if (sweetAlertInitialized) {
    return Promise.resolve(true);
  }

  if (initializationAttempts >= MAX_INITIALIZATION_ATTEMPTS) {
    console.error('Досягнуто максимальну кількість спроб ініціалізації SweetAlert2');
    return Promise.resolve(false);
  }

  initializationAttempts++;

  return new Promise((resolve) => {
    const checkSwal = setInterval(() => {
      if (typeof Swal !== 'undefined') {
        sweetAlertLoaded = true;
        sweetAlertInitialized = true;
        clearInterval(checkSwal);
        console.log('SweetAlert2 успішно ініціалізовано');
        resolve(true);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkSwal);
      if (!sweetAlertInitialized) {
        console.warn(`Спроба ${initializationAttempts}/${MAX_INITIALIZATION_ATTEMPTS}: SweetAlert2 не завантажився протягом ${INITIALIZATION_TIMEOUT/1000} секунд`);
        // Спробуємо перезавантажити скрипт
        if (initializationAttempts < MAX_INITIALIZATION_ATTEMPTS) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
          script.async = true;
          script.onload = () => {
            console.log('SweetAlert2 перезавантажено');
            initializeSweetAlert().then(resolve);
          };
          document.head.appendChild(script);
        } else {
          resolve(false);
        }
      }
    }, INITIALIZATION_TIMEOUT);
  });
}

$(document).ready(async function () {
  // ===== 1. Бургер-меню =====
  $('.burger').click(function () {
    $(this).toggleClass('open');
    $('.nav-links').toggleClass('active');
  });

  // ===== 2. Анімації при скролі =====
  function animateOnScroll() {
    $('.fade-in, .slide-in-right, .zoom-in').each(function () {
      const elemTop = $(this).offset().top;
      const winBottom = $(window).scrollTop() + $(window).height();
      if (elemTop < winBottom - 50) {
        $(this).addClass('visible');
      }
    });
  }
  animateOnScroll();
  $(window).on('scroll', animateOnScroll);

  // ===== 3. Плавний скрол до футера =====
  $('.nav-links a[href="#contacts"]').on('click', function (e) {
    e.preventDefault();
    const $target = $('#contacts');
    $('html, body').animate({ scrollTop: $target.offset().top - 40 }, 600, function () {
      $target.addClass('highlight');
      setTimeout(() => $target.removeClass('highlight'), 1200);
    });
  });

  // ===== 4. Анімовані ведмедики =====
  if ($('.gummybears-bg').length) {
    const colors = ['#ff80c0', '#ffd700', '#7ee787', '#6ecbff', '#ffb3de'];
    const bearSVG = color => `<svg viewBox='0 0 48 48'><g><ellipse cx='24' cy='38' rx='13' ry='8' fill='${color}'/><ellipse cx='13' cy='10' rx='5' ry='6' fill='${color}'/><ellipse cx='35' cy='10' rx='5' ry='6' fill='${color}'/><ellipse cx='24' cy='24' rx='15' ry='18' fill='${color}'/><ellipse cx='18' cy='20' rx='2' ry='3' fill='#fff'/><ellipse cx='30' cy='20' rx='2' ry='3' fill='#fff'/><ellipse cx='24' cy='30' rx='4' ry='2' fill='#fff'/></g></svg>`;
    for (let i = 0; i < 10; i++) {
      let bear = $('<div class="gummybear"></div>').css({
        left: `${Math.random() * 95}vw`,
        top: `${Math.random() * 30 + 70}vh`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${Math.random() * 8 + 10}s`
      }).html(bearSVG(colors[Math.floor(Math.random() * colors.length)]));
      $('.gummybears-bg').append(bear);
    }
  }

  // ===== 5. Фільтри та сортування =====
  let originalProducts = []; // Зберігаємо оригінальний список товарів
  let types = []; // Зберігаємо список типів
  let flavors = []; // Зберігаємо список смаків

  // Завантаження типів та смаків
  async function loadFilters() {
    try {
      const [typesData, flavorsData] = await Promise.all([
        getTypes(),
        getFlavors()
      ]);
      
      // Додаємо фільтр типів
      const $typeFilter = $('<div class="filter-group"><h4>Тип солодощів</h4></div>');
      typesData.forEach(type => {
        $typeFilter.append(`
          <label class="filter-checkbox">
            <input type="checkbox" name="type" value="${type._id}">
            <span class="type-name">${type.name}</span>
          </label>
        `);
      });
      $('.filter-dropdown').prepend($typeFilter);

      // Додаємо фільтр смаків
      const $flavorFilter = $('#flavors-filter');
      if ($flavorFilter.length) {
        $flavorFilter.empty();
        $flavorFilter.append('<h4>Смаки</h4>');
        
        flavorsData.forEach(flavor => {
          $flavorFilter.append(`
            <label class="filter-checkbox">
              <input type="checkbox" name="flavor" value="${flavor._id}">
              <span class="flavor-name">${flavor.name}</span>
            </label>
          `);
        });
      }

      // Додаємо кнопку скидання фільтрів
      if ($('.filter-box').find('.reset-filters').length === 0) {
        $('.filter-box').append(`
          <button class="reset-filters">
            Скинути фільтри
          </button>
        `);
      }

      // Обробник для скидання фільтрів
      $('.reset-filters').on('click', function() {
        $('input[type="checkbox"]').prop('checked', false);
        $('#price-range').val(1000);
        $('#price-value').text('0-1000 грн');
        $('#search-input').val('');
        filterAndSortProducts();
      });

      // Додаємо обробники подій для фільтрів
      $('.filter-checkbox input').on('change', filterAndSortProducts);
    } catch (error) {
      console.error('Помилка завантаження фільтрів:', error);
    }
  }

  // Завантаження та відображення товарів
  async function loadProducts() {
    try {
      const products = await getProducts();
      originalProducts = products.map(product => ({
        element: createProductElement(product),
        name: product.name,
        price: product.price,
        description: product.description,
        typeId: product.typeId,
        flavorId: product.flavorId
      }));
      filterAndSortProducts();
    } catch (error) {
      console.error('Помилка завантаження товарів:', error);
      $('.catalog-items').html('<div class="error-message">Помилка завантаження товарів. Спробуйте оновити сторінку.</div>');
    }
  }

  // Завантаження та відображення рекомендованих товарів
  async function loadRecommendedProducts() {
    try {
      // Завантажуємо фільтри
      await loadFilters();
      
      const products = await getRecommendedProducts();
      originalProducts = products.map(product => ({
        element: createProductElement(product),
        name: product.name,
        price: product.price,
        description: product.description,
        typeId: product.typeId,
        flavorId: product.flavorId
      }));
      
      // Оновлюємо відображення
      filterAndSortProducts();
      
      // Додаємо обробники подій для фільтрів
      initializeFilters();
      
    } catch (error) {
      console.error('Помилка завантаження рекомендованих товарів:', error);
      $('.catalog-items').html('<div class="error-message">Помилка завантаження товарів. Спробуйте оновити сторінку.</div>');
    }
  }

  // Завантаження та відображення товарів за категорією
  async function loadCategoryProducts(categoryType) {
    try {
      console.log('Завантаження товарів для категорії:', categoryType);
      
      // Отримуємо продукти з API
      const products = await getProducts({ typeId: categoryType });
      console.log('Всі товари:', products);
      
      // Зберігаємо оригінальні продукти
      originalProducts = products.map(product => ({
        element: createProductElement(product),
        name: product.name,
        price: product.price,
        description: product.description,
        typeId: product.typeId,
        flavorId: product.flavorId
      }));
      
      // Оновлюємо відображення
      filterAndSortProducts();
      
      // Ініціалізуємо фільтр ціни
      initializePriceFilter();
      
    } catch (error) {
      console.error('Помилка завантаження товарів категорії:', error);
      $('.catalog-items').html('<div class="error-message">Помилка завантаження товарів. Спробуйте оновити сторінку.</div>');
    }
  }

  // Ініціалізація фільтру ціни для категорій
  function initializePriceFilter() {
    // Оновлення відображення ціни при зміні слайдера
    $('#price-range').on('input', function () {
      const value = $(this).val();
      $('#price-value').text(`0-${value} грн`);
      filterAndSortProducts();
    });

    // Показати/сховати фільтр при кліку на кнопку
    $('.filter-btn').off('click').on('click', function (e) {
      e.stopPropagation();
      const $dropdown = $(this).siblings('.filter-dropdown');
      $('.filter-dropdown').not($dropdown).removeClass('active');
      $dropdown.toggleClass('active');
    });

    // Закрити фільтр при кліку поза ним
    $(document).off('click.filters').on('click.filters', function (e) {
      if (!$(e.target).closest('.filter-box').length) {
        $('.filter-dropdown').removeClass('active');
      }
    });
  }

  // Створення HTML-елемента товару
  function createProductElement(product) {
    const $item = $('<div class="catalog-item"></div>');
    
    // Використовуємо відносний шлях для зображення
    const imageUrl = product.image || '/images/products/default.jpg';
    
    $item.html(`
      <img src="${imageUrl}" alt="${product.name}">
      <h3>${product.name}</h3>
      <div class="description">${product.description}</div>
      <div class="price">${product.price} грн</div>
      <div class="product-actions">
        <button class="add-to-cart">Додати в кошик</button>
        <button class="favorite-btn"><i class="fas fa-heart"></i></button>
      </div>
    `);
    
    $item.data('id', product._id);
    $item.data('price', product.price);
    $item.data('type', product.typeId);
    $item.data('flavors', Array.isArray(product.flavorId) ? product.flavorId.join(',') : '');
    
    return $item[0];
  }

  // Ініціалізація при завантаженні
  if ($('.catalog-items').length) {
    const pathname = window.location.pathname.toLowerCase(); // Перетворюємо шлях у нижній регістр
    console.log('Поточний шлях:', pathname);
    
    if (pathname.includes('catalog.html')) {
      loadFilters().then(() => {
        loadProducts();
        loadFavorites();
      });
    } else if (pathname.includes('toxic.html')) {
      console.log('Завантаження токсичних товарів');
      loadCategoryProducts('Toxic');
      loadFavorites();
    } else if (pathname.includes('sweet.html')) {
      loadCategoryProducts('Sweet');
      loadFavorites();
    } else if (pathname.includes('sour.html')) {
      loadCategoryProducts('Sour');
      loadFavorites();
    } else if (pathname.includes('chocolate.html')) {
      loadCategoryProducts('Chocolate');
      loadFavorites();
    } else if (pathname.includes('juvastiki.html')) {
      loadCategoryProducts('Juvastiki');
      loadFavorites();
    } else if (pathname.includes('sharp.html')) {
      loadCategoryProducts('Sharp');
      loadFavorites();
    } else if (pathname.includes('vegan.html')) {
      loadCategoryProducts('Vegan');
      loadFavorites();
    } else if (pathname.includes('marshmalloow.html')) {
      loadCategoryProducts('Marshmalloow');
      loadFavorites();
    } else if (pathname.includes('licorice.html')) {
      loadCategoryProducts('Licorice');
      loadFavorites();
    } else if (pathname.includes('marmalade.html')) {
      loadCategoryProducts('Marmalade');
      loadFavorites();
    } else {
      loadRecommendedProducts();
      loadFavorites();
    }
  }

  // Функція фільтрації та сортування
  async function filterAndSortProducts() {
    try {
    const maxPrice = parseInt($('#price-range').val()) || 1000;
      const pathname = window.location.pathname.toLowerCase();
      
      // Визначаємо, чи знаходимося ми на сторінці категорії
      const isCategory = pathname.includes('/categories/');
      
      let filteredProducts;
      if (isCategory) {
        // Для категорій фільтруємо тільки за ціною
        filteredProducts = originalProducts.filter(product => 
          (!maxPrice || product.price <= maxPrice)
        );
      } else {
        // Для основного каталогу використовуємо всі фільтри
        const searchText = $('#search-input').val()?.toLowerCase().trim() || '';
        const selectedTypes = $('input[name="type"]:checked').map(function() {
          return $(this).val();
        }).get();
        const selectedFlavors = $('input[name="flavor"]:checked').map(function() {
          return $(this).val();
        }).get();

        const filters = {
          search: searchText || undefined,
          maxPrice: maxPrice || undefined,
          typeId: selectedTypes.length > 0 ? selectedTypes : undefined,
          flavorId: selectedFlavors.length > 0 ? selectedFlavors : undefined
        };

        filteredProducts = await getProducts(filters);
      }

      // Сортуємо продукти
      const sortValue = $('#sort-select').val() || 'name-asc';
    filteredProducts.sort((a, b) => {
      switch(sortValue) {
        case 'name-asc':
            return (a.name || '').localeCompare((b.name || ''), 'uk');
        case 'name-desc':
            return (b.name || '').localeCompare((a.name || ''), 'uk');
        case 'price-asc':
            return (a.price || 0) - (b.price || 0);
        case 'price-desc':
            return (b.price || 0) - (a.price || 0);
        default:
          return 0;
      }
    });

    // Оновлюємо відображення
    const $items = $('.catalog-items');
      if (!$items.length) {
        console.warn('Елемент .catalog-items не знайдено при оновленні');
        return;
      }

    $items.empty();

    if (filteredProducts.length === 0) {
      $items.html('<div class="no-results" style="text-align:center;padding:20px;color:#666;">Товарів не знайдено</div>');
    } else {
      filteredProducts.forEach(product => {
          const $item = $(createProductElement(product));
          $items.append($item);
        });
      }
    } catch (error) {
      console.error('Помилка при фільтрації продуктів:', error);
      $('.catalog-items').html('<div class="error-message">Помилка завантаження товарів. Спробуйте оновити сторінку.</div>');
    }
  }

  // Ініціалізація фільтрів
  function initializeFilters() {
  // Оновлення відображення ціни при зміні слайдера
  $('#price-range').on('input', function () {
    const value = $(this).val();
    $('#price-value').text(`0-${value} грн`);
    filterAndSortProducts();
  });

    // Показати/сховати фільтр при кліку на кнопку
    $('.filter-btn').off('click').on('click', function (e) {
      e.stopPropagation();
      const $dropdown = $(this).siblings('.filter-dropdown');
      $('.filter-dropdown').not($dropdown).removeClass('active');
      $dropdown.toggleClass('active');
    });

    // Закрити фільтр при кліку поза ним
    $(document).off('click.filters').on('click.filters', function (e) {
      if (!$(e.target).closest('.filter-box').length) {
        $('.filter-dropdown').removeClass('active');
      }
    });

    // Обробники для пошуку та сортування
    $('#search-input').off('input').on('input', filterAndSortProducts);
    $('#sort-select').off('change').on('change', filterAndSortProducts);
  }

  // ===== 7. Табуляція =====
  $('.tab-btn').click(function () {
    $('.tab-btn').removeClass('active');
    $(this).addClass('active');
    const tabId = $(this).data('tab');
    $('.tab-content').removeClass('active');
    $(`#${tabId}`).addClass('active');
  });

  // ===== Popup-форма зворотнього зв'язку на головній =====
  $('#openContactForm').on('click', function() {
    $('#contactPopup').fadeIn(200).addClass('active');
  });
  $('#closePopup').on('click', function() {
    $('#contactPopup').fadeOut(200).removeClass('active');
  });
  // Закриття по кліку поза popup
  $(document).on('mousedown', function(e) {
    if ($('#contactPopup').hasClass('active')) {
      if ($(e.target).is('#contactPopup')) {
        $('#contactPopup').fadeOut(200).removeClass('active');
      }
    }
  });

  // ===== 9. Валідація контактної форми =====
  // Add input hints
  $('#name').on('focus', function() {
    $(this).attr('placeholder', 'Наприклад: Петренко Марія Іванівна');
  }).on('blur', function() {
    $(this).attr('placeholder', '');
  });

  $('#email').on('focus', function() {
    $(this).attr('placeholder', 'Наприклад: maria@ukr.net');
  }).on('blur', function() {
    $(this).attr('placeholder', '');
  });

  $('#message').on('focus', function() {
    $(this).attr('placeholder', 'Опишіть ваше питання або пропозицію...');
  }).on('blur', function() {
    $(this).attr('placeholder', '');
  });

  function validateForm() {
    let isValid = true;
    $('.error-message').text('');
    $('.form-group').removeClass('error');

    // PIB validation
    const pib = $('#name').val().trim();
    const pibParts = pib.split(/\s+/).filter(part => part.length > 0);
    
    // Russian letters pattern
    const russianLetters = /[ёъыэ]/i;
    
    // Check for repeated characters
    const repeatedChars = /(.)\1{4,}/;
    
    if (!pib) {
      showError('#name', 'Будь ласка, введіть ПІБ');
      isValid = false;
    } else if (russianLetters.test(pib)) {
      showError('#name', 'Використання російських літер заборонено. Будь ласка, використовуйте українську мову');
      isValid = false;
    } else if (repeatedChars.test(pib)) {
      showError('#name', 'ПІБ не може містити більше 4 однакових символів підряд');
      isValid = false;
    } else if (pibParts.length < 3) {
      showError('#name', 'Будь ласка, введіть повне ПІБ (прізвище, ім\'я, по батькові) щонайменше по 2 символи кожне.');
      isValid = false;
    } else if (pibParts.some(part => part.length < 2)) {
      showError('#name', 'Кожна частина ПІБ має містити щонайменше 2 символи');
      isValid = false;
    } else if (!/^[а-яА-ЯҐґЄєІіЇї\s']+$/.test(pib)) {
      showError('#name', 'ПІБ не може містити цифри або спеціальні символи');
      isValid = false;
    }

    // Email validation
    const email = $('#email').val().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const tempEmailDomains = ['mailinator.com', '10minutemail.com', 'tempmail.com', 'yopmail.com'];
    
    // Check for spam-like patterns
    const spamPatterns = [
      /casino/i,
      /viagra/i,
      /porn/i,
      /xxx/i,
      /sex/i,
      /drugs/i,
      /lottery/i,
      /winner/i,
      /free.*money/i,
      /earn.*fast/i
    ];
    
    if (!email) {
      showError('#email', 'Введіть email-адресу');
      isValid = false;
    } else if (russianLetters.test(email)) {
      showError('#email', 'Використання російських літер заборонено. Будь ласка, використовуйте українську мову');
      isValid = false;
    } else if (spamPatterns.some(pattern => pattern.test(email))) {
      showError('#email', 'Виявлено підозрілі символи в email-адресі');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      showError('#email', 'Email повинен містити символ @ і не починатися з нього');
      isValid = false;
    } else if (email.length < 6) {
      showError('#email', 'Email має містити щонайменше 6 символів');
      isValid = false;
    } else if ((email.match(/@/g) || []).length > 1) {
      showError('#email', 'Email не може містити більше одного символу @');
      isValid = false;
    } else if (/\.ru$/i.test(email)) {
      showError('#email', 'Email з доменом .ru не дозволено');
      isValid = false;
    } else if (tempEmailDomains.some(domain => email.toLowerCase().endsWith(domain))) {
      showError('#email', 'Використання тимчасових email-адрес заборонено');
      isValid = false;
    }

    // Message validation
    const message = $('#message').val().trim();
    const messageWithoutSpaces = message.replace(/\s+/g, '');
    
    // Check for URLs
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const foundUrls = message.match(urlPattern);
    
    // Check for spam words
    const spamWords = [
      'купити', 'продати', 'заробіток', 'бізнес',
      'кредит', 'позика', 'інвестиції', 'казино',
      'ставки', 'лотерея', 'виграш', 'приз'
    ];
    
    if (!message) {
      showError('#message', 'Введіть повідомлення');
      isValid = false;
    } else if (russianLetters.test(message)) {
      showError('#message', 'Використання російських літер заборонено. Будь ласка, використовуйте українську мову');
      isValid = false;
    } else if (messageWithoutSpaces.length === 0) {
      showError('#message', 'Повідомлення не може складатися лише з пробілів');
      isValid = false;
    } else if (message.length < 10) {
      showError('#message', 'Повідомлення має містити щонайменше 10 символів');
      isValid = false;
    } else if (message.length > 1000) {
      showError('#message', 'Повідомлення не може перевищувати 1000 символів');
      isValid = false;
    } else if (!/\S/.test(message)) {
      showError('#message', 'Повідомлення має містити хоча б одне слово');
      isValid = false;
    } else if (foundUrls && foundUrls.length > 0) {
      showError('#message', 'Посилання в повідомленні заборонені');
      isValid = false;
    } else if (spamWords.some(word => message.toLowerCase().includes(word))) {
      showError('#message', 'Повідомлення містить заборонені слова');
      isValid = false;
    } else if (repeatedChars.test(message)) {
      showError('#message', 'Повідомлення містить забагато повторюваних символів');
      isValid = false;
    }

    // XSS protection
    if (isValid) {
      const sanitizedPib = pib.replace(/[<>]/g, '');
      const sanitizedEmail = email.replace(/[<>]/g, '');
      const sanitizedMessage = message.replace(/[<>]/g, '');
      
      if (sanitizedPib !== pib || sanitizedEmail !== email || sanitizedMessage !== message) {
        showError('#message', 'Повідомлення містить заборонені символи');
        isValid = false;
      }
    }

    return isValid;
  }

  // Prevent form resubmission
  let lastFormData = '';
  $('#contactForm').on('submit', function(e) {
    e.preventDefault();
    
    const currentFormData = $(this).serialize();
    if (currentFormData === lastFormData) {
      showError('#message', 'Ця форма вже була відправлена. Будь ласка, внесіть зміни перед повторною відправкою.');
      return;
    }
    
    if (validateForm()) {
      const name = $('#name').val().trim();
      const email = $('#email').val().trim();
      const message = $('#message').val().trim();

      // Send email
      window.location.href = `mailto:marmelandia.order@gmail.com?subject=Повідомлення від ${name}&body=${encodeURIComponent(message)}`;
      
      // Save form data to prevent resubmission
      lastFormData = currentFormData;
      
      // Reset form and close modal
      this.reset();
      $('#contactModal').removeClass('active');

      // Show success message
      showNotification('Ваше повідомлення надіслано');
    }
  });

  function showError(field, message) {
    $(field).closest('.form-group').addClass('error')
           .find('.error-message').text(message);
  }

  // ===== 10. Авторизація та реєстрація =====
  $('.toggle-btn').click(function () {
    $('.toggle-btn').removeClass('active');
    $(this).addClass('active');
    const formId = $(this).data('form');
    $('.auth-form').removeClass('active');
    $(`#${formId}Form`).addClass('active');
  });

  $('.toggle-password').click(function () {
    const input = $(this).siblings('input');
    input.attr('type', input.attr('type') === 'password' ? 'text' : 'password');
    $(this).toggleClass('fa-eye fa-eye-slash');
  });

  $('.auth-form input').on('input', function () {
    $(this).closest('.form-group').removeClass('error').find('.error-message').text('');
  });

  // ===== Карусель-галерея після hero =====
  let galleryIndex = 0;
  const $slides = $('.gallery-slide');
  const visibleSlides = 3;
  const totalSlides = $slides.length;

  function updateGallery() {
    // Зсуваємо .gallery-slides на потрібну ширину
    const $gallerySlides = $('.gallery-slides');
    $gallerySlides.css('transform', `translateX(-${galleryIndex * (100 / visibleSlides)}%)`);
    // Додаємо клас active лише до видимих
    $slides.removeClass('active');
    for (let i = 0; i < visibleSlides; i++) {
      $slides.eq((galleryIndex + i) % totalSlides).addClass('active');
    }
  }

  $('.gallery-next').click(function () {
    galleryIndex = (galleryIndex + 1) % totalSlides;
    updateGallery();
  });

  $('.gallery-prev').click(function () {
    galleryIndex = (galleryIndex - 1 + totalSlides) % totalSlides;
    updateGallery();
  });

  // Swipe support (optional, for touch devices)
  let startX = null;
  $('.gallery-slides').on('touchstart', function(e) {
    startX = e.originalEvent.touches[0].clientX;
  });
  $('.gallery-slides').on('touchend', function(e) {
    if (startX === null) return;
    let endX = e.originalEvent.changedTouches[0].clientX;
    if (endX - startX > 40) $('.gallery-prev').click();
    else if (startX - endX > 40) $('.gallery-next').click();
    startX = null;
  });

  // Автоматичне прокручування
  setInterval(function() {
    $('.gallery-next').click();
  }, 3000);

  // Початковий стан
  updateGallery();

  // ===== Slick-карусель для галереї (тільки якщо slick підключений і є галерея) =====
  if ($('.gallery-carousel').length && typeof $.fn.slick === 'function') {
    $('.gallery-carousel').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 0,
      speed: 3000,
      cssEase: 'linear',
      infinite: true,
      arrows: false,
      dots: false,
      pauseOnHover: false,
      centerMode: false,
      variableWidth: false,
      responsive: [
        {
          breakpoint: 900,
          settings: { slidesToShow: 2 }
        },
        {
          breakpoint: 600,
          settings: { slidesToShow: 1 }
        }
      ]
    });
  }

  // ===== Кошик =====
  let cart = { items: [] };
  let favorites = [];

  // Завантаження кошика
  async function loadCart() {
    try {
      cart = await getCart();
      updateCartCount();
      updateCartDisplay();
    } catch (error) {
      console.error('Помилка завантаження кошика:', error);
    }
  }

  // Завантаження улюблених
  async function loadFavorites() {
    try {
      // Перевіряємо, чи користувач авторизований
      const token = localStorage.getItem('token');
      if (!token) {
        window.favorites = []; // Використовуємо window для глобальної доступності
        updateFavoriteButtons();
        return;
      }

      window.favorites = await getFavorites();
      updateFavoriteButtons();
    } catch (error) {
      console.error('Помилка завантаження улюблених:', error);
      window.favorites = []; // У випадку помилки очищаємо масив
      updateFavoriteButtons();
    }
  }

  // Оновлення лічильника кошика
  function updateCartCount() {
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    $('#cartCount').text(count);
  }

  // Оновлення відображення кошика
  function updateCartDisplay() {
    const $cartItems = $('#cartItems');
    $cartItems.empty();

    if (cart.items.length === 0) {
      $cartItems.html('<p>Кошик порожній</p>');
      $('#cartTotal').text('0 грн');
      return;
    }

    let total = 0;
    cart.items.forEach(item => {
      const product = item.product;
      const subtotal = product.price * item.quantity;
      total += subtotal;

      const $item = $(`
        <div class="cart-item" data-id="${product._id}">
          <img src="${product.image}" alt="${product.name}">
          <div class="cart-item-details">
            <h3>${product.name}</h3>
            <p class="price">${product.price} грн</p>
            <div class="quantity-controls">
              <button class="quantity-btn minus">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn plus">+</button>
            </div>
          </div>
          <button class="remove-item">&times;</button>
          </div>
        `);

      $cartItems.append($item);
    });

    $('#cartTotal').text(`${total} грн`);
  }

  // Додавання товару до кошика
  async function handleAddToCart(productId, quantity = 1) {
    try {
      cart = await addToCart(productId, quantity);
      updateCartCount();
      updateCartDisplay();
      showNotification('Товар додано до кошика');
    } catch (error) {
      console.error('Помилка додавання товару:', error);
      showNotification('Помилка додавання товару', 'error');
    }
  }

  // Оновлення кількості товару
  async function handleUpdateQuantity(productId, quantity) {
    try {
      if (quantity <= 0) {
        await handleRemoveFromCart(productId);
      } else {
        cart = await updateCartItem(productId, quantity);
    updateCartCount();
        updateCartDisplay();
      }
    } catch (error) {
      console.error('Помилка оновлення кількості:', error);
      showNotification('Помилка оновлення кількості', 'error');
    }
  }

  // Видалення товару з кошика
  async function handleRemoveFromCart(productId) {
    try {
      cart = await removeFromCart(productId);
    updateCartCount();
      updateCartDisplay();
      showNotification('Товар видалено з кошика');
    } catch (error) {
      console.error('Помилка видалення товару:', error);
      showNotification('Помилка видалення товару', 'error');
    }
  }

  // Очищення кошика
  async function handleClearCart() {
    try {
      await clearCart();
      cart = { items: [] };
  updateCartCount();
      updateCartDisplay();
      showNotification('Кошик очищено');
    } catch (error) {
      console.error('Помилка очищення кошика:', error);
      showNotification('Помилка очищення кошика', 'error');
    }
  }

  // ===== Оформлення замовлення =====
  // Додаємо форму у popup-кошик (один раз)
  if ($('#cartPopup .order-form').length === 0) {
    $('#cartPopup .cart-content').append(`
      <form class="order-form" id="orderForm" style="display:none;margin-top:18px;">
        <h3 style="margin-bottom:10px;color:#ff4fa3;">Оформлення замовлення</h3>
        <div class="form-group">
          <input type="text" name="orderName" id="orderName" placeholder="ПІБ*" class="order-input">
          <span class="error-message"></span>
        </div>
        <div class="form-group">
          <input type="text" name="orderEmail" id="orderEmail" placeholder="Email*" class="order-input">
          <span class="error-message"></span>
        </div>
        <div class="form-group">
          <input type="text" name="orderPhone" id="orderPhone" placeholder="Телефон* (+380XXXXXXXXX)" class="order-input">
          <span class="error-message"></span>
        </div>
        <div class="form-group">
          <textarea name="orderComment" id="orderComment" placeholder="Коментар до замовлення" class="order-input"></textarea>
          <span class="error-message"></span>
        </div>
        <button type="submit" class="submit-btn" style="width:100%;margin-top:8px;">Підтвердити замовлення</button>
        <div class="order-success" style="display:none;color:green;margin-top:10px;text-align:center;"></div>
      </form>
    `);
  }

  // Показати форму при натисканні на "Оформити замовлення"
  $('#checkoutBtn').off('click').on('click', function() {
    $('#orderForm').slideDown(200);
  });

  // Add input hints
  $('#orderName').on('focus', function() {
    $(this).attr('placeholder', 'Наприклад: Петренко Марія Іванівна');
  }).on('blur', function() {
    $(this).attr('placeholder', 'ПІБ*');
  });

  $('#orderEmail').on('focus', function() {
    $(this).attr('placeholder', 'Наприклад: maria@ukr.net');
  }).on('blur', function() {
    $(this).attr('placeholder', 'Email*');
  });

  $('#orderComment').on('focus', function() {
    $(this).attr('placeholder', 'Опишіть ваше замовлення або додаткові побажання...');
  }).on('blur', function() {
    $(this).attr('placeholder', 'Коментар до замовлення');
  });

  function validateOrderForm() {
    let isValid = true;
    $('.error-message').text('');
    $('.form-group').removeClass('error');

    // PIB validation
    const pib = $('#orderName').val().trim();
    const pibParts = pib.split(/\s+/).filter(part => part.length > 0);
    
    // Russian letters pattern
    const russianLetters = /[ёъыэ]/i;
    
    // Check for repeated characters
    const repeatedChars = /(.)\1{4,}/;
    
    if (!pib) {
      showError('#orderName', 'Будь ласка, введіть ПІБ');
      isValid = false;
    } else if (russianLetters.test(pib)) {
      showError('#orderName', 'Використання російських літер заборонено. Будь ласка, використовуйте українську мову');
      isValid = false;
    } else if (repeatedChars.test(pib)) {
      showError('#orderName', 'ПІБ не може містити більше 4 однакових символів підряд');
      isValid = false;
    } else if (pibParts.length < 3) {
      showError('#orderName', 'Будь ласка, введіть повне ПІБ (прізвище, ім\'я, по батькові) щонайменше по 2 символи кожне.');
      isValid = false;
    } else if (pibParts.some(part => part.length < 2)) {
      showError('#orderName', 'Кожна частина ПІБ має містити щонайменше 2 символи');
      isValid = false;
    } else if (!/^[а-яА-ЯҐґЄєІіЇї\s']+$/.test(pib)) {
      showError('#orderName', 'ПІБ не може містити цифри або спеціальні символи');
      isValid = false;
    }

    // Email validation
    const email = $('#orderEmail').val().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const tempEmailDomains = ['mailinator.com', '10minutemail.com', 'tempmail.com', 'yopmail.com'];
    
    if (!email) {
      showError('#orderEmail', 'Введіть email-адресу');
      isValid = false;
    } else if (russianLetters.test(email)) {
      showError('#orderEmail', 'Використання російських літер заборонено');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      showError('#orderEmail', 'Email повинен містити символ @ і не починатися з нього');
      isValid = false;
    } else if (email.length < 6) {
      showError('#orderEmail', 'Email має містити щонайменше 6 символів');
      isValid = false;
    } else if ((email.match(/@/g) || []).length > 1) {
      showError('#orderEmail', 'Email не може містити більше одного символу @');
      isValid = false;
    } else if (/\.ru$/i.test(email)) {
      showError('#orderEmail', 'Email з доменом .ru не дозволено');
      isValid = false;
    } else if (tempEmailDomains.some(domain => email.toLowerCase().endsWith(domain))) {
      showError('#orderEmail', 'Використання тимчасових email-адрес заборонено');
      isValid = false;
    }

    // Phone validation
    const phone = $('#orderPhone').val().trim();
    const phoneRegex = /^\+380\d{9}$/;
    
    if (!phone) {
      showError('#orderPhone', 'Введіть номер телефону');
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      showError('#orderPhone', 'Введіть номер у форматі +380XXXXXXXXX');
      isValid = false;
    }

    // Comment validation
    const comment = $('#orderComment').val().trim();
    const commentWithoutSpaces = comment.replace(/\s+/g, '');
    
    if (comment && commentWithoutSpaces.length === 0) {
      showError('#orderComment', 'Повідомлення не може складатися лише з пробілів');
      isValid = false;
    } else if (comment && comment.length < 10) {
      showError('#orderComment', 'Повідомлення має містити щонайменше 10 символів');
      isValid = false;
    } else if (comment && comment.length > 1000) {
      showError('#orderComment', 'Повідомлення не може перевищувати 1000 символів');
      isValid = false;
    } else if (!/\S/.test(comment)) {
      showError('#orderComment', 'Повідомлення має містити хоча б одне слово');
      isValid = false;
    }

    // XSS protection
    if (isValid) {
      const sanitizedPib = pib.replace(/[<>]/g, '');
      const sanitizedEmail = email.replace(/[<>]/g, '');
      const sanitizedPhone = phone.replace(/[<>]/g, '');
      const sanitizedComment = comment.replace(/[<>]/g, '');
      
      if (sanitizedPib !== pib || sanitizedEmail !== email || 
          sanitizedPhone !== phone || sanitizedComment !== comment) {
        showError('#orderComment', 'Форма містить заборонені символи');
        isValid = false;
      }
    }

    return isValid;
  }

  // Prevent form resubmission
  let lastOrderData = '';
  $(document).on('submit', '#orderForm', async function(e) {
    e.preventDefault();
    
    if (validateOrderForm()) {
      const order = {
        date: new Date().toLocaleString('uk-UA'),
        items: cart.items,
        total: cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      name: $('#orderName').val().trim(),
      email: $('#orderEmail').val().trim(),
      phone: $('#orderPhone').val().trim(),
      comment: $('#orderComment').val().trim()
    };
    
      try {
        // Зберігаємо замовлення через API
        const response = await fetch(`${API_URL}/orders`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(order)
        });

        if (!response.ok) {
          throw new Error('Помилка при створенні замовлення');
        }

        // Очищаємо кошик
        await handleClearCart();
      
      $('.order-success').text('Дякуємо! Ваше замовлення прийнято.').show();
      setTimeout(function(){
        $('#cartPopup').fadeOut(200).removeClass('active');
        $('#orderForm')[0].reset();
        $('.order-success').hide();
          updateCartDisplay();
        updateCartCount();
        $('#orderForm').slideUp(200);
      }, 2000);
      } catch (error) {
        console.error('Помилка при оформленні замовлення:', error);
        $('.order-success').text('Помилка при оформленні замовлення. Спробуйте ще раз.').show();
      }
    }
  });

  // Clear errors on input
  $('.order-input').on('input', function() {
    $(this).closest('.form-group').removeClass('error')
           .find('.error-message').text('');
  });

  // ===== Особистий кабінет: збереження профілю =====
  async function loadProfile() {
    if (window.location.pathname.includes('account.html')) {
      try {
        const response = await fetch(`${API_URL}/profile`, {
          headers: getAuthHeaders()
        });
        if (response.ok) {
          const profile = await response.json();
          if (profile) {
      if (profile.name) $('#profileName').val(profile.name);
      if (profile.email) $('#profileEmail').val(profile.email);
      if (profile.phone) $('#profilePhone').val(profile.phone);
      if (profile.address) $('#profileAddress').val(profile.address);
    }
  }
      } catch (error) {
        console.error('Помилка завантаження профілю:', error);
      }
    }
  }

  // Збереження профілю
  $(document).on('click', '.save-profile-btn', async function(e) {
    e.preventDefault();
    
    const profileData = {
      name: $('#profileName').val().trim(),
      email: $('#profileEmail').val().trim(),
      phone: $('#profilePhone').val().trim(),
      address: $('#profileAddress').val().trim()
    };
    
    if (validateProfileForm()) {
      try {
        const response = await fetch(`${API_URL}/profile`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(profileData)
        });

        if (!response.ok) {
          throw new Error('Помилка при збереженні профілю');
        }
      
      if ($('.save-profile-btn').next('.profile-success').length === 0) {
        $('.save-profile-btn').after('<div class="profile-success" style="color:green;margin-top:10px;">Зміни збережено!</div>');
      } else {
        $('.profile-success').text('Зміни збережено!').show();
      }
      setTimeout(function(){ $('.profile-success').fadeOut(400); }, 2000);
      } catch (error) {
        console.error('Помилка при збереженні профілю:', error);
        $('.profile-success').text('Помилка при збереженні. Спробуйте ще раз.').show().css('color', 'red');
      }
    }
  });

  // Clear errors on input
  $('.profile-input').on('input', function() {
    $(this).closest('.form-group').removeClass('error')
           .find('.error-message').text('');
  });

  // ===== Особистий кабінет: зміна аватара =====
  if (window.location.pathname.includes('account.html')) {
    // Показати вибір файлу при кліку на кнопку
    $(document).on('click', '.change-avatar-btn', function(e) {
      e.preventDefault();
      $('#avatarInput').click();
    });
    // Обробка вибору файлу
    $('#avatarInput').on('change', function(e) {
      const file = this.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(ev) {
          $('.profile-avatar').attr('src', ev.target.result);
          // Зберігаємо у localStorage
          let profile = JSON.parse(localStorage.getItem('profile') || '{}');
          profile.avatar = ev.target.result;
          localStorage.setItem('profile', JSON.stringify(profile));
        };
        reader.readAsDataURL(file);
      }
    });
    // Підставляємо аватар при завантаженні
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    if (profile.avatar) {
      $('.profile-avatar').attr('src', profile.avatar);
    }
  }

  // ===== Особистий кабінет: показ замовлень =====
  async function renderOrders() {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        $('#orders').html('<p>Будь ласка, <a href="../pages/login.html" style="color:#ff4fa3;text-decoration:underline;">увійдіть в систему</a> для перегляду замовлень</p>');
        return;
      }

      const orders = await getMyOrders();
      const $ordersContainer = $('#orders');
      
      if (!orders || orders.length === 0) {
        $ordersContainer.html('<p>У вас поки немає замовлень</p>');
        return;
      }

      const ordersHtml = orders.map(order => `
        <div class="order-item">
            <div class="order-header">
            <span>Замовлення #${order._id}</span>
            <span class="order-date">${new Date(order.createdAt).toLocaleDateString('uk-UA')}</span>
            <span class="order-status ${order.status}">${order.status}</span>
            </div>
            <div class="order-details">
            ${order.items.map(item => `
              <div class="order-product">
                <img src="${item.product.imageUrl}" alt="${item.product.name}">
                <span class="product-name">${item.product.name}</span>
                <span class="product-quantity">${item.quantity} шт.</span>
                <span class="product-price">${item.price} грн</span>
            </div>
            `).join('')}
            <div class="order-total">
              <span>Загальна сума: ${order.totalAmount} грн</span>
          </div>
          </div>
        </div>
      `).join('');

      $ordersContainer.html(ordersHtml);
    } catch (error) {
      console.error('Помилка завантаження замовлень:', error);
      if (error.message === 'Немає токена, авторизація відхилена') {
        $('#orders').html('<p>Будь ласка, <a href="../pages/login.html" style="color:#ff4fa3;text-decoration:underline;">увійдіть в систему</a> для перегляду замовлень</p>');
      } else {
        $('#orders').html('<p class="error">Помилка завантаження замовлень</p>');
      }
    }
  }

  // Обробник кнопки відміни замовлення
  $(document).on('click', '.cancel-order-btn', async function() {
    const idx = $(this).data('idx');
    let orders = await db.getData('orders');
    orders.splice(idx, 1);
    await db.saveData('orders', orders);
  renderOrders();
    Swal && Swal.fire ? Swal.fire('Замовлення скасовано!', '', 'success') : alert('Замовлення скасовано!');
  });

  // ===== Улюблене =====
  // Оновлення кнопок улюблених
  function updateFavoriteButtons() {
    const token = localStorage.getItem('token');
    
    $('.favorite-btn').each(function() {
      const $btn = $(this);
      const productId = $btn.closest('.catalog-item').data('id');
      
      if (!token) {
        $btn.removeClass('active');
        $btn.attr('title', 'Увійдіть, щоб додати в улюблене');
        return;
      }
      
      
      const isFavorite = favorites.some(f => f.product._id === productId);
      $btn.toggleClass('active', isFavorite);
      $btn.attr('title', isFavorite ? 'Видалити з улюблених' : 'Додати в улюблене');
    });
  }

  // Функція для показу повідомлень
  async function showNotification(message, type = 'success') {
    const initialized = await initializeSweetAlert();
    
    if (initialized && sweetAlertLoaded) {
      return Swal.fire({
        text: message,
        icon: type,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: type === 'success' ? '#4caf50' : '#f44336',
        color: '#ffffff'
      });
    } else {
      // Fallback to browser's native alert
      if (type === 'error') {
        console.error(message);
      }
      alert(message);
    }
  }

  // Функція для показу модальних вікон
  async function showModal(options) {
    const initialized = await initializeSweetAlert();
    
    if (initialized && sweetAlertLoaded) {
      return Swal.fire(options);
      } else {
      // Fallback to browser's native dialogs
      if (options.text) {
        if (options.showCancelButton) {
          return Promise.resolve({ isConfirmed: confirm(options.text) });
        } else {
          alert(options.text);
          return Promise.resolve({ isConfirmed: true });
        }
      }
    }
  }

  // Додавання/видалення з улюблених
  async function handleToggleFavorite(productId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showModal({
          title: 'Потрібна авторизація',
          text: 'Для додавання товарів в улюблене, будь ласка, увійдіть в систему',
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Увійти',
          cancelButtonText: 'Скасувати',
          confirmButtonColor: '#ff4fa3'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = 'login.html';
          }
        });
        return;
      }

      const isFavorite = favorites.some(f => f.product._id === productId);
      
      if (isFavorite) {
        await removeFromFavorites(productId);
        favorites = favorites.filter(f => f.product._id !== productId);
        showNotification('Товар видалено з улюблених');
      } else {
        const favorite = await addToFavorites(productId);
        favorites.push(favorite);
        showNotification('Товар додано до улюблених');
      }
      
      updateFavoriteButtons();
    } catch (error) {
      console.error('Помилка оновлення улюблених:', error);
      showNotification('Помилка оновлення улюблених', 'error');
    }
  }

  // Кошик
  $(document).on('click', '.add-to-cart', function() {
    const productId = $(this).closest('.catalog-item').data('id');
    handleAddToCart(productId);
  });

  $(document).on('click', '.quantity-btn.plus', function() {
    const $item = $(this).closest('.cart-item');
    const productId = $item.data('id');
    const currentQuantity = parseInt($item.find('.quantity').text());
    handleUpdateQuantity(productId, currentQuantity + 1);
  });

  $(document).on('click', '.quantity-btn.minus', function() {
    const $item = $(this).closest('.cart-item');
    const productId = $item.data('id');
    const currentQuantity = parseInt($item.find('.quantity').text());
    handleUpdateQuantity(productId, currentQuantity - 1);
  });

  $(document).on('click', '.remove-item', function() {
    const productId = $(this).closest('.cart-item').data('id');
    handleRemoveFromCart(productId);
  });

  $('#clearCart').on('click', handleClearCart);

  // Улюблені
  $(document).on('click', '.favorite-btn', function() {
    const productId = $(this).closest('.catalog-item').data('id');
    handleToggleFavorite(productId);
  });

  // Ініціалізація при завантаженні
  updateCartCount();
  updateFavoriteButtons();
  renderOrders();

  // Викликаємо ініціалізацію фільтрів після завантаження сторінки
  if ($('.filter-box').length) {
    initializeFilters();
  }
});
