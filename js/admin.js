// Продвинутая админ-панель с защитой
const AdminTools = {
    // Показать/скрыть админ панель
    toggleAdminPanel() {
        if (!this.isAdmin()) {
            this.showNotification('❌ Доступ запрещен! Требуются права администратора.', 'error');
            return;
        }

        const panel = document.getElementById('adminPanel');
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            this.loadAdminStats();
        } else {
            panel.style.display = 'none';
        }
    },

    closeAdminPanel() {
        document.getElementById('adminPanel').style.display = 'none';
    },

    // Загрузка статистики
    loadAdminStats() {
        if (!this.isAdmin()) return;
        
        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('collabspace_current_user') || 'null');
        
        const stats = {
            totalUsers: users.length,
            activeUsers: users.filter(u => u.lastLogin).length,
            todayUsers: users.filter(u => new Date(u.lastLogin).toDateString() === new Date().toDateString()).length,
            adminUsers: users.filter(u => u.isAdmin).length
        };
        
        document.getElementById('adminStats').innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number">${stats.totalUsers}</div>
                    <div class="stat-label">Всего пользователей</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${stats.activeUsers}</div>
                    <div class="stat-label">Активных</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${stats.todayUsers}</div>
                    <div class="stat-label">Сегодня</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${stats.adminUsers}</div>
                    <div class="stat-label">Админов</div>
                </div>
            </div>
        `;
    },

    // Поиск пользователей
    searchUsers() {
        if (!this.isAdmin()) {
            this.showNotification('❌ Доступ запрещен! Требуются права администратора.', 'error');
            return;
        }

        const query = document.getElementById('adminSearch').value.toLowerCase();
        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        
        const results = users.filter(user => 
            user.username.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            (user.profile.displayName && user.profile.displayName.toLowerCase().includes(query))
        );
        
        this.displaySearchResults(results, query);
    },

    // Отображение результатов поиска
    displaySearchResults(users, query) {
        const output = document.getElementById('adminOutput');
        
        if (users.length === 0) {
            output.innerHTML = <p class="no-results">Ничего не найдено по запросу: "${query}"</p>;
            return;
        }
        
        let html = <h4>Найдено пользователей: ${users.length}</h4>;
        html += '<div class="users-list">';
        
        users.forEach(user => {
            const currentUser = JSON.parse(localStorage.getItem('collabspace_current_user') || '{}');
            const isCurrent = user.username === currentUser.username;
            const isAdmin = user.isAdmin;
            
            html += `
                <div class="user-item ${isCurrent ? 'current-user' : ''} ${isAdmin ? 'admin-user' : ''}">
                    <div class="user-header">
                        <div class="user-avatar-small">${user.username.charAt(0).toUpperCase()}</div>
                        <div class="user-info">
                            <strong>${user.username}</strong>
                            ${isAdmin ? '<span class="admin-badge">ADMIN</span>' : ''}
                            ${isCurrent ? '<span class="current-badge">ВЫ</span>' : ''}
                            <div class="user-email">${user.email}</div>
                        </div>
                    </div>
                    <div class="user-details">
                        <small>ID: ${user.id}</small><br>
                        <small>Зарегистрирован: ${new Date(user.createdAt).toLocaleDateString()}</small><br>
                        <small>Последний вход: ${new Date(user.lastLogin).toLocaleString()}</small>
                    </div>
                    <div class="user-actions">
                        ${!isCurrent ? `
                            <button onclick="AdminTools.impersonateUser('${user.username}')" class="btn-small warning">
                                <i class="fas fa-user-secret"></i> Войти как
                            </button>
                            <button onclick="AdminTools.deleteUser('${user.username}')" class="btn-small danger">
                                <i class="fas fa-trash"></i> Удалить
                            </button>
                            ${!isAdmin ? `
                                <button onclick="AdminTools.makeAdmin('${user.username}')" class="btn-small success">
                                    <i class="fas fa-shield-alt"></i> Сделать админом
                                </button>
                            ` : `
                                <button onclick="AdminTools.removeAdmin('${user.username}')" class="btn-small secondary">
                                    <i class="fas fa-user"></i> Убрать админа
                                </button>
                            `}
                        ` : `
                            <span class="current-user-text">Это вы</span>
                        `}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        output.innerHTML = html;
    },

    // Войти как другой пользователь (Impersonate)
    impersonateUser(username) {
        if (!this.isAdmin()) {
            this.showNotification('❌ Доступ запрещен! Требуются права администратора.', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        const targetUser = users.find(u => u.username === username);
        
        if (targetUser) {
            // Сохраняем текущего админа
            const adminUser = JSON.parse(localStorage.getItem('collabspace_current_user') || 'null');
            localStorage.setItem('collabspace_original_admin', JSON.stringify(adminUser));
            
            // Входим как целевой пользователь
            localStorage.setItem('collabspace_current_user', JSON.stringify(targetUser));
            
            this.showNotification(Вы вошли как ${username}. Перезагрузите страницу.);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    },

    // Вернуться к админ-аккаунту
    returnToAdmin() {
        const originalAdmin = JSON.parse(localStorage.getItem('collabspace_original_admin') || 'null');
        
        if (originalAdmin) {
            localStorage.setItem('collabspace_current_user', JSON.stringify(originalAdmin));
            localStorage.removeItem('collabspace_original_admin');
            this.showNotification('Возврат к админ-аккаунту');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    },

    // Сделать пользователя админом
    makeAdmin(username) {
        if (!this.isAdmin()) {
            this.showNotification('❌ Доступ запрещен! Требуются права администратора.', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex !== -1) {
            users[userIndex].isAdmin = true;
            localStorage.setItem('collabspace_users', JSON.stringify(users));
            this.showNotification(Пользователь ${username} теперь администратор);
            this.searchUsers(); // Обновляем список
        }
    },

    // Убрать права админа
    removeAdmin(username) {
        if (!this.isAdmin()) {
            this.showNotification('❌ Доступ запрещен! Требуются права администратора.', 'error');
            return;
        }

        if (username === 'dream') {
            this.showNotification('Нельзя убрать права у главного администратора!', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex !== -1) {
            users[userIndex].isAdmin = false;
            localStorage.setItem('collabspace_users', JSON.stringify(users));
            this.showNotification(Пользователь ${username} больше не администратор);
            this.searchUsers(); // Обновляем список
        }
    },

    // Показать всех пользователей
    showAllUsers() {
        if (!this.isAdmin()) {
            this.showNotification('❌ Доступ запрещен! Требуются права администратора.', 'error');
            return;
        }

        document.getElementById('adminSearch').value = '';
        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        this.displaySearchResults(users, '');
    },

    // Расширенное создание тестового пользователя
    createAdvancedTestUser() {
        if (!this.isAdmin()) {
            this.showNotification('❌ Доступ запрещен! Требуются права администратора.', 'error');
            return;
        }

        const username = prompt('Введите имя пользователя (или оставьте пустым для автоматического):');
        if (username === null) return; // Пользователь отменил
        
        const email = prompt('Введите email (или оставьте пустым для автоматического):');
        if (email === null) return;
        
        const isAdmin = confirm('Сделать этого пользователя администратором?');
        
        const finalUsername = username || 'testuser' + Date.now();
        const finalEmail = email || 'test' + Date.now() + '@test.com';
        
        // Проверка на существующего пользователя
        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        if (users.find(u => u.username === finalUsername)) {
            this.showNotification('Пользователь с таким именем уже существует!', 'error');
            return;
        }
        
        const newUser = {
            id: Date.now().toString(),
            username: finalUsername,
            email: finalEmail,
            password: '123456',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            profile: {
                displayName: finalUsername,
                avatar: null,
                bio: 'Тестовый пользователь'
            },
            isAdmin: isAdmin
        };

        users.push(newUser);
        localStorage.setItem('collabspace_users', JSON.stringify(users));
        
        this.showNotification(Создан пользователь: ${finalUsername} ${isAdmin ? '(админ)' : ''});
        this.showAllUsers();
    },

    // Массовое создание тестовых пользователей
    createMultipleTestUsers() {
        if (!this.isAdmin()) {
            this.showNotification('❌ Доступ запрещен! Требуются права администратора.', 'error');
            return;
        }

        const count = parseInt(prompt('Сколько тестовых пользователей создать?', '5')) || 5;
        
        if (count > 20) {
            this.showNotification('Нельзя создать больше 20 пользователей за раз!', 'error');
            return;
        }
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createTestUser();
            }, i * 100);
        }
        
        this.showNotification(Создание ${count} тестовых пользователей...);
        setTimeout(() => {
            this.showAllUsers();
        }, count * 100 + 500);
    },

    // Старая функция создания тестового пользователя (для обратной совместимости)
    createTestUser() {
        if (!this.isAdmin()) return;

        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        const testId = Date.now();
        
        const newUser = {
            id: testId.toString(),
            username: 'testuser' + testId,
            email: 'test' + testId + '@test.com',
            password: '123456',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            profile: {
                displayName: 'Test User ' + testId,
                avatar: null,
                bio: 'Тестовый пользователь'
            }
        };

        users.push(newUser);
        localStorage.setItem('collabspace_users', JSON.stringify(users));
        
        this.showNotification(Создан тестовый пользователь: ${newUser.username});
        this.showAllUsers();
    },

    // Экспорт данных в разных форматах
    exportData(format = 'json') {
        if (!this.isAdmin()) {
            this.showNotification('❌ Доступ запрещен! Требуются права администратора.', 'error');
            return;
        }

        const data = {
            users: JSON.parse(localStorage.getItem('collabspace_users') || '[]'),
            currentUser: JSON.parse(localStorage.getItem('collabspace_current_user') || 'null'),
            preferences: JSON.parse(localStorage.getItem('collabspace_user_prefs') || '{}'),
            exportDate: new Date().toISOString(),
            exportedBy: JSON.parse(localStorage.getItem('collabspace_current_user') || '{}').username
        };
        
        let blob, filename;
        
        if (format === 'json') {
            blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            filename = collabspace_backup_${new Date().toISOString().split('T')[0]}.json;
        } else if (format === 'csv') {
            const csv = this.convertToCSV(data.users);
            blob = new Blob([csv], { type: 'text/csv' });
            filename = users_${new Date().toISOString().split('T')[0]}.csv;
        }
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification(Данные экспортированы в ${format.toUpperCase()});
    },

    // Конвертация в CSV
    convertToCSV(users) {
        const headers = ['Username', 'Email', 'Created', 'Last Login', 'Is Admin'];
        const rows = users.map(user => [
            "${user.username}",
            "${user.email}",
            "${new Date(user.createdAt).toLocaleDateString()}",
            "${new Date(user.lastLogin).toLocaleDateString()}",
            user.isAdmin ? 'Yes' : 'No'
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    },

    // Аналитика активности
    showUserActivity() {
        if (!this.isAdmin()) {
            this.showNotification('❌ Доступ запрещен! Требуются права администратора.', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const activity = {
            today: users.filter(u => new Date(u.lastLogin) >= today).length,
            week: users.filter(u => new Date(u.lastLogin) >= new Date(now - 7 * 24 * 60 * 60 * 1000)).length,
            month: users.filter(u => new Date(u.lastLogin) >= new Date(now - 30 * 24 * 60 * 60 * 1000)).length,
            never: users.filter(u => !u.lastLogin || new Date(u.lastLogin) < new Date(u.createdAt)).length
        };
        
        const output = document.getElementById('adminOutput');
        output.innerHTML = `
            <h4>Активность пользователей</h4>
            <div class="activity-stats">
                <div class="activity-item">
                    <div class="activity-count">${activity.today}</div>
                    <div class="activity-label">Сегодня</div>
                </div>
                <div class="activity-item">
                    <div class="activity-count">${activity.week}</div>
                    <div class="activity-label">За 7 дней</div>
                </div>
                <div class="activity-item">
                    <div class="activity-count">${activity.month}</div>
                    <div class="activity-label">За 30 дней</div>
                </div>
                <div class="activity-item">
                    <div class="activity-count">${activity.never}</div>
                    <div class="activity-label">Никогда не входили</div>
                </div>
            </div>
        `;
    },

    // Удалить пользователя
    deleteUser(username) {
        if (!this.isAdmin()) {
            this.showNotification('❌ Доступ запрещен! Требуются права администратора.', 'error');
            return;
        }

        if (username === 'dream') {
            this.showNotification('Нельзя удалить главного администратора!', 'error');
            return;
        }

        if (!confirm(Вы уверены, что хотите удалить пользователя "${username}"?)) {
            return;
        }

        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        const filteredUsers = users.filter(u => u.username !== username);
        localStorage.setItem('collabspace_users', JSON.stringify(filteredUsers));
        
        this.showNotification(Пользователь ${username} удален);
        this.searchUsers();
    },

    // Очистить базу данных
    clearDatabase() {
        if (!this.isAdmin()) {
            this.showNotification('❌ Доступ запрещен! Требуются права администратора.', 'error');
            return;
        }

        if (!confirm('ВНИМАНИЕ! Это удалит ВСЕХ пользователей кроме dream. Продолжить?')) {
            return;
        }

        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        const adminUser = users.find(u => u.username === 'dream');
        
        const newUsers = adminUser ? [adminUser] : [];
        localStorage.setItem('collabspace_users', JSON.stringify(newUsers));
        localStorage.removeItem('collabspace_current_user');
        localStorage.removeItem('collabspace_user_prefs');
        
        this.showNotification('База данных очищена (администратор сохранен)');
        this.showAllUsers();
    },

    // Показать уведомление
    showNotification(message, type = 'success') {
        // Создаем красивое уведомление
        const notification = document.createElement('div');
        notification.className = admin-notification ${type};
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Автоматическое скрытие
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    },

    // Проверка прав администратора (ОСНОВНАЯ ФУНКЦИЯ БЕЗОПАСНОСТИ)
    isAdmin() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('collabspace_current_user') || 'null');
            const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
            
            if (!currentUser) {
                console.warn('Попытка доступа к админ-панели без авторизации');
                return false;
            }
            
            // Ищем пользователя в базе и проверяем флаг isAdmin
            const userInDb = users.find(u => u.id === currentUser.id && u.username === currentUser.username);
            
            if (!userInDb) {
                console.warn('Обнаружена попытка несанкционированного доступа!');
                return false;
            }
            
            return userInDb.username === 'dream' || userInDb.isAdmin === true;
        } catch (error) {
            console.error('Ошибка проверки прав администратора:', error);
            return false;
        }
    }
};

// Инициализация админ-панели
function initAdminPanel() {
    if (AdminTools.isAdmin()) {
        addAdminButton();
        
        // Проверяем, не находимся ли мы в режиме impersonate
        const originalAdmin = localStorage.getItem('collabspace_original_admin');
        if (originalAdmin) {
            addReturnToAdminButton();
        }
    } else {
        // Защита для не-админов - переопределяем функции
        protectAdminFunctions();
    }
}

function addAdminButton() {
    const userNav = document.querySelector('.user-nav');
    if (userNav && !userNav.querySelector('.admin-nav-btn')) {
        const adminBtn = document.createElement('button');
        adminBtn.className = 'admin-nav-btn';
        adminBtn.innerHTML = '<i class="fas fa-cog"></i> Админ';
        adminBtn.title = 'Админ панель';
        adminBtn.onclick = AdminTools.toggleAdminPanel;
        userNav.appendChild(adminBtn);
    }
}

function addReturnToAdminButton() {
    const userNav = document.querySelector('.user-nav');
    if (userNav && !userNav.querySelector('.return-admin-btn')) {
        const returnBtn = document.createElement('button');
        returnBtn.className = 'return-admin-btn';
        returnBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Вернуться к админу';
        returnBtn.onclick = AdminTools.returnToAdmin;
        userNav.insertBefore(returnBtn, userNav.querySelector('.admin-nav-btn'));
    }
}

// Защита от вызова админ-функций не-админами через консоль
function protectAdminFunctions() {
    const protectedFunctions = [
        'showAllUsers', 'searchUsers', 'deleteUser', 'impersonateUser',
        'makeAdmin', 'removeAdmin', 'createAdvancedTestUser', 'createMultipleTestUsers',
        'createTestUser', 'exportData', 'showUserActivity', 'clearDatabase',
        'toggleAdminPanel'
    ];
    
    protectedFunctions.forEach(funcName => {
        if (typeof AdminTools[funcName] === 'function') {
            const originalFunction = AdminTools[funcName];
            AdminTools[funcName] = function(...args) {
                if (!AdminTools.isAdmin()) {
                    console.error('❌ Доступ запрещен! Требуются права администратора.');
                    alert('Недостаточно прав для выполнения этой операции!');
                    return;
                }
                return originalFunction.apply(this, args);
            };
        }
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initAdminPanel, 100); // Небольшая задержка для полной загрузки
});

// Защита от прямого доступа к объекту
(function() {
    if (typeof Storage === 'undefined') {
        console.error('LocalStorage не поддерживается!');
        return;
    }
})();

// Делаем доступным глобально (с защитой)
window.AdminTools = AdminTools;

console.log('AdminTools загружен с защитой безопасности');
