import { Box, Button, TextField, MenuItem, styled } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FlightStatus } from '../types/flight';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { clearFilters } from '../store/slices/filtersSlice';

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

const MotionBox = motion.create(Box);

const ActionBar = ({ onAddFlight, onFilterChange }: ActionBarProps) => {
  const dispatch = useAppDispatch();
  const reduxStatus = useAppSelector((state: RootState) => state.filters.status);
  const reduxDestination = useAppSelector((state: RootState) => state.filters.destination);
  const reduxSearchQuery = useAppSelector((state: RootState) => state.filters.searchQuery);
  const [status, setStatus] = useState(reduxStatus);
  const [destination, setDestination] = useState(reduxDestination);
  const [searchQuery, setSearchQuery] = useState(reduxSearchQuery);

  const handleStatusChange = (value: string) => {
    setStatus(value as FlightStatus | '');
  };
  const handleDestinationChange = (value: string) => {
    setDestination(value);
  };
  const handleSearchQueryChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleClearFilters = () => {
    setStatus('');
    setDestination('');
    setSearchQuery('');
    dispatch(clearFilters());
    if (onFilterChange) {
      onFilterChange({ status: '', destination: '', searchQuery: '' });
    }
  };

  const handleSearch = () => {
    dispatch({ type: 'filters/setStatusFilter', payload: status as FlightStatus | '' });
    dispatch({ type: 'filters/setDestinationFilter', payload: destination });
    dispatch({ type: 'filters/setSearchQuery', payload: searchQuery });
    if (onFilterChange) {
      onFilterChange({ status, destination, searchQuery });
    }
  };

  // Keep local state in sync with Redux/global state if filters are reset elsewhere
  useEffect(() => {
    setStatus(reduxStatus);
    setDestination(reduxDestination);
    setSearchQuery(reduxSearchQuery);
  }, [reduxStatus, reduxDestination, reduxSearchQuery]);

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
           variant="contained"
           color="primary"
           startIcon={<SearchIcon />}
           onClick={handleSearch}
           fullWidth
           sx={{ height: '40px', borderRadius: '4px' }}
         >
           Search
         </Button>
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