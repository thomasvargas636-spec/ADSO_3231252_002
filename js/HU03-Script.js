// HU-03 — CA-01: registrar vehículo (placa, marca, modelo, año)

let vehicles = [];

const screenList = document.getElementById('screen-list');
const screenForm = document.getElementById('screen-form');
const vehiclesBody = document.getElementById('vehicles-body');
const emptyState = document.getElementById('empty-state');
const topbarTitle = document.getElementById('topbar-title');

function renderTable() {
  vehiclesBody.innerHTML = '';
  if (vehicles.length === 0) {
    document.getElementById('vehicles-table').classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }
  document.getElementById('vehicles-table').classList.remove('hidden');
  emptyState.classList.add('hidden');
  vehicles.forEach((v) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><span class="plate-badge">${v.plate}</span></td>
      <td>${v.brand}</td>
      <td>${v.model}</td>
      <td><span class="year-badge">${v.year}</span></td>`;
    vehiclesBody.appendChild(row);
  });
}

function showForm() {
  screenList.classList.add('hidden');
  screenForm.classList.remove('hidden');
  topbarTitle.textContent = 'Agregar vehículo';
  ['plate', 'brand', 'model', 'year'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function showList() {
  screenList.classList.remove('hidden');
  screenForm.classList.add('hidden');
  topbarTitle.textContent = 'Mis Vehículos';
}

document.getElementById('btn-save').addEventListener('click', () => {
  const plate = document.getElementById('plate').value.trim();
  const brand = document.getElementById('brand').value.trim();
  const model = document.getElementById('model').value.trim();
  const year = document.getElementById('year').value.trim();
  vehicles.push({ plate, brand, model, year });
  showList();
  renderTable();
});

document.getElementById('btn-show-form').addEventListener('click', showForm);
document.getElementById('btn-empty-add').addEventListener('click', showForm);
document.getElementById('btn-back').addEventListener('click', showList);
document.getElementById('btn-cancel').addEventListener('click', showList);

renderTable();
