// Простой рабочий код
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена!');
    
    // Показ модальных окон
    document.getElementById('loginBtn').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Кнопка Войти нажата');
        document.getElementById('loginModal').style.display = 'block';
    });
    
    document.getElementById('registerBtn').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Кнопка Регистрация нажата');
        document.getElementById('registerModal').style.display = 'block';
    });
    
    // Закрытие модальных окон
    document.getElementById('closeLogin').addEventListener('click', function() {
        document.getElementById('loginModal').style.display = 'none';
    });
    
    document.getElementById('closeRegister').addEventListener('click', function() {
        document.getElementById('registerModal').style.display = 'none';
    });
    
    // Закрытие по клику вне окна
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Обработка форм
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Вход выполнен!');
        document.getElementById('loginModal').style.display = 'none';
    });
    
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Регистрация успешна!');
        document.getElementById('registerModal').style.display = 'none';
    });
});
