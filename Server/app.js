const Express = require("express")
const App = Express()

require("dotenv").config()

const PORT = process.env.PORT || 5000

App.use(Express.json())
const cors = require("cors")
App.use(cors())

const LoginRoutes = require("./src/Router/Login.Routes")
const RegistroUsuarioRoutes = require("./src/Router/RegistroUsuario.Routes")
const UsuarioRoutes = require("./src/Router/Usuario.Routes")
const AlumnoRoutes = require("./src/Router/Alumno.Routes")
const CursoRoutes = require("./src/Router/Curso.Routes")
const AsistenciaRoutes = require("./src/Router/Asistencia.Routes")

App.use("/api", LoginRoutes)
App.use("/api", RegistroUsuarioRoutes)
App.use("/api", UsuarioRoutes)
App.use("/api", AlumnoRoutes)
App.use("/api", CursoRoutes)
App.use("/api", AsistenciaRoutes)

App.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
