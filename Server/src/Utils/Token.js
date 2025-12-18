const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET || "edutrak_secret_key_2024"

function GenerarToken(userData) {
  return jwt.sign(userData, JWT_SECRET, {
    expiresIn: "24h",
  })
}

function VerificacionToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error("Token inválido o expirado")
  }
}

module.exports = { GenerarToken, VerificacionToken }
