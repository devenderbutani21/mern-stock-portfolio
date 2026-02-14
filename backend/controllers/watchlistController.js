import Watchlist from "../models/Watchlist.js";

export const addToWatchList = async (req,res) => {
    try {
        const { stockId } = req.body;

        if(!stockId) {
            return res.status(400).json({ error: 'stockId is required' });
        }

        const watchlistItem = new Watchlist({ stockId });
        const saved = await watchlistItem.save();

        res.status(201).json({
            success: true,
            message: 'Added to watchlist',
            data: saved
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};