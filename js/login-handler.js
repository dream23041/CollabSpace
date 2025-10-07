// Обработчик кнопки "Войти"
class LoginHandler {
    static init() {
        // Обработка кнопки входа в навигации
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('login-btn') || 
                e.target.closest('.login-btn')) {
                e.preventDefault();
                LoginHandler.showLoginModal();
            }
        });

        // Обработка формы входа
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', LoginHandler.handleLogin);
        }
    }

    static showLoginModal() {
        // Создаем модальное окно входа, если его нет
        if (!document.getElementById('loginModal')) {
            LoginHandler.createLoginModal();
        }
        
        const modal = document.getElementById('loginModal');
        modal.style.display = 'block';
        document.getElementById('loginUsername').focus();
    }

    static createLoginModal() {
        const modalHTML = `
            <div id="loginModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="LoginHandler.closeModal()">&times;</span>
                    <h2>Вход в CollabSpace</h2>
                    <form id="loginForm">
                        <div class="form-group">
                            <input type="text" id="loginUsername" placeholder="Имя пользователя" required>
                        </div>
                        <div class="form-group">
                            <input type="password" id="loginPassword" placeholder="Пароль" required>
                        </div>
                        <button type="submit" class="btn primary full-width">Войти</button>
                    </form>
                    <div class="auth-links">
                        <a href="#" onclick="LoginHandler.showForgotPassword()">Забыли пароль?</a>
                        <span>Нет аккаунта? <a href="#" onclick="LoginHandler.switchToRegister()">Зарегистрироваться</a></span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Обработка закрытия по клику вне модального окна
        document.getElementById('loginModal').addEventListener('click', function(e) {
            if (e.target === this) {
                LoginHandler.closeModal();
            }
        });
    }

    static async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!username || !password) {
            alert('Заполните все поля');
            return;
        }

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Показываем индикатор загрузки
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход...';
            submitBtn.disabled = true;

            // Имитация задержки для реалистичности
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Выполняем вход
            Auth.login(username, password);
            
            // Успешный вход
            LoginHandler.closeModal();
            alert('Вход выполнен! Добро пожаловать, ' + username + '!');
            
            // Редирект в личный кабинет
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            alert('Ошибка входа: ' + error.message);
        } finally {
            // Восстанавливаем кнопку
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    static closeModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'none';
            // Очищаем форму
            const form = document.getElementById('loginForm');
            if (form) form.reset();
        }
    }

    static showForgotPassword() {
        alert('Функция восстановления пароля будет доступна в следующем обновлении!');
    }

    static switchToRegister() {
        LoginHandler.closeModal();
        RegisterHandler.showRegisterModal();
    }
}
