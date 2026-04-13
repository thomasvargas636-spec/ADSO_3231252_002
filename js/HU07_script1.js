
// ===============================
// BASE DE DATOS (VACÍA - REAL)
// ===============================
const reservas = [];

// ===============================
// VARIABLE GLOBAL
// ===============================
let reservaSeleccionada = null;

// ===============================
// FILTRAR RESERVAS ACTIVAS
// ===============================
function obtenerReservasActivas() {
  return reservas.filter(r => r.estado !== "cancelado");
}

// ===============================
// CREAR HTML DE RESERVA
// ===============================
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

      <button class="btn-cancelar" data-id="${reserva.id}">
        🗑 Cancelar reserva
      </button>

    </div>
  `;
}

// ===============================
// ACTIVAR EVENTOS
// ===============================
function activarEventosCancelar() {

  const botones = document.querySelectorAll(".btn-cancelar");

  botones.forEach(boton => {

    boton.addEventListener("click", () => {

      const id = boton.dataset.id;

      // guardar reserva seleccionada
      reservaSeleccionada = reservas.find(r => r.id === id);

      console.log("Reserva seleccionada:", reservaSeleccionada);

      // ===========================
      // CRITERIO 3: MOSTRAR CARD 2
      // ===========================

      document.querySelector(".card").style.display = "none";
      document.querySelector(".card-confirmacion").style.display = "block";

      document.querySelector(".detalle-reserva").innerHTML = `
        <p><b>${reservaSeleccionada.id}</b></p>
        <p>${reservaSeleccionada.zona}</p>
        <p>${reservaSeleccionada.fecha}</p>
        <p>${reservaSeleccionada.tiempo} - ${reservaSeleccionada.precio}</p>
      `;

    });

  });

}

// ===============================
// RENDERIZAR RESERVAS
// ===============================
function renderReservas() {

  const contenedor = document.querySelector(".reservas-container");
  const activas = obtenerReservasActivas();

  contenedor.innerHTML = "";

  if (activas.length === 0) {
    contenedor.innerHTML = `
      <div class="empty-state">
        <p>No tienes reservas activas</p>
      </div>
    `;
    return;
  }

  activas.forEach(reserva => {
    contenedor.innerHTML += crearReservaHTML(reserva);
  });

  activarEventosCancelar();
}

// ===============================
// BOTÓN VOLVER (CARD 2 → CARD 1)
// ===============================
function configurarBotonVolver() {

  document.querySelector(".btn-volver").addEventListener("click", () => {

    document.querySelector(".card-confirmacion").style.display = "none";
    document.querySelector(".card").style.display = "block";

  });

}

// ===============================
// INICIAR APP
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  renderReservas();
  configurarBotonVolver();

});