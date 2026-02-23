import { useState } from "react";
import {
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await authAPI.register(name, email, password);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Register failed');
        }
    };

    return (
        <Card sx={{ maxWidth: 400, mx: 'auto'}}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Register
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField 
                        label="Password"
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
                        Register
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default Register;