import User from "../models/User.js";

export const isAdmin = async (req, res, next) => {
    try {
        if(!req.user) return res.status(401).json({ error: 'Auth required' });

        const user = await User.findById(req.user.id).select('role');
        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if(user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        next();
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
}