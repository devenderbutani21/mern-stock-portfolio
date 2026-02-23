import Stock from '../models/Stock.js';
import { getHistoricalData, getLiveQuote } from '../services/stockService.js';
import cache from '../utils/cache.js';
import rateLimiter from '../utils/rateLimiter.js';

// GET all stock logic - with rate limiting and caching
export const getAllStocks = async (req,res) => {
    try {
        const stocks = await Stock.find();
        
        // Process stocks sequentially to respect rate limit
        const stocksWithLive = [];
        for (const stock of stocks) {
            try {
                const live = await getLiveQuote(stock.symbol);
                stocksWithLive.push({ ...stock._doc, ...live });
            } catch (error) {
                console.error(`Failed to fetch ${stock.symbol}:`, error.message);
                // Return stock with cached/stale data if available
                stocksWithLive.push(stock);
            }
        }
        
        // Add queue info for debugging
        res.json({
            stocks: stocksWithLive,
            queueLength: rateLimiter.getQueueLength(),
            cacheStats: cache.getStats()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getStockBySymbol = async (req,res) => {
    try {
        const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
        if(!stock) return res.status(404).json({ error: 'Stock not found' });

        const live = await getLiveQuote(req.params.symbol);
        res.json({ 
            ...stock._doc, 
            ...live,
            queueLength: rateLimiter.getQueueLength()
        });
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
        const { days = 30 } = req.query;
        const data = await getHistoricalData(req.params.symbol, parseInt(days), true);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET cache status (for debugging)
export const getCacheStatus = async (req, res) => {
    try {
        res.json({
            cache: cache.getStats(),
            queueLength: rateLimiter.getQueueLength()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST clear cache (admin only)
export const clearCache = async (req, res) => {
    try {
        cache.clear();
        res.json({ message: 'Cache cleared successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};