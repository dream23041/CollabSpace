// Dashboard functionality
class Dashboard {
    constructor() {
        console.log('Dashboard constructor called');
        this.currentUser = null;
        this.init();
    }

    init() {
        console.log('Dashboard init started');
        this.checkAuth();
        this.bindEvents();
        this.loadUserData();
        this.loadDashboardData();
        console.log('Dashboard init completed');
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
        
        navLinks.innerHTML = `
            <a href="#features">Возможности</a>
            <a href="#about">О проекте</a>
            <div class="user-nav">
                <span class="user-greeting">Привет, ${this.currentUser.username}!</span>
                <div class="avatar-small" id="userAvatarNav">
                    ${this.currentUser.username.charAt(0).toUpperCase()}
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
    }

    bindUserMenuEvents() {
        document.getElementById('userMenuBtn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('userDropdown').classList.toggle('show');
        });

        document.getElementById('profileBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showProfileModal();
        });

        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Закрытие dropdown при клике вне
        document.addEventListener('click', () => {
            const dropdown = document.getElementById('userDropdown');
            if (dropdown) dropdown.classList.remove('show');
        });
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Создание файла
        const createFileBtn = document.getElementById('createFileBtn');
        if (createFileBtn) {
            createFileBtn.addEventListener('click', () => {
                console.log('Create File button clicked');
                this.showCreateFileModal();
            });
        } else {
            console.error('Create File button not found!');
        }

        // Приглашение
        const inviteBtn = document.getElementById('inviteBtn');
        if (inviteBtn) {
            inviteBtn.addEventListener('click', () => {
                console.log('Invite button clicked');
                this.handleInvite();
            });
        } else {
            console.error('Invite button not found!');
        }

        // Создание проекта
        const createProjectBtn = document.getElementById('createProjectBtn');
        if (createProjectBtn) {
            createProjectBtn.addEventListener('click', () => {
                console.log('Create Project button clicked');
                this.showCreateProjectModal();
            });
        }

        // Быстрые действия
        document.querySelectorAll('.action-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                const action = card.dataset.action;
                console.log(Quick action clicked: ${action} (index: ${index}));
                
                switch (action) {
                    case 'create-file':
                        alert('Создание текстового документа');
                        this.showCreateFileModal();
                        break;
                    case 'create-code':
                        alert('Создание файла кода');
                        this.showCreateFileModal();
                        break;
                    case 'create-folder':
                        alert('Создание папки');
                        this.showCreateFolderModal();
                        break;
                    case 'import-files':
                        alert('Импорт файлов');
                        this.showImportModal();
                        break;
                    default:
                        alert(Действие: ${action});
                }
            });
        });

        // Форма создания файла
        const createFileForm = document.getElementById('createFileForm');
        if (createFileForm) {
            createFileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Create file form submitted');
                this.handleCreateFile(e);
            });
        }

        // Форма создания проекта
        const createProjectForm = document.getElementById('createProjectForm');
        if (createProjectForm) {
            createProjectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Create project form submitted');
                this.handleCreateProject(e);
            });
        }

        // Закрытие модальных окон
        this.setupModalCloseEvents();
        
        // Выбор типа файла
        this.bindFileTypeSelection();

        console.log('All events bound successfully');
    }

    setupModalCloseEvents() {
        // Закрытие по крестику
        document.getElementById('closeCreateFile')?.addEventListener('click', () => {
            this.closeModal('createFileModal');
        });
        
        document.getElementById('closeCreateProject')?.addEventListener('click', () => {
            this.closeModal('createProjectModal');
        });

        document.getElementById('closeProfileModal')?.addEventListener('click', () => {
            this.closeModal('profileModal');
        });

        // Отмена по кнопке
        document.getElementById('cancelCreateFile')?.addEventListener('click', () => {
            this.closeModal('createFileModal');
        });
        
        document.getElementById('cancelCreateProject')?.addEventListener('click', () => {
            this.closeModal('createProjectModal');
        });

        // Закрытие по клику вне окна
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
    }

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
            navAvatar.innerHTML = firstLetter;
        }
        
        // Создаем аватарку в модальном окне профиля
        const profileAvatar = document.querySelector('.profile-avatar .avatar-placeholder');
        if (profileAvatar) {
            profileAvatar.innerHTML = firstLetter;
        }
    }

    loadDashboardData() {
        // Загружаем статистику
        this.updateStats();
        this.loadRecentFiles();
        this.loadProjects();
    }

    updateStats() {
        // Получаем реальные данные из localStorage
        const files = JSON.parse(localStorage.getItem('collabspace_files') || '[]');
        const projects = JSON.parse(localStorage.getItem('collabspace_projects') || '[]');
        const folders = JSON.parse(localStorage.getItem('collabspace_folders') || '[]');
        
        // Фильтруем файлы текущего пользователя
        const userFiles = files.filter(file => file.owner === this.currentUser.id);
        const userProjects = projects.filter(project => project.owner === this.currentUser.id);
        
        // Обновляем статистику на dashboard
        document.getElementById('filesCount').textContent = userFiles.length;
        document.getElementById('projectsCount').textContent = userProjects.length + folders.length;
        document.getElementById('collaboratorsCount').textContent = '1';
        document.getElementById('lastActive').textContent = this.formatLastActive();

        // Обновляем статистику в профиле
        document.getElementById('profileFilesCount').textContent = userFiles.length;
        document.getElementById('profileProjectsCount').textContent = userProjects.length + folders.length;
        document.getElementById('profileCollaborationsCount').textContent = '0';
    }

    formatLastActive() {
        const now = new Date();
        const hours = now.getHours();
        
        if (hours < 6) return 'Ночью';
        if (hours < 12) return 'Утром';
        if (hours < 18) return 'Днём';
        return 'Вечером';
    }

    loadRecentFiles() {
        const files = JSON.parse(localStorage.getItem('collabspace_files') || '[]');
        const userFiles = files.filter(file => file.owner === this.currentUser.id);
        
        // Берем последние 4 файла
        const recentFiles = userFiles.slice(-4).reverse();

        const filesTable = document.getElementById('recentFilesTable');
        const recentFilesSidebar = document.getElementById('recentFiles');

        // Очищаем существующие элементы
        if (filesTable) filesTable.innerHTML = '';
        if (recentFilesSidebar) recentFilesSidebar.innerHTML = '';

        // Добавляем файлы в таблицу
        recentFiles.forEach(file => {
            if (filesTable) {
                const fileRow = document.createElement('div');
                fileRow.className = 'file-row';
                fileRow.innerHTML = `
                    <div class="file-icon">
                        <i class="${this.getFileIcon(file.type)}"></i>
                    </div>
                    <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-meta">${file.type.toUpperCase()} · ${file.size || '0 KB'} · ${this.formatTimeAgo(new Date(file.created))}</div>
                    </div>
                    <div class="file-actions">
                        <button class="action-btn">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                `;
                
                fileRow.addEventListener('click', () => {
                    this.openFile(file.name);
                });
                
                filesTable.appendChild(fileRow);
            }
        });

        // Добавляем файлы в сайдбар (только 3 последних)
        if (recentFilesSidebar) {
            recentFiles.slice(0, 3).forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'recent-file-item';
                fileItem.innerHTML = `
                    <i class="${this.getFileIcon(file.type)}"></i>
                    <span>${file.name}</span>
                `;
                
                fileItem.addEventListener('click', () => {
                    this.openFile(file.name);
                });
                
                recentFilesSidebar.appendChild(fileItem);
            });
        }
    }

    loadProjects() {
        const projects = JSON.parse(localStorage.getItem('collabspace_projects') || '[]');
        const userProjects = projects.filter(project => project.owner === this.currentUser.id);

        const projectList = document.getElementById('projectList');
        if (projectList) {
            projectList.innerHTML = '';

            if (userProjects.length === 0) {
                projectList.innerHTML = '<div style="color: #666; padding: 0.5rem; font-style: italic;">Нет проектов</div>';
                return;
            }

            userProjects.forEach(project => {
                const projectItem = document.createElement('div');
                projectItem.className = 'project-item';
                projectItem.innerHTML = `
                    <i class="fas fa-folder"></i>
                    <span>${project.name}</span>
                `;
                
                projectItem.addEventListener('click', () => {
                    alert(Открытие проекта: ${project.name});
                });
                
                projectList.appendChild(projectItem);
            });
        }
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

    formatTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'только что';
        if (diffMins < 60) return ${diffMins} мин назад;
        if (diffHours < 24) return ${diffHours} ч назад;
        if (diffDays === 1) return 'вчера';
        if (diffDays < 7) return ${diffDays} дн назад;
        return date.toLocaleDateString();
    }

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

    handleCreateFile(e) {
        e.preventDefault();
        
        const fileName = document.getElementById('fileName').value;
        const fileType = document.getElementById('fileType').value;

        if (!fileName) {
            alert('Введите название файла!');
            return;
        }

        if (!fileType) {
            alert('Выберите тип файла!');
            return;
        }

        // Создание файла
        const file = {
            id: Date.now().toString(),
            name: fileName + this.getExtension(fileType),
            type: fileType,
            extension: this.getExtension(fileType),
            content: this.getDefaultContent(fileType),
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            owner: this.currentUser.id,
            size: '0 KB'
        };

        // Сохранение файла
        this.saveFile(file);
        
        // Показать уведомление
        this.showNotification(Файл "${file.name}" создан успешно!);
        
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

        if (!projectName) {
            alert('Введите название проекта!');
            return;
        }

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

    handleInvite() {
        const workspaceName = document.getElementById('workspaceTitle').textContent;
        const inviteLink = ${window.location.origin}${window.location.pathname}?invite=${this.currentUser.id};
        
        const message = Присоединяйтесь к моему рабочему пространству "${workspaceName}" в CollabSpace!\n\nСсылка для присоединения: ${inviteLink}\n\nСкопируйте и отправьте эту ссылку друзьям!;
        
        alert(message);
        
        // Пытаемся скопировать в буфер обмена
        navigator.clipboard.writeText(inviteLink).then(() => {
            console.log('Invite link copied to clipboard');
        }).catch(() => {
            console.log('Could not copy to clipboard');
        });
    }

    showCreateFolderModal() {
        const folderName = prompt('Введите название папки:');
        if (folderName) {
            const folder = {
                id: Date.now().toString(),
                name: folderName,
                type: 'folder',
                created: new Date().toISOString(),
                owner: this.currentUser.id,
                files: []
            };
            
            this.saveFolder(folder);
            this.showNotification(Папка "${folderName}" создана);
            this.loadProjects();
        }
    }

    showImportModal() {
        alert('Функция импорта файлов будет доступна в следующем обновлении!');
    }

    openFile(filename) {
        // Находим файл в localStorage
        const files = JSON.parse(localStorage.getItem('collabspace_files') || '[]');
        const file = files.find(f => f.name === filename && f.owner === this.currentUser.id);
        
        if (file) {
            // Сохраняем ID файла для открытия в редакторе
            localStorage.setItem('collabspace_current_file', JSON.stringify(file));
            // Переходим в редактор
            window.location.href = 'editor.html';
        } else {
            this.showNotification('Файл не найден', 'error');
        }
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
            'javascript': '// Добро пожаловать в CollabSpace!\nconsole.log("Hello World!");',
            'html': '<!DOCTYPE html>\n<html>\n<head>\n    <title>Новый документ</title>\n</head>\n<body>\n    <h1>Добро пожаловать!</h1>\n</body>\n</html>',
            'css': '/* Добро пожаловать в CollabSpace! */\nbody {\n    margin: 0;\n    padding: 0;\n}',
            'text': 'Добро пожаловать в CollabSpace!',
            'markdown': '# Добро пожаловать!\n\nНачните писать свою документацию здесь.',
            'json': '{\n    "message": "Добро пожаловать в CollabSpace!"\n}'
        };
        return defaultContents[fileType] || '';
    }

    saveFile(file) {
        const files = JSON.parse(localStorage.getItem('collabspace_files') || '[]');
        files.push(file);
        localStorage.setItem('collabspace_files', JSON.stringify(files));
        console.log('Файл сохранен:', file);
    }

    saveProject(project) {
        const projects = JSON.parse(localStorage.getItem('collabspace_projects') || '[]');
        projects.push(project);
        localStorage.setItem('collabspace_projects', JSON.stringify(projects));
        console.log('Проект сохранен:', project);
    }

    saveFolder(folder) {
        const folders = JSON.parse(localStorage.getItem('collabspace_folders') || '[]');
        folders.push(folder);
        localStorage.setItem('collabspace_folders', JSON.stringify(folders));
        console.log('Папка сохранена:', folder);
    }

    showNotification(message, type = 'success') {
        alert(message); // Простое уведомление через alert
    }

    logout() {
        if (confirm('Вы уверены, что хотите выйти?')) {
            Auth.logout();
            window.location.href = 'index.html';
        }
    }
}

// Инициализация dashboard
let dashboard;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing dashboard...');
    dashboard = new Dashboard();
    window.dashboard = dashboard; // Делаем глобально доступным для тестирования
});

console.log('Dashboard.js loaded successfully');
