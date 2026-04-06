// ── PASSWORD VALIDATION ──

const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm-password');
const btnRegister = document.getElementById('btn-register');

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
      if (passed) {
        item.classList.add('met');
        item.classList.remove('unmet');
      } else {
        item.classList.remove('met');
        item.classList.add('unmet');
      }
    });
  });
}

// ── CLICK TO VALIDATE ──
if (btnRegister) {
  btnRegister.addEventListener('click', function () {
    const inputs = document.querySelectorAll('input');
    let allFilled = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        allFilled = false;
        input.classList.add('error');
      } else {
        input.classList.remove('error');
      }
    });

    if (passwordInput && confirmInput) {
      if (passwordInput.value !== confirmInput.value) {
        confirmInput.classList.add('error');
        allFilled = false;
      }
    }

    if (allFilled) {
      window.location.href = 'hu01-finish.html';
    }
  });
}