import React from 'react';
import { Flight, FlightStatus } from '../types/flight';
import { useDeleteFlight } from '../hooks/useFlights';

interface FlightBoardProps {
  flights: Flight[];
  isLoading: boolean;
  error: string | null;
}

const FlightBoard: React.FC<FlightBoardProps> = ({ flights, isLoading, error }) => {
  const deleteFlight = useDeleteFlight();

  const handleDeleteFlight = (id: number) => {
    if (window.confirm('Are you sure you want to delete this flight?')) {
      deleteFlight.mutate(id);
    }
  };

  const getStatusColor = (status: FlightStatus) => {
    switch (status) {
      case FlightStatus.Scheduled:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case FlightStatus.Boarding:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case FlightStatus.Departed:
        return 'bg-green-100 text-green-800 border-green-200';
      case FlightStatus.Landed:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="w-full px-6">
        <div className="max-w-7xl mx-auto">
          <div className="neo-card p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading flights...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-6">
        <div className="max-w-7xl mx-auto">
          <div className="neo-card p-8 text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium">Error loading flights</p>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6">
      <div className="max-w-7xl mx-auto">
        <div className="neo-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Flight Board</h2>
            <div className="text-sm text-gray-600">
              {flights.length} flight{flights.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {flights.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">✈️</div>
              <p className="text-gray-600 text-lg">No flights found</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters or add a new flight</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Flight Number</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Destination</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Departure Time</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Gate</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map((flight, index) => (
                    <tr
                      key={flight.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 animate-fade-in`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-800">{flight.flightNumber}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-700">{flight.destination}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-700">{formatDateTime(flight.departureTime)}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-700 font-medium">{flight.gate}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(flight.status)}`}>
                          {flight.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleDeleteFlight(flight.id)}
                          disabled={deleteFlight.isPending}
                          className="text-red-500 hover:text-red-700 font-medium text-sm hover:bg-red-50 px-3 py-1 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                          {deleteFlight.isPending ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightBoard; 