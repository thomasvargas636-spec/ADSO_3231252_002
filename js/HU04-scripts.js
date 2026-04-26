class ZoneManager {
    constructor() {
        this.zonesData = this.loadZones();
        this.filteredZones = [...this.zonesData];
        this.selectedZone = null;
        this.init();
    }

    init() {
        this.renderMapPins();
        this.renderZonesList(); // Added for Step 2
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

    // Logic for the occupancy progress bar
    calculateOccupancyPercentage(zone) {
        const occupied = zone.totalSpots - zone.availableSpots;
        return (occupied / zone.totalSpots) * 100;
    }

    // Determine bar color based on occupancy levels
    getProgressBarClass(percentage) {
        if (percentage >= 100) return 'high'; // Red equivalent in CSS
        if (percentage >= 75) return 'medium'; // Warning equivalent
        return 'low'; // Normal/Available
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

    // New method for Requirement 2: Render the side list
    renderZonesList() {
        const listContainer = document.querySelector('.zones-list');
        if (!listContainer) return;

        listContainer.innerHTML = '';

        this.filteredZones.forEach(zone => {
            const isSelected = this.selectedZone && this.selectedZone.id === zone.id;
            const occupancyPercent = this.calculateOccupancyPercentage(zone);
            const barClass = this.getProgressBarClass(occupancyPercent);

            const zoneItem = document.createElement('div');
            zoneItem.className = `zone-item ${isSelected ? 'selected' : ''}`;
            
            zoneItem.innerHTML = `
                <div class="zone-item-header">
                    <div class="zone-name">${zone.name}</div>
                </div>
                <div class="zone-address">📍 ${zone.address}</div>
                <div class="zone-details">
                    <div class="zone-price">$${zone.price.toLocaleString()}/hr</div>
                    <div class="spots-bar">
                        <div class="spots-fill ${barClass}" style="width: ${occupancyPercent}%;"></div>
                    </div>
                </div>
            `;
            listContainer.appendChild(zoneItem);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.zoneManager = new ZoneManager();
});