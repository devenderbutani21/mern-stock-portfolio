import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import stockRoutes from './routes/stockRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Local MongoDB connected!'); 
} catch (error) {
    console.log('MongoDB:', error.message);
    process.exit(1);
}

app.use('/api/stocks', stockRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req,res) => {
    res.json({
        message: 'Stock API',
        endpoints: ['GET /api/stocks', 'POST /api/watchlist']
    });
});

app.use('*', (req,res) => {
    res.status(404).json({ error: `No ${req.method} ${req.path}` });
});

app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`Stocks: http://localhost:${PORT}/api/stocks`);
});
