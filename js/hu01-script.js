// ── SIMULATION OF REGISTERED EMAILS ──
const registeredEmails = ['test@mail.com', 'admin@parkalia.com'];
const screenForm = document.getElementById('screen-form');
const screenSuccess = document.getElementById('screen-success');
const btnRegister = document.getElementById('btn-register');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm-password');

function setError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) {
        input.classList.add('input-error');
        input.classList.remove('input-success');
    }   if (error) error.textContent = '⚠ ' + message;
}

