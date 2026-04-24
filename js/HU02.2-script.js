const form = document.getElementById("resetForm");
const pass1 = document.getElementById("new-password");
const pass2 = document.getElementById("confirm-password");

const error1 = document.getElementById("new-password-error");
const error2 = document.getElementById("confirm-password-error");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    limpiarErrores();

    let password = pass1.value;
    let confirm = pass2.value;

    // VALIDACIONES
    if (password.length < 8) {
        return mostrarError(error1, "Minimo 8 caracteres");
    }

    if (password.length > 12) {
        return mostrarError(error1, "Maximo 12 caracteres");
    }

    if (!/[A-Z]/.test(password)) {
        return mostrarError(error1, "Debe tener una mayuscula");
    }

    if (!/[0-9]/.test(password)) {
        return mostrarError(error1, "Debe tener un numero");
    }

    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
        return mostrarError(error1, "Debe tener un caracter especial");
    }

    if (password !== confirm) {
        return mostrarError(error2, "Las contrasenas no coinciden");
    }

    // GUARDADO SIN BASE DE DATOS
    localStorage.setItem("password", password);

    alert("Contrasena guardada correctamente");
});

// funciones
function mostrarError(elemento, mensaje) {
    elemento.textContent = mensaje;
    elemento.classList.add("visible");
}

function limpiarErrores() {
    error1.textContent = "";
    error2.textContent = "";
    error1.classList.remove("visible");
    error2.classList.remove("visible");
}