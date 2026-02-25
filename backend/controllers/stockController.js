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
                stocksWithLive.push({ 
                    ...stock._doc, 
                    ...live, 
                    company: stock.company || stock.name 
                });
            } catch (error) {
                console.error(`Failed to fetch ${stock.symbol}:`, error.message);
                // Fallback to historical price data from Stock model
                const currentPrice = stock.prices?.c || stock.prices?.current || stock.initial_price || 0;
                const previousPrice = stock.prices?.pc || stock.price_2007 || stock.price_2002 || currentPrice;
                const change = currentPrice - previousPrice;
                const changePercent = previousPrice ? (change / previousPrice * 100) : 0;
                const fallback = {
                    ...stock._doc,
                    price: currentPrice,
                    change: change,
                    changePercent: changePercent,
                    company: stock.company || stock.name,
                    symbol: stock.symbol
                };
                stocksWithLive.push(fallback);
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

        try {
            const live = await getLiveQuote(req.params.symbol);
            res.json({
                ...stock._doc,
                ...live,
                company: stock.company || stock.name,
                queueLength: rateLimiter.getQueueLength()
            });
        } catch (error) {
            // Fallback to cached data
            const currentPrice = stock.prices?.c || stock.prices?.current || stock.initial_price || 0;
            const previousPrice = stock.prices?.pc || stock.price_2007 || stock.price_2002 || currentPrice;
            const change = currentPrice - previousPrice;
            const changePercent = previousPrice ? (change / previousPrice * 100) : 0;
            res.json({
                ...stock._doc,
                price: currentPrice,
                change: change,
                changePercent: changePercent,
                company: stock.company || stock.name,
                queueLength: rateLimiter.getQueueLength()
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createStock = async (req,res) => {
    try {
        const { company, symbol, name } = req.body;
        const stock = new Stock({ 
            _id: symbol,
            company: company || name, 
            name: name || company,
            symbol, 
            prices: { c: 0, current: 0 } 
        });
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