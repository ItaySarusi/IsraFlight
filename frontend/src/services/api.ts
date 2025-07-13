import axios from 'axios';
import { Flight, CreateFlightDto, FlightStatus } from '../types/flight';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const flightApi = {
  // Get all flights
  getAllFlights: async (): Promise<Flight[]> => {
    const response = await api.get<Flight[]>('/api/flights');
    return response.data;
  },

  // Get flight by ID
  getFlightById: async (id: number): Promise<Flight> => {
    const response = await api.get<Flight>(`/api/flights/${id}`);
    return response.data;
  },

  // Search flights with filters
  searchFlights: async (
    status?: FlightStatus,
    destination?: string
  ): Promise<Flight[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (destination) params.append('destination', destination);
    
    const response = await api.get<Flight[]>(`/api/flights/search?${params}`);
    return response.data;
  },

  // Create new flight
  createFlight: async (flight: CreateFlightDto): Promise<Flight> => {
    const response = await api.post<Flight>('/api/flights', flight);
    return response.data;
  },

  // Delete flight
  deleteFlight: async (id: number): Promise<void> => {
    await api.delete(`/api/flights/${id}`);
  },
};

export default api; 