import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setStatusFilter, setDestinationFilter, setSearchKeyword, clearFilters } from '../store/slices/filtersSlice';
import { FlightStatus } from '../types/flight';

interface ActionsProps {
  onAddFlightClick: () => void;
  onSearch: () => void;
  destinations: string[];
}

const Actions: React.FC<ActionsProps> = ({ onAddFlightClick, onSearch, destinations }) => {
  const dispatch = useAppDispatch();
  const connectionStatus = useAppSelector((state) => state.connection.status);
  const filters = useAppSelector((state) => state.filters.filters);
  
  const [localSearchKeyword, setLocalSearchKeyword] = useState('');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    dispatch(setStatusFilter(value ? (value as FlightStatus) : undefined));
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    dispatch(setDestinationFilter(value || undefined));
  };

  const handleSearchKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchKeyword(e.target.value);
    dispatch(setSearchKeyword(e.target.value || undefined));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setLocalSearchKeyword('');
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
                <div className={`status-indicator ${connectionStatus.isConnected ? 'status-online' : 'status-offline'}`}></div>
                <span className={`font-medium text-sm ${connectionStatus.isConnected ? 'text-green-700' : 'text-red-700'}`}>
                  {connectionStatus.isConnected ? 'SYSTEM ONLINE' : 'CONNECTING...'}
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
                  value={filters.status || ''}
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
                  value={filters.destination || ''}
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
                    value={localSearchKeyword}
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

export default Actions; 