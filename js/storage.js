// Хранилище данных
const Storage = {
    // Получить пользователей
    getUsers() {
        return JSON.parse(localStorage.getItem('collabspace_users')) || [];
    },

    // Сохранить пользователей
    saveUsers(users) {
        localStorage.setItem('collabspace_users', JSON.stringify(users));
    },

    // Получить текущего пользователя
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('collabspace_current_user')) || null;
    },

    // Сохранить текущего пользователя
    saveCurrentUser(user) {
        if (user) {
            localStorage.setItem('collabspace_current_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('collabspace_current_user');
        }
    },

    // Очистить текущего пользователя
    clearCurrentUser() {
        localStorage.removeItem('collabspace_current_user');
    }
};
