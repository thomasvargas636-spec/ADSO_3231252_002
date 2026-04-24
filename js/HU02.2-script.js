const tiempoGuardado = localStorage.getItem("recoveryTime");

if (tiempoGuardado) {
    const ahora = Date.now();
    const diferencia = ahora - tiempoGuardado;

    const limite = 15 * 60 * 1000; // 15 minutos

    if (diferencia > limite) {
        alert("El enlace ha expirado. Solicita uno nuevo.");
        window.location.href = "../HU-02/HU-02-index.html";
    }
}

const newUser = {
  email: "camilo@gmail.com",
  password: null
};

const form = document.getElementById('resetForm');
const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const newPasswordError = document.getElementById('new-password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');
const successMessage = document.getElementById('success-message');

function clearErrors() {
  newPasswordInput.classList.remove('error');
  confirmPasswordInput.classList.remove('error');

  newPasswordError.classList.remove('visible');
  confirmPasswordError.classList.remove('visible');
  successMessage.classList.remove('visible');

  newPasswordError.textContent = '';
  confirmPasswordError.textContent = '';
  successMessage.textContent = '';
}

function validatePassword(pass) {
  if (!pass) return 'La contrasena es obligatoria.';
  if (pass.length < 8) return 'Minimo 8 caracteres.';
  if (pass.length > 12) return 'Maximo 12 caracteres.';
  if (!/[A-Z]/.test(pass)) return 'Debe tener una mayuscula.';
  if (!/[0-9]/.test(pass)) return 'Debe tener un numero.';
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pass)) return 'Debe tener un caracter especial.';
  return null;
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  clearErrors();
localStorage.removeItem("recoveryTime");
  const pass1 = newPasswordInput.value.trim();
  const pass2 = confirmPasswordInput.value.trim();

  const error = validatePassword(pass1);
  if (error) {
    newPasswordInput.classList.add('error');
    newPasswordError.textContent = error;
    newPasswordError.classList.add('visible');
    return;
  }

  if (!pass2) {
    confirmPasswordInput.classList.add('error');
    confirmPasswordError.textContent = 'Debes confirmar tu contrasena.';
    confirmPasswordError.classList.add('visible');
    return;
  }

  if (pass1 !== pass2) {
    confirmPasswordInput.classList.add('error');
    confirmPasswordError.textContent = 'Las contrasenas no coinciden.';
    confirmPasswordError.classList.add('visible');
    return;
  }

  // guardar sin base de datos
  localStorage.setItem("password", pass1);
  newUser.password = pass1;

  // mensaje de exito
  successMessage.textContent = 'Contrasena actualizada correctamente.';
  successMessage.classList.add('visible');
  setTimeout(() => {
  window.location.href = "HU02.2.2-index.html"; // usa tu ruta real
}, 2000);
});