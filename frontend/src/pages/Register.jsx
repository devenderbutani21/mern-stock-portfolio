// src/pages/Register.jsx (replace with Login but add name field)
import { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Fade,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await authAPI.register(formData.name, formData.email, formData.password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pt: 4,
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(16,185,129,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16,185,129,0.1) 0%, transparent 50%)',
          backgroundColor: 'background.default'
        }}
      >
        <Card sx={{ 
          maxWidth: 420, 
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 45px -20px rgba(0,0,0,0.5)'
        }}>
          <CardContent sx={{ p: 5 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800, 
                mb: 1, 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Join Stock Portfolio
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Create your free account
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <TextField
                label="Full Name"
                fullWidth
                margin="normal"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'background.paper',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }
                  }
                }}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'background.paper',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }
                  }
                }}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'background.paper',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }
                  }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ 
                  mt: 3, 
                  py: 1.5, 
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  boxShadow: '0 10px 30px rgba(16,185,129,0.4)'
                }}
                disabled={loading}
              >
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default Register;
