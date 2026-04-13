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

      <button 
        class="btn-cancelar"
        data-id="${reserva.id}"
      >
        🗑 Cancelar reserva
      </button>

    </div>
  `;
}


// ===============================
// ACTIVAR EVENTOS (CLICK)
// ===============================
function activarEventosCancelar() {

  const botones = document.querySelectorAll(".btn-cancelar");

  botones.forEach(boton => {

    boton.addEventListener("click", () => {

      const id = boton.dataset.id;

      // BUSCAR RESERVA
      reservaSeleccionada = reservas.find(r => r.id === id);

      console.log("Reserva seleccionada:", reservaSeleccionada);

      // 👉 Aquí luego mostraremos la Card 2 (criterio 3)

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

  // SI NO HAY RESERVAS
  if (activas.length === 0) {
    contenedor.innerHTML = `
      <div class="empty-state">
        <p>No tienes reservas activas</p>
      </div>
    `;
    return;
  }

  // SI HAY RESERVAS
  activas.forEach(reserva => {
    contenedor.innerHTML += crearReservaHTML(reserva);
  });

  // ACTIVAR EVENTOS
  activarEventosCancelar();
}


// ===============================
// INICIAR APP
// ===============================
renderReservas();