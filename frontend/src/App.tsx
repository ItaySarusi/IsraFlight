import React, { useState, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import ActionsSimple from './components/ActionsSimple';
import FlightBoard from './components/FlightBoard';
import AddFlightModal from './components/AddFlightModal';
import { useFlights } from './hooks/useFlights';
import { Flight } from './types/flight';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  const [isAddFlightModalOpen, setIsAddFlightModalOpen] = useState(false);
  // TODO: Fix Redux typing issue later
  // const filters = useAppSelector((state) => state.filters.filters);
  
  // Use search query if filters are applied, otherwise use regular flights query
  // const shouldUseSearch = !!(filters.status || filters.destination);
  
  const flightsQuery = useFlights();
  // const searchQuery = useFlightSearch(filters.status, filters.destination);
  
  const activeQuery = flightsQuery; // shouldUseSearch ? searchQuery : flightsQuery;
  
  // Filter flights by search keyword on the client side
  const filteredFlights = useMemo(() => {
    if (!activeQuery.data) return [];
    
    let flights = activeQuery.data;
    
    // TODO: Add search filtering back when Redux is fixed
    // if (filters.searchKeyword) {
    //   const keyword = filters.searchKeyword.toLowerCase();
    //   flights = flights.filter((flight: Flight) =>
    //     flight.flightNumber.toLowerCase().includes(keyword) ||
    //     flight.destination.toLowerCase().includes(keyword) ||
    //     flight.gate.toLowerCase().includes(keyword)
    //   );
    // }
    
    return flights;
  }, [activeQuery.data]);
  
  // Extract unique destinations for the dropdown
  const destinations = useMemo(() => {
    if (!flightsQuery.data) return [];
    return Array.from(new Set(flightsQuery.data.map((flight: Flight) => flight.destination))).sort();
  }, [flightsQuery.data]);

  const handleAddFlightClick = () => {
    setIsAddFlightModalOpen(true);
  };

  const handleCloseAddFlightModal = () => {
    setIsAddFlightModalOpen(false);
  };

  const handleSearch = () => {
    // Trigger refetch of the appropriate query
    flightsQuery.refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Header />
      <ActionsSimple
        onAddFlightClick={handleAddFlightClick}
        onSearch={handleSearch}
        destinations={destinations}
      />
      <FlightBoard
        flights={filteredFlights}
        isLoading={activeQuery.isLoading}
        error={activeQuery.error?.message || null}
      />
      <AddFlightModal
        isOpen={isAddFlightModalOpen}
        onClose={handleCloseAddFlightModal}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;
