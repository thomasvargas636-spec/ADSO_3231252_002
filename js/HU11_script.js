const usuarioActual = {
  nombre: "AdminUser",
  rol: "Administrador" // cambia a "Ciudadano" para probar bloqueo
};

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
// ESTADO GLOBAL
// =========================
let filtroActual = "todos";
let textoBusqueda = "";

// =========================
// SUBCARDS
// =========================
function actualizarCards() {

  const total = usuarios.length;
  const activos = usuarios.filter(u => u.estado === "activo").length;
  const inactivos = usuarios.filter(u => u.estado === "inactivo").length;
  const admins = usuarios.filter(u => u.rol === "Administrador").length;

  document.getElementById("totalUsuarios").textContent = total;
  document.getElementById("activos").textContent = activos;
  document.getElementById("inactivos").textContent = inactivos;
  document.getElementById("admins").textContent = admins;
}

// =========================
// RENDER TABLA
// =========================
function renderTabla() {

  const cont = document.querySelector(".tabla-body");
  cont.innerHTML = "";

  usuarios
    .filter(u => {

      if (filtroActual === "activo") return u.estado === "activo";
      if (filtroActual === "inactivo") return u.estado === "inactivo";
      if (filtroActual === "admin") return u.rol === "Administrador";

      return true;
    })
    .filter(u => {
      return (
        u.nombre.toLowerCase().includes(textoBusqueda) ||
        u.correo.toLowerCase().includes(textoBusqueda)
      );
    })
    .forEach((u, index) => {

      const row = document.createElement("div");
      row.classList.add("fila");

      row.innerHTML = `
        <span>
          <b>${u.nombre}</b><br>
          <small>${u.correo}</small>
        </span>

        <span class="rol ${u.rol === "Administrador" ? "admin" : ""}">
            ${u.rol}
        </span>
        <span>${u.fecha}</span>
        <span>${u.reservas}</span>

        <span class="estado estado-${u.estado}">
          ${u.estado === "activo" ? "Activo" : "Inactivo"}
        </span>

        <span class="acciones">
          <button class="btn editar" data-index="${usuarios.indexOf(u)}">✏️</button>
          <button class="btn toggle" data-index="${usuarios.indexOf(u)}">⏸️</button>
          <button class="btn delete" data-index="${usuarios.indexOf(u)}">🗑️</button>
        </span>
      `;

      cont.appendChild(row);
    });

  actualizarCards();
}

// =========================
// EVENTOS GENERALES
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

  // 🟡 TOGGLE ESTADO (criterio 5)
  if (e.target.classList.contains("toggle")) {

    const user = usuarios[index];

    const accion =
      user.estado === "activo"
        ? "desactivar"
        : "activar";

    const confirmar = confirm(
      `¿Seguro que deseas ${accion} este usuario?`
    );

    if (!confirmar) return;

    user.estado =
      user.estado === "activo" ? "inactivo" : "activo";

    renderTabla();
  }

  // 🔴 ELIMINAR (criterio 5)
  if (e.target.classList.contains("delete")) {

    const confirmar = confirm(
      "¿Seguro que deseas eliminar este usuario?"
    );

    if (!confirmar) return;

    usuarios.splice(index, 1);

    renderTabla();
  }

});

// =========================
// BUSCADOR
// =========================
document.getElementById("buscador").addEventListener("input", (e) => {
  textoBusqueda = e.target.value.toLowerCase();
  renderTabla();
});

// =========================
// FILTROS
// =========================
document.querySelectorAll(".botones button").forEach(btn => {

  btn.addEventListener("click", () => {

    document.querySelectorAll(".botones button")
      .forEach(b => b.classList.remove("activo"));

    btn.classList.add("activo");

    filtroActual = btn.dataset.filtro;

    renderTabla();
  });

});

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {

  // 🔒 VALIDACIÓN DE ACCESO
  if (usuarioActual.rol !== "Administrador") {

    document.body.innerHTML = `
      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        height:100vh;
        background:#0D1117;
        color:#fff;
        font-family:DM Sans;
        text-align:center;
      ">
        <div>
          <h1 style="color:#F85149;">Acceso restringido</h1>
          <p>No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    `;

    return; // 🚨 detiene todo
  }

  // ✅ SI ES ADMIN
  renderTabla();
});