let isLoggedIn = false;

function updateAuthButton() {
    const authButton = document.getElementById('authButton');
    const path = window.location.pathname;
    
    // Визначаємо, де знаходиться файл
    const isMainPage = path.endsWith('index.html') || path.endsWith('/');
    const isInCategories = path.includes('/categories/');
    
    // Встановлюємо правильний шлях до login.html
    let loginPath;
    if (isMainPage) {
        loginPath = 'pages/login.html';
    } else if (isInCategories) {
        loginPath = '../pages/login.html';
    } else {
        loginPath = 'login.html';
    }
    
    if (isLoggedIn) {
        authButton.innerHTML = `
            <a href="#" class="login-btn" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i> Вийти
            </a>
        `;
        
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    } else {
        authButton.innerHTML = `
            <a href="${loginPath}" class="login-btn" id="loginBtn">
                <i class="fas fa-sign-in-alt"></i> Увійти
            </a>
        `;
    }
}

function logout() {
    isLoggedIn = false;
    localStorage.setItem('isLoggedIn', 'false');
    updateAuthButton();
    
    const path = window.location.pathname;
    const isMainPage = path.endsWith('index.html') || path.endsWith('/');
    const isInCategories = path.includes('/categories/');
    
    // Правильне перенаправлення при виході
    if (isMainPage) {
        window.location.href = 'index.html';
    } else if (isInCategories) {
        window.location.href = '../index.html';
    } else {
        window.location.href = '../index.html';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    updateAuthButton();
});


// Додаємо функцію для обробки форми логіну
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Тут можна додати валідацію
            if (!email || !password) {
                alert('Будь ласка, заповніть всі поля');
                return;
            }
            
            // Імітація успішної авторизації
            // В реальному проекті тут був би запит до сервера
            login();
            
            // Перенаправлення на особистий кабінет
            const path = window.location.pathname;
            const isInCategories = path.includes('/categories/');
            
            if (isInCategories) {
                window.location.href = '../pages/account.html';
            } else {
                window.location.href = 'account.html';
            }
        });
    }
    
    // Перевіряємо стан авторизації при завантаженні
    isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    updateAuthButton();
});