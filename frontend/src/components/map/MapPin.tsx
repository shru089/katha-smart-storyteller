import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import Icon from '../ui/Icon';

interface MapPinProps {
  position: [number, number];
  name: string;
  isActive?: boolean;
  onClick: () => void;
}

const MapPin: React.FC<MapPinProps> = ({ position, name, isActive, onClick }) => {
  const iconHtml = `
    <div class="flex flex-col items-center gap-1 cursor-pointer group transform -translate-x-1/2 -translate-y-1/2">
      <div class="relative">
        ${isActive ? '<div class="absolute inset-0 bg-primary rounded-full animate-ping opacity-75 h-full w-full"></div>' : ''}
        <div class="relative z-10 text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <span class="material-symbols-outlined text-[40px] ${isActive ? 'text-primary' : 'text-text-muted'}" style="font-variation-settings: 'FILL' 1;">location_on</span>
        </div>
      </div>
      <span class="text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">${name}</span>
    </div>
  `;

  const customIcon = new L.DivIcon({
    html: iconHtml,
    className: 'bg-transparent border-none',
  });

  return <Marker position={position} icon={customIcon} eventHandlers={{ click: onClick }} />;
};

export default MapPin;
