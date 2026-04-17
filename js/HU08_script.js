let filtroActual = "todas";

const reservas = [
  {
    codigo: "PRK-001",
    zona: "Zona Norte A",
    vehiculo: "ABC-123",
    fecha: "18 Mar 2026 - 2:00 AM",
    duracion: "2 horas",
    monto: 2000,
    estado: "pagada"
  },
  {
    codigo: "PRK-002",
    zona: "Zona Sur B",
    vehiculo: "XYZ-987",
    fecha: "19 Mar 2026 - 4:00 PM",
    duracion: "3 horas",
    monto: 3000,
    estado: "pendiente"
  },
  {
    codigo: "PRK-003",
    zona: "Zona Central",
    vehiculo: "LMN-456",
    fecha: "20 Mar 2026 - 1:00 PM",
    duracion: "1 hora",
    monto: 1500,
    estado: "cancelado"
  }
];

function getReservasFiltradas() {
  if (filtroActual === "todas") return reservas;
  return reservas.filter(r => r.estado === filtroActual);
}

function renderTabla() {

  const cont = document.querySelector(".tabla-body");
  cont.innerHTML = "";

  const data = getReservasFiltradas();

  // 🔥 vacío total
  if (reservas.length === 0) {
    cont.innerHTML = `<div class="empty-state">No tienes reservas aún</div>`;
    return;
  }

  // 🔥 filtro vacío
  if (data.length === 0) {
    cont.innerHTML = `<div class="empty-state">No hay reservas en este estado</div>`;
    return;
  }

  data.forEach(r => {

    const row = document.createElement("div");
    row.classList.add("fila");

    row.innerHTML = `
      <span><span class="codigo">${r.codigo}</span></span>
      <span>${r.zona}</span>
      <span>${r.vehiculo}</span>
      <span>${r.fecha}</span>
      <span>${r.duracion}</span>
      <span class="monto ${r.estado}">${r.monto}</span>
      <span class="estado estado-${r.estado}">${r.estado}</span>
    `;

    cont.appendChild(row);
  });
}

function renderResumen() {

  document.getElementById("totalReservas").innerText = reservas.length;

  document.getElementById("totalPagadas").innerText =
    reservas.filter(r => r.estado === "pagada").length;

  document.getElementById("totalPendientes").innerText =
    reservas.filter(r => r.estado === "pendiente").length;

  document.getElementById("totalCanceladas").innerText =
    reservas.filter(r => r.estado === "cancelado").length;
}

// 🔥 BOTONES FILTRO
document.querySelectorAll(".filtro-btn").forEach(btn => {

  btn.addEventListener("click", () => {

    document.querySelectorAll(".filtro-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    const text = btn.textContent.toLowerCase();

    if (text.includes("todas")) filtroActual = "todas";
    if (text.includes("pagadas")) filtroActual = "pagada";
    if (text.includes("pendientes")) filtroActual = "pendiente";
    if (text.includes("canceladas")) filtroActual = "cancelado";

    renderTabla();
  });
});

// INIT
document.addEventListener("DOMContentLoaded", () => {

  validarAutenticacion(); // 🔥 primero

  renderTabla();
  renderResumen();

});

function validarAutenticacion() {

  const usuario = localStorage.getItem("usuario");

  if (!usuario) {
    alert("Debes iniciar sesión");

    // redirección (simulada)
    window.location.href = "login.html";
  }

}