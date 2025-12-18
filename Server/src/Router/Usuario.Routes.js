const Express = require("express")
const Rutas = Express.Router()

const {
  ObtenerUsuarios,
  ObtenerUsuarioPorId,
  ActualizarUsuario,
  EliminarUsuario,
} = require("../Controller/Usuario.Controller")

const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

// Obtener lista de usuarios (requiere estar autenticado y ser admin)
Rutas.get("/usuarios", authMiddleware, roleMiddleware('admin'), ObtenerUsuarios)
Rutas.get("/usuarios/:id", authMiddleware, roleMiddleware('admin'), ObtenerUsuarioPorId)
// Actualizar usuario (solo admin puede cambiar rol)
Rutas.put("/usuarios/:id", authMiddleware, roleMiddleware('admin'), ActualizarUsuario)
Rutas.delete("/usuarios/:id", authMiddleware, roleMiddleware('admin'), EliminarUsuario)

module.exports = Rutas
