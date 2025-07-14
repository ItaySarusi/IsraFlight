import { Box, Button, TextField, MenuItem, styled, Chip, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FlightStatus } from '../types/flight';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setStatusFilter, setDestinationFilter, setSearchQuery, clearFilters } from '../store/slices/filtersSlice';
import { signalRService } from '../services/signalRService';
import { useQueryClient } from '@tanstack/react-query';

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
  const dispatch = useDispatch();
  const status = useSelector((state: RootState) => state.filters.status);
  const destination = useSelector((state: RootState) => state.filters.destination);
  const searchQuery = useSelector((state: RootState) => state.filters.searchQuery);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isConnected = useSelector((state: RootState) => state.connection.isConnected);
  const queryClient = useQueryClient();

  const handleStatusChange = (value: string) => {
    dispatch(setStatusFilter(value as FlightStatus | ''));
  };
  const handleDestinationChange = (value: string) => {
    dispatch(setDestinationFilter(value));
  };
  const handleSearchQueryChange = (value: string) => {
    dispatch(setSearchQuery(value));
  };
  const handleClearFilters = () => {
    dispatch(clearFilters());
    if (onFilterChange) {
      onFilterChange({ status: '', destination: '', searchQuery: '' });
    }
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

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      console.log('Refreshing flight data...');
      
      // Invalidate and refetch all flight queries
      await queryClient.invalidateQueries({ queryKey: ['flights'] });
      
      // Small delay to show the refresh animation
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
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
          <ConnectionStatus>
            <Tooltip title="Refresh Flight Data">
              <IconButton
                size="small"
                onClick={handleRefreshData}
                disabled={isRefreshing}
                sx={{
                  color: isConnected ? 'success.main' : 'error.main',
                  '&:hover': {
                    backgroundColor: isConnected ? 'success.light' : 'error.light',
                    color: 'white',
                  },
                }}
              >
                <RefreshIcon 
                  sx={{ 
                    fontSize: '16px',
                    animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                  }} 
                />
              </IconButton>
            </Tooltip>
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
        </TopBar>

        <FiltersContainer>
          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
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
            label="Search By Destination"
            value={destination}
            onChange={(e) => handleDestinationChange(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />, 
            }}
          />

          <TextField
            label="Search By Flight Number"
            value={searchQuery}
            onChange={(e) => handleSearchQueryChange(e.target.value)}
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
            sx={{ height: '40px', borderRadius: '4px' }}
          >
            Clear Filters
          </Button>
        </FiltersContainer>
      </StyledActionBar>
    </MotionBox>
  );
};

export default ActionBar; 