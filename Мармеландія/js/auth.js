import { login as apiLogin, logout as apiLogout } from './api/auth.js';

let isLoggedIn = false;

function showError(selector, message) {
    const errorElement = document.querySelector(`${selector} + .error-message`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

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
        
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
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

// Функція для входу
async function login(email, password) {
    try {
        const data = await apiLogin(email, password);
        isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', data.token);
        updateAuthButton();
        return data;
    } catch (error) {
        throw error;
    }
}

// Функція для виходу
function logout() {
    isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    apiLogout();
    updateAuthButton();
}

document.addEventListener('DOMContentLoaded', () => {
    // Перевіряємо стан авторизації при завантаженні
    isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    updateAuthButton();

    // Додаємо обробник форми логіну
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail')?.value;
            const password = document.getElementById('loginPassword')?.value;
            
            // Валідація
            let isValid = true;
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showError('#loginEmail', 'Некоректний email');
                isValid = false;
            } else if (/.ru$/.test(email)) {
                showError('#loginEmail', 'Домени .ru не дозволені');
                isValid = false;
            }
            
            if (!password) {
                showError('#loginPassword', 'Введіть пароль');
                isValid = false;
            }
            
            if (!isValid) return;
            
            try {
                await login(email, password);
                
                // Перенаправлення на особистий кабінет
                const path = window.location.pathname;
                if (path.includes('/categories/')) {
                    window.location.href = '../pages/account.html';
                } else if (path.includes('/pages/')) {
                    window.location.href = 'account.html';
                } else {
                    window.location.href = 'pages/account.html';
                }
            } catch (error) {
                showError('#loginPassword', error.message || 'Помилка входу в систему');
            }
        });
    }
});