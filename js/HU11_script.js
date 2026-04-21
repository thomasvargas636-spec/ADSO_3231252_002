// HU11_script.js

const usuarios = [
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

function renderTabla() {

  const cont = document.querySelector(".tabla-body");
  cont.innerHTML = "";

  usuarios.forEach(u => {

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
        ${u.estado}
      </span>
    `;

    cont.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderTabla();
});