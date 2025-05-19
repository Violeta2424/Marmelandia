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
  $('.filter-btn').click(function (e) {
    e.stopPropagation();
    $('.filter-dropdown').toggleClass('active');
  });

  $(document).click(function (e) {
    if (!$(e.target).closest('.filter-box').length) {
      $('.filter-dropdown').removeClass('active');
    }
  });

  $('#price-range').on('input', function () {
    $('#price-value').text(`0-${this.value} грн`);
  });

  function filterProducts() {
    const searchText = $('#search-input').val().toLowerCase();
    const sortValue = $('#sort-select').val();
    const maxPrice = $('#price-range').val();
    const selectedCategories = $('input[type="checkbox"]:checked').map(function () {
      return this.value;
    }).get();

    $('.catalog-item').each(function () {
      const $item = $(this);
      const name = $item.text().toLowerCase();
      const price = parseInt($item.data('price'));
      const category = $item.data('category');
      const matches = name.includes(searchText) && price <= maxPrice && 
                      (selectedCategories.length === 0 || selectedCategories.includes(category));
      $item.toggle(matches);
    });

    const $items = $('.catalog-items');
    const $products = $items.children('.catalog-item').get();
    $products.sort(function (a, b) {
      const $a = $(a);
      const $b = $(b);
      if (sortValue === 'name-asc') return $a.text().localeCompare($b.text());
      if (sortValue === 'name-desc') return $b.text().localeCompare($a.text());
      if (sortValue === 'price-asc') return $a.data('price') - $b.data('price');
      if (sortValue === 'price-desc') return $b.data('price') - $a.data('price');
    });
    $items.append($products);
  }

  $('#search-input, #sort-select, #price-range, .filter-group input[type="checkbox"]').on('input change', filterProducts);

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
  // Form submission
  $('#contactForm').on('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
      const name = $('#name').val().trim();
      const email = $('#email').val().trim();
      const message = $('#message').val().trim();

      // Send email
      window.location.href = `mailto:marmelandia.order@gmail.com?subject=Повідомлення від ${name}&body=${encodeURIComponent(message)}`;
      
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

  function validateForm() {
    let isValid = true;
    $('.error-message').text('');
    $('.form-group').removeClass('error');

    // Name validation
    const name = $('#name').val().trim();
    if (!name || name.length < 2 || !/^[a-zA-ZА-ЯҐЄІЇа-яґєії\s']+$/.test(name)) {
      showError('#name', 'Введіть коректне ім\'я');
      isValid = false;
    }

    // Email validation
    const email = $('#email').val().trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('#email', 'Введіть коректний email');
      isValid = false;
    }
    if (/\.ru$/i.test(email)) {
      showError('#email', 'Email з доменом .ru не дозволено');
      isValid = false;
    }

    // Message validation
    const message = $('#message').val().trim();
    if (!message || message.length < 10) {
      showError('#message', 'Повідомлення має містити мінімум 10 символів');
      isValid = false;
    }

    return isValid;
  }

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
  $('.add-to-cart').on('click', function() {
    const $item = $(this).closest('.catalog-item');
    const title = $item.find('h3').text();
    const priceText = $item.find('.price').text();
    const price = parseInt(priceText);
    const img = $item.find('img').attr('src');
    addToCart({ title, price, img });
  });
  // Додаємо/оновлюємо товар у LocalStorage
  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = cart.findIndex(item => item.title === product.title);
    if (idx > -1) {
      cart[idx].qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  }
  // Оновлення лічильника
  function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let count = cart.reduce((sum, item) => sum + item.qty, 0);
    $('#cartCount').text(count);
  }
  // Відображення кошика
  function renderCart() {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
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
  $(document).on('click', '.cart-qty-btn', function() {
    let idx = $(this).data('idx');
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if ($(this).hasClass('plus')) {
      cart[idx].qty += 1;
    } else if ($(this).hasClass('minus')) {
      cart[idx].qty -= 1;
      if (cart[idx].qty < 1) cart[idx].qty = 1;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
  });
  // Видалення товару з кошика
  $(document).on('click', '.remove-cart-item', function() {
    let idx = $(this).data('idx');
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.splice(idx, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
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
        <input type="text" name="orderName" id="orderName" placeholder="Ваше ім'я*" required style="margin-bottom:8px;width:100%;padding:8px 12px;border-radius:10px;border:1.5px solid #ffd6ef;">
        <input type="email" name="orderEmail" id="orderEmail" placeholder="Email*" required style="margin-bottom:8px;width:100%;padding:8px 12px;border-radius:10px;border:1.5px solid #ffd6ef;">
        <input type="tel" name="orderPhone" id="orderPhone" placeholder="Телефон*" required style="margin-bottom:8px;width:100%;padding:8px 12px;border-radius:10px;border:1.5px solid #ffd6ef;">
        <textarea name="orderComment" id="orderComment" placeholder="Коментар до замовлення" style="margin-bottom:8px;width:100%;padding:8px 12px;border-radius:10px;border:1.5px solid #ffd6ef;"></textarea>
        <button type="submit" class="submit-btn" style="width:100%;margin-top:8px;">Підтвердити замовлення</button>
        <div class="order-success" style="display:none;color:green;margin-top:10px;text-align:center;"></div>
      </form>
    `);
  }
  // Показати форму при натисканні на "Оформити замовлення"
  $('#checkoutBtn').off('click').on('click', function() {
    $('#orderForm').slideDown(200);
  });
  // Валідація та "відправка" замовлення
  $(document).on('submit', '#orderForm', function(e) {
    e.preventDefault();
    let name = $('#orderName').val().trim();
    let email = $('#orderEmail').val().trim();
    let phone = $('#orderPhone').val().trim();
    if (!name || name.length < 2) { alert('Введіть ім\'я'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Введіть коректний email'); return; }
    if (/\.ru$/i.test(email)) { alert('Email з доменом .ru не дозволено'); return; }
    if (!/^[\d\+\-\s\(\)]{7,}$/.test(phone)) { alert('Введіть коректний телефон'); return; }
    // Тут можна реалізувати реальну відправку (через бекенд або mailto)
    // Для демо — просто повідомлення про успіх
    // --- Зберігаємо замовлення в LocalStorage ---
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    let order = {
      date: new Date().toLocaleString('uk-UA'),
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
      name, email, phone,
      comment: $('#orderComment').val().trim()
    };
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    $('.order-success').text('Дякуємо! Ваше замовлення прийнято.').show();
    setTimeout(function(){
      $('#cartPopup').fadeOut(200).removeClass('active');
      $('#orderForm')[0].reset();
      $('.order-success').hide();
      // Очищаємо кошик
      localStorage.removeItem('cart');
      renderCart();
      updateCartCount();
      $('#orderForm').slideUp(200);
    }, 2000);
  });

  // ===== Особистий кабінет: збереження профілю =====
  function loadProfile() {
    if (window.location.pathname.includes('account.html')) {
      const profile = JSON.parse(localStorage.getItem('profile') || '{}');
      if (profile.name) $(".profile-details input[type='text']").val(profile.name);
      if (profile.email) $(".profile-details input[type='email']").val(profile.email);
      if (profile.phone) $(".profile-details input[type='tel']").val(profile.phone);
      if (profile.address) $(".profile-details textarea").val(profile.address);
    }
  }
  loadProfile();
  $(document).on('click', '.save-profile-btn', function(e) {
    e.preventDefault();
    const name = $(".profile-details input[type='text']").val().trim();
    const email = $(".profile-details input[type='email']").val().trim();
    const phone = $(".profile-details input[type='tel']").val().trim();
    const address = $(".profile-details textarea").val().trim();
    if (!name || name.length < 2) { alert('Введіть коректне ім\'я'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Введіть коректний email'); return; }
    if (/\.ru$/i.test(email)) { alert('Email з доменом .ru не дозволено'); return; }
    // Український номер: +380XXXXXXXXX або 0XXXXXXXXX
    const uaPhoneRegex = /^(\+380|0)\d{9}$/;
    if (!uaPhoneRegex.test(phone)) { alert('Введіть коректний український номер телефону у форматі +380XXXXXXXXX або 0XXXXXXXXX'); return; }
    localStorage.setItem('profile', JSON.stringify({ name, email, phone, address }));
    if ($('.save-profile-btn').next('.profile-success').length === 0) {
      $('.save-profile-btn').after('<div class="profile-success" style="color:green;margin-top:10px;">Зміни збережено!</div>');
    } else {
      $('.profile-success').text('Зміни збережено!').show();
    }
    setTimeout(function(){ $('.profile-success').fadeOut(400); }, 2000);
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
  function renderOrders() {
    if (window.location.pathname.includes('account.html')) {
      let orders = JSON.parse(localStorage.getItem('orders') || '[]');
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
  renderOrders();

  // ===== Улюблене =====
  function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  }
  function setFavorites(favs) {
    localStorage.setItem('favorites', JSON.stringify(favs));
  }
  // Додаємо/видаляємо з улюбленого
  $(document).on('click', '.favorite-btn', function(e) {
    e.preventDefault();
    const $item = $(this).closest('.catalog-item');
    const title = $item.find('h3').text();
    const price = parseInt($item.find('.price').text());
    const img = $item.find('img').attr('src');
    const favs = getFavorites();
    const idx = favs.findIndex(f => f.title === title);
    if (idx > -1) {
      favs.splice(idx, 1);
      $(this).removeClass('active');
    } else {
      favs.push({ title, price, img });
      $(this).addClass('active');
    }
    setFavorites(favs);
    renderFavorites();
  });
  // Підсвічування сердечка для улюбленого
  function updateFavoriteBtns() {
    const favs = getFavorites();
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
  function renderFavorites() {
    if (window.location.pathname.includes('account.html')) {
      const favs = getFavorites();
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
  $(document).on('click', '.remove-favorite-btn', function() {
    const idx = $(this).data('idx');
    const favs = getFavorites();
    favs.splice(idx, 1);
    setFavorites(favs);
    renderFavorites();
    updateFavoriteBtns();
  });
  // Підсвічування сердечок при завантаженні
  updateFavoriteBtns();
  // Відображення улюбленого у кабінеті при завантаженні
  renderFavorites();

  // Обробник кнопки відміни замовлення
  $(document).on('click', '.cancel-order-btn', function() {
    const idx = $(this).data('idx');
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.splice(idx, 1);
    localStorage.setItem('orders', JSON.stringify(orders));
    renderOrders();
    Swal && Swal.fire ? Swal.fire('Замовлення скасовано!', '', 'success') : alert('Замовлення скасовано!');
  });
});
