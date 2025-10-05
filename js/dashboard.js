// Dashboard functionality
class Dashboard {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.bindEvents();
        this.loadUserData();
    }

    checkAuth() {
        this.currentUser = JSON.parse(localStorage.getItem('collabspace_current_user'));
        
        if (!this.currentUser) {
            window.location.href = 'index.html';
            return;
        }
    }

    loadUserData() {
        document.getElementById('usernameDisplay').textContent = this.currentUser.username;
    }

    bindEvents() {
        // Меню пользователя
        document.getElementById('userMenuBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('userDropdown').classList.toggle('show');
        });

        // Выход
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Закрытие dropdown при клике вне
        document.addEventListener('click', () => {
            document.getElementById('userDropdown').classList.remove('show');
        });

        // Создание файла
        document.getElementById('createFileBtn').addEventListener('click', () => {
            this.showCreateFileModal();
        });

        document.getElementById('createFirstFileBtn').addEventListener('click', () => {
            this.showCreateFileModal();
        });

        // Создание проекта
        document.getElementById('createProjectBtn').addEventListener('click', () => {
            this.showCreateProjectModal();
        });

        // Выбор типа файла
        this.bindFileTypeSelection();

        // Формы
        document.getElementById('createFileForm').addEventListener('submit', (e) => {
            this.handleCreateFile(e);
        });

        document.getElementById('createProjectForm').addEventListener('submit', (e) => {
            this.handleCreateProject(e);
        });

        // Закрытие модальных окон
        document.getElementById('closeCreateFile').addEventListener('click', () => {
            this.closeModal('createFileModal');
        });

        document.getElementById('closeCreateProject').addEventListener('click', () => {
            this.closeModal('createProjectModal');
        });

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

    showCreateFileModal() {
        document.getElementById('createFileModal').style.display = 'block';
        document.getElementById('fileName').focus();
    }

    showCreateProjectModal() {
        document.getElementById('createProjectModal').style.display = 'block';
        document.getElementById('projectName').focus();
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    handleCreateFile(e) {
        e.preventDefault();
        
        const fileName = document.getElementById('fileName').value;
        const fileType = document.getElementById('fileType').value;
        const fileProject = document.getElementById('fileProject').value;

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
            project: fileProject,
            content: this.getDefaultContent(fileType),
            created: new Date().toISOString(),
            size: '0 KB',
            owner: this.currentUser.id
        };

        // Сохранение файла (в реальном проекте - API запрос)
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

        // Сохранение проекта (в реальном проекте - API запрос)
        this.saveProject(project);
        
        // Показать уведомление
        this.showNotification(Проект "${projectName}" создан успешно!);
        
        // Закрыть модальное окно
        this.closeModal('createProjectModal');
        
        // Очистить форму
        document.getElementById('createProjectForm').reset();
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
        // Пока просто показываем alert
        alert(Файл "${file.name}${file.extension}" создан! В реальном приложении здесь будет открыт редактор.);
    }

    saveProject(project) {
        // В реальном проекте здесь будет API запрос
        console.log('Создан проект:', project);
    }

    showNotification(message) {
        // Простое уведомление
        alert(message);
    }

    logout() {
        localStorage.removeItem('collabspace_current_user');
        window.location.href = 'index.html';
    }
}

// Инициализация dashboard
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});
