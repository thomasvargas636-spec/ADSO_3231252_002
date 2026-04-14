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
  },
  {
    id: "PRK-003",
    estado: "usada",
    zona: "Zona Central",
    fecha: "10 Mar 2025 - 2:00 AM",
    tiempo: "1 hora",
    precio: "$1500"
  }
];

let reservaSeleccionada = null;

// ===============================
// RENDER
// ===============================
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
        "¿Seguro que deseas cancelar\n esta reserva? El cupo será liberado\n automáticamente.";
    };
  });
}

// ===============================
// MOSTRAR CARDS
// ===============================
function mostrar(tipo) {

  document.querySelectorAll(".card").forEach(c => {
    c.style.display = "none";
    c.classList.remove("activa");
  });

  const card = document.querySelector(`.card-${tipo}`);
  card.style.display = "block";
  card.classList.add("activa");
}

// ===============================
// CANCELAR
// ===============================
function cancelarReserva() {

  if (!reservaSeleccionada) {
    mostrarAlerta("No hay ninguna reserva seleccionada");
    return;
  }

  // ❌ VALIDACIONES
  if (reservaSeleccionada.estado === "usada") {
    mostrarAlerta("No puedes cancelar una reserva ya utilizada");
    return;
  }

  if (estaExpirada(reservaSeleccionada.fecha)) {
    mostrarAlerta("No puedes cancelar una reserva expirada");
    return;
  }

  if (reservaSeleccionada.estado === "cancelado") {
    mostrarAlerta("Esta reserva ya fue cancelada");
    return;
  }

  // ✅ CANCELAR
  reservaSeleccionada.estado = "cancelado";

  // 🔥 NUEVO BLOQUE (SUBCARD DE ÉXITO)
  document.querySelector(".detalle-exito").innerHTML = `
  
  <div class="info-card">

    <div class="reserva-info-card">

      <p><strong>Código:</strong> ${reservaSeleccionada.id}</p>
      <p><strong>Zona:</strong> ${reservaSeleccionada.zona}</p>
      <p><strong>Fecha:</strong> ${reservaSeleccionada.fecha}</p>

      <p>
        <strong>Estado:</strong> 
        <span class="estado estado-cancelado">Cancelada</span>
      </p>

      <div class="info-card cupo-card">
        +1 cupo liberado en ${reservaSeleccionada.zona}
      </div>

    </div>

   

  </div>
`;

  renderReservas();
  mostrar("exito");
}

// ===============================
// EVENTOS GLOBALES
// ===============================
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

// ===============================
// INIT
// ===============================
renderReservas();
mostrar("lista");

// ===============================
// ALERTA
// ===============================
function mostrarAlerta(mensaje) {
  const alerta = document.getElementById("alerta");

  alerta.innerText = mensaje;
  alerta.classList.add("show");

  setTimeout(() => {
    alerta.classList.remove("show");
  }, 3000);
}

// ===============================
// VALIDACIONES
// ===============================
function estaExpirada(fechaTexto) {

  const fechaReserva = new Date(fechaTexto);
  const ahora = new Date();

  return fechaReserva < ahora;
}

function horasRestantes(fechaTexto) {

  const fechaReserva = new Date(fechaTexto);
  const ahora = new Date();

  const diff = fechaReserva - ahora;

  return diff / (1000 * 60 * 60);
}