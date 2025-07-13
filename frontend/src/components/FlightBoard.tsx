import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Flight, FlightStatus } from '../types/flight';
import { LoadingSpinner } from './LoadingSpinner';

const API_URL = 'http://localhost:5001/api';

const fetchFlights = async (): Promise<Flight[]> => {
  const response = await fetch(`${API_URL}/flights`);
  if (!response.ok) {
    throw new Error('Failed to fetch flights');
  }
  return response.json();
};

const searchFlights = async (filters: {
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

interface FlightBoardProps {
  onDeleteFlight: (id: string) => Promise<void>;
  filters: {
    status: string;
    destination: string;
    searchQuery: string;
  };
}

const getStatusColor = (status: FlightStatus) => {
  switch (status) {
    case FlightStatus.Scheduled:
      return 'default';
    case FlightStatus.Boarding:
      return 'warning';
    case FlightStatus.Departed:
      return 'info';
    case FlightStatus.Landed:
      return 'success';
    default:
      return 'default';
  }
};

const FlightBoard = ({ onDeleteFlight, filters }: FlightBoardProps) => {
  const { data: flights = [], isLoading, error } = useQuery<Flight[]>({
    queryKey: ['flights', filters],
    queryFn: () => {
      // If any filter is applied, use search endpoint
      if (filters.status || filters.destination || filters.searchQuery) {
        return searchFlights({
          status: filters.status || undefined,
          destination: filters.destination || undefined,
          flightNumber: filters.searchQuery || undefined,
        });
      }
      // Otherwise, fetch all flights
      return fetchFlights();
    },
  });

  if (isLoading) {
    return (
      <Paper
        sx={{
          p: 3,
          backgroundColor: 'background.paper',
        }}
      >
        <LoadingSpinner />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        sx={{
          p: 3,
          backgroundColor: 'background.paper',
          textAlign: 'center',
          color: 'error.main',
        }}
      >
        Error loading flights
      </Paper>
    );
  }

  if (flights.length === 0) {
    return (
      <Paper
        sx={{
          p: 3,
          backgroundColor: 'background.paper',
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        No flights available
      </Paper>
    );
  }

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        overflow: 'hidden',
        backgroundColor: 'background.paper',
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Flight Number</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Departure Time</TableCell>
              <TableCell>Gate</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.map((flight) => (
              <TableRow
                key={flight.id}
                component={motion.tr}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{flight.flightNumber}</TableCell>
                <TableCell>{flight.destination}</TableCell>
                <TableCell>
                  {new Date(flight.departureTime).toLocaleTimeString()}
                </TableCell>
                <TableCell>{flight.gate}</TableCell>
                <TableCell>
                  <Chip
                    label={flight.status}
                    color={getStatusColor(flight.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => onDeleteFlight(flight.id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default FlightBoard; 