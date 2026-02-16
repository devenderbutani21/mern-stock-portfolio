import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
    stockId: { type: String, ref: 'Stock', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
}, { timestamps: true });

export default mongoose.model('Watchlist', watchlistSchema);