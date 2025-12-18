const Express = require("express")
const Rutas = Express.Router()

const {
  ObtenerUsuarios,
  ObtenerUsuarioPorId,
  ActualizarUsuario,
  EliminarUsuario,
} = require("../Controller/Usuario.Controller")

Rutas.get("/usuarios", ObtenerUsuarios)
Rutas.get("/usuarios/:id", ObtenerUsuarioPorId)
Rutas.put("/usuarios/:id", ActualizarUsuario)
Rutas.delete("/usuarios/:id", EliminarUsuario)

module.exports = Rutas
