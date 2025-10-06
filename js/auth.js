// Система аутентификации
const Auth = {
    currentUser: Storage.getCurrentUser(),

    // Валидация имени пользователя
    validateUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
            throw new Error('Имя пользователя должно содержать от 3 до 20 символов (только буквы, цифры и подчеркивания)');
        }
        return true;
    },

    // Валидация email
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Введите корректный email адрес');
        }
        return true;
    },

    // Валидация пароля
    validatePassword(password) {
        if (password.length < 6) {
            throw new Error('Пароль должен содержать минимум 6 символов');
        }
        return true;
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
        // Валидация
        this.validateUsername(username);
        this.validateEmail(email);
        this.validatePassword(password);

        const users = Storage.getUsers();
        
        // Проверка на существующего пользователя
        if (!this.isUsernameUnique(username)) {
            throw new Error('Пользователь с таким именем уже существует. Выберите другое имя.');
        }

        if (!this.isEmailUnique(email)) {
            throw new Error('Пользователь с таким email уже существует. Используйте другой email.');
        }

        // Создание нового пользователя
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
        Storage.saveUsers(users);
        
        // Автоматический вход после регистрации
        this.login(username, password);
        
        return newUser;
    },

    // В функции login добавить валидацию
    login(username, password) {
        const users = Storage.getUsers();
        const user = users.find(u => 
            u.username.toLowerCase() === username.toLowerCase() && 
            u.password === password
        );
    
        if (!user) {
            throw new Error('Неверное имя пользователя или пароль');
        }

        // Валидация пользователя
        if (!user.id || !user.username) {
            throw new Error('Некорректные данные пользователя');
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
