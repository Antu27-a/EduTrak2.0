const Express = require("express")
const Rutas = Express.Router()

const {
  RegistrarCurso,
  ObtenerCursos,
  ObtenerCursoPorId,
  ActualizarCurso,
  EliminarCurso,
  AsignarCursoPreceptor,
  DesasignarCursoPreceptor,
  ObtenerPreceptoresPorCurso,
  ObtenerTodasAsignaciones, 
} = require("../Controller/Curso.Controller")

Rutas.post("/cursos", RegistrarCurso)
Rutas.get("/cursos", ObtenerCursos)
Rutas.get("/cursos/:id", ObtenerCursoPorId)
Rutas.put("/cursos/:id", ActualizarCurso)
Rutas.delete("/cursos/:id", EliminarCurso)
Rutas.post("/cursos/asignar", AsignarCursoPreceptor)
Rutas.post("/cursos/desasignar", DesasignarCursoPreceptor)
Rutas.get("/cursos/:id_curso/preceptores", ObtenerPreceptoresPorCurso)


module.exports = Rutas
