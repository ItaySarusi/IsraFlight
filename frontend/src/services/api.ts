import axios from 'axios';
import { Flight, FlightFormData } from '../types/flight';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const flightApi = {
  getFlights: async (): Promise<Flight[]> => {
    const response = await api.get('/flights');
    return response.data;
  },

  createFlight: async (flightData: FlightFormData): Promise<Flight> => {
    const response = await api.post('/flights', flightData);
    return response.data;
  },

  deleteFlight: async (id: string): Promise<void> => {
    await api.delete(`/flights/${id}`);
  },
};

export default api; 