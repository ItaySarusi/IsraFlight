import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  styled,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FlightFormData, FlightStatus } from '../types/flight';

interface AddFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FlightFormData) => void;
  isLoading: boolean;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
}));

const FormContainer = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  minWidth: '400px',
  [theme.breakpoints.down('sm')]: {
    minWidth: '100%',
  },
}));

const AddFlightModal = ({ isOpen, onClose, onSubmit, isLoading }: AddFlightModalProps) => {
  const [formData, setFormData] = useState<FlightFormData>({
    flightNumber: '',
    destination: '',
    departureTime: '',
    gate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <StyledDialog
          open={isOpen}
          onClose={onClose}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Add New Flight</DialogTitle>
          <DialogContent>
            <FormContainer onSubmit={handleSubmit}>
              <TextField
                name="flightNumber"
                label="Flight Number"
                value={formData.flightNumber}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                name="destination"
                label="Destination"
                value={formData.destination}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                name="departureTime"
                label="Departure Time"
                type="datetime-local"
                value={formData.departureTime}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="gate"
                label="Gate"
                value={formData.gate}
                onChange={handleChange}
                required
                fullWidth
              />
            </FormContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={isLoading}
              startIcon={isLoading && <CircularProgress size={20} />}
            >
              Add Flight
            </Button>
          </DialogActions>
        </StyledDialog>
      )}
    </AnimatePresence>
  );
};

export default AddFlightModal; 