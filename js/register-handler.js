// Обработчик кнопки "Регистрация"
class RegisterHandler {
    static init() {
        // Обработка кнопки регистрации в навигации
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('register-btn') || 
                e.target.closest('.register-btn')) {
                e.preventDefault();
                RegisterHandler.showRegisterModal();
            }
        });

        // Обработка формы регистрации
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', RegisterHandler.handleRegister);
        }
    }

    static showRegisterModal() {
        // Создаем модальное окно регистрации, если его нет
        if (!document.getElementById('registerModal')) {
            RegisterHandler.createRegisterModal();
        }
        
        const modal = document.getElementById('registerModal');
        modal.style.display = 'block';
        document.getElementById('registerUsername').focus();
    }

    static createRegisterModal() {
        const modalHTML = `
            <div id="registerModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="RegisterHandler.closeModal()">&times;</span>
                    <h2>Регистрация в CollabSpace</h2>
                    <form id="registerForm">
                        <div class="form-group">
                            <input type="text" id="registerUsername" placeholder="Имя пользователя" required>
                            <div class="field-hint">3-20 символов (буквы, цифры, подчеркивания)</div>
                        </div>
                        <div class="form-group">
                            <input type="email" id="registerEmail" placeholder="Email (для восстановления)" required>
                        </div>
                        <div class="form-group">
                            <input type="password" id="registerPassword" placeholder="Пароль" required>
                            <div class="field-hint">Минимум 6 символов</div>
                        </div>
                        <div class="form-group">
                            <input type="password" id="confirmPassword" placeholder="Подтвердите пароль" required>
                        </div>
                        
                        <div class="agreements-section">
                            <div class="checkbox-group">
                                <input type="checkbox" id="agreeTerms" required>
                                <label for="agreeTerms">
                                    Я принимаю <a href="terms.html" target="_blank">Условия использования</a>
                                </label>
                            </div>
                            <div class="checkbox-group">
                                <input type="checkbox" id="agreePrivacy" required>
                                <label for="agreePrivacy">
                                    Я согласен с <a href="privacy-policy.html" target="_blank">Политикой конфиденциальности</a>
                                </label>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn primary full-width">Зарегистрироваться</button>
                    </form>
                    <div class="auth-links">
                        <span>Уже есть аккаунт? <a href="#" onclick="RegisterHandler.switchToLogin()">Войти</a></span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Обработка закрытия по клику вне модального окна
        document.getElementById('registerModal').addEventListener('click', function(e) {
            if (e.target === this) {
                RegisterHandler.closeModal();
            }
        });

        // Валидация в реальном времени
        RegisterHandler.setupRealTimeValidation();
    }

    static setupRealTimeValidation() {
        const usernameInput = document.getElementById('registerUsername');
        const emailInput = document.getElementById('registerEmail');
        const passwordInput = document.getElementById('registerPassword');
        const confirmInput = document.getElementById('confirmPassword');

        if (usernameInput) {
            usernameInput.addEventListener('blur', RegisterHandler.validateUsername);
        }
        if (emailInput) {
            emailInput.addEventListener('blur', RegisterHandler.validateEmail);
        }
        if (passwordInput) {
            passwordInput.addEventListener('input', RegisterHandler.validatePassword);
        }
        if (confirmInput) {
            confirmInput.addEventListener('input', RegisterHandler.validatePasswordMatch);
        }
    }

    static validateUsername() {
        const username = document.getElementById('registerUsername').value;
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        
        if (!username) return true;
        
        if (!usernameRegex.test(username)) {
            RegisterHandler.showFieldError('registerUsername', 'Имя пользователя должно содержать 3-20 символов (только буквы, цифры и подчеркивания)');
            return false;
        }
        
        // Проверка уникальности имени пользователя
        if (!Auth.isUsernameUnique(username)) {
            RegisterHandler.showFieldError('registerUsername', 'Это имя пользователя уже занято');
            return false;
        }
        
        RegisterHandler.showFieldSuccess('registerUsername');
        return true;
    }

    static validateEmail() {
        const email = document.getElementById('registerEmail').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) return true;
        
        if (!emailRegex.test(email)) {
            RegisterHandler.showFieldError('registerEmail', 'Введите корректный email адрес');
            return false;
        }
        
        // Проверка уникальности email
        if (!Auth.isEmailUnique(email)) {
            RegisterHandler.showFieldError('registerEmail', 'Этот email уже используется');
            return false;
        }
        
        RegisterHandler.showFieldSuccess('registerEmail');
        return true;
    }

    static validatePassword() {
        const password = document.getElementById('registerPassword').value;
        
        if (!password) return true;
        
        if (password.length < 6) {
            RegisterHandler.showFieldError('registerPassword', 'Пароль должен содержать минимум 6 символов');
            return false;
        }
        
        RegisterHandler.showFieldSuccess('registerPassword');
        return true;
    }

    static validatePasswordMatch() {
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!confirmPassword) return true;
        
        if (password !== confirmPassword) {
            RegisterHandler.showFieldError('confirmPassword', 'Пароли не совпадают');
            return false;
        }
        
        RegisterHandler.showFieldSuccess('confirmPassword');
        return true;
    }

    static showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.classList.add('error');
        field.classList.remove('success');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    static showFieldSuccess(fieldId) {
        const field = document.getElementById(fieldId);
        field.classList.remove('error');
        field.classList.add('success');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    static async handleRegister(e) {
        e.preventDefault();
        
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        const agreePrivacy = document.getElementById('agreePrivacy').checked;

        // Валидация всех полей
        const isUsernameValid = RegisterHandler.validateUsername();
        const isEmailValid = RegisterHandler.validateEmail();
        const isPasswordValid = RegisterHandler.validatePassword();
        const isPasswordMatchValid = RegisterHandler.validatePasswordMatch();

        if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isPasswordMatchValid) {
            alert('Исправьте ошибки в форме');
            return;
        }

        if (!agreeTerms) {
            alert('Необходимо принять Условия использования');
            return;
        }

        if (!agreePrivacy) {
            alert('Необходимо согласие с Политикой конфиденциальности');
            return;
        }

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Показываем индикатор загрузки
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';
            submitBtn.disabled = true;

            // Имитация задержки для реалистичности
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Выполняем регистрацию
            Auth.register(username, email, password);
            
            // Успешная регистрация
            RegisterHandler.closeModal();
            alert('Регистрация успешна! Добро пожаловать, ' + username + '!');
            
            // Редирект в личный кабинет
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            alert('Ошибка регистрации: ' + error.message);
        } finally {
            // Восстанавливаем кнопку
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    static closeModal() {
        const modal = document.getElementById('registerModal');
        if (modal) {
            modal.style.display = 'none';
            // Очищаем форму
            const form = document.getElementById('registerForm');
            if (form) form.reset();
            
            // Убираем сообщения об ошибках
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            document.querySelectorAll('.error, .success').forEach(el => {
                el.classList.remove('error', 'success');
            });
        }
    }

    static switchToLogin() {
        RegisterHandler.closeModal();
        LoginHandler.showLoginModal();
    }
}
