import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req,res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.'});
        }

        const existing = await User.findOne({ email });
        if(existing) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({ email, password: hashed });

        res.status(201).json({
            success: true,
            message: 'User registered',
            data: { id: user._id, email: user.email }
        });
    } catch (error) {   
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req,res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        const secret = process.env.JWT_SECRET;
        console.log('🔑 FRESH SECRET:', !!secret, secret?.length);
        
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            secret, 
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token, 
            data: { id: user._id, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}