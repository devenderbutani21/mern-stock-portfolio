import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { QueryClientProvider } from './context/QueryClientProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider>
    <ThemeProvider>
      <AuthProvider>
        <React.StrictMode>
          <App />
          <ReactQueryDevtools initialIsOpen={false} /> 
        </React.StrictMode>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
