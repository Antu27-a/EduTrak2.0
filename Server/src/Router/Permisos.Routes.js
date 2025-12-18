const express = require("express")
const router = express.Router()

const authMiddleware = require("../middlewares/auth.middleware")
const roleMiddleware = require("../middlewares/role.middleware")
const { CambiarRolUsuario } = require("../Controllers/permisos.controller")

router.put(
    "/usuarios/:id/rol",
    authMiddleware,
    roleMiddleware("superadmin"),
    CambiarRolUsuario
)

module.exports = router
