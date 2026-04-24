const loginForm   = document.getElementById('loginForm');
const emailInput  = document.getElementById('email');
const passInput   = document.getElementById('password');

// Contenedores de alerta
const errorBox    = document.getElementById('error-box');
const warningBox  = document.getElementById('warning-box');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    resetFormStates();

    const emailValue = emailInput.value.trim();
    const passValue  = passInput.value.trim();

    // VALIDAR CAMPOS VACIOS
    if (emailValue === "" || passValue === "") {
        showWarning("Los campos de correo y contrasena son obligatorios.");
        if (emailValue === "") emailInput.classList.add('input-error');
        if (passValue === "")  passInput.classList.add('input-error');
        return;
    }

    // 🔥 DATOS DINAMICOS (localStorage)
    const savedEmail = localStorage.getItem("email") || "camilo@gmail.com";
    const savedPass  = localStorage.getItem("password") || "parkalia2026";

    // VALIDACION
    if (emailValue === savedEmail && passValue === savedPass) {
        handleLoginSuccess();
    } else {
        showError("Las credenciales no coinciden. Verifica tu correo y contrasena.");
    }
});

/* FUNCIONES DE APOYO */

function resetFormStates() {
    errorBox.classList.add('hidden');
    warningBox.classList.add('hidden');
    emailInput.classList.remove('input-error');
    passInput.classList.remove('input-error');
}

function showWarning(message) {
    warningBox.textContent = message;
    warningBox.classList.remove('hidden');
}

function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
}

function handleLoginSuccess() {
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('user', emailInput.value.trim());

    alert("Bienvenido a Parkalia!");
    window.location.href = "dashboard.html"; 
}