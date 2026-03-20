// ============================================================================
// Calgary Map Component
// ============================================================================
// Displays OpenStreetMap centered on downtown Calgary
// Props: { filters } - filter criteria for stations/lines
// ============================================================================

import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Component to set the map view 
const SetViewOnMount = ({ center, zoom }) => { 
    const map = useMap(); // Get the map instance from Leaflet

    useEffect(() => {
        map.setView(center, zoom);
    }, [map, center, zoom]);

    return null;
}

// Calgary Map component 
const CalgaryMap = ({ filters }) => { 
    // Calgary coordinates (downtown center)
    const calgaryCenter = [51.0447, -114.0719];
    const defaultZoom = 12;

    return ( 
        // Container with explicit height for Leaflet
        <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <MapContainer
                center={calgaryCenter}
                zoom={defaultZoom}
                scrollWheelZoom={true}
                className="w-full h-full"
                zoomControl={true}
                style={{ height: '100%', width: '100%' }}
            >
                {/* OpenStreetMap Tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Set initial view on load */}
                <SetViewOnMount center={calgaryCenter} zoom={defaultZoom} />
            </MapContainer>
        </div>
    );
}

export default CalgaryMap;