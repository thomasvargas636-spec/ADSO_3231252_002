const loginForm   = document.getElementById('loginForm');
const emailInput  = document.getElementById('email');
const passInput   = document.getElementById('password');

// Contenedores de alerta
const errorBox    = document.getElementById('error-box');
const warningBox  = document.getElementById('warning-box');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Resetear estados visuales
    resetFormStates();

    const emailValue = emailInput.value.trim();
    const passValue  = passInput.value.trim();

    /* --- CRITERIO 4: Validar campos obligatorios --- */
    if (emailValue === "" || passValue === "") {
        showWarning("Los campos de correo y contraseña son obligatorios.");
        if (emailValue === "") emailInput.classList.add('input-error');
        if (passValue === "")  passInput.classList.add('input-error');
        return;
    }

    /* --- CRITERIO 2: Simulación de cuenta registrada --- */
    const validUser = "camilo@gmail.com";
    const validPass = "parkalia2026";

    if (emailValue === validUser && passValue === validPass) {
        /* --- CRITERIO 1: Redirección exitosa --- */
        handleLoginSuccess();
    } 
});

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
    sessionStorage.setItem('userEmail', emailInput.value);
    
    alert("¡Bienvenido a Parkalia!");
    // Asegúrate de que dashboard.html exista en la misma carpeta
    window.location.href = "dashboard.html"; 
}