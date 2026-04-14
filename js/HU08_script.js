let filtroActual = "todas";

function renderTabla() {

  const cont = document.querySelector(".tabla-body");
  cont.innerHTML = "";

  const data = getReservasFiltradas();

  if (data.length === 0) {
    cont.innerHTML = `<p class="sub">No hay reservas en este estado</p>`;
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

// CONTADORES
function renderResumen() {

  document.getElementById("totalReservas").innerText = reservas.length;

  document.getElementById("totalPagadas").innerText =
    reservas.filter(r => r.estado === "pagada").length;

  document.getElementById("totalPendientes").innerText =
    reservas.filter(r => r.estado === "pendiente").length;

  document.getElementById("totalCanceladas").innerText =
    reservas.filter(r => r.estado === "cancelado").length;
}

function getReservasFiltradas() {
  if (filtroActual === "todas") return reservas;
  return reservas.filter(r => r.estado === filtroActual);
}
document.querySelectorAll(".filtro-btn").forEach(btn => {

  btn.addEventListener("click", () => {

    // quitar active
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

document.addEventListener("DOMContentLoaded", () => {
  renderTabla();
  renderResumen();
});

