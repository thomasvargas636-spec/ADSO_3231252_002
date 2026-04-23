// HU-03 — CA-01: registrar (placa, marca, modelo, año)
// CA-02: placa única
// CA-03: editar vehículos existentes
// CA-04: eliminar vehículos
// CA-05: mensaje de confirmación al guardar
// CA-06: validar campos obligatorios

let vehicles = [];
/** null = alta nueva; número = índice en `vehicles` al editar */
let editingIndex = null;
let pendingDeleteIndex = null;

function normalizePlate(value) {
  return String(value).trim().toUpperCase().replace(/\s+/g, ' ');
}

function setPlateDuplicateError(show, message = '') {
  const input = document.getElementById('plate');
  const err = document.getElementById('plate-error');
  if (input) input.classList.toggle('input-error', show);
  if (err) err.textContent = show ? message : '';
}

function setFieldError(fieldId, message = '') {
  const input = document.getElementById(fieldId);
  const err = document.getElementById(`${fieldId}-error`);
  const hasError = Boolean(message);
  if (input) {
    input.classList.toggle('input-error', hasError);
    input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }
  if (err) err.textContent = hasError ? `⚠ ${message}` : '';
}

function clearFieldError(fieldId) {
  setFieldError(fieldId, '');
}

/** @param {number|null} excludeIndex índice a ignorar (misma fila en edición) */
function plateExists(normalized, excludeIndex = null) {
  return vehicles.some(
    (v, i) => normalizePlate(v.plate) === normalized && i !== excludeIndex
  );
}

function esc(text) {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

const screenList = document.getElementById('screen-list');
const screenForm = document.getElementById('screen-form');
const vehiclesBody = document.getElementById('vehicles-body');
const emptyState = document.getElementById('empty-state');
const topbarTitle = document.getElementById('topbar-title');
const formCardTitle = document.getElementById('form-card-title');
const btnSave = document.getElementById('btn-save');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const successMsg = document.getElementById('success-msg');
const modalDelete = document.getElementById('modal-delete');
const modalPlate = document.getElementById('modal-plate');
const modalDetail = document.getElementById('modal-detail');
const btnCancelDelete = document.getElementById('btn-cancel-delete');
const btnConfirmDelete = document.getElementById('btn-confirm-delete');

function renderTable() {
  vehiclesBody.innerHTML = '';
  if (vehicles.length === 0) {
    document.getElementById('vehicles-table').classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }
  document.getElementById('vehicles-table').classList.remove('hidden');
  emptyState.classList.add('hidden');
  vehicles.forEach((v, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><span class="plate-badge">${esc(v.plate)}</span></td>
      <td>${esc(v.brand)}</td>
      <td>${esc(v.model)}</td>
      <td><span class="year-badge">${esc(String(v.year))}</span></td>
      <td>
        <div class="action-btns">
          <button type="button" class="btn-edit" data-index="${index}" title="Editar" aria-label="Editar vehículo ${esc(v.plate)}">✏</button>
          <button type="button" class="btn-del" data-index="${index}" title="Eliminar" aria-label="Eliminar vehículo ${esc(v.plate)}">🗑</button>
        </div>
      </td>`;
    vehiclesBody.appendChild(row);
  });
}

function setFormMode(isEdit) {
  formCardTitle.textContent = isEdit ? 'Editar vehículo' : 'Nuevo vehículo';
  btnSave.textContent = isEdit ? 'Guardar cambios' : 'Registrar vehículo';
  btnCancelEdit.classList.toggle('hidden', !isEdit);
  topbarTitle.textContent = isEdit ? 'Editar vehículo' : 'Agregar vehículo';
}

function showFormNew() {
  editingIndex = null;
  screenList.classList.add('hidden');
  screenForm.classList.remove('hidden');
  setFormMode(false);
  ['plate', 'brand', 'model', 'year'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['plate', 'brand', 'model', 'year'].forEach(clearFieldError);
}

function startEdit(index) {
  const v = vehicles[index];
  if (!v) return;
  editingIndex = index;
  screenList.classList.add('hidden');
  screenForm.classList.remove('hidden');
  setFormMode(true);
  document.getElementById('plate').value = v.plate;
  document.getElementById('brand').value = v.brand;
  document.getElementById('model').value = v.model;
  document.getElementById('year').value = v.year;
  ['plate', 'brand', 'model', 'year'].forEach(clearFieldError);
  document.getElementById('plate').focus();
}

function openDeleteModal(index) {
  if (!Number.isInteger(index) || !vehicles[index]) return;
  pendingDeleteIndex = index;
  const v = vehicles[index];
  modalPlate.textContent = v.plate;
  modalDetail.textContent = `${v.brand} ${v.model} · ${v.year}`;
  modalDelete.classList.remove('hidden');
  btnConfirmDelete.focus();
}

function closeDeleteModal() {
  pendingDeleteIndex = null;
  modalDelete.classList.add('hidden');
}

function confirmDeleteVehicle() {
  if (!Number.isInteger(pendingDeleteIndex) || !vehicles[pendingDeleteIndex]) {
    closeDeleteModal();
    return;
  }
  const index = pendingDeleteIndex;
  const plate = vehicles[index].plate;
  closeDeleteModal();
  deleteVehicle(index, plate);
}

function deleteVehicle(index, plateText = null) {
  if (!Number.isInteger(index) || !vehicles[index]) return;
  const plate = plateText || vehicles[index].plate;
  vehicles.splice(index, 1);
  showList();
  renderTable();
  showSuccess(`✅ Vehículo ${plate} eliminado correctamente.`);
}

function showList() {
  editingIndex = null;
  screenList.classList.remove('hidden');
  screenForm.classList.add('hidden');
  topbarTitle.textContent = 'Mis Vehículos';
  document.getElementById('btn-show-form').focus();
}

function showSuccess(message) {
  if (!successMsg) return;
  successMsg.textContent = message;
  successMsg.classList.remove('hidden');
  window.clearTimeout(showSuccess._timer);
  showSuccess._timer = window.setTimeout(() => {
    successMsg.classList.add('hidden');
  }, 2500);
}

document.getElementById('btn-save').addEventListener('click', () => {
  const isEdit = editingIndex !== null;
  const plateNorm = normalizePlate(document.getElementById('plate').value);
  const brand = document.getElementById('brand').value.trim();
  const model = document.getElementById('model').value.trim();
  const year = document.getElementById('year').value.trim();

  let isValid = true;
  if (!plateNorm) {
    setFieldError('plate', 'La placa es obligatoria.');
    isValid = false;
  } else {
    clearFieldError('plate');
  }
  if (!brand) {
    setFieldError('brand', 'La marca es obligatoria.');
    isValid = false;
  } else {
    clearFieldError('brand');
  }
  if (!model) {
    setFieldError('model', 'El modelo es obligatorio.');
    isValid = false;
  } else {
    clearFieldError('model');
  }
  if (!year) {
    setFieldError('year', 'El año es obligatorio.');
    isValid = false;
  } else {
    clearFieldError('year');
  }
  if (!isValid) return;

  if (plateExists(plateNorm, editingIndex)) {
    setPlateDuplicateError(true, '⚠ Esta placa ya está registrada.');
    return;
  }
  clearFieldError('plate');

  const entry = { plate: plateNorm, brand, model, year };
  if (editingIndex !== null) {
    vehicles[editingIndex] = entry;
  } else {
    vehicles.push(entry);
  }
  showList();
  renderTable();
  showSuccess(isEdit ? '✅ Cambios guardados correctamente.' : '✅ Vehículo registrado correctamente.');
});

document.getElementById('plate').addEventListener('input', () => {
  clearFieldError('plate');
});

document.getElementById('brand').addEventListener('input', () => {
  clearFieldError('brand');
});

document.getElementById('model').addEventListener('input', () => {
  clearFieldError('model');
});

document.getElementById('year').addEventListener('input', () => {
  clearFieldError('year');
});

vehiclesBody.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-index]');
  if (!btn) return;
  const i = Number.parseInt(btn.getAttribute('data-index'), 10);
  if (!Number.isFinite(i)) return;
  if (btn.classList.contains('btn-edit')) startEdit(i);
  if (btn.classList.contains('btn-del')) openDeleteModal(i);
});

document.getElementById('btn-show-form').addEventListener('click', showFormNew);
document.getElementById('btn-empty-add').addEventListener('click', showFormNew);
document.getElementById('btn-back').addEventListener('click', showList);
document.getElementById('btn-cancel').addEventListener('click', showList);
document.getElementById('btn-cancel-edit').addEventListener('click', showList);
btnCancelDelete.addEventListener('click', closeDeleteModal);
btnConfirmDelete.addEventListener('click', confirmDeleteVehicle);
modalDelete.addEventListener('click', (e) => {
  if (e.target === modalDelete) closeDeleteModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modalDelete.classList.contains('hidden')) {
    closeDeleteModal();
    return;
  }
  if (e.key === 'Escape' && !screenForm.classList.contains('hidden')) {
    showList();
  }
});

renderTable();
