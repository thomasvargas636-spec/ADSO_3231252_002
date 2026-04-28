// ── DATOS ──
let zones = [];
const MAX_ZONE_CAPACITY = 500;

// ── REFERENCIAS ──
const screenList = document.getElementById('screen-list');
const screenForm = document.getElementById('screen-form');
const zonesBody = document.getElementById('zones-body');
const emptyState = document.getElementById('empty-state');
const successMsg = document.getElementById('success-msg');
const topbarTitle = document.getElementById('topbar-title');
const formCardTitle = document.getElementById('form-card-title');
const editIndexInput = document.getElementById('edit-index');

function getNextZoneId() {
  const existingIds = new Set(zones.map(zone => zone.id));
  let nextNumber = 1;
  let nextId = `ZN-${String(nextNumber).padStart(3, '0')}`;

  while (existingIds.has(nextId)) {
    nextNumber += 1;
    nextId = `ZN-${String(nextNumber).padStart(3, '0')}`;
  }

  return nextId;
}

function showSuccess(message) {
  successMsg.textContent = message;
  successMsg.classList.remove('hidden');
  setTimeout(() => successMsg.classList.add('hidden'), 3000);
}

function refreshAfterChange(message) {
  showList();
  renderTable();
  showSuccess(message);
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

  zones.forEach((zone, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><span class="id-badge">${zone.id}</span></td>
      <td style="font-weight:600;">${zone.name}</td>
      <td style="color:var(--muted);">${zone.address}</td>
      <td>${zone.capacity}</td>
      <td>${zone.status === 'active'
        ? '<span class="badge badge-green">Activa</span>'
        : '<span class="badge badge-red">Inactiva</span>'}</td>
      <td>
        <div class="action-btns">
          <button class="btn-edit" onclick="editZone(${index})">✏</button>
          <button class="btn-del" onclick="deleteZone(${index})">🗑</button>
        </div>
      </td>
    `;
    zonesBody.appendChild(row);
  });
}

function showForm(isEdit = false) {
  screenList.classList.add('hidden');
  screenForm.classList.remove('hidden');
  topbarTitle.textContent = isEdit ? 'Editar Zona' : 'Nueva Zona';
  formCardTitle.textContent = isEdit ? 'Editar Zona' : 'Nueva Zona de Parqueo';
  if (!isEdit) clearForm();
}

function showList() {
  screenList.classList.remove('hidden');
  screenForm.classList.add('hidden');
  topbarTitle.textContent = 'Gestión de Zonas';
  formCardTitle.textContent = 'Nueva Zona de Parqueo';
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
  document.getElementById('zone-status').value = 'active';
  editIndexInput.value = '-1';
}

function editZone(index) {
  const zone = zones[index];
  if (!zone) return;

  document.getElementById('zone-name').value = zone.name;
  document.getElementById('zone-address').value = zone.address;
  document.getElementById('zone-capacity').value = zone.capacity;
  document.getElementById('zone-status').value = zone.status || 'active';
  editIndexInput.value = String(index);
  showForm(true);
}

function hasActiveReservations(zone) {
  return (zone?.reservations || 0) > 0;
}

function deleteZone(index) {
  const zone = zones[index];
  if (!zone) return;

  // Primera validacion: bloquear antes de mostrar confirmacion.
  if (hasActiveReservations(zone)) {
    showSuccess('No se puede eliminar: la zona tiene reservas activas.');
    return;
  }

  const confirmed = window.confirm(`¿Deseas eliminar la zona ${zone.name}?`);
  if (!confirmed) return;

  // Segunda validacion: volver a revisar justo antes de eliminar.
  const zoneToDeleteIndex = zones.findIndex(currentZone => currentZone.id === zone.id);
  if (zoneToDeleteIndex === -1) return;
  if (hasActiveReservations(zones[zoneToDeleteIndex])) {
    showSuccess('No se puede eliminar: la zona tiene reservas activas.');
    return;
  }

  zones.splice(zoneToDeleteIndex, 1);
  refreshAfterChange('Zona eliminada correctamente.');
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
  const capacity = Number(capacityInput);

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
  } else if (!Number.isInteger(capacity)) {
    setError('zone-capacity', 'zone-capacity-error', 'La capacidad debe ser un numero entero.');
    valid = false;
  } else if (capacity < 1) {
    setError('zone-capacity', 'zone-capacity-error', 'La capacidad debe ser mayor a 0.');
    valid = false;
  } else if (capacity > MAX_ZONE_CAPACITY) {
    setError('zone-capacity', 'zone-capacity-error', `La capacidad maxima permitida es ${MAX_ZONE_CAPACITY}.`);
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
  const status = document.getElementById('zone-status').value;
  const editIndex = Number.parseInt(editIndexInput.value, 10);

  if (!validateCreationForm(name, address, capacityInput)) return;

  const capacity = Number.parseInt(capacityInput, 10);

  if (editIndex >= 0) {
    zones[editIndex] = {
      ...zones[editIndex],
      name,
      address,
      capacity,
      status
    };
    refreshAfterChange('Cambios guardados correctamente.');
    return;
  }

  zones.push({
    id: getNextZoneId(),
    name,
    address,
    capacity,
    status,
    reservations: 0
  });

  refreshAfterChange('Cambios guardados correctamente.');
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