import { useState } from "react";
import {
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ error, setError ] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await authAPI.login(email, password);
            login(res.data.token);
            navigate('/stocks');
        } catch (err) {
            setError(err.response?.data?.error || 'Login Failed');
        }
    };

    return (
        <Card sx={{ maxWidth: 400, mx: 'auto' }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Login
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2}}
                    >
                        Login
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
};

export default Login;