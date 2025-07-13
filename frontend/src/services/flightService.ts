import { Flight, FlightFormData } from '../types/flight';

const API_URL = 'http://localhost:5000/api';

export const fetchFlights = async (): Promise<Flight[]> => {
  const response = await fetch(`${API_URL}/flights`);
  if (!response.ok) {
    throw new Error('Failed to fetch flights');
  }
  return response.json();
};

export const addFlight = async (flightData: FlightFormData): Promise<Flight> => {
  const response = await fetch(`${API_URL}/flights`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(flightData),
  });
  if (!response.ok) {
    throw new Error('Failed to add flight');
  }
  return response.json();
};

export const deleteFlight = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/flights/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete flight');
  }
}; 