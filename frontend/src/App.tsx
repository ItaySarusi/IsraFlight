import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { theme } from './theme/theme';
import Header from './components/Header';
import FlightBoard from './components/FlightBoard';
import ActionBar from './components/ActionBar';
import { AnimatePresence, motion } from 'framer-motion';
import { Provider } from 'react-redux';
import { store, RootState } from './store';
import AddFlightModal from './components/AddFlightModal';
import { QueryClient, QueryClientProvider, useMutation, useQueryClient } from '@tanstack/react-query';
import { Flight, FlightFormData } from './types/flight';
import { useState, useEffect, useRef } from 'react';
import { addFlight, deleteFlight } from './services/flightService';
import { signalRService } from './services/signalRService';
import { useSelector } from 'react-redux';

const queryClient = new QueryClient();

// Separate component for the app content that uses React Query hooks
const AppContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filters = useSelector((state: RootState) => state.filters);
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const queryClient = useQueryClient();
  const handlersRegistered = useRef(false);

  useEffect(() => {
    setAppliedFilters(filters);
  }, [filters]);

  useEffect(() => {
    let isInitialized = false;
    
    const initializeSignalR = async () => {
      if (isInitialized) return;
      isInitialized = true;
      
      await signalRService.startConnection();
      await signalRService.joinFlightBoard();

      if (!handlersRegistered.current) {
        signalRService.onFlightStatusUpdated((flightId, newStatus) => {
          queryClient.refetchQueries({ queryKey: ['flights'] });
        });

        signalRService.onFlightStatusesUpdated((statusChanges) => {
          console.log('SignalR: Received FlightStatusesUpdated event:', statusChanges);
          queryClient.refetchQueries({ queryKey: ['flights'] });
        });

        signalRService.onFlightAdded((flight) => {
          queryClient.refetchQueries({ queryKey: ['flights'] });
        });

        signalRService.onFlightDeleted((flightId) => {
          queryClient.refetchQueries({ queryKey: ['flights'] });
        });
        handlersRegistered.current = true;
      }
    };

    initializeSignalR();

    return () => {
      // Don't stop connection on unmount to avoid issues with React Strict Mode
      // The connection will be managed by the service itself
    };
  }, [queryClient]);

  const addFlightMutation = useMutation({
    mutationFn: addFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      setIsModalOpen(false);
    },
  });

  const deleteFlightMutation = useMutation({
    mutationFn: deleteFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
    },
  });

  const handleAddFlight = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitFlight = async (flightData: FlightFormData) => {
    addFlightMutation.mutate(flightData);
  };

  const handleDeleteFlight = async (id: string) => {
    deleteFlightMutation.mutate(id);
  };

  const handleFilterChange = (newFilters: { status: string; destination: string; searchQuery: string }) => {
    setAppliedFilters(newFilters as any); // Type assertion to FlightFilters
    queryClient.invalidateQueries({ queryKey: ['flights', newFilters] });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <ActionBar onAddFlight={handleAddFlight} onFilterChange={handleFilterChange} />
        <FlightBoard onDeleteFlight={handleDeleteFlight} filters={appliedFilters} />
        <AddFlightModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitFlight}
          isLoading={addFlightMutation.isPending}
        />
      </Box>
    </Box>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AppContent />
          </motion.div>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
