const jwt = require('jsonwebtoken');
const db = require('../DataBase/db');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ Error: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ Error: 'Token no válido' });
        }

        req.userId = decoded.id;
        next();
    });
};

module.exports = authMiddleware;