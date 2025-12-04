const jwt = require('jsonwebtoken');
require('dotenv').config();

function GenerarToken(email) {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

function VerificacionToken(){
    return jwt.verify(TokenEmail, process.env.JWT_SECRET);
}

module.exports = { GenerarToken, VerificacionToken };