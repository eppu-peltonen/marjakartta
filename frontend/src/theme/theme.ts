import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#1B6B3A',
          light: '#4E9960',
          dark: '#004016',
        },
        secondary: {
          main: '#B71C4A',
          light: '#ED4E77',
          dark: '#800022',
        },
        background: {
          default: '#F6FBF4',
          paper: '#FFFFFF',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#7DD99E',
          light: '#AFF0C6',
          dark: '#4AA872',
        },
        secondary: {
          main: '#FFB1C8',
          light: '#FFE3EC',
          dark: '#C77F97',
        },
        background: {
          default: '#1A1C19',
          paper: '#2D312B',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
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
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;
