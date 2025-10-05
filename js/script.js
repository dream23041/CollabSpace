// Хранилище пользователей (в реальном проекте это будет база данных)
let users = JSON.parse(localStorage.getItem('collabspace_users')) || [];

// Текущий пользователь
let currentUser = JSON.parse(localStorage.getItem('collabspace_current_user')) || null;

// Функции для модальных окон
function showLogin() {
    closeAllModals();
    document.getElementById('loginModal').style.display = 'block';
}

function showRegister() {
    closeAllModals();
    document.getElementById('registerModal').style.display = 'block';
}

function showForgotPassword() {
    closeAllModals();
    document.getElementById('forgotPasswordModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    clearFormErrors(modalId);
}

function closeAllModals() {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        modal.style.display = 'none';
        clearFormErrors(modal.id);
    }
}

function switchToRegister() {
    closeAllModals();
    showRegister();
}

function switchToLogin() {
    closeAllModals();
    showLogin();
}

// Очистка ошибок формы
function clearFormErrors(modalId) {
    const form = document.querySelector(#${modalId} form);
    if (form) {
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.textContent = '');
        
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => input.classList.remove('error'));
    }
}

// Валидация форм
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateUsername(username) {
    return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
}

// Показать ошибку
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(inputId + 'Error');
    
    if (input && errorElement) {
        input.classList.add('error');
        errorElement.textContent = message;
    }
}

// Очистить ошибку
function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(inputId + 'Error');
    
    if (input && errorElement) {
        input.classList.remove('error');
        errorElement.textContent = '';
    }
}

// Обработка регистрации
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    let isValid = true;
    
    // Валидация имени пользователя
    if (!validateUsername(username)) {
        showError('username', 'Имя пользователя должно содержать минимум 3 символа (только буквы, цифры и подчеркивания)');
        isValid = false;
    } else {
        clearError('username');
    }
    
    // Валидация email
    if (!validateEmail(email)) {
        showError('email', 'Введите корректный email адрес');
        isValid = false;
    } else if (users.find(user => user.email === email)) {
        showError('email', 'Пользователь с таким email уже существует');
        isValid = false;
    } else {
        clearError('email');
    }
    
    // Валидация пароля
    if (!validatePassword(password)) {
        showError('password', 'Пароль должен содержать минимум 6 символов');
        isValid = false;
    } else {
        clearError('password');
    }
    
    // Подтверждение пароля
    if (password !== confirmPassword) {
        showError('confirmPassword', 'Пароли не совпадают');
        isValid = false;
    } else {
        clearError('confirmPassword');
    }
    
    // Согласие с условиями
    if (!agreeTerms) {
        showError('terms', 'Необходимо согласие с условиями использования');
        isValid = false;
    } else {
        clearError('terms');
    }
    
    if (isValid) {
        // Регистрация пользователя
        const newUser = {
            id: Date.now().toString(),
            username: username,
            email: email,
            password: password, // В реальном проекте пароль должен хэшироваться!
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('collabspace_users', JSON.stringify(users));
        
        // Автоматический вход после регистрации
        currentUser = newUser;
        localStorage.setItem('collabspace_current_user', JSON.stringify(currentUser));
        
        // Показать сообщение об успехе
        alert(Добро пожаловать в CollabSpace, ${username}!);
        
        // Закрыть модальное окно и обновить интерфейс
        closeModal('registerModal');
        updateUI();
    }
});

// Обработка входа
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    let isValid = true;
    
    // Валидация email
    if (!validateEmail(email)) {
        showError('loginEmail', 'Введите корректный email адрес');
        isValid = false;
    } else {
        clearError('loginEmail');
    }
    
    // Валидация пароля
    if (!password) {
        showError('loginPassword', 'Введите пароль');
        isValid = false;
    } else {
        clearError('loginPassword');
    }
    
    if (isValid) {
        // Поиск пользователя
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Успешный вход
            currentUser = user;
            localStorage.setItem('collabspace_current_user', JSON.stringify(currentUser));
            
            // Показать сообщение об успехе
            alert(С возвращением, ${user.username}!);
            
            // Закрыть модальное окно и обновить интерфейс
            closeModal('loginModal');
            updateUI();
        } else {
            showError('loginPassword', 'Неверный email или пароль');
        }
    }
});

// Обработка восстановления пароля
document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    if (!validateEmail(email)) {
        showError('forgotEmail', 'Введите корректный email адрес');
        return;
    }
    
    // В реальном проекте здесь будет отправка email
    alert(Ссылка для сброса пароля отправлена на ${email});
    closeModal('forgotPasswordModal');
});

// Обновление интерфейса после входа/выхода
function updateUI() {
    const navLinks = document.querySelector('.nav-links');
    
    if (currentUser) {
        // Пользователь вошел в систему
        navLinks.innerHTML = `
            <a href="#features">Возможности</a>
            <a href="#about">О проекте</a>
            <div class="user-menu">
                <span class="user-greeting">Привет, ${currentUser.username}!</span>
                <button class="btn logout-btn" onclick="logout()">Выйти</button>
            </div>
        `;
    } else {
        // Пользователь не вошел в систему
        navLinks.innerHTML = `
            <a href="#features">Возможности</a>
            <a href="#about">О проекте</a>
            <a href="#" class="login-btn" onclick="showLogin()">Войти</a>
            <a href="#" class="register-btn" onclick="showRegister()">Регистрация</a>
        `;
    }
}

// Выход из системы
function logout() {
    currentUser = null;
    localStorage.removeItem('collabspace_current_user');
    updateUI();
    alert('Вы вышли из системы');
}

// Вспомогательные функции
function showDemo() {
    alert('Демо-режим будет доступен после реализации основного функционала!');
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target == modal) {
            closeModal(modal.id);
        }
    }
}

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateUI();
    
    // Добавляем валидацию в реальном времени
    document.getElementById('confirmPassword')?.addEventListener('input', function() {
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = this.value;
        
        if (confirmPassword && password !== confirmPassword) {
            showError('confirmPassword', 'Пароли не совпадают');
        } else {
            clearError('confirmPassword');
        }
    });
    
    document.getElementById('registerPassword')?.addEventListener('input', function() {
        const password = this.value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (confirmPassword && password !== confirmPassword) {
            showError('confirmPassword', 'Пароли не совпадают');
        } else {
            clearError('confirmPassword');
        }
    });
});
