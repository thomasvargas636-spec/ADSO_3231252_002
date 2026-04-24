const validCode = "000000"; // Código de verificación simulado

const form = document.getElementById('loginForm');
const codeInput = document.getElementById('code');
const codeError = document.getElementById('email-error');

function clearErrors() {
  codeInput.classList.remove('error');
  codeError.classList.remove('visible');
  codeError.textContent = '';
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  clearErrors();

  const code = codeInput.value.trim();

  if (!code) {
    codeInput.classList.add('error');
    codeError.textContent = 'El código de verificación es obligatorio.';
    codeError.classList.add('visible');
    return;
  }

  if (code !== validCode) {
    codeInput.classList.add('error');
    codeError.textContent = 'El código ingresado es incorrecto o ha expirado.';
    codeError.classList.add('visible');
    return;
  }
window.location.href = '../feature-HU02.2/html/HU-02.2.-index.html';
});