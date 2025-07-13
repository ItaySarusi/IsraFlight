import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flightApi } from '../services/api';
import { Flight, CreateFlightDto, FlightStatus } from '../types/flight';

export const useFlights = () => {
  return useQuery({
    queryKey: ['flights'],
    queryFn: flightApi.getAllFlights,
    refetchInterval: 30000, // Refetch every 30 seconds as backup to SignalR
  });
};

export const useFlightSearch = (status?: FlightStatus, destination?: string) => {
  return useQuery({
    queryKey: ['flights', 'search', status, destination],
    queryFn: () => flightApi.searchFlights(status, destination),
    enabled: !!(status || destination), // Only run if filters are provided
  });
};

export const useCreateFlight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (flight: CreateFlightDto) => flightApi.createFlight(flight),
    onSuccess: (newFlight) => {
      // Optimistically update the cache
      queryClient.setQueryData(['flights'], (oldData: Flight[] | undefined) => {
        if (!oldData) return [newFlight];
        return [...oldData, newFlight];
      });
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['flights'] });
    },
  });
};

export const useDeleteFlight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => flightApi.deleteFlight(id),
    onSuccess: (_, deletedId) => {
      // Optimistically update the cache
      queryClient.setQueryData(['flights'], (oldData: Flight[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(flight => flight.id !== deletedId);
      });
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['flights'] });
    },
  });
}; 