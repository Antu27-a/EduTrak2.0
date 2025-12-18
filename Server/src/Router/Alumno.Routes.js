const Express = require("express")
const Rutas = Express.Router()

const {
  RegistrarAlumno,
  ObtenerAlumnos,
  ObtenerAlumnosPorCurso,
  ActualizarAlumno,
  EliminarAlumno,
} = require("../Controller/Alumno.Controller")

Rutas.post("/alumnos", RegistrarAlumno)
Rutas.get("/alumnos", ObtenerAlumnos)
Rutas.get("/alumnos/curso/:id_curso", ObtenerAlumnosPorCurso)
Rutas.put("/alumnos/:id", ActualizarAlumno)
Rutas.delete("/alumnos/:id", EliminarAlumno)

module.exports = Rutas
