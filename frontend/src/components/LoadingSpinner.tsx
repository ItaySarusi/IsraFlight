import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

export const LoadingSpinner = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
      }}
    >
      <CircularProgress
        sx={{
          color: 'primary.main',
        }}
      />
    </Box>
  );
}; 