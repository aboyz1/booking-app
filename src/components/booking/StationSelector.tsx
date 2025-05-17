import React from 'react';
import { Station } from '../../types';
import { MapPin } from 'lucide-react';

interface StationSelectorProps {
  label: string;
  stations: Station[];
  selectedStation: Station | null;
  onSelect: (station: Station) => void;
  excludeStation?: Station | null;
  className?: string;
}

const StationSelector: React.FC<StationSelectorProps> = ({
  label,
  stations,
  selectedStation,
  onSelect,
  excludeStation,
  className = '',
}) => {
  // Filter out the excluded station (if any)
  const availableStations = excludeStation
    ? stations.filter(station => station.id !== excludeStation.id)
    : stations;

  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <select
          className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={selectedStation?.id || ''}
          onChange={(e) => {
            const stationId = e.target.value;
            const station = availableStations.find((s) => s.id === stationId);
            if (station) {
              onSelect(station);
            }
          }}
        >
          <option value="">Select {label}</option>
          {availableStations.map((station) => (
            <option key={station.id} value={station.id}>
              {station.name}, {station.city}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StationSelector;