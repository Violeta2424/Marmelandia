// === Основний JavaScript для сайту ===

$(document).ready(function () {
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

  // Ініціалізація при завантаженні сторінки
  function initializeProducts() {
    const $items = $('.catalog-items');
    originalProducts = $items.children('.catalog-item').get().map(item => ({
      element: item,
      name: $(item).find('h3').text(),
      price: parseInt($(item).data('price')) || 0,
      description: $(item).find('.description').text()
    }));
  }

  // Функція фільтрації та сортування
  function filterAndSortProducts() {
    const searchText = $('#search-input').val().toLowerCase().trim();
    const sortValue = $('#sort-select').val();
    const maxPrice = parseInt($('#price-range').val()) || 1000;

    // Фільтруємо товари
    let filteredProducts = originalProducts.filter(product => {
      const matchesSearch = searchText === '' || 
        product.name.toLowerCase().includes(searchText) || 
        product.description.toLowerCase().includes(searchText);
      const matchesPrice = product.price <= maxPrice;
      return matchesSearch && matchesPrice;
    });

    // Сортуємо товари
    filteredProducts.sort((a, b) => {
      switch(sortValue) {
        case 'name-asc':
          return a.name.localeCompare(b.name, 'uk');
        case 'name-desc':
          return b.name.localeCompare(a.name, 'uk');
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    // Оновлюємо відображення
    const $items = $('.catalog-items');
    $items.empty();

    if (filteredProducts.length === 0) {
      $items.html('<div class="no-results" style="text-align:center;padding:20px;color:#666;">Товарів не знайдено</div>');
    } else {
      filteredProducts.forEach(product => {
        $items.append(product.element);
      });
    }
  }

  // Обробники подій
  $('.filter-btn').click(function (e) {
    e.stopPropagation();
    $('.filter-dropdown').toggleClass('active');
  });

  $(document).click(function (e) {
    if (!$(e.target).closest('.filter-box').length) {
      $('.filter-dropdown').removeClass('active');
    }
  });

  // Оновлення відображення ціни при зміні слайдера
  $('#price-range').on('input', function () {
    const value = $(this).val();
    $('#price-value').text(`0-${value} грн`);
    filterAndSortProducts();
  });

  // Обробники подій для пошуку та сортування
  $('#search-input').on('input', function() {
    filterAndSortProducts();
  });

  $('#sort-select').on('change', function() {
    filterAndSortProducts();
  });

  // Ініціалізація при завантаженні сторінки
  $(document).ready(function() {
    initializeProducts();
    filterAndSortProducts();
  });

  // Скидання фільтрів
  function resetFilters() {
    $('#search-input').val('');
    $('#price-range').val(1000);
    $('#price-value').text('0-1000 грн');
    $('#sort-select').val('name-asc');
    filterAndSortProducts();
  }

  // Додаємо кнопку скидання фільтрів
  if ($('.filter-box').find('.reset-filters').length === 0) {
    $('.filter-box').append('<button class="reset-filters" style="margin-top:10px;padding:8px 16px;background:#ff4fa3;color:white;border:none;border-radius:8px;cursor:pointer;">Скинути фільтри</button>');
  }

  $('.reset-filters').on('click', function() {
    resetFilters();
  });

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
      Swal.fire({
        icon: 'success',
        title: 'Дякуємо!',
        text: 'Ваше повідомлення надіслано',
        confirmButtonColor: 'rgb(255, 0, 144)'
      });
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

  $('#loginForm').on('submit', function (e) {
    e.preventDefault();
    const email = $('#loginEmail').val();
    const password = $('#loginPassword').val();
    let isValid = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) showError('#loginEmail', 'Некоректний email');
    else if (/.ru$/.test(email)) showError('#loginEmail', 'Домени .ru не дозволені');
    if (!password) showError('#loginPassword', 'Введіть пароль');
    if ($('.form-group.error').length === 0) Swal.fire('Успішно!', 'Ви увійшли в систему', 'success');
  });

  $('#registerForm').on('submit', function (e) {
    e.preventDefault();
    let isValid = true;
    const name = $('#regName').val();
    const email = $('#regEmail').val();
    const password = $('#regPassword').val();
    const confirm = $('#regPasswordConfirm').val();
    if (!name || name.length < 2) { showError('#regName', 'Мінімум 2 символи'); isValid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) showError('#regEmail', 'Некоректний email');
    else if (/.ru$/.test(email)) showError('#regEmail', 'Домени .ru не дозволені');
    if (!password || !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) showError('#regPassword', 'Мінімум 8 символів, літери і цифри');
    if (password !== confirm) showError('#regPasswordConfirm', 'Паролі не співпадають');
    if (!$('#terms').is(':checked')) showError('#terms', 'Погодьтесь з умовами');
    if ($('.form-group.error').length === 0) Swal.fire('Успішно!', 'Реєстрація пройшла успішно', 'success');
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
  // Відкрити кошик
  $('#cartIcon').on('click', function() {
    $('#cartPopup').fadeIn(200).addClass('active');
    renderCart();
  });
  // Закрити кошик
  $('#closeCart').on('click', function() {
    $('#cartPopup').fadeOut(200).removeClass('active');
  });
  // Закриття по кліку поза popup
  $(document).on('mousedown', function(e) {
    if ($('#cartPopup').hasClass('active')) {
      if ($(e.target).is('#cartPopup')) {
        $('#cartPopup').fadeOut(200).removeClass('active');
      }
    }
  });
  // Додавання товару в кошик
  $(document).on('click', '.add-to-cart', function() {
    const $item = $(this).closest('.catalog-item');
    const title = $item.find('h3').text();
    const priceText = $item.find('.price').text();
    const price = parseInt(priceText);
    const img = $item.find('img').attr('src');
    addToCart({ title, price, img });
  });
  // Додаємо/оновлюємо товар у LocalStorage
  async function addToCart(product) {
    let cart = await db.getData('cart');
    const idx = cart.findIndex(item => item.title === product.title);
    if (idx > -1) {
      cart[idx].qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    await db.saveData('cart', cart);
    updateCartCount();
  }
  // Оновлення лічильника
  async function updateCartCount() {
    let cart = await db.getData('cart');
    let count = cart.reduce((sum, item) => sum + item.qty, 0);
    $('#cartCount').text(count);
  }
  // Відображення кошика
  async function renderCart() {
    let cart = await db.getData('cart');
    let $cartItems = $('#cartItems');
    $cartItems.empty();
    let total = 0;
    if (cart.length === 0) {
      $cartItems.html('<p>Кошик порожній</p>');
      $('#checkoutBtn').hide();
    } else {
      cart.forEach((item, i) => {
        total += item.price * item.qty;
        $cartItems.append(`
          <div class="cart-item-row">
            <img src="${item.img}" alt="${item.title}" class="cart-item-img" style="width:44px;height:44px;object-fit:cover;border-radius:12px;margin-right:10px;">
            <span class="cart-item-title">${item.title}</span>
            <div class="cart-qty-controls">
              <button class="cart-qty-btn minus" data-idx="${i}">-</button>
              <span class="cart-item-qty">${item.qty}</span>
              <button class="cart-qty-btn plus" data-idx="${i}">+</button>
            </div>
            <span class="cart-item-price">${item.price * item.qty} грн</span>
            <button class="remove-cart-item" data-idx="${i}" title="Видалити">&times;</button>
          </div>
        `);
      });
      $('#checkoutBtn').show();
    }
    $('#cartTotal').text(total + ' грн');
  }
  // Кнопки + і - для зміни кількості
  $(document).on('click', '.cart-qty-btn', async function() {
    let idx = $(this).data('idx');
    let cart = await db.getData('cart');
    if ($(this).hasClass('plus')) {
      cart[idx].qty += 1;
    } else if ($(this).hasClass('minus')) {
      cart[idx].qty -= 1;
      if (cart[idx].qty < 1) cart[idx].qty = 1;
    }
    await db.saveData('cart', cart);
    renderCart();
    updateCartCount();
  });
  // Видалення товару з кошика
  $(document).on('click', '.remove-cart-item', async function() {
    let idx = $(this).data('idx');
    let cart = await db.getData('cart');
    cart.splice(idx, 1);
    await db.saveData('cart', cart);
    renderCart();
    updateCartCount();
  });
  // Оновити лічильник при завантаженні
  updateCartCount();

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
      const cart = await db.getData('cart');
      const order = {
        date: new Date().toLocaleString('uk-UA'),
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
        name: $('#orderName').val().trim(),
        email: $('#orderEmail').val().trim(),
        phone: $('#orderPhone').val().trim(),
        comment: $('#orderComment').val().trim()
      };

      // Зберігаємо замовлення
      const orders = await db.getData('orders');
      orders.push(order);
      await db.saveData('orders', orders);

      // Очищаємо кошик
      await db.clearStore('cart');
      
      $('.order-success').text('Дякуємо! Ваше замовлення прийнято.').show();
      setTimeout(function(){
        $('#cartPopup').fadeOut(200).removeClass('active');
        $('#orderForm')[0].reset();
        $('.order-success').hide();
        renderCart();
        updateCartCount();
        $('#orderForm').slideUp(200);
      }, 2000);
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
      const profile = await db.getData('profile');
      if (profile && profile.length > 0) {
        const userProfile = profile[0];
        if (userProfile.name) $('#profileName').val(userProfile.name);
        if (userProfile.email) $('#profileEmail').val(userProfile.email);
        if (userProfile.phone) $('#profilePhone').val(userProfile.phone);
        if (userProfile.address) $('#profileAddress').val(userProfile.address);
      }
    }
  }
  loadProfile();

  // Add input hints
  $('#profileName').on('focus', function() {
    $(this).attr('placeholder', 'Наприклад: Петренко Марія Іванівна');
  }).on('blur', function() {
    $(this).attr('placeholder', '');
  });

  $('#profileEmail').on('focus', function() {
    $(this).attr('placeholder', 'Наприклад: maria@ukr.net');
  }).on('blur', function() {
    $(this).attr('placeholder', '');
  });

  function validateProfileForm() {
    let isValid = true;
    $('.error-message').text('');
    $('.form-group').removeClass('error');

    // PIB validation
    const pib = $('#profileName').val().trim();
    const pibParts = pib.split(/\s+/).filter(part => part.length > 0);
    
    // Russian letters pattern
    const russianLetters = /[ёъыэ]/i;
    
    // Check for repeated characters
    const repeatedChars = /(.)\1{4,}/;
    
    if (!pib) {
      showError('#profileName', 'Будь ласка, введіть ПІБ');
      isValid = false;
    } else if (russianLetters.test(pib)) {
      showError('#profileName', 'Використання російських літер заборонено. Будь ласка, використовуйте українську мову');
      isValid = false;
    } else if (repeatedChars.test(pib)) {
      showError('#profileName', 'ПІБ не може містити більше 4 однакових символів підряд');
      isValid = false;
    } else if (pibParts.length < 3) {
      showError('#profileName', 'Будь ласка, введіть повне ПІБ (прізвище, ім\'я, по батькові) щонайменше по 2 символи кожне.');
      isValid = false;
    } else if (pibParts.some(part => part.length < 2)) {
      showError('#profileName', 'Кожна частина ПІБ має містити щонайменше 2 символи');
      isValid = false;
    } else if (!/^[а-яА-ЯҐґЄєІіЇї\s']+$/.test(pib)) {
      showError('#profileName', 'ПІБ не може містити цифри або спеціальні символи');
      isValid = false;
    }

    // Email validation
    const email = $('#profileEmail').val().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const tempEmailDomains = ['mailinator.com', '10minutemail.com', 'tempmail.com', 'yopmail.com'];
    
    if (!email) {
      showError('#profileEmail', 'Введіть email-адресу');
      isValid = false;
    } else if (russianLetters.test(email)) {
      showError('#profileEmail', 'Використання російських літер заборонено');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      showError('#profileEmail', 'Email повинен містити символ @ і не починатися з нього');
      isValid = false;
    } else if (email.length < 6) {
      showError('#profileEmail', 'Email має містити щонайменше 6 символів');
      isValid = false;
    } else if ((email.match(/@/g) || []).length > 1) {
      showError('#profileEmail', 'Email не може містити більше одного символу @');
      isValid = false;
    } else if (/\.ru$/i.test(email)) {
      showError('#profileEmail', 'Email з доменом .ru не дозволено');
      isValid = false;
    } else if (tempEmailDomains.some(domain => email.toLowerCase().endsWith(domain))) {
      showError('#profileEmail', 'Використання тимчасових email-адрес заборонено');
      isValid = false;
    }

    // Phone validation
    const phone = $('#profilePhone').val().trim();
    const phoneRegex = /^\+380\d{9}$/;
    
    if (!phone) {
      showError('#profilePhone', 'Введіть номер телефону');
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      showError('#profilePhone', 'Введіть номер у форматі +380XXXXXXXXX');
      isValid = false;
    }

    // Address validation
    const address = $('#profileAddress').val().trim();
    const addressWithoutSpaces = address.replace(/\s+/g, '');
    const validAddressChars = /^[а-яА-ЯҐґЄєІіЇї0-9\s.,-]+$/;
    const hasNumber = /\d/;
    const hasMultipleCommas = /,\s*,/;
    
    if (!address) {
      showError('#profileAddress', 'Введіть адресу доставки');
      isValid = false;
    } else if (addressWithoutSpaces.length === 0) {
      showError('#profileAddress', 'Введіть адресу доставки, це поле не може бути порожнім');
      isValid = false;
    } else if (address.length < 10) {
      showError('#profileAddress', 'Адреса має містити щонайменше 10 символів');
      isValid = false;
    } else if (address.length > 150) {
      showError('#profileAddress', 'Адреса не може бути довшою за 150 символів');
      isValid = false;
    } else if (!validAddressChars.test(address)) {
      showError('#profileAddress', 'Адреса містить недопустимі символи');
      isValid = false;
    } else if (!hasNumber.test(address)) {
      showError('#profileAddress', 'Вкажіть номер будинку або квартири');
      isValid = false;
    } else if (hasMultipleCommas.test(address)) {
      showError('#profileAddress', 'Адреса не може містити зайвих ком або пробілів');
      isValid = false;
    }

    // XSS protection
    if (isValid) {
      const sanitizedPib = pib.replace(/[<>]/g, '');
      const sanitizedEmail = email.replace(/[<>]/g, '');
      const sanitizedPhone = phone.replace(/[<>]/g, '');
      const sanitizedAddress = address.replace(/[<>]/g, '');
      
      if (sanitizedPib !== pib || sanitizedEmail !== email || 
          sanitizedPhone !== phone || sanitizedAddress !== address) {
        showError('#profileAddress', 'Форма містить заборонені символи');
        isValid = false;
      }
    }

    return isValid;
  }

  // Збереження профілю
  $(document).on('click', '.save-profile-btn', async function(e) {
    e.preventDefault();
    
    const currentFormData = {
      id: 1, // Фіксований ID для профілю
      name: $('#profileName').val().trim(),
      email: $('#profileEmail').val().trim(),
      phone: $('#profilePhone').val().trim(),
      address: $('#profileAddress').val().trim()
    };
    
    if (validateProfileForm()) {
      await db.saveData('profile', currentFormData);
      
      if ($('.save-profile-btn').next('.profile-success').length === 0) {
        $('.save-profile-btn').after('<div class="profile-success" style="color:green;margin-top:10px;">Зміни збережено!</div>');
      } else {
        $('.profile-success').text('Зміни збережено!').show();
      }
      setTimeout(function(){ $('.profile-success').fadeOut(400); }, 2000);
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
    if (window.location.pathname.includes('account.html')) {
      let orders = await db.getData('orders');
      let $list = $('.orders-list');
      $list.empty();
      if (!orders.length) {
        $list.html('<div style="color:#888;">У вас ще немає замовлень.</div>');
        return;
      }
      orders.reverse().forEach((order, idx) => {
        let itemsHtml = order.items.map(item =>
          `<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
            <img src="${item.img}" alt="" style="width:32px;height:32px;border-radius:8px;object-fit:cover;">
            <span>${item.title} <span style='color:#aaa;font-size:13px;'>x${item.qty}</span></span>
            <span style='margin-left:auto;color:#ff4fa3;font-weight:600;'>${item.price * item.qty} грн</span>
          </div>`
        ).join('');
        $list.append(`
          <div class="order-item" data-order-idx="${orders.length-1-idx}">
            <div class="order-header">
              <span><i class="fas fa-calendar"></i> ${order.date}</span>
              <span class="order-status success">Оформлено</span>
              <span style="font-weight:600;">${order.total} грн</span>
            </div>
            <div class="order-details">
              <div style="margin-bottom:8px;">${itemsHtml}</div>
              <div style="font-size:0.98em;color:#888;">${order.name}, ${order.phone}, ${order.email}</div>
              ${order.comment ? `<div style='margin-top:4px;color:#888;'>${order.comment}</div>` : ''}
              <button class="cancel-order-btn" data-idx="${orders.length-1-idx}"><i class="fas fa-times-circle"></i> Відмінити замовлення</button>
            </div>
          </div>
        `);
      });
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
  async function getFavorites() {
    return await db.getData('favorites');
  }

  async function setFavorites(favs) {
    await db.clearStore('favorites');
    await db.saveData('favorites', favs);
  }

  // Додаємо/видаляємо з улюбленого
  $(document).on('click', '.favorite-btn', async function(e) {
    e.preventDefault();
    const $item = $(this).closest('.catalog-item');
    const title = $item.find('h3').text();
    const price = parseInt($item.find('.price').text());
    const img = $item.find('img').attr('src');
    const favs = await getFavorites();
    const idx = favs.findIndex(f => f.title === title);
    if (idx > -1) {
      favs.splice(idx, 1);
      $(this).removeClass('active');
    } else {
      favs.push({ title, price, img });
      $(this).addClass('active');
    }
    await setFavorites(favs);
    renderFavorites();
  });

  // Підсвічування сердечка для улюбленого
  async function updateFavoriteBtns() {
    const favs = await getFavorites();
    $('.catalog-item').each(function() {
      const title = $(this).find('h3').text();
      if (favs.find(f => f.title === title)) {
        $(this).find('.favorite-btn').addClass('active');
      } else {
        $(this).find('.favorite-btn').removeClass('active');
      }
    });
  }

  // Відображення улюбленого у кабінеті
  async function renderFavorites() {
    if (window.location.pathname.includes('account.html')) {
      const favs = await getFavorites();
      const $grid = $('.favorites-grid');
      $grid.empty();
      if (!favs.length) {
        $grid.html('<div style="color:#888;">У вас ще немає улюблених товарів.</div>');
        return;
      }
      favs.forEach((item, i) => {
        $grid.append(`
          <div class="favorite-item">
            <div class="favorite-item-inner">
              <img src="${item.img}" alt="${item.title}" style="width:80px;height:80px;object-fit:cover;border-radius:12px;">
              <div style="font-weight:600;margin:8px 0 4px 0;">${item.title}</div>
              <div style="color:#ff4fa3;font-weight:600;">${item.price} грн</div>
            </div>
            <button class="remove-favorite-btn" data-idx="${i}" title="Видалити"><i class="fas fa-trash"></i></button>
          </div>
        `);
      });
    }
  }

  // Видалення з улюбленого у кабінеті
  $(document).on('click', '.remove-favorite-btn', async function() {
    const idx = $(this).data('idx');
    const favs = await getFavorites();
    favs.splice(idx, 1);
    await setFavorites(favs);
    renderFavorites();
    updateFavoriteBtns();
  });

  // Ініціалізація при завантаженні
  updateCartCount();
  updateFavoriteBtns();
  renderFavorites();
  renderOrders();
});
