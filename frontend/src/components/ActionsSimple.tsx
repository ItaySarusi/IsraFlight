import React, { useState } from 'react';
import { FlightStatus } from '../types/flight';

interface ActionsSimpleProps {
  onAddFlightClick: () => void;
  onSearch: () => void;
  destinations: string[];
}

const ActionsSimple: React.FC<ActionsSimpleProps> = ({ onAddFlightClick, onSearch, destinations }) => {
  const [statusFilter, setStatusFilter] = useState<FlightStatus | ''>('');
  const [destinationFilter, setDestinationFilter] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  
  // Mock connection status for now
  const isConnected = false;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as FlightStatus | '');
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDestinationFilter(e.target.value);
  };

  const handleSearchKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setDestinationFilter('');
    setSearchKeyword('');
  };

  const handleSearch = () => {
    onSearch();
  };

  return (
    <div className="w-full px-6 mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Connection Status */}
            <div className="flex items-center space-x-3">
              <div className="neo-inset p-4 flex items-center space-x-3 min-w-0">
                <div className={`status-indicator ${isConnected ? 'status-online' : 'status-offline'}`}></div>
                <span className={`font-medium text-sm ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
                  {isConnected ? 'SYSTEM ONLINE' : 'CONNECTING...'}
                </span>
              </div>
            </div>

            {/* Add Flight Button */}
            <div className="flex items-center">
              <button
                onClick={onAddFlightClick}
                className="btn-primary w-full py-3 px-6 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
              >
                ✈️ Add Flight
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Filter
                </label>
                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  className="dropdown w-full"
                >
                  <option value="">All Statuses</option>
                  <option value={FlightStatus.Scheduled}>Scheduled</option>
                  <option value={FlightStatus.Boarding}>Boarding</option>
                  <option value={FlightStatus.Departed}>Departed</option>
                  <option value={FlightStatus.Landed}>Landed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Filter
                </label>
                <select
                  value={destinationFilter}
                  onChange={handleDestinationChange}
                  className="dropdown w-full"
                >
                  <option value="">All Destinations</option>
                  {destinations.map((destination) => (
                    <option key={destination} value={destination}>
                      {destination}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search and Actions */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Flights
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Search flights..."
                    value={searchKeyword}
                    onChange={handleSearchKeywordChange}
                    className="input-field flex-1"
                  />
                  <button
                    onClick={handleSearch}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    🔍
                  </button>
                </div>
              </div>

              <button
                onClick={handleClearFilters}
                className="btn-secondary w-full py-2 px-4 text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionsSimple; 