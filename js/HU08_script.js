function renderTabla() {

  const cont = document.querySelector(".tabla-body");
  cont.innerHTML = "";

  reservas.forEach(r => {

    const row = document.createElement("div");
    row.classList.add("tabla-row");

    row.innerHTML = `
      <span><span class="codigo">${r.id}</span></span>
      <span>${r.zona}</span>
      <span>SAM 525</span>
      <span>${r.fecha}</span>
      <span>${r.tiempo}</span>
      <span>${r.precio}</span>
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

// INIT
document.addEventListener("DOMContentLoaded", () => {
  renderTabla();
  renderResumen();
});