// ── DATOS ──
let zones = [];

// ── REFERENCIAS ──
const screenList = document.getElementById('screen-list');
const screenForm = document.getElementById('screen-form');
const zonesBody = document.getElementById('zones-body');
const emptyState = document.getElementById('empty-state');
const successMsg = document.getElementById('success-msg');
const topbarTitle = document.getElementById('topbar-title');

function getNextZoneId() {
  const currentMax = zones.reduce((max, zone) => {
    const numericId = Number.parseInt(zone.id.replace('ZN-', ''), 10);
    return Number.isNaN(numericId) ? max : Math.max(max, numericId);
  }, 0);
  return `ZN-${String(currentMax + 1).padStart(3, '0')}`;
}

function showSuccess(message) {
  successMsg.textContent = message;
  successMsg.classList.remove('hidden');
  setTimeout(() => successMsg.classList.add('hidden'), 3000);
}

function renderTable() {
  zonesBody.innerHTML = '';

  if (zones.length === 0) {
    document.getElementById('zones-table').classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  document.getElementById('zones-table').classList.remove('hidden');
  emptyState.classList.add('hidden');

  zones.forEach(zone => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><span class="id-badge">${zone.id}</span></td>
      <td style="font-weight:600;">${zone.name}</td>
      <td style="color:var(--muted);">${zone.address}</td>
      <td>${zone.capacity}</td>
    `;
    zonesBody.appendChild(row);
  });
}

function showForm() {
  screenList.classList.add('hidden');
  screenForm.classList.remove('hidden');
  topbarTitle.textContent = 'Nueva Zona';
  clearForm();
}

function showList() {
  screenList.classList.remove('hidden');
  screenForm.classList.add('hidden');
  topbarTitle.textContent = 'Gestión de Zonas';
  clearForm();
}

function clearForm() {
  ['zone-name', 'zone-address', 'zone-capacity'].forEach(id => {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    if (input) {
      input.value = '';
      input.classList.remove('input-error', 'input-success');
    }
    if (error) error.textContent = '';
  });
}

function setError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) {
    input.classList.add('input-error');
    input.classList.remove('input-success');
  }
  if (error) error.textContent = message;
}

function setFieldSuccess(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) {
    input.classList.remove('input-error');
    input.classList.add('input-success');
  }
  if (error) error.textContent = '';
}

function validateCreationForm(name, address, capacityInput) {
  let valid = true;

  if (!name) {
    setError('zone-name', 'zone-name-error', 'El nombre es requerido.');
    valid = false;
  } else {
    setFieldSuccess('zone-name', 'zone-name-error');
  }

  if (!address) {
    setError('zone-address', 'zone-address-error', 'La dirección es requerida.');
    valid = false;
  } else {
    setFieldSuccess('zone-address', 'zone-address-error');
  }

  if (!capacityInput) {
    setError('zone-capacity', 'zone-capacity-error', 'La capacidad es requerida.');
    valid = false;
  } else if (Number.parseInt(capacityInput, 10) < 1) {
    setError('zone-capacity', 'zone-capacity-error', 'La capacidad debe ser mayor a 0.');
    valid = false;
  } else {
    setFieldSuccess('zone-capacity', 'zone-capacity-error');
  }

  return valid;
}

document.getElementById('btn-save').addEventListener('click', () => {
  const name = document.getElementById('zone-name').value.trim();
  const address = document.getElementById('zone-address').value.trim();
  const capacityInput = document.getElementById('zone-capacity').value.trim();

  if (!validateCreationForm(name, address, capacityInput)) return;

  zones.push({
    id: getNextZoneId(),
    name,
    address,
    capacity: Number.parseInt(capacityInput, 10)
  });

  showList();
  renderTable();
  showSuccess('Zona creada correctamente.');
});

['zone-name', 'zone-address', 'zone-capacity'].forEach(id => {
  const input = document.getElementById(id);
  if (!input) return;
  input.addEventListener('input', function onInput() {
    this.classList.remove('input-error');
    const errorEl = document.getElementById(`${id}-error`);
    if (errorEl) errorEl.textContent = '';
  });
});

document.getElementById('btn-show-form').addEventListener('click', showForm);
document.getElementById('btn-empty-add').addEventListener('click', showForm);
document.getElementById('btn-back').addEventListener('click', showList);
document.getElementById('btn-cancel').addEventListener('click', showList);

renderTable();