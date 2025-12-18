const Express = require("express")
const Rutas = Express.Router()

const {
  RegistrarCurso,
  ObtenerCursos,
  ObtenerCursoPorId,
  ActualizarCurso,
  EliminarCurso,
} = require("../Controller/Curso.Controller")

Rutas.post("/cursos", RegistrarCurso)
Rutas.get("/cursos", ObtenerCursos)
Rutas.get("/cursos/:id", ObtenerCursoPorId)
Rutas.put("/cursos/:id", ActualizarCurso)
Rutas.delete("/cursos/:id", EliminarCurso)

module.exports = Rutas
