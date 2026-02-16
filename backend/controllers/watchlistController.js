import Watchlist from "../models/Watchlist.js";

export const addToWatchList = async (req,res) => {
    try {
        const { stockId } = req.body;
        const userId = req.user.id;

        if(!stockId) {
            return res.status(400).json({ error: 'stockId is required' });
        }

        const existing = await Watchlist.findOne({ userId, stockId });
        if (existing) {
            return res.status(400).json({ error: 'Already on the watchlist' });
        }

        const item = await Watchlist.create({ stockId, userId });

        res.status(201).json({
            success: true,
            message: 'Added to watchlist',
            data: item
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getWatchlist = async (req,res) => {
    try {
        const userId = req.user.id;
        const items = await Watchlist.find({ userId })
            .populate('stockId', 'symbol name prices');

        res.json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}