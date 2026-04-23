const registeredEmail = "camilo@gmail.com"; // Usuario registrado simulado

const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');

function clearErrors() {
  emailInput.classList.remove('error');
  emailError.classList.remove('visible');
  emailError.textContent = '';
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  clearErrors();

  const email = emailInput.value.trim();

  if (!email) {
    emailInput.classList.add('error');
    emailError.textContent = 'El correo es obligatorio.';
    emailError.classList.add('visible');
    return;
  }

  if (email !== registeredEmail) {
    emailInput.classList.add('error');
    emailError.textContent = 'Este correo no está registrado en el sistema.';
    emailError.classList.add('visible');
    return;
  }
console.log("Validación exitosa, redirigiendo...");
window.location.href = '../html/HU02.1.3-index.html';
});