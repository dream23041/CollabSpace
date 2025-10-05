// Система аутентификации
const Auth = {
    currentUser: Storage.getCurrentUser(),

    // Валидация email
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Валидация пароля
    validatePassword(password) {
        return password.length >= 6;
    },

    // Валидация имени пользователя
    validateUsername(username) {
        return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
    },

    // Регистрация
    register(username, email, password) {
        const users = Storage.getUsers();
        
        // Проверка на существующего пользователя
        if (users.find(user => user.email === email)) {
            throw new Error('Пользователь с таким email уже существует');
        }

        if (users.find(user => user.username === username)) {
            throw new Error('Пользователь с таким именем уже существует');
        }

        // Создание нового пользователя
        const newUser = {
            id: Date.now().toString(),
            username: username,
            email: email,
            password: password, // В реальном проекте нужно хэшировать!
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        Storage.saveUsers(users);
        
        // Автоматический вход после регистрации
        this.login(email, password);
        
        return newUser;
    },

    // Вход
    login(email, password) {
        const users = Storage.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Неверный email или пароль');
        }

        this.currentUser = user;
        Storage.saveCurrentUser(user);
        
        return user;
    },

    // Выход
    logout() {
        this.currentUser = null;
        Storage.clearCurrentUser();
    },

    // Проверка авторизации
    isAuthenticated() {
        return this.currentUser !== null;
    },

    // Получить текущего пользователя
    getCurrentUser() {
        return this.currentUser;
    }
};
