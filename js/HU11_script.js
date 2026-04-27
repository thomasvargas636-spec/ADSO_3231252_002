// =========================
// USUARIO ACTUAL
// =========================
const usuarioActual = {
  nombre: "AdminUser",
  rol: "Administrador"
};

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
// ESTADO GLOBAL
// =========================
let filtroActual = "todos";
let textoBusqueda = "";
let usuarioSeleccionado = null;
let accionToggle = null;

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
    .forEach((u) => {

      const index = usuarios.indexOf(u);

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
          <button class="btn editar" data-index="${index}">✏️</button>
          <button class="btn toggle" data-index="${index}">⏸️</button>
          <button class="btn delete" data-index="${index}">🗑️</button>
        </span>
      `;

      cont.appendChild(row);
    });

  actualizarCards();
}

// =========================
// CAMBIO DE VISTAS
// =========================
function volverTabla() {

  document.getElementById("vista-editar").classList.add("oculto");
  document.getElementById("vista-toggle").classList.add("oculto");
  document.getElementById("vista-eliminar").classList.add("oculto");

  document.querySelector(".tabla-card").classList.remove("oculto");
  document.querySelector(".cards").classList.remove("oculto");
  document.querySelector(".filtros").classList.remove("oculto");

  renderTabla();
}

function volverDesdeToggle() {
  document.getElementById("vista-toggle").classList.add("oculto");
  volverTabla();
}

// =========================
// EVENTOS
// =========================
document.addEventListener("click", (e) => {

  const index = e.target.dataset.index;

  // 🔵 EDITAR
  if (e.target.classList.contains("editar")) {

    usuarioSeleccionado = index;
    const user = usuarios[index];

    document.getElementById("editNombre").value = user.nombre;
    document.getElementById("editCorreo").value = user.correo;
    document.getElementById("editRol").value = user.rol;
    document.getElementById("editEstado").value = user.estado;

    document.querySelector(".tabla-card").classList.add("oculto");
    document.querySelector(".cards").classList.add("oculto");
    document.querySelector(".filtros").classList.add("oculto");
    document.getElementById("vista-editar").classList.remove("oculto");
  }

  // 💾 GUARDAR EDITAR
  if (e.target.id === "guardarEditar") {

    const user = usuarios[usuarioSeleccionado];

    user.nombre = document.getElementById("editNombre").value;
    user.correo = document.getElementById("editCorreo").value;
    user.rol = document.getElementById("editRol").value;
    user.estado = document.getElementById("editEstado").value;

    volverTabla();
  }

  // ❌ CANCELAR EDITAR
  if (e.target.id === "cancelarEditar" || e.target.id === "cerrarEditar") {
    volverTabla();
  }

  // 🟡 TOGGLE (ABRIR VISTA)
  if (e.target.classList.contains("toggle")) {

    usuarioSeleccionado = index;
    const user = usuarios[index];

    accionToggle = user.estado === "activo" ? "desactivar" : "activar";

    document.getElementById("tituloToggle").textContent =
      accionToggle === "desactivar"
        ? "Desactivar usuario"
        : "Activar usuario";

    document.getElementById("mensajeToggle").innerHTML = `
      ¿Seguro que deseas ${accionToggle} a <b>${user.nombre}</b>?
      <br><br>
      <span class="rol ${user.rol === "Administrador" ? "admin" : ""}">
        ${user.rol}
      </span>
    `;

    document.querySelector(".tabla-card").classList.add("oculto");
    document.querySelector(".cards").classList.add("oculto");
    document.querySelector(".filtros").classList.add("oculto");

    document.getElementById("vista-toggle").classList.remove("oculto");
  }

  // ✅ CONFIRMAR TOGGLE
  if (e.target.id === "confirmarToggle") {

    const user = usuarios[usuarioSeleccionado];

    user.estado =
      user.estado === "activo" ? "inactivo" : "activo";

    volverDesdeToggle();
  }

  // ❌ CANCELAR TOGGLE
  if (e.target.id === "cancelarToggle" || e.target.id === "cerrarToggle") {
    volverDesdeToggle();
  }

  // 🔴 ELIMINAR (ABRIR VISTA)
  if (e.target.classList.contains("delete")) {

    usuarioSeleccionado = index;
    const user = usuarios[index];

    document.getElementById("deleteUserPreview").innerHTML = `
      <div style="flex:1">
        <b>${user.nombre}</b><br>
        <small>${user.correo}</small>
      </div>

      <span class="rol ${user.rol === "Administrador" ? "admin" : ""}">
        ${user.rol}
      </span>
    `;

    document.querySelector(".tabla-card").classList.add("oculto");
    document.querySelector(".cards").classList.add("oculto");
    document.querySelector(".filtros").classList.add("oculto");

    document.getElementById("vista-eliminar").classList.remove("oculto");
  }

  // 🔥 CONFIRMAR ELIMINAR
  if (e.target.id === "confirmarEliminar") {

    usuarios.splice(usuarioSeleccionado, 1);

    volverTabla();
  }

  // ❌ CANCELAR ELIMINAR
  if (e.target.id === "cancelarEliminar" || e.target.id === "cerrarEliminar") {
    volverTabla();
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
    return;
  }

  renderTabla();
});