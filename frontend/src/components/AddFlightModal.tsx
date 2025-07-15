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
import { useState, useEffect } from 'react';
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

  const [errors, setErrors] = useState({
    flightNumber: '',
    destination: '',
    departureTime: '',
    gate: '',
  });

  const [show, setShow] = useState(isOpen);
  const [shouldRender, setShouldRender] = useState(isOpen);

  // Reset form and errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        flightNumber: '',
        destination: '',
        departureTime: '',
        gate: '',
      });
      setErrors({
        flightNumber: '',
        destination: '',
        departureTime: '',
        gate: '',
      });
    }
  }, [isOpen]);

  // Reset form and errors when flight is successfully added
  useEffect(() => {
    if (!isLoading && isOpen) {
      setFormData({
        flightNumber: '',
        destination: '',
        departureTime: '',
        gate: '',
      });
      setErrors({
        flightNumber: '',
        destination: '',
        departureTime: '',
        gate: '',
      });
    }
  }, [isLoading, isOpen]);

  // Animate open/close
  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setShouldRender(true);
    } else if (show) {
      // If closing, wait for animation before unmounting
      setTimeout(() => setShouldRender(false), 300);
      setShow(false);
    }
  }, [isOpen]);

  const validate = (name: string, value: string) => {
    switch (name) {
      case 'flightNumber':
        if (value.length > 10) return 'Max 10 characters';
        if (!value) return 'Required';
        return '';
      case 'destination':
        if (value.length > 20) return 'Max 20 characters';
        if (!value) return 'Required';
        return '';
      case 'departureTime':
        if (!value) return 'Required';
        const now = new Date();
        const dep = new Date(value);
        if (dep <= now) return 'Departure time must be in the future';
        return '';
      case 'gate':
        if (value.length > 10) return 'Max 10 characters';
        if (!value) return 'Required';
        return '';
      default:
        return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all fields
    const newErrors = {
      flightNumber: validate('flightNumber', formData.flightNumber),
      destination: validate('destination', formData.destination),
      departureTime: validate('departureTime', formData.departureTime),
      gate: validate('gate', formData.gate),
    };
    setErrors(newErrors);
    const hasError = Object.values(newErrors).some((err) => err);
    if (hasError) return;
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: validate(name, value),
    }));
  };

  const handleClose = () => {
    setFormData({
      flightNumber: '',
      destination: '',
      departureTime: '',
      gate: '',
    });
    setErrors({
      flightNumber: '',
      destination: '',
      departureTime: '',
      gate: '',
    });
    onClose();
  };

  const handleAnimatedClose = () => {
    setShow(false);
    setTimeout(() => {
      handleClose();
    }, 300); // Match animation duration
  };

  const isFormInvalid = Object.values(errors).some((err) => err) ||
    !formData.flightNumber ||
    !formData.destination ||
    !formData.departureTime ||
    !formData.gate;

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: show ? 1 : 0, y: show ? 0 : 40 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <StyledDialog
            open={show}
            onClose={handleAnimatedClose}
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
                  error={!!errors.flightNumber}
                  helperText={errors.flightNumber}
                  inputProps={{ maxLength: 10 }}
                />
                <TextField
                  name="destination"
                  label="Destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  fullWidth
                  error={!!errors.destination}
                  helperText={errors.destination}
                  inputProps={{ maxLength: 20 }}
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
                  error={!!errors.departureTime}
                  helperText={errors.departureTime}
                />
                <TextField
                  name="gate"
                  label="Gate"
                  value={formData.gate}
                  onChange={handleChange}
                  required
                  fullWidth
                  error={!!errors.gate}
                  helperText={errors.gate}
                  inputProps={{ maxLength: 10 }}
                />
              </FormContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAnimatedClose} color="inherit">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={isLoading || isFormInvalid}
                startIcon={isLoading && <CircularProgress size={20} />}
              >
                Add Flight
              </Button>
            </DialogActions>
          </StyledDialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddFlightModal; 