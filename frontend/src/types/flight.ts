export interface Flight {
  id: string;
  flightNumber: string;
  destination: string;
  departureTime: string;
  gate: string;
  status: FlightStatus;
}

export enum FlightStatus {
  Scheduled = 'Scheduled',
  Boarding = 'Boarding',
  Departed = 'Departed',
  Landed = 'Landed',
}

export interface FlightFormData {
  flightNumber: string;
  destination: string;
  departureTime: string;
  gate: string;
}

export interface FlightFilters {
  status: FlightStatus | '';
  destination: string;
  searchQuery: string;
} 