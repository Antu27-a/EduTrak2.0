const jwt = require("jsonwebtoken")
const db = require("../DataBase/db")

const authMiddleware = (req, res, next) => {
  let token = req.headers["authorization"]

  if (!token) {
    return res.status(403).json({ Error: "Token no proporcionado" })
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length)
  }

  jwt.verify(token, process.env.JWT_SECRET || "edutrak_secret_key_2024", (err, decoded) => {
    if (err) {
      console.error("Error al verificar token:", err.message)
      return res.status(401).json({ Error: "Token no válido" })
    }

    req.userId = decoded.id_user
    req.userEmail = decoded.email
    req.userRol = decoded.rol
    next()
  })
}

module.exports = authMiddleware
