import jwt from 'jsonwebtoken';

export const auth = (req,res,next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.split(' ')[1]; // Bearer Token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { id : decoded.userId };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        } 
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        } 
        res.status(401).json({ error: 'Token verification failed' });
    }
};