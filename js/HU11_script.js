// =========================
// DATOS
// =========================
let usuarios = [
  {
    nombre: "JosephGomez8",
    correo: "joseph@correo.com",
    rol: "Ciudadano",
    fecha: "10 Ene 2026",
    reservas: 12,
    estado: "activo"
  },
  {
    nombre: "t_vxrgas",
    correo: "tvxrgas@correo.com",
    rol: "Administrador",
    fecha: "5 Ene 2026",
    reservas: 3,
    estado: "activo"
  },
  {
    nombre: "usuario3",
    correo: "usuario3@correo.com",
    rol: "Ciudadano",
    fecha: "15 Feb 2026",
    reservas: 7,
    estado: "inactivo"
  }
];

// =========================
// RENDER TABLA
// =========================
function renderTabla() {

  const cont = document.querySelector(".tabla-body");
  cont.innerHTML = "";

  usuarios.forEach((u, index) => {

    const row = document.createElement("div");
    row.classList.add("fila");

    row.innerHTML = `
      <span>
        <b>${u.nombre}</b><br>
        <small>${u.correo}</small>
      </span>

      <span>${u.rol}</span>
      <span>${u.fecha}</span>
      <span>${u.reservas}</span>

      <span class="estado estado-${u.estado}">
        ${u.estado === "activo" ? "Activo" : "Inactivo"}
      </span>

      <span class="acciones">
        <button class="btn editar" data-index="${index}">✏️</button>
        <button class="btn toggle" data-index="${index}">⏸️</button>
        <button class="btn delete" data-index="${index}">🗑️</button>
      </span>
    `;

    cont.appendChild(row);
  });
}

// =========================
// EVENTOS
// =========================
document.addEventListener("click", (e) => {

  const index = e.target.dataset.index;

  // 🔵 EDITAR (criterio 2)
  if (e.target.classList.contains("editar")) {

    const user = usuarios[index];

    const nuevoNombre = prompt("Editar nombre:", user.nombre);
    const nuevoCorreo = prompt("Editar correo:", user.correo);

    if (nuevoNombre) user.nombre = nuevoNombre;
    if (nuevoCorreo) user.correo = nuevoCorreo;

    renderTabla();
  }

  // 🟡 TOGGLE ESTADO
  if (e.target.classList.contains("toggle")) {

    const user = usuarios[index];

    user.estado =
      user.estado === "activo" ? "inactivo" : "activo";

    renderTabla();
  }

  // 🔴 ELIMINAR
  if (e.target.classList.contains("delete")) {

    usuarios.splice(index, 1);

    renderTabla();
  }

});

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  renderTabla();
});