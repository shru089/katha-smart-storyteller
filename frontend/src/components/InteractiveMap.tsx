/**
 * Interactive Katha Map
 * Visualizes story locations on a real-world map
 */

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import { getLocations } from "../api/client";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

// Fix for Leaflet default icon issues in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Ancient Map Style
const MAP_STYLE = {
    height: "100%",
    width: "100%",
    borderRadius: "24px",
    zIndex: 10
};

// Custom Marker Icon
const createCustomIcon = () => new L.DivIcon({
    className: 'custom-marker',
    html: `<div class="w-8 h-8 rounded-full bg-[#EC6D13] border-2 border-white shadow-[0_0_15px_rgba(236,109,19,0.6)] flex items-center justify-center animate-bounce">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

interface Location {
    id: number;
    name: string;
    description: string;
    lat: number;
    lon: number;
}

export default function InteractiveMap() {
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        getLocations()
            .then(setLocations)
            .catch(console.error);
    }, []);

    return (
        <div className="relative h-[600px] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl group">
            <MapContainer
                center={[20.5937, 78.9629]} // Center of India
                zoom={5}
                className="h-full w-full"
                scrollWheelZoom={false}
                style={{ background: '#f5f0e6' }} // Light parchment-like background
            >
                {/* Light Mode Map Tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {locations.map((loc) => (
                    <Marker
                        key={loc.id}
                        position={[loc.lat, loc.lon]}
                        icon={createCustomIcon()}
                    >
                        <Popup className="ancient-popup">
                            <div className="p-2 min-w-[200px]">
                                <h3 className="text-lg font-bold font-serif text-[#221810] mb-1">{loc.name}</h3>
                                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{loc.description}</p>
                                <Link
                                    to={`/explore?q=${loc.name}`}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-[#EC6D13] hover:underline uppercase tracking-widest"
                                >
                                    Read Stories <ArrowRight size={12} />
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Overlay Gradient for seamless integration */}
            <div className="absolute inset-0 pointer-events-none rounded-[32px] ring-1 ring-inset ring-white/10" />
        </div>
    );
}
