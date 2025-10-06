// Редактор текстовых файлов
class TextEditor {
    constructor() {
        this.currentFile = null;
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.bindEvents();
        this.loadFiles();
        this.setupAutoSave();
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
            <a href="dashboard.html">Личный кабинет</a>
            <div class="user-nav">
                <span class="user-greeting">Привет, ${this.currentUser.username}!</span>
                <div class="avatar-small">${this.currentUser.username.charAt(0).toUpperCase()}</div>
                <div class="dropdown">
                    <button class="user-btn">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="dropdown-menu">
                        <a href="dashboard.html" class="dropdown-item">
                            <i class="fas fa-home"></i>
                            В кабинет
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item" onclick="logout()">
                            <i class="fas fa-sign-out-alt"></i>
                            Выйти
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Автосохранение при изменении текста
        document.getElementById('textEditor').addEventListener('input', () => {
            this.autoSave();
        });

        // Сохранение при изменении имени файла
        document.getElementById('fileNameInput').addEventListener('change', () => {
            this.saveFile();
        });

        // Горячие клавиши
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 's') {
                    e.preventDefault();
                    this.saveFile();
                }
            }
        });
    }

    loadFiles() {
        const files = JSON.parse(localStorage.getItem('collabspace_files') || '[]');
        const userFiles = files.filter(file => file.owner === this.currentUser.id);
        
        const fileTree = document.getElementById('fileTree');
        fileTree.innerHTML = '';

        if (userFiles.length === 0) {
            fileTree.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <p>Нет файлов</p>
                </div>
            `;
            return;
        }

        userFiles.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-tree-item';
            fileItem.innerHTML = `
                <i class="${this.getFileIcon(file.type)}"></i>
                <span>${file.name}</span>
            `;
            
            fileItem.addEventListener('click', () => {
                this.openFile(file);
            });
            
            fileTree.appendChild(fileItem);
        });
    }

    openFile(file) {
        this.currentFile = file;
        
        // Обновляем интерфейс
        document.getElementById('fileNameInput').value = file.name;
        document.getElementById('textEditor').value = file.content;
        document.getElementById('fileIcon').className = this.getFileIcon(file.type);
        
        // Показываем информацию о файле
        this.showFileInfo(file);
        
        // Подсвечиваем активный файл в дереве
        document.querySelectorAll('.file-tree-item').forEach(item => {
            item.classList.remove('active');
        });
        
        event.currentTarget.classList.add('active');
    }

    showFileInfo(file) {
        const fileInfo = document.getElementById('fileInfo');
        const created = new Date(file.created).toLocaleString();
        const modified = new Date(file.modified).toLocaleString();
        
        fileInfo.innerHTML = `
            <div><strong>Тип:</strong> ${this.getFileTypeName(file.type)}</div>
            <div><strong>Размер:</strong> ${file.size || '0 KB'}</div>
            <div><strong>Создан:</strong> ${created}</div>
            <div><strong>Изменен:</strong> ${modified}</div>
            ${file.imported ? '<div><em>Импортирован</em></div>' : ''}
        `;
    }

    createNewFile() {
        const fileName = prompt('Введите название файла:', 'Новый документ.txt');
        if (!fileName) return;

        const fileType = this.getFileTypeFromExtension(fileName);
        
        const newFile = {
            id: Date.now().toString(),
            name: fileName,
            type: fileType,
            extension: this.getExtension(fileType),
            content: '',
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            owner: this.currentUser.id,
            size: '0 KB'
        };

        this.saveFileToStorage(newFile);
        this.loadFiles();
        this.openFile(newFile);
        
        this.showNotification(Файл "${fileName}" создан);
    }

    saveFile() {
        if (!this.currentFile) {
            this.createNewFile();
            return;
        }

        const fileName = document.getElementById('fileNameInput').value;
        const content = document.getElementById('textEditor').value;
        
        // Обновляем текущий файл
        this.currentFile.name = fileName;
        this.currentFile.content = content;
        this.currentFile.modified = new Date().toISOString();
        this.currentFile.size = this.formatSize(content.length);
        
        this.saveFileToStorage(this.currentFile);
        this.loadFiles();
        
        this.showNotification('Файл сохранен');
    }

    autoSave() {
        if (!this.currentFile) return;
        
        // Автосохранение каждые 30 секунд
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.saveFile();
        }, 30000);
    }

    setupAutoSave() {
        // Показываем уведомление об автосохранении
        console.log('Автосохранение включено (каждые 30 секунд)');
    }

    saveFileToStorage(file) {
        const files = JSON.parse(localStorage.getItem('collabspace_files') || '[]');
        const existingIndex = files.findIndex(f => f.id === file.id);
        
        if (existingIndex !== -1) {
            files[existingIndex] = file;
        } else {
            files.push(file);
        }
        
        localStorage.setItem('collabspace_files', JSON.stringify(files));
    }

    downloadFile() {
        if (!this.currentFile) {
            this.showNotification('Нет файла для скачивания', 'error');
            return;
        }

        const content = document.getElementById('textEditor').value;
        const fileName = document.getElementById('fileNameInput').value;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Файл скачан');
    }

    // Вспомогательные функции
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

    getFileTypeName(fileType) {
        const names = {
            'javascript': 'JavaScript',
            'html': 'HTML',
            'css': 'CSS',
            'text': 'Текстовый файл',
            'markdown': 'Markdown',
            'json': 'JSON'
        };
        return names[fileType] || 'Файл';
    }

    getFileTypeFromExtension(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const typeMap = {
            'js': 'javascript',
            'html': 'html',
            'css': 'css',
            'txt': 'text',
            'md': 'markdown',
            'json': 'json'
        };
        return typeMap[extension] || 'text';
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

    formatSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = admin-notification ${type};
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Глобальные функции для HTML
function createNewFile() {
    editor.createNewFile();
}

function saveFile() {
    editor.saveFile();
}

function downloadFile() {
    editor.downloadFile();
}

function goToDashboard() {
    window.location.href = 'dashboard.html';
}

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        Auth.logout();
        window.location.href = 'index.html';
    }
}

// Функции форматирования текста
function formatText(type) {
    const textarea = document.getElementById('textEditor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedText = '';
    
    switch (type) {
        case 'bold':
            formattedText = **${selectedText}**;
            break;
        case 'italic':
            formattedText = _${selectedText}_;
            break;
        case 'underline':
            formattedText = <u>${selectedText}</u>;
            break;
    }
    
    textarea.setRangeText(formattedText, start, end, 'select');
    textarea.focus();
}

function insertText(text) {
    const textarea = document.getElementById('textEditor');
    const start = textarea.selectionStart;
    
    textarea.setRangeText(text, start, start, 'end');
    textarea.focus();
}

// Инициализация редактора
let editor;

document.addEventListener('DOMContentLoaded', function() {
    editor = new TextEditor();
});
