// Система аутентификации
const Auth = {
    currentUser: Storage.getCurrentUser(),

    // Валидация имени пользователя
    validateUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    },

    // Валидация email
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Валидация пароля
    validatePassword(password) {
        return password.length >= 6;
    },

    // Проверка уникальности имени пользователя
    isUsernameUnique(username) {
        const users = Storage.getUsers();
        return !users.find(user => user.username.toLowerCase() === username.toLowerCase());
    },

    // Проверка уникальности email
    isEmailUnique(email) {
        const users = Storage.getUsers();
        return !users.find(user => user.email.toLowerCase() === email.toLowerCase());
    },

    // Регистрация
    register(username, email, password) {
        const users = Storage.getUsers();
        
        // Валидация имени пользователя
        if (!this.validateUsername(username)) {
            throw new Error('Имя пользователя должно содержать от 3 до 20 символов (только буквы, цифры и подчеркивания)');
        }

        // Проверка на существующего пользователя
        if (!this.isUsernameUnique(username)) {
            throw new Error('Пользователь с таким именем уже существует');
        }

        if (!this.isEmailUnique(email)) {
            throw new Error('Пользователь с таким email уже существует');
        }

        // Валидация email
        if (!this.validateEmail(email)) {
            throw new Error('Введите корректный email адрес');
        }

        // Валидация пароля
        if (!this.validatePassword(password)) {
            throw new Error('Пароль должен содержать минимум 6 символов');
        }

        // Создание нового пользователя
        const newUser = {
            id: Date.now().toString(),
            username: username,
            email: email,
            password: password, // В реальном проекте нужно хэшировать!
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            profile: {
                displayName: username,
                avatar: null,
                bio: ''
            }
        };

        users.push(newUser);
        Storage.saveUsers(users);
        
        // Автоматический вход после регистрации
        this.login(username, password);
        
        return newUser;
    },

    // Вход
    login(username, password) {
        const users = Storage.getUsers();
        const user = users.find(u => 
            u.username.toLowerCase() === username.toLowerCase() && 
            u.password === password
        );
        
        if (!user) {
            throw new Error('Неверное имя пользователя или пароль');
        }

        // Обновляем время последнего входа
        user.lastLogin = new Date().toISOString();
        Storage.saveUsers(users);

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
    },

    // Поиск пользователя по имени
    findUserByUsername(username) {
        const users = Storage.getUsers();
        return users.find(u => u.username.toLowerCase() === username.toLowerCase());
    },

    // Обновление профиля
    updateProfile(updates) {
        if (!this.currentUser) {
            throw new Error('Пользователь не авторизован');
        }

        const users = Storage.getUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            // Обновляем данные
            users[userIndex] = {
                ...users[userIndex],
                ...updates,
                profile: {
                    ...users[userIndex].profile,
                    ...updates.profile
                }
            };

            // Обновляем текущего пользователя
            this.currentUser = users[userIndex];
            
            // Сохраняем изменения
            Storage.saveUsers(users);
            Storage.saveCurrentUser(this.currentUser);
            
            return this.currentUser;
        }
    }
};
