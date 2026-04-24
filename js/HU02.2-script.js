const form = document.getElementById("resetForm");
const pass1 = document.getElementById("new-password");
const pass2 = document.getElementById("confirm-password");

const error1 = document.getElementById("new-password-error");
const error2 = document.getElementById("confirm-password-error");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    // limpiar errores
    error1.textContent = "";
    error2.textContent = "";
    error1.classList.remove("visible");
    error2.classList.remove("visible");

    let password = pass1.value;
    let confirm = pass2.value;

    // validaciones de seguridad
    if (password.length < 8) {
        mostrarError(error1, "Minimo 8 caracteres");
        return;
    }

    if (password.length > 12) {
        mostrarError(error1, "Maximo 12 caracteres");
        return;
    }

    if (!/[A-Z]/.test(password)) {
        mostrarError(error1, "Debe tener una mayuscula");
        return;
    }

    if (!/[0-9]/.test(password)) {
        mostrarError(error1, "Debe tener un numero");
        return;
    }

    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
        mostrarError(error1, "Debe tener un caracter especial");
        return;
    }

    if (!/^[a-zA-Z0-9!@#$%^&*(),.?\":{}|<>]+$/.test(password)) {
        mostrarError(error1, "Solo caracteres validos");
        return;
    }

    // validar que coincidan
    if (password !== confirm) {
        mostrarError(error2, "Las contrasenas no coinciden");
        return;
    }

    alert("Contrasena actualizada correctamente");
});

// funcion reutilizable
function mostrarError(elemento, mensaje) {
    elemento.textContent = mensaje;
    elemento.classList.add("visible");
}