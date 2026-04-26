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

    filterZones() {
        this.isFilterActive = !this.isFilterActive;
        this.applyFilters();
    }
    applyFilters() {
        if (this.isFilterActive) {
            this.filteredZones = this.zonesData.filter(zone => zone.availableSpots > 0);
            document.getElementById('filter-btn').textContent = '✅ Mostrando disponibles';
        } else {
            this.filteredZones = [...this.zonesData];
            document.getElementById('filter-btn').textContent = '🔍 Filtrar zonas';
        }

        if (this.selectedZone && !this.filteredZones.find(z => z.id === this.selectedZone.id)) {
            this.selectedZone = null;
        }
        this.updateUI();
    }

    simulateRealTimeUpdates() {
        setInterval(() => {
            this.zonesData.forEach(zone => {
                const change = Math.floor(Math.random() * 3) - 1;
                zone.availableSpots = Math.max(0, Math.min(zone.totalSpots, zone.availableSpots + change));
            });
            this.applyFilters();
        }, 5000);
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            const zoneItem = e.target.closest('.zone-item');
            if (zoneItem) this.selectZone(zoneItem.dataset.zoneId);
            
            const mapPin = e.target.closest('.map-pin');
            if (mapPin) this.selectZone(mapPin.dataset.zoneId);

            if (e.target.id === 'reserve-btn' && !e.target.disabled) {
                alert(`Redirecting to reservation for: ${this.selectedZone.name}`);
            }

            if (e.target.id === 'filter-btn') {
                this.filterZones();
            }
        });
    }

    selectZone(zoneId) {
        this.selectedZone = this.zonesData.find(z => z.id === zoneId);
        this.updateUI();
    }

    updateUI() {
        this.renderMapPins();
        this.renderZonesList();
        this.updateDetailPanel();
        this.updateGlobalStatus();
    }

    updateGlobalStatus() {
        const statusText = document.querySelector('.zones-status-text');
        if (!statusText) return;
        const availableCount = this.zonesData.filter(z => z.availableSpots > 0).length;
        statusText.textContent = `${availableCount} disponibles · ${this.zonesData.length - availableCount} llenas`;
    }

    updateDetailPanel() {
        const detailContainer = document.querySelector('.zone-detail-card');
        if (!detailContainer) return;

        if (!this.selectedZone) {
            detailContainer.style.display = 'none';
            return;
        }

        const isAvailable = this.selectedZone.availableSpots > 0;
        detailContainer.style.display = 'block';
        detailContainer.innerHTML = `
            <div class="zone-detail-header">
                <div class="zone-detail-name">${this.selectedZone.name}</div>
                <button id="reserve-btn" class="btn-primary" ${!isAvailable ? 'disabled' : ''}>
                    ${isAvailable ? 'Reservar plaza →' : 'Sin disponibilidad'}
                </button>
            </div>
            <div class="detail-row">
                <span class="detail-label">Dirección</span>
                <span class="detail-value">${this.selectedZone.address}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Cupos disponibles</span>
                <span class="detail-value ${isAvailable ? 'text-green' : 'text-danger'}">${this.selectedZone.availableSpots} de ${this.selectedZone.totalSpots}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Tarifa</span><span class="detail-value">$${this.selectedZone.price.toLocaleString()} por hora</span></div>
            <div class="detail-row"><span class="detail-label">Horario</span><span class="detail-value">${this.selectedZone.schedule}</span></div>
        `;
    }

    getZoneStatus(available) {
        if (available === 0) return { text: 'Sin cupos', class: 'badge-red' };
        if (available <= 5) return { text: 'Casi llena', class: 'badge-warning' };
        return { text: 'Disponible', class: 'badge-green' };
    }

    renderMapPins() {
        const mapPlaceholder = document.querySelector('.map-placeholder');
        if (!mapPlaceholder) return;
        mapPlaceholder.querySelectorAll('.map-pin').forEach(pin => pin.remove());

        if (this.filteredZones.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'map-empty-state';
            emptyMsg.innerHTML = '<p>No matching zones found on the map.</p>';
            mapPlaceholder.appendChild(emptyMsg);
            return;
        }

        this.filteredZones.forEach(zone => {
            const isSelected = this.selectedZone && this.selectedZone.id === zone.id;
            const pinClass = isSelected ? 'pin-selected' : (zone.availableSpots === 0 ? 'pin-full' : (zone.availableSpots <= 5 ? 'pin-warning' : 'pin-available'));
            const textClass = isSelected ? 'text-blue' : (zone.availableSpots === 0 ? 'text-danger' : (zone.availableSpots <= 5 ? 'text-warning' : 'text-green'));
            const pin = document.createElement('div');
            pin.className = `map-pin ${pinClass}`;
            pin.style.cssText = `top: ${zone.position.top}; left: ${zone.position.left};`;
            pin.dataset.zoneId = zone.id;
            pin.innerHTML = `<div class="map-pin-icon"><span>📍</span></div><div class="map-pin-label ${textClass}">${zone.shortName}</div>`;
            mapPlaceholder.appendChild(pin);
        });
    }

    renderZonesList() {
        const listContainer = document.querySelector('.zones-list');
        if (!listContainer) return;
        listContainer.innerHTML = '';

        if (this.filteredZones.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <div class="empty-state-title">No hay zonas disponibles</div>
                    <div class="empty-state-text">Intenta ajustar los filtros para ver más resultados.</div>
                </div>
            `;
            return;
        }

        this.filteredZones.forEach(zone => {
            const isSelected = this.selectedZone && this.selectedZone.id === zone.id;
            const status = this.getZoneStatus(zone.availableSpots);
            const zoneItem = document.createElement('div');
            zoneItem.className = `zone-item ${isSelected ? 'selected' : ''}`;
            zoneItem.dataset.zoneId = zone.id;
            zoneItem.innerHTML = `
                <div class="zone-item-header"><div class="zone-name">${zone.name}</div><span class="badge ${status.class}">${status.text}</span></div>
                <div class="zone-address">📍 ${zone.address}</div>
                <div class="zone-details">
                    <div class="zone-price">$${zone.price.toLocaleString()}/hr</div>
                    <div class="spots-bar"><div class="spots-fill ${(zone.availableSpots === 0 ? 'low' : (zone.availableSpots <= 5 ? 'medium' : 'high'))}" style="width: ${((zone.totalSpots - zone.availableSpots) / zone.totalSpots) * 100}%;"></div></div>
                    <div class="spots-text">${zone.availableSpots}/${zone.totalSpots} cupos</div>
                </div>
            `;
            listContainer.appendChild(zoneItem);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => { window.zoneManager = new ZoneManager(); });