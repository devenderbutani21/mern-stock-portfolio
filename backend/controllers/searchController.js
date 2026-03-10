import Stock from '../models/Stock.js';
import { getLiveQuote } from '../services/stockService.js';

export const searchStocks = async (req, res) => {
    try {
        const { query } = req.query;

        if(!query || query.trim().length === 0) {
            return res.json({ stocks: [] });
        }

        const searchTerm = query.trim().toUpperCase();

        // Search by symbol or company name (case-insensitive regex)
        const stocks = await Stock.find({
            $or: [
                { symbol: { $regex: searchTerm, $options: 'i' }},
                { company: { $regex: searchTerm, $options: 'i' }},
                { name: { $regex: searchTerm, $options: 'i' }}
            ]
        }).limit(10);

        // Fetch live quotes for results
        const stocksWithLive = await Promise.all(
            stocks.map(async (stock) => {
                try {
                    const live = await getLiveQuote(stock.symbol);
                    return {
                        ...stock._doc,
                        ...live,
                        company: stock.company || stock.name
                    };
                } catch (error) {
                    // Fallback if API fails
                    return {
                        ...stock._doc,
                        company: stock.company || stock.name,
                        price: stock.prices?.c || 0,
                        change: 0,
                        changePercent: 0
                    };
                }
            })
        );

        res.json({ stocks: stocksWithLive });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};