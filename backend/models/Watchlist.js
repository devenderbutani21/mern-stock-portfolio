import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
    stockId: { type: String, ref: 'Stock' },
    userId: { type: String, default: null }
}, { timestamps: true });

export default mongoose.model('Watchlist', watchlistSchema);