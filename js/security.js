// Система безопасности
const Security = {
    // Проверка доступа к админ-функциям
    checkAdminAccess() {
        const currentUser = JSON.parse(localStorage.getItem('collabspace_current_user') || 'null');
        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        
        if (!currentUser) return false;
        
        // Ищем пользователя в базе (защита от подделки localStorage)
        const userInDb = users.find(u => u.id === currentUser.id && u.username === currentUser.username);
        
        if (!userInDb) {
            console.warn('Обнаружена попытка несанкционированного доступа!');
            return false;
        }
        
        return userInDb.username === 'dream' || userInDb.isAdmin === true;
    },

    // Защита от прямого вызова через консоль
    protectAdminFunctions() {
        // Переопределяем глобальные функции для не-админов
        if (!this.checkAdminAccess()) {
            window.AdminTools = {
                showAllUsers: function() { 
                    console.error('❌ Доступ запрещен!'); 
                    alert('Недостаточно прав для выполнения этой операции!');
                },
                searchUsers: function() { 
                    console.error('❌ Доступ запрещен!'); 
                },
                // ... все остальные функции тоже переопределяем
            };
        }
    },

    // Проверка целостности данных
    validateUserData() {
        const currentUser = JSON.parse(localStorage.getItem('collabspace_current_user') || 'null');
        const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        
        if (currentUser) {
            const userExists = users.find(u => u.id === currentUser.id);
            if (!userExists) {
                console.warn('Обнаружен невалидный пользователь! Очищаем сессию.');
                localStorage.removeItem('collabspace_current_user');
                window.location.href = 'index.html';
            }
        }
    }
};

// Защита при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    Security.validateUserData();
    Security.protectAdminFunctions();
});
