import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flightApi } from '../services/api';
import { Flight, FlightFormData } from '../types/flight';

export const useFlights = () => {
  return useQuery({
    queryKey: ['flights'],
    queryFn: flightApi.getFlights,
    refetchInterval: false, // Disable polling - SignalR will handle updates
  });
};

export const useCreateFlight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: flightApi.createFlight,
    onSuccess: (newFlight: Flight) => {
      queryClient.setQueryData(['flights'], (oldFlights: Flight[] | undefined) => {
        return oldFlights ? [...oldFlights, newFlight] : [newFlight];
      });
    },
  });
};

export const useDeleteFlight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: flightApi.deleteFlight,
    onSuccess: (_, deletedId: string) => {
      queryClient.setQueryData(['flights'], (oldFlights: Flight[] | undefined) => {
        return oldFlights ? oldFlights.filter(flight => flight.id !== deletedId) : [];
      });
    },
  });
}; 