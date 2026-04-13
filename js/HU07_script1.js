// BASE DE DATOS VACÍA (REALISTA)
const reservas = [];


// FILTRAR ACTIVAS
function obtenerReservasActivas() {
  return reservas.filter(r => r.estado !== "cancelado");
}


// CREAR HTML
function crearReservaHTML(reserva) {
  return `
    <div class="reserva-item">

      <div class="reserva-top">
        <span class="codigo">${reserva.id}</span>
        <span class="estado estado-${reserva.estado}">
          ${reserva.estado}
        </span>
      </div>

      <p>${reserva.zona}</p>
      <p>${reserva.fecha}</p>
      <p>${reserva.tiempo} - ${reserva.precio}</p>

      <button class="btn-cancelar">
        🗑 Cancelar reserva
      </button>

    </div>
  `;
}


// RENDER
function renderReservas() {
  const contenedor = document.querySelector(".reservas-container");

  const activas = obtenerReservasActivas();

  contenedor.innerHTML = "";

  // 👇 CASO SIN DATOS
  if (activas.length === 0) {
    contenedor.innerHTML = `
      <div class="empty-state">
        <p>No tienes reservas activas</p>
      </div>
    `;
    return;
  }

  // 👇 SI HAY DATOS
  activas.forEach(reserva => {
    contenedor.innerHTML += crearReservaHTML(reserva);
  });
}


// INICIAR
renderReservas();