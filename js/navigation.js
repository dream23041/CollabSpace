// Умная навигационная система
class Navigation {
    static updateNavigation() {
        const currentUser = Auth.getCurrentUser();
        const navLinks = document.getElementById('navLinks');
        
        if (!navLinks) return;
        
        if (currentUser) {
            // Навигация для авторизованного пользователя
            navLinks.innerHTML = `
                <a href="dashboard.html">Личный кабинет</a>
                <a href="about.html">О нас</a>
                <a href="support.html">Поддержка</a>
                <a href="contact.html">Контакты</a>
                <div class="user-nav">
                    <span class="user-greeting">Привет, ${currentUser.username}!</span>
                    <div class="avatar-small">${currentUser.username.charAt(0).toUpperCase()}</div>
                    <div class="dropdown">
                        <button class="user-btn" id="userMenuBtn">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu" id="userDropdown">
                            <a href="dashboard.html" class="dropdown-item">
                                <i class="fas fa-home"></i>
                                Личный кабинет
                            </a>
                            <a href="support.html" class="dropdown-item">
                                <i class="fas fa-headset"></i>
                                Поддержка
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item" onclick="Navigation.logout()">
                                <i class="fas fa-sign-out-alt"></i>
                                Выйти
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            this.bindUserMenuEvents();
        } else {
            // Навигация для неавторизованного пользователя
            navLinks.innerHTML = `
                <a href="index.html">Главная</a>
                <a href="about.html">О нас</a>
                <a href="support.html">Поддержка</a>
                <a href="contact.html">Контакты</a>
                <button class="login-btn" onclick="location.href='index.html'">Войти</button>
                <button class="register-btn" onclick="location.href='index.html'">Регистрация</button>
            `;
        }
    }
    
    static bindUserMenuEvents() {
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });
            
            // Закрытие dropdown при клике вне
            document.addEventListener('click', () => {
                userDropdown.classList.remove('show');
            });
        }
    }
    
    static logout() {
        if (confirm('Вы уверены, что хотите выйти?')) {
            Auth.logout();
            window.location.href = 'index.html';
        }
    }
    
    // Проверка авторизации для защищенных страниц
    static checkAuth(redirectTo = 'index.html') {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser && redirectTo) {
            window.location.href = redirectTo;
            return false;
        }
        return !!currentUser;
    }
    
    // Проверка для публичных страниц (просто обновляем навигацию)
    static initPublicPage() {
        this.updateNavigation();
    }
}

// Автоматическое обновление навигации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    Navigation.updateNavigation();
});
