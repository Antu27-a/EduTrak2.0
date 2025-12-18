const Express = require("express")
const Rutas = Express.Router()

const { RegistrarUsuarios, IniciarSesion } = require("../Controller/Login.Controller")

Rutas.post("/IniciarSesion", IniciarSesion)
Rutas.post("/RegistrarUsuario", RegistrarUsuarios)

module.exports = Rutas
