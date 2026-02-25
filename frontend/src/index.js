import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { green } from '@mui/material/colors';
import App from './App';
import { AuthProvider } from './context/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: green[500] },
    secondary: { main: green[400] },
    background: {
      default: '#0a0a0a',
      paper: '#161616',
    },
    success: { main: green[500] },
    error: { main: '#ef5350' },
    text: { primary: '#e0e0e0' },
  },
  shape: { borderRadius: 12},
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(145deg, #1a1a1a, #161616)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
          transition: 'all 0.3s ease'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 32,
          fontWeight: 600,
          fontSize: '0.875rem'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover' : {
            backgroundColor: 'rgba(255,255,255,0.05)',
            transform: 'translateY(-1px)'
          }
        }
      }
    }
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h5: { fontWeight: 700, color: '#ffffff' },
    body1: { color: '#b0b0b0' }
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <React.StrictMode>
          <App />  
        </React.StrictMode>
    </ThemeProvider>
  </AuthProvider>
);