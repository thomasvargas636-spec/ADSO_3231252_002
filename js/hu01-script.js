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
function setSuccess(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) {
    input.classList.remove('input-error');
    input.classList.add('input-success');
    }
    if (error) error.textContent = '';
}
if (passwordInput) {
passwordInput.addEventListener('input', function () {
    const value = this.value;
    const checks = {
    'req-length': value.length >= 8 && value.length <= 12,
    'req-upper': /[A-Z]/.test(value),
    'req-special': /[^a-zA-Z0-9]/.test(value),
    'req-alnum': /[a-zA-Z]/.test(value) && /[0-9]/.test(value)
    };
    Object.entries(checks).forEach(([id, passed]) => {
    const item = document.getElementById(id);
    if (!item) return;
    item.classList.toggle('met', passed);
    });
});
}
['firstname', 'lastname', 'email', 'password', 'confirm-password'].forEach(id => {
const input = document.getElementById(id);
if (input) {
    input.addEventListener('input', function () {
    this.classList.remove('input-error');
    const errorEl = document.getElementById(id + '-error');
    if (errorEl) errorEl.textContent = '';
    });
}
});
if (btnRegister) {
btnRegister.addEventListener('click', function () {
    let valid = true;
    const firstname = document.getElementById('firstname').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    if (!firstname) {
    setError('firstname', 'firstname-error', 'El primer nombre es requerido.');
    valid = false;
    } else {
    setSuccess('firstname', 'firstname-error');
    }
    if (!lastname) {
    setError('lastname', 'lastname-error', 'El apellido es requerido.');
    valid = false;
    } else {
    setSuccess('lastname', 'lastname-error');
    }
    if (!email) {
    setError('email', 'email-error', 'El correo electrónico es requerido.');
    valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('email', 'email-error', 'Ingresa un correo electrónico válido.');
    valid = false;
    } else if (registeredEmails.includes(email.toLowerCase())) {

    setError('email', 'email-error', 'Este correo ya está registrado.');
    valid = false;
    } else {
    setSuccess('email', 'email-error');
    }
});
}