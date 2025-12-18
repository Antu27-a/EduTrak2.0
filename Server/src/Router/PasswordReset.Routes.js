const express = require("express")
const Rutas = express.Router()
const { SolicitarRecuperacion, VerificarCodigo, CambiarContraseña } = require("../Controller/PasswordReset.Controller")

Rutas.post("/password-reset/solicitar", SolicitarRecuperacion)
Rutas.post("/password-reset/verificar", VerificarCodigo)
Rutas.post("/password-reset/cambiar", CambiarContraseña)

module.exports = Rutas
