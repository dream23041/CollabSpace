// Хранилище данных
const Storage = {
    // Ключи для localStorage
    KEYS: {
        USERS: 'collabspace_users',
        CURRENT_USER: 'collabspace_current_user',
        USER_PREFERENCES: 'collabspace_user_prefs'
    },

    // Получить пользователей
    getUsers() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.USERS)) || [];
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error);
            return [];
        }
    },

    // Сохранить пользователей
    saveUsers(users) {
        try {
            localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
            return true;
        } catch (error) {
            console.error('Ошибка сохранения пользователей:', error);
            return false;
        }
    },

    // Получить текущего пользователя
    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.CURRENT_USER)) || null;
        } catch (error) {
            console.error('Ошибка загрузки текущего пользователя:', error);
            return null;
        }
    },

    // Сохранить текущего пользователя
    saveCurrentUser(user) {
        try {
            if (user) {
                localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
            } else {
                localStorage.removeItem(this.KEYS.CURRENT_USER);
            }
            return true;
        } catch (error) {
            console.error('Ошибка сохранения текущего пользователя:', error);
            return false;
        }
    },

    // Очистить текущего пользователя
    clearCurrentUser() {
        try {
            localStorage.removeItem(this.KEYS.CURRENT_USER);
            return true;
        } catch (error) {
            console.error('Ошибка очистки текущего пользователя:', error);
            return false;
        }
    },

    // Получить настройки пользователя
    getUserPreferences(userId) {
        try {
            const allPrefs = JSON.parse(localStorage.getItem(this.KEYS.USER_PREFERENCES)) || {};
            return allPrefs[userId] || {};
        } catch (error) {
            console.error('Ошибка загрузки настроек:', error);
            return {};
        }
    },

    // Сохранить настройки пользователя
    saveUserPreferences(userId, preferences) {
        try {
            const allPrefs = JSON.parse(localStorage.getItem(this.KEYS.USER_PREFERENCES)) || {};
            allPrefs[userId] = { ...allPrefs[userId], ...preferences };
            localStorage.setItem(this.KEYS.USER_PREFERENCES, JSON.stringify(allPrefs));
            return true;
        } catch (error) {
            console.error('Ошибка сохранения настроек:', error);
            return false;
        }
    },

    // Очистить все данные (для тестирования)
    clearAll() {
        try {
            localStorage.removeItem(this.KEYS.USERS);
            localStorage.removeItem(this.KEYS.CURRENT_USER);
            localStorage.removeItem(this.KEYS.USER_PREFERENCES);
            return true;
        } catch (error) {
            console.error('Ошибка очистки данных:', error);
            return false;
        }
    }
};
