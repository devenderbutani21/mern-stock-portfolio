import Stock from '../models/Stock.js';

// GET all stock logic
export const getAllStocks = async (req,res) => {
    try {
        const stocks = await Stock.find();
        res.json({
            success: true,
            count: stocks.length,
            data: stocks
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};