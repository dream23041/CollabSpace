// Управление интерфейсом
const UI = {
    init() {
        this.bindEvents();
        this.updateUI();
    },

    // Привязка событий
    bindEvents() {
        // Кнопки навигации
        document.getElementById('loginBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLogin();
        });

        document.getElementById('registerBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegister();
        });

        document.getElementById('startFreeBtn').addEventListener('click', () => {
            this.showRegister();
        });

        document.getElementById('demoBtn').addEventListener('click', () => {
            this.showDemo();
        });

        // Закрытие модальных окон
        document.getElementById('closeLogin').addEventListener('click', () => {
            this.closeModal('loginModal');
        });

        document.getElementById('closeRegister').addEventListener('click', () => {
            this.closeModal('registerModal');
        });

        document.getElementById('closeForgotPassword').addEventListener('click', () => {
            this.closeModal('forgotPasswordModal');
        });

        // Переключение между формами
        document.getElementById('switchToRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchToRegister();
        });

        document.getElementById('switchToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchToLogin();
        });

        document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showForgotPassword();
        });

        document.getElementById('backToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchToLogin();
        });

        // Формы
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            this.handleLogin(e);
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            this.handleRegister(e);
        });

        document.getElementById('forgotPasswordForm').addEventListener('submit', (e) => {
            this.handleForgotPassword(e);
        });

        // Закрытие по клику вне модального окна
        window.addEventListener('click', (e) => {
            this.handleOutsideClick(e);
        });

        // Плавная прокрутка
        this.bindSmoothScroll();
        
        // Валидация в реальном времени
        this.bindRealTimeValidation();
    },

    // Показать форму входа
    showLogin() {
        this.closeAllModals();
        document.getElementById('loginModal').style.display = 'block';
    },

    // Показать форму регистрации
    showRegister() {
        this.closeAllModals();
        document.getElementById('registerModal').style.display = 'block';
    },

    // Показать форму восстановления пароля
    showForgotPassword() {
        this.closeAllModals();
        document.getElementById('forgotPasswordModal').style.display = 'block';
    },

    // Закрыть модальное окно
    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        this.clearFormErrors(modalId);
    },

    // Закрыть все модальные окна
    closeAllModals() {
        const modals = document.getElementsByClassName('modal');
        for (let modal of modals) {
            modal.style.display = 'none';
            this.clearFormErrors(modal.id);
        }
    },

    // Переключиться на регистрацию
    switchToRegister() {
        this.closeAllModals();
        this.showRegister();
    },

    // Переключиться на вход
    switchToLogin() {
        this.closeAllModals();
        this.showLogin();
    },

    // Обработка входа
    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        this.clearFormErrors('loginModal');

        try {
            // Валидация
            if (!Auth.validateEmail(email)) {
                throw new Error('Введите корректный email адрес', 'loginEmail');
            }

            if (!password) {
                throw new Error('Введите пароль', 'loginPassword');
            }

            // Попытка входа
            const user = Auth.login(email, password);
            
            // Успешный вход
            this.showSuccess(С возвращением, ${user.username}!);
            this.closeModal('loginModal');
            this.updateUI();
            
        } catch (error) {
            this.showError(error.message, error.field);
        }
    },

    // Обработка регистрации
    handleRegister(e) {
        e.preventDefault();
        
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        this.clearFormErrors('registerModal');

        try {
            // Валидация
            if (!Auth.validateUsername(username)) {
                throw new Error('Имя пользователя должно содержать минимум 3 символа (только буквы, цифры и подчеркивания)', 'username');
            }

            if (!Auth.validateEmail(email)) {
                throw new Error('Введите корректный email адрес', 'email');
            }

            if (!Auth.validatePassword(password)) {
                throw new Error('Пароль должен содержать минимум 6 символов', 'password');
            }

            if (password !== confirmPassword) {
                throw new Error('Пароли не совпадают', 'confirmPassword');
            }

            if (!agreeTerms) {
                throw new Error('Необходимо согласие с условиями использования', 'terms');
            }

            // Регистрация
            const user = Auth.register(username, email, password);
            
            // Успешная регистрация
            this.showSuccess(Добро пожаловать в CollabSpace, ${username}!);
            this.closeModal('registerModal');
            this.updateUI();
            
        } catch (error) {
            this.showError(error.message, error.field);
        }
    },

    // Обработка восстановления пароля
    handleForgotPassword(e) {
        e.preventDefault();
        
        const email = document.getElementById('forgotEmail').value;
        
        this.clearFormErrors('forgotPasswordModal');

        try {
            if (!Auth.validateEmail(email)) {
                throw new Error('Введите корректный email адрес', 'forgotEmail');
            }

            // В реальном проекте здесь будет отправка email
            this.showSuccess(Ссылка для сброса пароля отправлена на ${email});
            this.closeModal('forgotPasswordModal');
            
        } catch (error) {
            this.showError(error.message, error.field);
        }
    },

    // Показать ошибку
    showError(message, field = null) {
        if (field) {
            const input = document.getElementById(field);
            const errorElement = document.getElementById(field + 'Error');
            
            if (input && errorElement) {
                input.classList.add('error');
                errorElement.textContent = message;
            }
        } else {
            alert('Ошибка: ' + message);
        }
    },

    // Показать успех
    showSuccess(message) {
        alert(message);
    },

    // Очистить ошибки формы
    clearFormErrors(modalId) {
        const form = document.querySelector(#${modalId} form);
        if (form) {
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(error => error.textContent = '');
            
            const inputs = form.querySelectorAll('input');
            inputs.forEach(input => input.classList.remove('error'));
        }
    },

    // Обновление интерфейса
    updateUI() {
        const navLinks = document.getElementById('navLinks');
        const user = Auth.getCurrentUser();
        
        if (user) {
            // Пользователь вошел в систему
            navLinks.innerHTML = `
                <a href="#features">Возможности</a>
                <a href="#about">О проекте</a>
                <div class="user-menu">
                    <span class="user-greeting">Привет, ${user.username}!</span>
                    <button class="btn logout-btn" id="logoutBtn">Выйти</button>
                </div>
            `;
            
            // Привязать событие выхода
            document.getElementById('logoutBtn').addEventListener('click', () => {
                this.handleLogout();
            });
        } else {
            // Пользователь не вошел в систему
            navLinks.innerHTML = `
                <a href="#features">Возможности</a>
                <a href="#about">О проекте</a>
                <a href="#" class="login-btn" id="loginBtn">Войти</a>
                <a href="#" class="register-btn" id="registerBtn">Регистрация</a>
            `;
            
            // Перепривязать события
            document.getElementById('loginBtn').addEventListener('click', (e) => {
                e.preventDefault();
                this.showLogin();
            });
            
            document.getElementById('registerBtn').addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegister();
            });
        }
    },

    // Обработка выхода
    handleLogout() {
        Auth.logout();
        this.showSuccess('Вы вышли из системы');
        this.updateUI();
    },

    // Демо
    showDemo() {
        this.showSuccess('Демо-режим будет доступен после реализации основного функционала!');
    },

    // Обработка клика вне модального окна
    handleOutsideClick(e) {
        const modals = document.getElementsByClassName('modal');
        for (let modal of modals) {
            if (e.target == modal) {
                this.closeModal(modal.id);
            }
        }
    },

    // Плавная прокрутка
    bindSmoothScroll() {
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
    },

    // Валидация в реальном времени
    bindRealTimeValidation() {
        const confirmPassword = document.getElementById('confirmPassword');
        const registerPassword = document.getElementById('registerPassword');
        
        if (confirmPassword && registerPassword) {
            confirmPassword.addEventListener('input', () => {
                this.validatePasswordMatch();
            });
            
            registerPassword.addEventListener('input', () => {
                this.validatePasswordMatch();
            });
        }
    },

    // Проверка совпадения паролей
    validatePasswordMatch() {
        const password = document.getElementById('registerPassword')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.showError('Пароли не совпадают', 'confirmPassword');
        } else {
            this.clearError('confirmPassword');
        }
    },

    // Очистить конкретную ошибку
    clearError(field) {
        const input = document.getElementById(field);
        const errorElement = document.getElementById(field + 'Error');
        
        if (input && errorElement) {
            input.classList.remove('error');
            errorElement.textContent = '';
        }
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    UI.init();
});
