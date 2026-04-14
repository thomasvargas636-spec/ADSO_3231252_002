const cuposPorZona = {
  "Zona Norte A": 10,
  "Zona Sur B": 8,
  "Zona Central": 15
};

const reservas = [
  {
    id: "PRK-001",
    estado: "confirmada",
    zona: "Zona Norte A",
    fecha: "18 Mar 2026 - 2:00 AM",
    tiempo: "2 horas",
    precio: "$2000"
  },
  {
    id: "PRK-002",
    estado: "pendiente",
    zona: "Zona Sur B",
    fecha: "19 Mar 2026 - 4:00 PM",
    tiempo: "3 horas",
    precio: "$3000"
  }
];

let reservaSeleccionada = null;

// RENDER
function renderReservas() {

  const cont = document.querySelector(".reservas-container");
  cont.innerHTML = "";

  reservas.filter(r => r.estado !== "cancelado").forEach(r => {

    const div = document.createElement("div");
    div.classList.add("reserva-item");

    div.innerHTML = `
      <div class="reserva-top">
        <span>${r.id}</span>
        <span class="estado estado-${r.estado}">${r.estado}</span>
      </div>

      <p>${r.zona}</p>
      <p>${r.fecha}</p>
      <p>${r.tiempo} - ${r.precio}</p>

      <button class="btn-cancelar" data-id="${r.id}">
        🗑 Cancelar reserva
      </button>
    `;

    cont.appendChild(div);
  });

  document.querySelectorAll(".btn-cancelar").forEach(btn => {
    btn.onclick = () => {
      reservaSeleccionada = reservas.find(r => r.id === btn.dataset.id);
      mostrar("confirmacion");

      document.querySelector(".detalle-reserva").innerText =
        `${reservaSeleccionada.id} - ${reservaSeleccionada.zona}`;

      document.querySelector(".alerta").innerText =
        "¿Seguro que deseas cancelar esta reserva? El cupo será liberado automáticamente.";
    };
  });
}

// MOSTRAR CARDS
function mostrar(tipo) {
  document.querySelector(".card-lista").style.display = "none";
  document.querySelector(".card-confirmacion").style.display = "none";
  document.querySelector(".card-exito").style.display = "none";

  document.querySelector(`.card-${tipo}`).style.display = "block";
}

// CANCELAR
function cancelarReserva() {

  // VALIDACIÓN 1: existe selección
  if (!reservaSeleccionada) {
    mostrarAlerta("No hay ninguna reserva seleccionada");
    return;
  }

  // VALIDACIÓN 2: ya está cancelada
  if (reservaSeleccionada.estado === "cancelado") {
    mostrarAlerta("Esta reserva ya fue cancelada");
    return;
  }

  // Cancelar
  reservaSeleccionada.estado = "cancelado";

  // Liberar cupo (criterio 5)
  if (cuposPorZona[reservaSeleccionada.zona] !== undefined) {
    cuposPorZona[reservaSeleccionada.zona]++;
  }

  // Mensajes
  document.querySelector(".mensaje-exito").innerText =
    `Reserva ${reservaSeleccionada.id} cancelada`;

  document.querySelector(".cupo-liberado").innerText =
    `+1 cupo liberado en ${reservaSeleccionada.zona}`;

  renderReservas();
  mostrar("exito");
}

// EVENTOS GLOBALES
document.addEventListener("click", (e) => {

  if (e.target.classList.contains("btn-confirmar")) {
    cancelarReserva();
  }

  if (e.target.classList.contains("btn-volver")) {
    mostrar("lista");
  }

  if (e.target.classList.contains("btn-ver-reservas")) {
    mostrar("lista");
  }

  if (e.target.classList.contains("btn-inicio")) {
    location.reload();
  }

});

// INIT
renderReservas();
mostrar("lista");

function mostrarAlerta(mensaje) {
  const alerta = document.getElementById("alerta");

  alerta.innerText = mensaje;
  alerta.classList.add("show");

  setTimeout(() => {
    alerta.classList.remove("show");
  }, 3000);
}