class ZoneManager {
    constructor() {
        this.zonesData = this.loadZones();
        this.filteredZones = [...this.zonesData];
        this.selectedZone = null;
        this.isFilterActive = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.bindMobileMenu();
        this.updateUI();
        this.simulateRealTimeUpdates();
    }

    loadZones() {
        return [
            { id: 'centro-a', name: 'Zona Centro A', shortName: 'Centro A', address: 'Calle 15 #8-20, Centro', price: 2500, availableSpots: 14, totalSpots: 20, schedule: '6:00 AM — 10:00 PM', position: { top: '22%', left: '18%' } },
            { id: 'norte-b', name: 'Zona Norte B', shortName: 'Norte B', address: 'Carrera 10 #24-45, Norte', price: 3000, availableSpots: 3, totalSpots: 20, schedule: '7:00 AM — 9:00 PM', position: { top: '18%', left: '58%' } },
            { id: 'sur-c', name: 'Zona Sur C', shortName: 'Sur C', address: 'Calle 80 #12-10, Sur', price: 2000, availableSpots: 12, totalSpots: 20, schedule: '24 Horas', position: { top: '55%', left: '30%' } },
            { id: 'occidental-d', name: 'Zona Occidental D', shortName: 'Occ. D', address: 'Av. Américas #45-00', price: 2800, availableSpots: 0, totalSpots: 20, schedule: '6:00 AM — 11:00 PM', position: { top: '52%', left: '68%' } }
        ];
    }

    bindMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const openBtn = document.getElementById('open-menu');
        const closeBtn = document.getElementById('close-menu');

        openBtn?.addEventListener('click', () => sidebar.classList.add('open'));
        closeBtn?.addEventListener('click', () => sidebar.classList.remove('open'));
        
        // Cerrar al clickear opciones
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => sidebar.classList.remove('open'));
        });
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            const zoneItem = e.target.closest('.zone-item');
            const mapPin = e.target.closest('.map-pin');

            if (zoneItem || mapPin) {
                const id = zoneItem ? zoneItem.dataset.zoneId : mapPin.dataset.zoneId;
                this.selectZone(id);
                
                // Scroll automático en móviles si se toca un pin del mapa
                if (window.innerWidth <= 1024 && mapPin) {
                    document.getElementById('detail-panel').scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }

            if (e.target.id === 'filter-btn') {
                this.isFilterActive = !this.isFilterActive;
                this.applyFilters();
            }

            if (e.target.id === 'reserve-btn' && !e.target.disabled) {
                alert(`Reservando en: ${this.selectedZone.name}`);
            }
        });
    }

    applyFilters() {
        const btn = document.getElementById('filter-btn');
        if (this.isFilterActive) {
            this.filteredZones = this.zonesData.filter(z => z.availableSpots > 0);
            btn.textContent = '✅ Mostrando disponibles';
            btn.classList.add('active');
        } else {
            this.filteredZones = [...this.zonesData];
            btn.textContent = '🔍 Filtrar zonas';
            btn.classList.remove('active');
        }
        this.updateUI();
    }

    selectZone(id) {
        this.selectedZone = this.zonesData.find(z => z.id === id);
        this.updateUI();
    }

    updateUI() {
        this.renderMap();
        this.renderList();
        this.updateDetails();
        this.updateGlobalStatus();
    }

    renderMap() {
        const container = document.querySelector('.map-placeholder');
        container.querySelectorAll('.map-pin').forEach(p => p.remove());

        this.filteredZones.forEach(zone => {
            const isSelected = this.selectedZone?.id === zone.id;
            const status = zone.availableSpots === 0 ? 'pin-full' : (zone.availableSpots <= 5 ? 'pin-warning' : 'pin-available');
            
            const pin = document.createElement('div');
            pin.className = `map-pin ${status} ${isSelected ? 'pin-selected' : ''}`;
            pin.style.top = zone.position.top;
            pin.style.left = zone.position.left;
            pin.dataset.zoneId = zone.id;
            pin.innerHTML = `
                <div class="map-pin-icon"><span>📍</span></div>
                <div class="map-pin-label">${zone.shortName}</div>
            `;
            container.appendChild(pin);
        });
    }

    renderList() {
        const container = document.querySelector('.zones-list');
        container.innerHTML = '';

        if (this.filteredZones.length === 0) {
            container.innerHTML = `<div style="padding:40px; text-align:center; color:gray;">No hay zonas disponibles</div>`;
            return;
        }

        this.filteredZones.forEach(zone => {
            const isSelected = this.selectedZone?.id === zone.id;
            const occupancy = ((zone.totalSpots - zone.availableSpots) / zone.totalSpots) * 100;
            const colorClass = zone.availableSpots === 0 ? 'low' : (zone.availableSpots <= 5 ? 'medium' : 'high');

            const item = document.createElement('div');
            item.className = `zone-item ${isSelected ? 'selected' : ''}`;
            item.dataset.zoneId = zone.id;
            item.innerHTML = `
                <div class="zone-name">${zone.name}</div>
                <div class="zone-address">📍 ${zone.address}</div>
                <div class="zone-details">
                    <div class="zone-price">$${zone.price}/hr</div>
                    <div class="spots-bar"><div class="spots-fill bg-${colorClass === 'high' ? 'green' : (colorClass === 'medium' ? 'warning' : 'danger')}" style="width: ${occupancy}%"></div></div>
                    <div class="spots-text">${zone.availableSpots}/${zone.totalSpots}</div>
                </div>
            `;
            container.appendChild(item);
        });
    }

    updateDetails() {
        const panel = document.getElementById('detail-panel');
        if (!this.selectedZone) { panel.style.display = 'none'; return; }

        const z = this.selectedZone;
        panel.style.display = 'block';
        panel.innerHTML = `
            <div class="zone-detail-header">
                <div class="zone-detail-name">${z.name}</div>
                <button id="reserve-btn" class="btn-primary" ${z.availableSpots === 0 ? 'disabled' : ''}>
                    ${z.availableSpots > 0 ? 'Reservar plaza →' : 'Lleno'}
                </button>
            </div>
            <div class="detail-row"><span>Dirección</span><span>${z.address}</span></div>
            <div class="detail-row"><span>Cupos</span><span class="${z.availableSpots > 0 ? 'text-green' : 'text-danger'}">${z.availableSpots} de ${z.totalSpots}</span></div>
            <div class="detail-row"><span>Tarifa</span><span>$${z.price}/hr</span></div>
            <div class="detail-row"><span>Horario</span><span>${z.schedule}</span></div>
        `;
    }

    updateGlobalStatus() {
        const statusText = document.querySelector('.zones-status-text');
        const available = this.zonesData.filter(z => z.availableSpots > 0).length;
        if (statusText) statusText.textContent = `${available} disponibles · ${this.zonesData.length - available} llenas`;
    }

    simulateRealTimeUpdates() {
        setInterval(() => {
            this.zonesData.forEach(z => {
                const change = Math.floor(Math.random() * 3) - 1;
                z.availableSpots = Math.max(0, Math.min(z.totalSpots, z.availableSpots + change));
            });
            this.updateUI();
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => new ZoneManager());