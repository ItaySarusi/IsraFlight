import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      orange: string;
      blueGray: string;
      softBlack: string;
    };
  }
  interface PaletteOptions {
    custom: {
      orange: string;
      blueGray: string;
      softBlack: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF7043', // Soft orange
      light: '#FFB74D',
      dark: '#F4511E',
    },
    secondary: {
      main: '#607D8B', // Blue gray
      light: '#90A4AE',
      dark: '#455A64',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    custom: {
      orange: '#FF7043',
      blueGray: '#607D8B',
      softBlack: '#37474F',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      color: '#37474F',
    },
    h2: {
      fontWeight: 600,
      color: '#37474F',
    },
    h3: {
      fontWeight: 500,
      color: '#37474F',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
}); 