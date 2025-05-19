// ============================================================================
// Мармеландія - Основний JavaScript файл
// ============================================================================

$(document).ready(function () {
    // ============================================================================
    // 1. Навігація та меню
    // ============================================================================
    $('.burger').click(function () {
        $(this).toggleClass('open');
        $('.nav-links').toggleClass('active');
    });

    // ============================================================================
    // 2. Анімації та ефекти
    // ============================================================================
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

    // Плавний скрол до футера
    $('.nav-links a[href="#contacts"]').on('click', function (e) {
        e.preventDefault();
        const $target = $('#contacts');
        $('html, body').animate({ scrollTop: $target.offset().top - 40 }, 600, function () {
            $target.addClass('highlight');
            setTimeout(() => $target.removeClass('highlight'), 1200);
        });
    });

    // ============================================================================
    // 3. Анімовані ведмедики на фоні
    // ============================================================================
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

    // ============================================================================
    // 4. Фільтрація та сортування товарів
    // ============================================================================
    let originalProducts = [];

    function initializeProducts() {
        const $items = $('.catalog-items');
        originalProducts = $items.children('.catalog-item').get().map(item => ({
            element: item,
            name: $(item).find('h3').text(),
            price: parseInt($(item).data('price')) || 0,
            description: $(item).find('.description').text()
        }));
    }

    function filterAndSortProducts() {
        const searchText = $('#search-input').val().toLowerCase().trim();
        const sortValue = $('#sort-select').val();
        const maxPrice = parseInt($('#price-range').val()) || 1000;

        let filteredProducts = originalProducts.filter(product => {
            const matchesSearch = searchText === '' || 
                product.name.toLowerCase().includes(searchText) || 
                product.description.toLowerCase().includes(searchText);
            const matchesPrice = product.price <= maxPrice;
            return matchesSearch && matchesPrice;
        });

        filteredProducts.sort((a, b) => {
            switch(sortValue) {
                case 'name-asc': return a.name.localeCompare(b.name, 'uk');
                case 'name-desc': return b.name.localeCompare(a.name, 'uk');
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                default: return 0;
            }
        });

        const $items = $('.catalog-items');
        $items.empty();

        if (filteredProducts.length === 0) {
            $items.html('<div class="no-results">Товарів не знайдено</div>');
        } else {
            filteredProducts.forEach(product => {
                $items.append(product.element);
            });
        }
    }

    // Ініціалізація фільтрів
    initializeProducts();
    filterAndSortProducts();

    // Обробники подій для фільтрів
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
        const value = $(this).val();
        $('#price-value').text(`0-${value} грн`);
        filterAndSortProducts();
    });

    $('#search-input').on('input', filterAndSortProducts);
    $('#sort-select').on('change', filterAndSortProducts);

    // Скидання фільтрів
    function resetFilters() {
        $('#search-input').val('');
        $('#price-range').val(1000);
        $('#price-value').text('0-1000 грн');
        $('#sort-select').val('name-asc');
        filterAndSortProducts();
    }

    if ($('.filter-box').find('.reset-filters').length === 0) {
        $('.filter-box').append('<button class="reset-filters">Скинути фільтри</button>');
    }

    $('.reset-filters').on('click', resetFilters);

    // ============================================================================
    // 5. Табуляція та вкладки
    // ============================================================================
    $('.tab-btn').click(function () {
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');
        const tabId = $(this).data('tab');
        $('.tab-content').removeClass('active');
        $(`#${tabId}`).addClass('active');
    });

    // ============================================================================
    // 6. Форми та валідація
    // ============================================================================
    // Контактна форма
    $('#openContactForm').on('click', function() {
        $('#contactPopup').fadeIn(200).addClass('active');
    });

    $('#closePopup').on('click', function() {
        $('#contactPopup').fadeOut(200).removeClass('active');
    });

    $(document).on('mousedown', function(e) {
        if ($('#contactPopup').hasClass('active') && $(e.target).is('#contactPopup')) {
            $('#contactPopup').fadeOut(200).removeClass('active');
        }
    });

    // Підказки для полів вводу
    $('#name, #orderName, #profileName').on('focus', function() {
        $(this).attr('placeholder', 'Наприклад: Петренко Марія Іванівна');
    }).on('blur', function() {
        $(this).attr('placeholder', '');
    });

    $('#email, #orderEmail, #profileEmail').on('focus', function() {
        $(this).attr('placeholder', 'Наприклад: maria@ukr.net');
    }).on('blur', function() {
        $(this).attr('placeholder', '');
    });

    $('#message, #orderComment').on('focus', function() {
        $(this).attr('placeholder', 'Опишіть ваше питання або пропозицію...');
    }).on('blur', function() {
        $(this).attr('placeholder', '');
    });

    // ============================================================================
    // 7. Кошик та замовлення
    // ============================================================================
    // Відкриття/закриття кошика
    $('#cartIcon').on('click', function() {
        $('#cartPopup').fadeIn(200).addClass('active');
        renderCart();
    });

    $('#closeCart').on('click', function() {
        $('#cartPopup').fadeOut(200).removeClass('active');
    });

    $(document).on('mousedown', function(e) {
        if ($('#cartPopup').hasClass('active') && $(e.target).is('#cartPopup')) {
            $('#cartPopup').fadeOut(200).removeClass('active');
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

    // Функції для роботи з кошиком
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

    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        let count = cart.reduce((sum, item) => sum + item.qty, 0);
        $('#cartCount').text(count);
    }

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
                        <img src="${item.img}" alt="${item.title}" class="cart-item-img">
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

    // Обробники подій для кошика
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

    $(document).on('click', '.remove-cart-item', function() {
        let idx = $(this).data('idx');
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.splice(idx, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    });

    // Ініціалізація кошика
    updateCartCount();

    // ============================================================================
    // 8. Особистий кабінет
    // ============================================================================
    if (window.location.pathname.includes('account.html')) {
        // Завантаження профілю
        function loadProfile() {
            const profile = JSON.parse(localStorage.getItem('profile') || '{}');
            if (profile.name) $('#profileName').val(profile.name);
            if (profile.email) $('#profileEmail').val(profile.email);
            if (profile.phone) $('#profilePhone').val(profile.phone);
            if (profile.address) $('#profileAddress').val(profile.address);
            if (profile.avatar) $('.profile-avatar').attr('src', profile.avatar);
        }
        loadProfile();

        // Зміна аватара
        $(document).on('click', '.change-avatar-btn', function(e) {
            e.preventDefault();
            $('#avatarInput').click();
        });

        $('#avatarInput').on('change', function(e) {
            const file = this.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    $('.profile-avatar').attr('src', ev.target.result);
                    let profile = JSON.parse(localStorage.getItem('profile') || '{}');
                    profile.avatar = ev.target.result;
                    localStorage.setItem('profile', JSON.stringify(profile));
                };
                reader.readAsDataURL(file);
            }
        });

        // Відображення замовлень
        function renderOrders() {
            let orders = JSON.parse(localStorage.getItem('orders') || '[]');
            let $list = $('.orders-list');
            $list.empty();

            if (!orders.length) {
                $list.html('<div class="no-orders">У вас ще немає замовлень.</div>');
                return;
            }

            orders.reverse().forEach((order, idx) => {
                let itemsHtml = order.items.map(item =>
                    `<div class="order-item-details">
                        <img src="${item.img}" alt="" class="order-item-img">
                        <span>${item.title} <span class="order-item-qty">x${item.qty}</span></span>
                        <span class="order-item-price">${item.price * item.qty} грн</span>
                    </div>`
                ).join('');

                $list.append(`
                    <div class="order-item" data-order-idx="${orders.length-1-idx}">
                        <div class="order-header">
                            <span><i class="fas fa-calendar"></i> ${order.date}</span>
                            <span class="order-status success">Оформлено</span>
                            <span class="order-total">${order.total} грн</span>
                        </div>
                        <div class="order-details">
                            <div class="order-items">${itemsHtml}</div>
                            <div class="order-customer">${order.name}, ${order.phone}, ${order.email}</div>
                            ${order.comment ? `<div class="order-comment">${order.comment}</div>` : ''}
                            <button class="cancel-order-btn" data-idx="${orders.length-1-idx}">
                                <i class="fas fa-times-circle"></i> Відмінити замовлення
                            </button>
                        </div>
                    </div>
                `);
            });
        }
        renderOrders();

        // Відображення улюблених товарів
        function renderFavorites() {
            const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
            const $grid = $('.favorites-grid');
            $grid.empty();

            if (!favs.length) {
                $grid.html('<div class="no-favorites">У вас ще немає улюблених товарів.</div>');
                return;
            }

            favs.forEach((item, i) => {
                $grid.append(`
                    <div class="favorite-item">
                        <div class="favorite-item-inner">
                            <img src="${item.img}" alt="${item.title}" class="favorite-item-img">
                            <div class="favorite-item-title">${item.title}</div>
                            <div class="favorite-item-price">${item.price} грн</div>
                        </div>
                        <button class="remove-favorite-btn" data-idx="${i}" title="Видалити">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `);
            });
        }
        renderFavorites();
    }

    // ============================================================================
    // 9. Улюблені товари
    // ============================================================================
    function getFavorites() {
        return JSON.parse(localStorage.getItem('favorites') || '[]');
    }

    function setFavorites(favs) {
        localStorage.setItem('favorites', JSON.stringify(favs));
    }

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

    function updateFavoriteBtns() {
        const favs = getFavorites();
        $('.catalog-item').each(function() {
            const title = $(this).find('h3').text();
            $(this).find('.favorite-btn').toggleClass('active', favs.find(f => f.title === title));
        });
    }
    updateFavoriteBtns();

    // ============================================================================
    // 10. Ініціалізація додаткових функцій
    // ============================================================================
    // Галерея
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
            responsive: [
                { breakpoint: 900, settings: { slidesToShow: 2 } },
                { breakpoint: 600, settings: { slidesToShow: 1 } }
            ]
        });
    }
});
