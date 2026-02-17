import Stock from '../models/Stock.js';
import { getLiveQuote } from '../services/stockService.js';

// GET all stock logic
export const getAllStocks = async (req,res) => {
    try {
        const stocks = await Stock.find();
        const stocksWithLive = await Promise.all(
            stocks.map(async (stock) => {
                try {
                    const live = await getLiveQuote(stock.symbol);
                    return {...stock._doc, ...live};
                } catch {
                    return stock;
                }
            })
        )
        res.json(stocksWithLive);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getStockBySymbol = async (req,res) => {
    try {
        const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
        if(!stock) return res.status(404).json({ error: 'Stock not found' });

        const live = await getLiveQuote(req.params.symbol);
        res.json({ ...stock._doc, ...live });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};