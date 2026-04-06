const RATE_PER_HOUR = 2500;
const STORAGE_KEY   = 'parkalia_reserva';

/* ════════════════════════════════
   UTILIDADES
════════════════════════════════ */
function saveState(data) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadState() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function formatPrice(amount) {
  return '$' + amount.toLocaleString('es-CO');
}

function generateCode() {
  return 'PRK-' + Math.floor(1000 + Math.random() * 9000);
}

const timeSlots  = document.querySelectorAll('.time-slot:not(.unavailable)');
const btnContinuar = document.getElementById('btn-continuar');

if (timeSlots.length > 0) {
  timeSlots.forEach((slot) => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
    });
  });
}

if (btnContinuar) {
  btnContinuar.addEventListener('click', () => {
    const vehicleEl  = document.getElementById('select-vehicle');
    const dateEl     = document.getElementById('input-date');
    const durationEl = document.getElementById('select-duration');
    const selectedSlot = document.querySelector('.time-slot.selected');

    const raw = vehicleEl ? vehicleEl.options[vehicleEl.selectedIndex].text : 'SAM 525';
    const match = raw.match(/([A-Z]{2,3}\s?\d{3})/);
    const vehiculo = match ? match[1] : 'SAM 525';

    const state = {
      zona:     'Centro A',
      vehiculo,
      fecha:    dateEl     ? dateEl.value                        : '16 Mar 2026',
      entrada:  selectedSlot ? selectedSlot.dataset.time         : '9:00 AM',
      duracion: durationEl  ? parseInt(durationEl.value, 10)     : 2,
    };

    saveState(state);
    window.location.href = 'paso2.html';
  });
}

/* ════════════════════════════════
   PASO 2 — paso2.html
════════════════════════════════ */
const btnConfirmar = document.getElementById('btn-confirmar');
const btnVolver    = document.getElementById('btn-volver');

if (btnConfirmar || btnVolver) {
  const state = loadState();

  // Poblar resumen
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('conf-zona',     state.zona     || 'Centro A');
  set('conf-vehiculo', state.vehiculo || 'SAM 525');
  set('conf-fecha',    state.fecha    || '16 Mar 2026');
  set('conf-entrada',  state.entrada  || '9:00 AM');
  set('conf-duracion', (state.duracion || 2) + ((state.duracion === 1) ? ' hora' : ' horas'));
  set('conf-total',    formatPrice((state.duracion || 2) * RATE_PER_HOUR));
}

if (btnVolver) {
  btnVolver.addEventListener('click', () => {
    window.location.href = 'paso1.html';
  });
}

if (btnConfirmar) {
  btnConfirmar.addEventListener('click', () => {
    const state = loadState();
    state.codigo = generateCode();
    saveState(state);
    window.location.href = 'paso3.html';
  });
}

/* ════════════════════════════════
   PASO 3 — paso3.html
════════════════════════════════ */
const codeEl = document.getElementById('reservation-code');

if (codeEl) {
  const state = loadState();
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set('reservation-code', state.codigo  || generateCode());
  set('final-zona',       state.zona    || 'Centro A');
  set('final-fecha',      state.fecha   || '16 Mar 2026');
  set('final-entrada',    state.entrada || '9:00 AM');
}

const btnVerReservas = document.getElementById('btn-ver-reservas');
const btnInicio      = document.getElementById('btn-inicio');

if (btnVerReservas) {
  btnVerReservas.addEventListener('click', () => {
    alert('Redirigiendo a Mis Reservas…');
  });
}

if (btnInicio) {
  btnInicio.addEventListener('click', () => {
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.href = 'paso1.html';
  });
}