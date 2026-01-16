import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Map from '../components/map/Map';
import MapPin from '../components/map/MapPin';
import InfoPanel from '../components/map/InfoPanel';
import { BottomNavbar } from '../components/BottomNavbar';

const MapPage: React.FC = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/locations/")
      .then(r => r.json())
      .then(data => {
        setLocations(data);
        if (data.length > 0) setSelectedLocation(data[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col font-sans bg-[#0F0A0A]">
      <div className="flex-1 relative">
        {!loading && (
          <Map>
            {locations.map(loc => (
              <MapPin
                key={loc.id}
                position={[loc.lat, loc.lon]}
                name={loc.name}
                isActive={selectedLocation?.id === loc.id}
                onClick={() => setSelectedLocation(loc)}
              />
            ))}
          </Map>
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="text-primary font-serif italic text-xl animate-pulse">Consulting the ancient maps...</div>
          </div>
        )}

        {/* UI Overlays */}
        <div className="absolute top-0 left-0 w-full z-[1000] px-6 pt-12 pb-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none">
          <h1 className="text-3xl font-bold font-serif pointer-events-auto text-white tracking-tight">Bharat Varsha</h1>
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] pointer-events-auto mt-1">Sacred Geography of the Immortals</p>
        </div>

        <AnimatePresence>
          {selectedLocation && (
            <InfoPanel
              title={selectedLocation.name}
              {...selectedLocation}
              onClose={() => setSelectedLocation(null)}
            />
          )}
        </AnimatePresence>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default MapPage;
