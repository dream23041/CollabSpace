// Dashboard functionality
class Dashboard {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        console.log('=== DASHBOARD INIT ===');
        this.checkAuth();
        console.log('Текущий пользователь после checkAuth:', this.currentUser);
        this.bindEvents();
        this.loadUserData();
        this.loadDashboardData();
        console.log('=== DASHBOARD INIT COMPLETE ===');
    }

    checkAuth() {
        this.currentUser = Auth.getCurrentUser();
        
        if (!this.currentUser) {
            window.location.href = 'index.html';
            return;
        }
        
        this.updateNavigation();
    }

    updateNavigation() {
        const navLinks = document.getElementById('navLinks');
        const username = this.currentUser.username;
        const firstLetter = username.charAt(0).toUpperCase();
    
        navLinks.innerHTML = `
            <a href="#features">Возможности</a>
            <a href="#about">О проекте</a>
            <div class="user-nav">
                <span class="user-greeting">Привет, ${username}!</span>
                <div class="avatar-small" id="userAvatarNav">
                    ${firstLetter}
                </div>
                <div class="dropdown">
                    <button class="user-btn" id="userMenuBtn">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="dropdown-menu" id="userDropdown">
                        <a href="#" class="dropdown-item" id="profileBtn">
                            <i class="fas fa-user"></i>
                            Профиль
                        </a>
                        <a href="#" class="dropdown-item" id="settingsBtn">
                            <i class="fas fa-cog"></i>
                            Настройки
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item" id="logoutBtn">
                            <i class="fas fa-sign-out-alt"></i>
                            Выйти
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Привязываем события для нового меню
        this.bindUserMenuEvents();
    },

    bindUserMenuEvents() {
        document.getElementById('userMenuBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('userDropdown').classList.toggle('show');
        });

        document.getElementById('profileBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showProfileModal();
        });

        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Закрытие dropdown при клике вне
        document.addEventListener('click', () => {
            document.getElementById('userDropdown').classList.remove('show');
        });
    }

    bindEvents() {
        // Создание файла
        document.getElementById('createFileBtn').addEventListener('click', () => {
            this.showCreateFileModal();
        });

        // Создание проекта
        document.getElementById('createProjectBtn').addEventListener('click', () => {
            this.showCreateProjectModal();
        });

        // Быстрые действия
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', () => {
                const action = card.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Закрытие модальных окон
        document.getElementById('closeCreateFile').addEventListener('click', () => {
            this.closeModal('createFileModal');
        });

        document.getElementById('closeCreateProject').addEventListener('click', () => {
            this.closeModal('createProjectModal');
        });

        document.getElementById('closeProfileModal').addEventListener('click', () => {
            this.closeModal('profileModal');
        });

        // Отмена создания
        document.getElementById('cancelCreateFile').addEventListener('click', () => {
            this.closeModal('createFileModal');
        });

        document.getElementById('cancelCreateProject').addEventListener('click', () => {
            this.closeModal('createProjectModal');
        });

        // Формы
        document.getElementById('createFileForm').addEventListener('submit', (e) => {
            this.handleCreateFile(e);
        });

        document.getElementById('createProjectForm').addEventListener('submit', (e) => {
            this.handleCreateProject(e);
        });

        // Выбор типа файла
        this.bindFileTypeSelection();

        // Закрытие по клику вне модального окна
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    bindFileTypeSelection() {
        const fileTypeOptions = document.querySelectorAll('.file-type-option');
        
        fileTypeOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Убрать выделение у всех
                fileTypeOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Выделить выбранный
                option.classList.add('selected');
                
                // Установить значение
                document.getElementById('fileType').value = option.dataset.type;
            });
        });
    }

    loadUserData() {
        if (!this.currentUser) {
            console.error('Нет текущего пользователя!');
            return;
        }

        // Загружаем данные пользователя
        const username = this.currentUser.username;
        console.log('Загружаем пользователя:', username);
    
        // Устанавливаем имя пользователя везде
        const sidebarUsername = document.getElementById('sidebarUsername');
        const profileUsername = document.getElementById('profileUsername');
    
        if (sidebarUsername) sidebarUsername.textContent = username;
        if (profileUsername) profileUsername.textContent = username;
    
        // Устанавливаем email
        const profileEmail = document.getElementById('profileEmail');
        if (profileEmail) profileEmail.textContent = this.currentUser.email || 'Не указан';
    
        // Создаем аватарку по умолчанию
        this.generateDefaultAvatar(username);
    
        // Форматируем дату регистрации
        if (this.currentUser.createdAt) {
            const joinDate = new Date(this.currentUser.createdAt);
            const memberSince = document.getElementById('memberSince');
            if (memberSince) memberSince.textContent = joinDate.getFullYear();
        }
    },

    // Улучшенная функция для генерации аватарки
    generateDefaultAvatar(username) {
        if (!username) {
            console.error('Нет имени пользователя для аватарки!');
            return;
        }

        // Берем первую букву имени для аватарки
        const firstLetter = username.charAt(0).toUpperCase();
        console.log('Генерируем аватарку для:', username, 'буква:', firstLetter);
    
        // Создаем аватарку в сайдбаре
        const avatarPlaceholder = document.getElementById('avatarPlaceholder');
        if (avatarPlaceholder) {
            avatarPlaceholder.innerHTML = firstLetter;
            console.log('Аватарка в сайдбаре установлена');
        }
    
        // Создаем аватарку в навигации
        const navAvatar = document.getElementById('userAvatarNav');
        if (navAvatar) {
            // Если это div для аватарки (а не img)
            if (navAvatar.classList && navAvatar.classList.contains('avatar-small')) {
                navAvatar.innerHTML = firstLetter;
            } else if (navAvatar.tagName === 'IMG' && !navAvatar.src) {
                // Если это img без src, создаем текстовый аватар
                const newAvatar = document.createElement('div');
                newAvatar.className = 'avatar-small';
                newAvatar.innerHTML = firstLetter;
                navAvatar.parentNode.replaceChild(newAvatar, navAvatar);
            }
        }
    
        // Создаем аватарку в модальном окне профиля
        const profileAvatarImg = document.getElementById('profileAvatarImg');
        const profileAvatar = document.querySelector('.profile-avatar');
    
        if (profileAvatar && !profileAvatar.querySelector('.avatar-placeholder')) {
            const placeholder = document.createElement('div');
            placeholder.className = 'avatar-placeholder';
            placeholder.innerHTML = firstLetter;
            if (profileAvatarImg) profileAvatarImg.style.display = 'none';
            profileAvatar.insertBefore(placeholder, profileAvatarImg);
        }
    },

    // В функции loadDashboardData() добавьте проверку
    loadDashboardData() {
        // Обычные пользователи видят только свою статистику
        this.updateStats();
        this.loadRecentFiles();
        this.loadProjects();
    
        // Только админы видят админ-функции
        if (this.isUserAdmin()) {
            this.initAdminFeatures();
        }
    },

    // Новая функция проверки админа
    isUserAdmin() {
        try {
            const currentUser = this.currentUser;
            const users = JSON.parse(localStorage.getItem('collabspace_users') || '[]');
        
            if (!currentUser) return false;
        
            const userInDb = users.find(u => u.id === currentUser.id);
            return userInDb && (userInDb.username === 'dream' || userInDb.isAdmin === true);
        } catch (error) {
            return false;
        }
    },

    // Инициализация админ-функций только для админов
    initAdminFeatures() {
        console.log('Инициализация админ-функций для пользователя:', this.currentUser.username);
        // Здесь можно добавить дополнительные админ-функции
    },

    updateStats() {
        // Временные данные для демонстрации
        document.getElementById('filesCount').textContent = '5';
        document.getElementById('projectsCount').textContent = '2';
        document.getElementById('collaboratorsCount').textContent = '1';
        document.getElementById('lastActive').textContent = 'Сегодня';

        // Для профиля
        document.getElementById('profileFilesCount').textContent = '5';
        document.getElementById('profileProjectsCount').textContent = '2';
        document.getElementById('profileCollaborationsCount').textContent = '0';
    }

    loadRecentFiles() {
        const recentFiles = [
            { name: 'script.js', type: 'javascript', size: '2 KB', modified: '2 часа назад' },
            { name: 'index.html', type: 'html', size: '1 KB', modified: '5 часов назад' },
            { name: 'styles.css', type: 'css', size: '3 KB', modified: '1 день назад' },
            { name: 'README.md', type: 'markdown', size: '0.5 KB', modified: '2 дня назад' }
        ];

        const filesTable = document.getElementById('recentFilesTable');
        const recentFilesSidebar = document.getElementById('recentFiles');

        // Очищаем существующие элементы
        filesTable.innerHTML = '';
        recentFilesSidebar.innerHTML = '';

        // Добавляем файлы в таблицу
        recentFiles.forEach(file => {
            const fileRow = document.createElement('div');
            fileRow.className = 'file-row';
            fileRow.innerHTML = `
                <div class="file-icon">
                    <i class="${this.getFileIcon(file.type)}"></i>
                </div>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-meta">${file.type.toUpperCase()} · ${file.size} · ${file.modified}</div>
                </div>
                <div class="file-actions">
                    <button class="action-btn">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
            `;
            filesTable.appendChild(fileRow);
        });

        // Добавляем файлы в сайдбар (только 3 последних)
        recentFiles.slice(0, 3).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'recent-file-item';
            fileItem.innerHTML = `
                <i class="${this.getFileIcon(file.type)}"></i>
                <span>${file.name}</span>
            `;
            recentFilesSidebar.appendChild(fileItem);
        });
    }

    loadProjects() {
        const projects = [
            { name: 'Мой первый проект', files: 3 },
            { name: 'Документация', files: 2 }
        ];

        const projectList = document.getElementById('projectList');
        projectList.innerHTML = '';

        projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            projectItem.innerHTML = `
                <i class="fas fa-folder"></i>
                <span>${project.name}</span>
            `;
            projectList.appendChild(projectItem);
        });
    }

    getFileIcon(fileType) {
        const icons = {
            'javascript': 'fab fa-js-square',
            'html': 'fab fa-html5',
            'css': 'fab fa-css3-alt',
            'text': 'fas fa-file-alt',
            'markdown': 'fas fa-markdown',
            'json': 'fas fa-code'
        };
        return icons[fileType] || 'fas fa-file';
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        const username = this.currentUser.username;
        const firstLetter = username.charAt(0).toUpperCase();
    
        // Обновляем аватарку в модальном окне
        const avatarPlaceholder = document.querySelector('.profile-avatar .avatar-placeholder');
        if (avatarPlaceholder) {
            avatarPlaceholder.textContent = firstLetter;
        }
    
        modal.style.display = 'block';
    },

    showCreateFileModal() {
        document.getElementById('createFileModal').style.display = 'block';
        document.getElementById('fileName').focus();
    }

    showCreateProjectModal() {
        document.getElementById('createProjectModal').style.display = 'block';
        document.getElementById('projectName').focus();
    }

    showProfileModal() {
        document.getElementById('profileModal').style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    handleQuickAction(action) {
        switch (action) {
            case 'create-file':
                this.showCreateFileModal();
                break;
            case 'create-code':
                this.showCreateFileModal();
                break;
            case 'create-folder':
                alert('Создание папки будет реализовано позже');
                break;
            case 'import-files':
                alert('Импорт файлов будет реализован позже');
                break;
        }
    }

    handleCreateFile(e) {
        e.preventDefault();
        
        const fileName = document.getElementById('fileName').value;
        const fileType = document.getElementById('fileType').value;

        if (!fileType) {
            alert('Пожалуйста, выберите тип файла');
            return;
        }

        // Создание файла
        const file = {
            id: Date.now().toString(),
            name: fileName,
            type: fileType,
            extension: this.getExtension(fileType),
            content: this.getDefaultContent(fileType),
            created: new Date().toISOString(),
            owner: this.currentUser.id
        };

        // Сохранение файла
        this.saveFile(file);
        
        // Показать уведомление
        this.showNotification(Файл "${fileName}" создан успешно!);
        
        // Закрыть модальное окно
        this.closeModal('createFileModal');
        
        // Очистить форму
        document.getElementById('createFileForm').reset();
        document.querySelectorAll('.file-type-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Обновить список файлов
        this.loadRecentFiles();
        this.updateStats();
    }

    handleCreateProject(e) {
        e.preventDefault();
        
        const projectName = document.getElementById('projectName').value;
        const projectDescription = document.getElementById('projectDescription').value;

        // Создание проекта
        const project = {
            id: Date.now().toString(),
            name: projectName,
            description: projectDescription,
            created: new Date().toISOString(),
            owner: this.currentUser.id
        };

        // Сохранение проекта
        this.saveProject(project);
        
        // Показать уведомление
        this.showNotification(Проект "${projectName}" создан успешно!);
        
        // Закрыть модальное окно
        this.closeModal('createProjectModal');
        
        // Очистить форму
        document.getElementById('createProjectForm').reset();

        // Обновить список проектов
        this.loadProjects();
        this.updateStats();
    }

    getExtension(fileType) {
        const extensions = {
            'javascript': '.js',
            'html': '.html',
            'css': '.css',
            'text': '.txt',
            'markdown': '.md',
            'json': '.json'
        };
        return extensions[fileType] || '.txt';
    }

    getDefaultContent(fileType) {
        const defaultContents = {
            'javascript': '// Добро пожаловать в CollabSpace!\\nconsole.log("Hello World!");',
            'html': '<!DOCTYPE html>\\n<html>\\n<head>\\n    <title>Новый документ</title>\\n</head>\\n<body>\\n    <h1>Добро пожаловать!</h1>\\n</body>\\n</html>',
            'css': '/* Добро пожаловать в CollabSpace! */\\nbody {\\n    margin: 0;\\n    padding: 0;\\n}',
            'text': 'Добро пожаловать в CollabSpace!',
            'markdown': '# Добро пожаловать!\\n\\nНачните писать свою документацию здесь.',
            'json': '{\\n    "message": "Добро пожаловать в CollabSpace!"\\n}'
        };
        return defaultContents[fileType] || '';
    }

    saveFile(file) {
        // В реальном проекте здесь будет API запрос
        console.log('Создан файл:', file);
    }

    saveProject(project) {
        // В реальном проекте здесь будет API запрос
        console.log('Создан проект:', project);
    }

    showNotification(message, type = 'success') {
        if (typeof UI !== 'undefined') {
            UI.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    logout() {
        if (confirm('Вы уверены, что хотите выйти?')) {
            Auth.logout();
            window.location.href = 'index.html';
        }
    }
}

// Инициализация dashboard
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});
