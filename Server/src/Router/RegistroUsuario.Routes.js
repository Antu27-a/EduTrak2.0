const Express = require("express")
const Rutas = Express.Router()

const { RegistrarUsuarios } = require("../Controller/Registro.controller")
const { VerificacionToken } = require("../Utils/Token")

const db = require("../DataBase/db")

Rutas.post("/RegistroUsuario", RegistrarUsuarios)

Rutas.get("/verificacion/:Token", (req, res) => {
  const { Token } = req.params
  console.log(req.params)
  try {
    const decoded = VerificacionToken(Token)
    const query = "UPDATE Usuario SET verificacion=1 WHERE email=?"
    db.run(query, [decoded.email], (error) => {
      if (error) {
        console.error("Error en la verificacion del usuario")
        return res.status(500).send("Error al verificar el usuario")
      }
      res.send("<h1>Cuenta Verificada Correctamente</h1>")
    })
  } catch (Error) {
    console.error("Error verificando token:", Error.message)
    res.status(500).send("Token inválido")
  }
})

module.exports = Rutas
