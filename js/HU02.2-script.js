const form = document.getElementById("resetForm");
const pass1 = document.getElementById("new-password");
const pass2 = document.getElementById("confirm-password");
const error = document.getElementById("confirm-password-error");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    error.textContent = "";
    error.classList.remove("visible");

    if (pass1.value !== pass2.value) {
        error.textContent = "Las contrasenas no coinciden";
        error.classList.add("visible");
        return;
    }

    alert("Contrasena actualizada correctamente");
});