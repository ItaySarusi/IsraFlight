export enum FlightStatus {
  Scheduled = 'Scheduled',
  Boarding = 'Boarding',
  Departed = 'Departed',
  Landed = 'Landed'
}

export interface Flight {
  id: number;
  flightNumber: string;
  destination: string;
  departureTime: string;
  gate: string;
  status: FlightStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFlightDto {
  flightNumber: string;
  destination: string;
  departureTime: string;
  gate: string;
}

export interface UpdateFlightDto {
  destination?: string;
  departureTime?: string;
  gate?: string;
}

export interface FlightFilters {
  status?: FlightStatus;
  destination?: string;
  searchKeyword?: string;
}

export interface ConnectionStatus {
  isConnected: boolean;
  connectionId?: string;
} 