// Утилита для администрирования базы данных
const AdminTools = {
    // Показать всех пользователей
    showAllUsers() {
        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        console.table(users.map(user => ({
            ID: user.id,
            Username: user.username,
            Email: user.email,
            Created: new Date(user.createdAt).toLocaleDateString(),
            LastLogin: new Date(user.lastLogin).toLocaleDateString()
        })));
        return users;
    },

    // Найти пользователя по имени
    findUser(username) {
        const users = this.showAllUsers();
        return users.find(u => u.username.toLowerCase() === username.toLowerCase());
    },

    // Удалить пользователя
    deleteUser(username) {
        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        const filteredUsers = users.filter(u => u.username !== username);
        localStorage.setItem('collabspace_users', JSON.stringify(filteredUsers));
        console.log(Пользователь ${username} удален);
    },

    // Создать тестового пользователя
    createTestUser(username = 'test', email = 'test@test.com', password = '123456') {
        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        
        const newUser = {
            id: Date.now().toString(),
            username: username,
            email: email,
            password: password,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            profile: {
                displayName: username,
                avatar: null,
                bio: ''
            }
        };

        users.push(newUser);
        localStorage.setItem('collabspace_users', JSON.stringify(users));
        console.log(Создан тестовый пользователь: ${username});
        return newUser;
    },

    // Очистить всю базу
    clearDatabase() {
        localStorage.removeItem('collabspace_users');
        localStorage.removeItem('collabspace_current_user');
        localStorage.removeItem('collabspace_user_prefs');
        console.log('База данных очищена');
    },

    // Экспорт базы данных
    exportDatabase() {
        const data = {
            users: JSON.parse(localStorage.getItem('collabspace_users') || '[]'),
            currentUser: JSON.parse(localStorage.getItem('collabspace_current_user') || 'null'),
            preferences: JSON.parse(localStorage.getItem('collabspace_user_prefs') || '{}')
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'collabspace_database.json';
        a.click();
        URL.revokeObjectURL(url);
    }
};

// Добавьте в консоль для быстрого доступа
window.AdminTools = AdminTools;
