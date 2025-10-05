// Утилита для администрирования базы данных
const AdminTools = {
    // Показать/скрыть админ панель
    toggleAdminPanel() {
        const panel = document.getElementById('adminPanel');
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
        } else {
            panel.style.display = 'none';
        }
    },

    closeAdminPanel() {
        document.getElementById('adminPanel').style.display = 'none';
    },

    // Показать всех пользователей
    showAllUsers() {
        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        const output = document.getElementById('adminOutput');
        
        let html = '<h4>Все пользователи (' + users.length + '):</h4>';
        
        if (users.length === 0) {
            html += '<p>Нет пользователей</p>';
        } else {
            html += '<div class="users-list">';
            users.forEach(user => {
                html += `
                    <div class="user-item">
                        <strong>${user.username}</strong> (${user.email})
                        <br><small>ID: ${user.id} | Создан: ${new Date(user.createdAt).toLocaleDateString()}</small>
                        <button onclick="AdminTools.deleteUser('${user.username}')" class="btn-small danger">Удалить</button>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        output.innerHTML = html;
        this.showNotification('Пользователи загружены');
    },

    // Найти пользователя по имени
    findUser(username) {
        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        return users.find(u => u.username.toLowerCase() === username.toLowerCase());
    },

    // Удалить пользователя
    deleteUser(username) {
        if (username === 'dream') {
            this.showNotification('Нельзя удалить администратора!', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        const filteredUsers = users.filter(u => u.username !== username);
        localStorage.setItem('collabspace_users', JSON.stringify(filteredUsers));
        
        this.showNotification(Пользователь ${username} удален);
        this.showAllUsers(); // Обновляем список
    },

    // Создать тестового пользователя
    createTestUser() {
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
        this.showAllUsers(); // Обновляем список
    },

    // Очистить всю базу (кроме администратора)
    clearDatabase() {
        if (!confirm('Вы уверены, что хотите очистить базу данных? Все пользователи (кроме dream) будут удалены!')) {
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

    // Экспорт базы данных
    exportDatabase() {
        const data = {
            users: JSON.parse(localStorage.getItem('collabspace_users') || '[]'),
            currentUser: JSON.parse(localStorage.getItem('collabspace_current_user') || 'null'),
            preferences: JSON.parse(localStorage.getItem('collabspace_user_prefs') || '{}'),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'collabspace_database_' + new Date().toISOString().split('T')[0] + '.json';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('База данных экспортирована');
    },

    // Показать уведомление
    showNotification(message, type = 'success') {
        alert(message); // Простой alert, можно заменить на красивые уведомления
    },

    // Проверить является ли пользователь администратором
    isAdmin() {
        const currentUser = JSON.parse(localStorage.getItem('collabspace_current_user') || 'null');
        return currentUser && currentUser.username === 'dream';
    }
};

// Добавляем кнопку админа в навигацию если пользователь dream
function addAdminButton() {
    if (AdminTools.isAdmin()) {
        const userNav = document.querySelector('.user-nav');
        if (userNav) {
            const adminBtn = document.createElement('button');
            adminBtn.className = 'admin-nav-btn';
            adminBtn.innerHTML = '<i class="fas fa-cog"></i>';
            adminBtn.title = 'Админ панель';
            adminBtn.onclick = AdminTools.toggleAdminPanel;
            userNav.appendChild(adminBtn);
        }
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    addAdminButton();
});

// Делаем доступным глобально
window.AdminTools = AdminTools;
