import { Box, Button, TextField, MenuItem, styled, Chip, Stack, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FlightStatus } from '../types/flight';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { signalRService } from '../services/signalRService';

interface ActionBarProps {
  onAddFlight: () => void;
  onFilterChange?: (filters: {
    status: string;
    destination: string;
    searchQuery: string;
  }) => void;
}

const StyledActionBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
}));

const TopBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const FiltersContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: theme.spacing(2),
}));

const ConnectionStatus = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const StatusDot = styled(FiberManualRecordIcon, {
  shouldForwardProp: (prop) => prop !== 'isConnected',
})<{ isConnected?: boolean }>(({ theme, isConnected }) => ({
  fontSize: '12px',
  color: isConnected ? theme.palette.success.main : theme.palette.error.main,
  animation: isConnected ? 'none' : 'pulse 2s infinite',
}));

const MotionBox = motion.create(Box);

const destinations = [
  'Tel Aviv',
  'New York',
  'London',
  'Paris',
  'Dubai',
  'Frankfurt',
  'Rome',
  'Amsterdam',
];

const ActionBar = ({ onAddFlight, onFilterChange }: ActionBarProps) => {
  const [status, setStatus] = useState('');
  const [destination, setDestination] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);
  const isConnected = useSelector((state: RootState) => state.connection.isConnected);

  const handleFilterChange = (
    type: 'status' | 'destination' | 'search',
    value: string
  ) => {
    let newFilters;
    switch (type) {
      case 'status':
        setStatus(value);
        newFilters = { status: value, destination, searchQuery };
        break;
      case 'destination':
        setDestination(value);
        newFilters = { status, destination: value, searchQuery };
        break;
      case 'search':
        setSearchQuery(value);
        newFilters = { status, destination, searchQuery: value };
        break;
    }
    onFilterChange?.(newFilters);
  };

  const handleClearFilters = () => {
    setStatus('');
    setDestination('');
    setSearchQuery('');
    onFilterChange?.({ status: '', destination: '', searchQuery: '' });
  };

  const handleRetryConnection = async () => {
    setIsRetrying(true);
    try {
      console.log('Retrying SignalR connection...');
      
      // Test if backend is available first
      const isBackendAvailable = await signalRService.testConnection();
      if (!isBackendAvailable) {
        console.error('Backend is not available');
        return;
      }
      
      await signalRService.stopConnection();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      await signalRService.startConnection();
    } catch (error) {
      console.error('Failed to retry connection:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledActionBar>
        <TopBar>
          <ConnectionStatus>
            <StatusDot isConnected={isConnected} />
            <Chip
              label={isConnected ? 'SYSTEM ONLINE' : 'CONNECTING...'}
              size="small"
              color={isConnected ? 'success' : 'error'}
              variant="outlined"
            />
            {!isConnected && (
              <Tooltip title="Retry Connection">
                <IconButton
                  size="small"
                  onClick={handleRetryConnection}
                  disabled={isRetrying}
                  sx={{
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.light',
                      color: 'white',
                    },
                  }}
                >
                  <RefreshIcon 
                    sx={{ 
                      fontSize: '16px',
                      animation: isRetrying ? 'spin 1s linear infinite' : 'none'
                    }} 
                  />
                </IconButton>
              </Tooltip>
            )}
          </ConnectionStatus>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddFlight}
            sx={{
              borderRadius: '8px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: (theme) => theme.shadows[4],
              },
            }}
          >
            Add Flight
          </Button>
        </TopBar>

        <FiltersContainer>
          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          >
            <MenuItem value="">All Statuses</MenuItem>
            {Object.values(FlightStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Destination"
            value={destination}
            onChange={(e) => handleFilterChange('destination', e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          >
            <MenuItem value="">All Destinations</MenuItem>
            {destinations.map((dest) => (
              <MenuItem key={dest} value={dest}>
                {dest}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Search Flight Number"
            value={searchQuery}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
          />

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            fullWidth
            sx={{
              height: '40px',
              borderRadius: '4px',
            }}
          >
            Clear Filters
          </Button>
        </FiltersContainer>
      </StyledActionBar>
    </MotionBox>
  );
};

export default ActionBar; 