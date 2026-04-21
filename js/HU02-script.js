
const loginForm   = document.getElementById('loginForm');
const emailInput  = document.getElementById('email');
const passInput   = document.getElementById('password');

// Contenedores de alerta
const errorBox    = document.getElementById('error-box');
const warningBox  = document.getElementById('warning-box');

loginForm.addEventListener('submit', function(e) {
    // Prevenir el envío automático para validar primero
    e.preventDefault();

    // Resetear estados visuales en cada intento
    resetFormStates();

    const emailValue = emailInput.value.trim();
    const passValue  = passInput.value.trim();

    /* --- CRITERIO 2: Simulación de cuenta registrada --- */

    const validUser = "camilo@gmail.com";// Usuario registrado simulado
    const validPass = "parkalia2026";// Contraseña registrada simulada

    if (emailValue === validUser && passValue === validPass) {
        /* --- CRITERIO 1: Redirección exitosa --- */
        handleLoginSuccess();
    } else {
        /* --- CRITERIO 3: Credenciales incorrectas --- */
        showError("Las credenciales no coinciden. Verifica tu correo y contraseña.");
    }
});

/* =========================================
   3. FUNCIONES DE APOYO (HELPERS)
   ========================================= */

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
    // Guardamos sesión simple (opcional)
    sessionStorage.setItem('isLoggedIn', 'true');
    
    // Alerta de éxito y redirección al Dashboard
    alert("¡Bienvenido a Parkalia!");
    window.location.href = "dashboard.html"; 
}
function handleLoginSuccess() {
    // Guardamos sesión simple (opcional)
    sessionStorage.setItem('isLoggedIn', 'true');
    
    // Alerta de éxito y redirección al Dashboard
    alert("¡Bienvenido a Parkalia!");
    window.location.href = "dashboard.html"; 
}