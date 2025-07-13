export interface Flight {
  id: string;
  flightNumber: string;
  destination: string;
  departureTime: string;
  gate: string;
  status: FlightStatus;
}

export enum FlightStatus {
  OnTime = 'On Time',
  Delayed = 'Delayed',
  Boarding = 'Boarding',
  Departed = 'Departed',
  Cancelled = 'Cancelled',
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