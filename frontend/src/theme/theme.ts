import { createTheme } from '@mui/material/styles';

const acColors = {
  // Main greens (Nature theme)
  primaryGreen: '#8FBC8F',      // Sage green
  darkGreen: '#556B2F',         // Dark olive
  lightGreen: '#F0FFF0',        // Honeydew
  
  // Earth tones
  brown: '#8B4513',             // Saddle brown
  lightBrown: '#DEB887',        // Burlywood
  cream: '#FFF8DC',             // Cornsilk
  
  // UI colors
  background: '#FFFEF7',        // Warm white
  paper: '#F5F5DC',             // Beige
  
  // Turnip colors
  turnipYellow: '#DAA520',      // Goldenrod 
  profit: '#32CD32',            // Lime green
  loss: '#DC143C',              // Crimson
};

export const theme = createTheme({
  palette: {
    primary: {
      main: acColors.primaryGreen,
      dark: acColors.darkGreen,
      light: acColors.lightGreen,
    },
    secondary: {
      main: acColors.brown,
      light: acColors.lightBrown,
    },
    background: {
      default: acColors.background,
      paper: acColors.paper,
    },
    success: {
      main: acColors.profit,
    },
    error: {
      main: acColors.loss,
    },
    warning: {
      main: acColors.turnipYellow,
    },
  },
  
  typography: {
    fontFamily: [
      '"Comic Neue"',
      '"Nunito"',
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),

    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    
    h4: {
      fontWeight: 700,
      color: acColors.darkGreen,
    },
    
    h6: {
      fontWeight: 600,
      color: acColors.brown,
    },
    body1: {
      fontWeight: 500,
    },
  },
  
  shape: {
    borderRadius: 16,
  },
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: `2px solid ${acColors.lightGreen}`,
        },
      },
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;