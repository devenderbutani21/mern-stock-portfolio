import Stock from '../models/Stock.js';
import { getHistoricalData, getLiveQuote } from '../services/stockService.js';

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

export const createStock = async (req,res) => {
    try {
        const { company, symbol } = req.body;
        const stock = new Stock({ company, symbol, prices: { current: 0} });
        await stock.save();
        res.status(201).json(stock);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getHistorical = async (req,res) => {
    try {
        const data = await getHistoricalData(req.params.symbol);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}