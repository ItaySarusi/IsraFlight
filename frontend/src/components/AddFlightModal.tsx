import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCreateFlight } from '../hooks/useFlights';
import { CreateFlightDto } from '../types/flight';

interface AddFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddFlightModal: React.FC<AddFlightModalProps> = ({ isOpen, onClose }) => {
  const createFlight = useCreateFlight();
  const [formData, setFormData] = useState<CreateFlightDto>({
    flightNumber: '',
    destination: '',
    departureTime: '',
    gate: '',
  });
  const [errors, setErrors] = useState<Partial<CreateFlightDto>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateFlightDto> = {};

    if (!formData.flightNumber.trim()) {
      newErrors.flightNumber = 'Flight number is required';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (!formData.departureTime) {
      newErrors.departureTime = 'Departure time is required';
    } else {
      const departureDate = new Date(formData.departureTime);
      const now = new Date();
      if (departureDate <= now) {
        newErrors.departureTime = 'Departure time must be in the future';
      }
    }

    if (!formData.gate.trim()) {
      newErrors.gate = 'Gate is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createFlight.mutateAsync(formData);
      handleClose();
    } catch (error) {
      console.error('Error creating flight:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      flightNumber: '',
      destination: '',
      departureTime: '',
      gate: '',
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof CreateFlightDto]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New Flight</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flight Number
              </label>
              <input
                type="text"
                name="flightNumber"
                value={formData.flightNumber}
                onChange={handleInputChange}
                className={`input-field w-full ${errors.flightNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="e.g., EL123"
              />
              {errors.flightNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.flightNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                className={`input-field w-full ${errors.destination ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="e.g., New York"
              />
              {errors.destination && (
                <p className="text-red-500 text-sm mt-1">{errors.destination}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure Time
              </label>
              <input
                type="datetime-local"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleInputChange}
                className={`input-field w-full ${errors.departureTime ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.departureTime && (
                <p className="text-red-500 text-sm mt-1">{errors.departureTime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gate
              </label>
              <input
                type="text"
                name="gate"
                value={formData.gate}
                onChange={handleInputChange}
                className={`input-field w-full ${errors.gate ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="e.g., A12"
              />
              {errors.gate && (
                <p className="text-red-500 text-sm mt-1">{errors.gate}</p>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary flex-1"
                disabled={createFlight.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={createFlight.isPending}
              >
                {createFlight.isPending ? 'Adding...' : 'Add Flight'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AddFlightModal; 