// src/pages/Login.jsx (replace)
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
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await authAPI.login(email, password);
      login(res.data.token);
      navigate('/stocks', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
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
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(120,119,198,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(120,119,198,0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(120,119,198,0.3) 0%, transparent 50%)',
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
              Stock Portfolio
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Sign in to your account
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default Login;
