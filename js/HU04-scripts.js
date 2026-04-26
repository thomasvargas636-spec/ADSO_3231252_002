class ZoneManager {
    constructor() {
        this.zonesData = this.loadZones();
        this.filteredZones = [...this.zonesData];
        this.selectedZone = null;
        this.init();
    }

    init() {
        this.renderMapPins();
    }

    // Load initial data
    loadZones() {
        return [
            {
                id: 'centro-a',
                shortName: 'Centro A',
                availableSpots: 14,
                totalSpots: 20,
                position: { top: '22%', left: '18%' }
            },
            {
                id: 'norte-b',
                shortName: 'Norte B',
                availableSpots: 3,
                totalSpots: 20,
                position: { top: '18%', left: '58%' }
            },
            {
                id: 'sur-c',
                shortName: 'Sur C',
                availableSpots: 12,
                totalSpots: 20,
                position: { top: '55%', left: '30%' }
            },
            {
                id: 'occidental-d',
                shortName: 'Occ. D',
                availableSpots: 0,
                totalSpots: 20,
                position: { top: '52%', left: '68%' }
            }
        ];
    }

    // Logic to determine pin color based on occupancy
    getPinClass(zone, isSelected) {
        if (isSelected) return 'pin-selected';      // Blue
        if (zone.availableSpots === 0) return 'pin-full';        // Red
        if (zone.availableSpots <= 5) return 'pin-warning';      // Yellow
        return 'pin-available';                                  // Green
    }

    // Render markers on the map
    renderMapPins() {
        const mapPlaceholder = document.querySelector('.map-placeholder');
        if (!mapPlaceholder) return;

        // Clear existing pins
        mapPlaceholder.querySelectorAll('.map-pin').forEach(pin => pin.remove());

        this.filteredZones.forEach(zone => {
            const isSelected = this.selectedZone && this.selectedZone.id === zone.id;
            const pinClass = this.getPinClass(zone, isSelected);
            
            // Define text color class
            const textClass = isSelected ? 'text-blue' : 
                zone.availableSpots === 0 ? 'text-danger' :
                zone.availableSpots <= 5 ? 'text-warning' : 'text-green';

            const pin = document.createElement('div');
            pin.className = `map-pin ${pinClass}`;
            pin.style.cssText = `top: ${zone.position.top}; left: ${zone.position.left};`;
            
            pin.innerHTML = `
                <div class="map-pin-icon"><span>📍</span></div>
                <div class="map-pin-label ${textClass}">${zone.shortName}</div>
            `;
            mapPlaceholder.appendChild(pin);
        });
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.zoneManager = new ZoneManager();
});