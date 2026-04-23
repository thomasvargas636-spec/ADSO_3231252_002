// HU-03 — CA-01: registrar (placa, marca, modelo, año)
// CA-02: placa única
// CA-03: editar vehículos existentes
// CA-04: eliminar vehículos

let vehicles = [];
/** null = alta nueva; número = índice en `vehicles` al editar */
let editingIndex = null;

function normalizePlate(value) {
  return String(value).trim().toUpperCase().replace(/\s+/g, ' ');
}

function setPlateDuplicateError(show, message = '') {
  const input = document.getElementById('plate');
  const err = document.getElementById('plate-error');
  if (input) input.classList.toggle('input-error', show);
  if (err) err.textContent = show ? message : '';
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
          <button type="button" class="btn-edit" data-index="${index}" title="Editar">✏</button>
          <button type="button" class="btn-del" data-index="${index}" title="Eliminar">🗑</button>
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
  setPlateDuplicateError(false);
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
  setPlateDuplicateError(false);
  document.getElementById('plate').focus();
}

function deleteVehicle(index) {
  if (!Number.isInteger(index) || !vehicles[index]) return;
  const plate = vehicles[index].plate;
  if (!window.confirm(`¿Eliminar el vehículo ${plate}?`)) return;
  vehicles.splice(index, 1);
  showList();
  renderTable();
}

function showList() {
  editingIndex = null;
  screenList.classList.remove('hidden');
  screenForm.classList.add('hidden');
  topbarTitle.textContent = 'Mis Vehículos';
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

  if (plateExists(plateNorm, editingIndex)) {
    setPlateDuplicateError(true, '⚠ Esta placa ya está registrada.');
    return;
  }
  setPlateDuplicateError(false);

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
  setPlateDuplicateError(false);
});

vehiclesBody.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-index]');
  if (!btn) return;
  const i = Number.parseInt(btn.getAttribute('data-index'), 10);
  if (!Number.isFinite(i)) return;
  if (btn.classList.contains('btn-edit')) startEdit(i);
  if (btn.classList.contains('btn-del')) deleteVehicle(i);
});

document.getElementById('btn-show-form').addEventListener('click', showFormNew);
document.getElementById('btn-empty-add').addEventListener('click', showFormNew);
document.getElementById('btn-back').addEventListener('click', showList);
document.getElementById('btn-cancel').addEventListener('click', showList);
document.getElementById('btn-cancel-edit').addEventListener('click', showList);

renderTable();
