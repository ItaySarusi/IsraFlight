import { Flight, FlightFormData } from '../types/flight';

const API_URL = 'http://localhost:5001/api';

export const fetchFlights = async (): Promise<Flight[]> => {
  const response = await fetch(`${API_URL}/flights`);
  if (!response.ok) {
    throw new Error('Failed to fetch flights');
  }
  return response.json();
};

export const searchFlights = async (filters: {
  status?: string;
  destination?: string;
  flightNumber?: string;
}): Promise<Flight[]> => {
  const params = new URLSearchParams();
  
  if (filters.status) {
    params.append('status', filters.status);
  }
  if (filters.destination) {
    params.append('destination', filters.destination);
  }
  if (filters.flightNumber) {
    params.append('flightNumber', filters.flightNumber);
  }
  
  const url = `${API_URL}/flights/search${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to search flights');
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