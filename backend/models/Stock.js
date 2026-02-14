import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
    _id: { type: String, required: true},
    name: String,
    symbol: String,
    prices: {
        l: Number,
        h: Number,
        c: Number,
        pc: Number,
    }
}, {collection: 'stocks'});

export default mongoose.model('Stock', stockSchema);