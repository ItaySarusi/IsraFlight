import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, TablePagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useMemo } from 'react';
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
  tableRefreshKey?: number; // Optional, for remote refresh animation
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

const FlightBoard = ({ onDeleteFlight, filters, tableRefreshKey }: FlightBoardProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const prevStatuses = useRef<Record<string, FlightStatus>>({});

  // --- Animation state for exiting rows ---
  const [displayedRows, setDisplayedRows] = useState<Flight[]>([]);
  const [exitingRows, setExitingRows] = useState<string[]>([]);
  const prevFlightsRef = useRef<Flight[]>([]);

  const [pendingPage, setPendingPage] = useState<number | null>(null);
  const [isPageAnimating, setIsPageAnimating] = useState(false);

  const { data, isLoading, error } = useQuery<Flight[], Error>({
    queryKey: ['flights', filters],
    queryFn: () => {
      if (filters.status || filters.destination || filters.searchQuery) {
        return searchFlights({
          status: filters.status || undefined,
          destination: filters.destination || undefined,
          flightNumber: filters.searchQuery || undefined,
        });
      }
      return fetchFlights();
    },
  });
  const flights: Flight[] = useMemo(() => data || [], [data]);

  // Track previous statuses for status change animation
  useEffect(() => {
    // Delay updating prevStatuses until after the animation frame
    const timeout = setTimeout(() => {
      const map: Record<string, FlightStatus> = {};
      flights.forEach((f) => {
        map[f.id] = f.status;
      });
      prevStatuses.current = map;
    }, 50); // 50ms is enough for React to render and Framer Motion to pick up the change

    return () => clearTimeout(timeout);
  }, [flights]);

  // --- Row animation logic for first page only ---
  useEffect(() => {
    // Only apply this logic for the first page and 5 rows per page
    if (page !== 0 || rowsPerPage !== 5) {
      // fallback to normal pagination logic
      const sorted = [...flights].sort((a, b) => new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime());
      setDisplayedRows(sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
      setExitingRows([]);
      prevFlightsRef.current = sorted;
      return;
    }
    const sorted = [...flights].sort((a, b) => new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime());
    const newRows = sorted.slice(0, 5);
    const prevRows = prevFlightsRef.current.slice(0, 5);
    // Detect if a new row is added (length increased or new id at top)
    if (flights.length > prevFlightsRef.current.length || (prevRows[0] && newRows[0] && prevRows[0].id !== newRows[0].id)) {
      // Find the row that will be pushed out (present in prevRows but not in newRows)
      const leavingRow = prevRows.find(f => !newRows.some(nf => nf.id === f.id));
      if (leavingRow) {
        setDisplayedRows([...newRows, leavingRow]);
        setExitingRows([leavingRow.id]);
        setTimeout(() => {
          setDisplayedRows(newRows);
          setExitingRows([]);
        }, 400); // match animation duration
      } else {
        setDisplayedRows(newRows);
        setExitingRows([]);
      }
    } else {
      setDisplayedRows(newRows);
      setExitingRows([]);
    }
    prevFlightsRef.current = sorted;
  }, [flights, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPendingPage(newPage);
    setIsPageAnimating(true);
    setTimeout(() => {
      setPage(newPage);
      setPendingPage(null);
      setIsPageAnimating(false);
    }, 400); // match fade animation duration
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [filters]);

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
    <AnimatePresence mode="wait">
      <Paper
        key={tableRefreshKey}
        component={motion.div}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        sx={{
          overflow: 'hidden',
          backgroundColor: 'background.paper',
        }}
      >
        <TableContainer
          sx={{
            '@media (max-width:600px)': {
              width: 'calc(100vw - 10px)',
              marginRight: '5px',
              maxWidth: 'calc(100vw - 10px)',
            },
          }}
        >
          <Table
            sx={{
              '@media (max-width:600px)': {
                minWidth: 650, // ensure table is wide enough to scroll to actions column
                overflowX: 'auto', // enable horizontal scroll on the table itself (mobile)
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{
                    '@media (max-width:600px)': {
                      maxWidth: 50,
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      lineHeight: 1.1,
                      padding: '6px 4px',
                      textAlign: 'center', // center on mobile
                    },
                  }}
                >
                  <span className="flight-number-header" style={{ display: 'inline' }}>
                    <span className="desktop-only" style={{ display: 'inline' }}>
                      Flight Number
                    </span>
                    <span className="mobile-only" style={{ display: 'none' }}>
                      Flight<br />Number
                    </span>
                  </span>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    '@media (max-width:600px)': {
                      textAlign: 'left', // left align on mobile
                      padding: '6px 2px', // reduce horizontal padding
                    },
                  }}
                >
                  Destination
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    '@media (max-width:600px)': {
                      maxWidth: 50,
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      lineHeight: 1.1,
                      padding: '6px 2px', // reduce horizontal padding
                      textAlign: 'center', // center on mobile
                    },
                  }}
                >
                  <span className="departure-time-header" style={{ display: 'inline' }}>
                    <span className="desktop-only" style={{ display: 'inline' }}>
                      Departure Time
                    </span>
                    <span className="mobile-only" style={{ display: 'none' }}>
                      Departure<br />Time
                    </span>
                  </span>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    '@media (max-width:600px)': {
                      textAlign: 'left', // left align on mobile
                    },
                  }}
                >
                  Gate
                </TableCell>
                <TableCell
                  align="left"
                  className="status-cell"
                  sx={{
                    '@media (max-width:600px)': {
                      textAlign: 'left',
                    },
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  align="left"
                  className="actions-cell"
                  sx={{
                    '@media (max-width:600px)': {
                      textAlign: 'left', // left align actions column on mobile
                    },
                    '@media (min-width:601px)': {
                      textAlign: 'center',
                    },
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              component={motion.tbody}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <AnimatePresence initial={false}>
                {isPageAnimating && pendingPage !== null
                  ? [] // Show no rows during page transition
                  : displayedRows.map((flight) => {
                  const prevStatus = prevStatuses.current[flight.id];
                  const statusChanged = prevStatus && prevStatus !== flight.status;
                  const depDate = new Date(flight.departureTime);
                  const dateStr = depDate.toLocaleDateString();
                  const timeStr = depDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                  return (
                    <motion.tr
                      key={flight.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={exitingRows.includes(flight.id)
                        ? { opacity: 0, y: -10 } // animate out for row push
                        : { opacity: 0 }} // fade out for deletion
                      transition={{ duration: 0.4 }}
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                      style={{ position: 'relative' }}
                    >
                      <TableCell>{flight.flightNumber}</TableCell>
                      <TableCell>{flight.destination}</TableCell>
                      <TableCell
                        sx={{
                          '@media (max-width:600px)': {
                            minWidth: 80,
                            maxWidth: 100,
                            fontSize: '0.8rem',
                            padding: '6px 2px',
                            textAlign: 'center',
                          },
                        }}
                      >
                        <span className="mobile-date" style={{ display: 'block' }}>{dateStr}</span>
                        <span className="mobile-time" style={{ display: 'block' }}>{timeStr}</span>
                      </TableCell>
                      <TableCell>{flight.gate}</TableCell>
                      <TableCell className="status-cell" style={{ position: 'relative' }}
                        sx={{
                          '@media (max-width:600px)': {
                            paddingRight: '48px', // increase space in body (mobile)
                          },
                        }}
                      >
                        <motion.div
                          key={flight.status}
                          initial={statusChanged
                            ? {
                                scale: 1.35,
                                background: 'radial-gradient(circle, #fff176 0%, #ff9800 60%, #2196f3 100%)',
                                boxShadow: '0 0 48px 16px #ff9800, 0 0 0 0 #fffde7',
                                filter: 'brightness(1.5)'
                              }
                            : {
                                scale: 1,
                                background: 'transparent',
                                boxShadow: 'none',
                                filter: 'none'
                              }
                          }
                          animate={{
                            scale: 1,
                            background: 'transparent',
                            boxShadow: 'none',
                            filter: 'none',
                            transition: {
                              background: { duration: 1.2 },
                              scale: { type: 'spring', stiffness: 350, damping: 18, duration: 1.1 },
                              boxShadow: { duration: 1.1 },
                              filter: { duration: 0.7 },
                            },
                          }}
                          transition={{ duration: 1.1 }}
                          style={{ display: 'inline-block', borderRadius: 14 }}
                        >
                          <Chip
                            label={flight.status}
                            color={getStatusColor(flight.status)}
                            size="small"
                            sx={{ fontWeight: 600, letterSpacing: 1 }}
                          />
                        </motion.div>
                      </TableCell>
                      <TableCell align="center" className="actions-cell"
                        sx={{
                          '@media (max-width:600px)': {
                            textAlign: 'left', // left align actions cell on mobile
                          },
                        }}
                      >
                        <IconButton
                          onClick={() => onDeleteFlight(flight.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
        {flights.length > 5 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={flights.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          />
        )}
      </Paper>
    </AnimatePresence>
  );
};

export default FlightBoard; 