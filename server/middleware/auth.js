const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader ? authHeader.replace('Bearer ', '') : null;

        if (!token) {
            return res.status(401).json({ message: 'Token non fourni' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
};

module.exports = auth;