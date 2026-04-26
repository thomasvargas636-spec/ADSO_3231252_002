class ZoneManager {
    constructor() {
        this.zonesData = this.loadZones();
        this.filteredZones = [...this.zonesData];
        this.selectedZone = null;
        this.init();
    }

    init() {
        this.renderMapPins();
        this.renderZonesList();
    }

    loadZones() {
        return [
            {
                id: 'centro-a',
                name: 'Zona Centro A',
                shortName: 'Centro A',
                address: 'Calle 15 #8-20, Centro',
                price: 2500,
                availableSpots: 14,
                totalSpots: 20,
                position: { top: '22%', left: '18%' }
            },
            {
                id: 'norte-b',
                name: 'Zona Norte B',
                shortName: 'Norte B',
                address: 'Carrera 10 #24-45, Norte',
                price: 3000,
                availableSpots: 3,
                totalSpots: 20,
                position: { top: '18%', left: '58%' }
            },
            {
                id: 'sur-c',
                name: 'Zona Sur C',
                shortName: 'Sur C',
                address: 'Calle 80 #12-10, Sur',
                price: 2000,
                availableSpots: 12,
                totalSpots: 20,
                position: { top: '55%', left: '30%' }
            },
            {
                id: 'occidental-d',
                name: 'Zona Occidental D',
                shortName: 'Occ. D',
                address: 'Av. Américas #45-00',
                price: 2800,
                availableSpots: 0,
                totalSpots: 20,
                position: { top: '52%', left: '68%' }
            }
        ];
    }

    // Requirement 3: Logic to determine status text and badge class
    getZoneStatus(available) {
        if (available === 0) return { text: 'Sin cupos', class: 'badge-red' };
        if (available <= 5) return { text: 'Casi llena', class: 'badge-warning' };
        return { text: 'Disponible', class: 'badge-green' };
    }

    calculateOccupancyPercentage(zone) {
        const occupied = zone.totalSpots - zone.availableSpots;
        return (occupied / zone.totalSpots) * 100;
    }

    getProgressBarClass(available) {
        if (available === 0) return 'low'; // Red styling in CSS
        if (available <= 5) return 'medium'; // Yellow styling
        return 'high'; // Green styling
    }

    renderMapPins() {
        const mapPlaceholder = document.querySelector('.map-placeholder');
        if (!mapPlaceholder) return;
        mapPlaceholder.querySelectorAll('.map-pin').forEach(pin => pin.remove());

        this.filteredZones.forEach(zone => {
            const isSelected = this.selectedZone && this.selectedZone.id === zone.id;
            const pinClass = isSelected ? 'pin-selected' : 
                            (zone.availableSpots === 0 ? 'pin-full' : 
                            (zone.availableSpots <= 5 ? 'pin-warning' : 'pin-available'));

            const pin = document.createElement('div');
            pin.className = `map-pin ${pinClass}`;
            pin.style.cssText = `top: ${zone.position.top}; left: ${zone.position.left};`;
            pin.innerHTML = `
                <div class="map-pin-icon"><span>📍</span></div>
                <div class="map-pin-label">${zone.shortName}</div>
            `;
            mapPlaceholder.appendChild(pin);
        });
    }
    renderZonesList() {
        const listContainer = document.querySelector('.zones-list');
        if (!listContainer) return;

        listContainer.innerHTML = '';

        this.filteredZones.forEach(zone => {
            const isSelected = this.selectedZone && this.selectedZone.id === zone.id;
            const occupancyPercent = this.calculateOccupancyPercentage(zone);
            const barClass = this.getProgressBarClass(zone.availableSpots);
            const status = this.getZoneStatus(zone.availableSpots);

            const zoneItem = document.createElement('div');
            zoneItem.className = `zone-item ${isSelected ? 'selected' : ''}`;
            
            zoneItem.innerHTML = `
                <div class="zone-item-header">
                    <div class="zone-name">${zone.name}</div>
                    <span class="badge ${status.class}">${status.text}</span>
                </div>
                <div class="zone-address">📍 ${zone.address}</div>
                <div class="zone-details">
                    <div class="zone-price">$${zone.price.toLocaleString()}/hr</div>
                    <div class="spots-bar">
                        <div class="spots-fill ${barClass}" style="width: ${occupancyPercent}%;"></div>
                    </div>
                    <div class="spots-text">${zone.availableSpots}/${zone.totalSpots} cupos</div>
                </div>
            `;
            listContainer.appendChild(zoneItem);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.zoneManager = new ZoneManager();
});