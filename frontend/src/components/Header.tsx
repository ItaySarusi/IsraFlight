import { AppBar, Toolbar, Typography, Box, styled } from '@mui/material';
import { motion } from 'framer-motion';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backdropFilter: 'blur(8px)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const LogoIcon = styled(FlightTakeoffIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '2rem',
  transform: 'rotate(-45deg)',
}));

const Header = () => {
  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <LogoContainer>
          <LogoIcon />
          <Typography
            variant="h5"
            component={motion.h1}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              fontWeight: 600,
              background: (theme) =>
                `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            IsraFlight
          </Typography>
        </LogoContainer>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header; 