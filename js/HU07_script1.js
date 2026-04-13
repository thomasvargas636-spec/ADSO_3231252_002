const reservas = [
  {
    id: "PRK-001",
    estado: "confirmada",
    zona: "Zona Norte B",
    fecha: "18 Mar 2026 - 2:00 AM",
    tiempo: "2 horas",
    precio: "$2000"
  },
  {
    id: "PRK-002",
    estado: "pendiente",
    zona: "Zona Sur A",
    fecha: "19 Mar 2026 - 4:00 PM",
    tiempo: "3 horas",
    precio: "$3000"
  }
];

let reservaSeleccionada = null;

// ================== RENDER
function obtenerActivas() {
  return reservas.filter(r => r.estado !== "cancelado");
}

function crearHTML(r) {
  return `
    <div class="reserva-item">
      <div class="reserva-top">
        <span class="codigo">${r.id}</span>
        <span class="estado estado-${r.estado}">${r.estado}</span>
      </div>

      <p>${r.zona}</p>
      <p>${r.fecha}</p>
      <p>${r.tiempo} - ${r.precio}</p>

      <button class="btn-cancelar" data-id="${r.id}">
        🗑 Cancelar reserva
      </button>
    </div>
  `;
}

function render() {
  const cont = document.querySelector(".reservas-container");
  cont.innerHTML = "";

  obtenerActivas().forEach(r => {
    cont.innerHTML += crearHTML(r);
  });
}

// ================== VISTAS
function mostrar(vista) {
  document.querySelector(".card-lista").style.display = "none";
  document.querySelector(".card-confirmacion").style.display = "none";
  document.querySelector(".card-exito").style.display = "none";

  vista.style.display = "block";
}

// ================== EVENTOS (DELEGACIÓN)
document.addEventListener("click", (e) => {

  if (e.target.classList.contains("btn-cancelar")) {

    const id = e.target.dataset.id;
    reservaSeleccionada = reservas.find(r => r.id === id);

    document.querySelector(".detalle-reserva").innerHTML = `
      <b>${reservaSeleccionada.id}</b><br>
      ${reservaSeleccionada.zona}<br>
      ${reservaSeleccionada.fecha}
    `;

    mostrar(document.querySelector(".card-confirmacion"));
  }

  if (e.target.classList.contains("btn-volver")) {
    mostrar(document.querySelector(".card-lista"));
  }

  if (e.target.classList.contains("btn-confirmar")) {
    cancelar();
  }

  if (e.target.classList.contains("btn-ver-reservas")) {
    mostrar(document.querySelector(".card-lista"));
  }

  if (e.target.classList.contains("btn-inicio")) {
    location.reload();
  }

});

// ================== CRITERIO 4
function cancelar() {

  reservaSeleccionada.estado = "cancelado";

  render();

  document.querySelector(".mensaje-exito").innerHTML =
    `Reserva ${reservaSeleccionada.id} cancelada`;

  document.querySelector(".cupo-liberado").innerText =
    `+1 cupo liberado en ${reservaSeleccionada.zona}`;

  mostrar(document.querySelector(".card-exito"));
}

// ================== INIT
document.addEventListener("DOMContentLoaded", () => {
  render();
  mostrar(document.querySelector(".card-lista"));
});