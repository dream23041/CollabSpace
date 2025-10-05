// Базовые функции для модальных окон
function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

function showRegister() {
    document.getElementById('registerModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showDemo() {
    alert('Демо-режим будет доступен после реализации основного функционала!');
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// Обработка форм
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('#loginModal form');
    const registerForm = document.querySelector('#registerModal form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Функционал входа будет реализован в бэкенде');
            closeModal('loginModal');
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Функционал регистрации будет реализован в бэкенде');
            closeModal('registerModal');
        });
    }
    
    // Добавляем обработчики для кнопок в навигации
    document.querySelector('.login-btn').addEventListener('click', function(e) {
        e.preventDefault();
        showLogin();
    });
    
    document.querySelector('.register-btn').addEventListener('click', function(e) {
        e.preventDefault();
        showRegister();
    });
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
