const Express = require("express")
const Rutas = Express.Router()
const authMiddleware = require("../middlewares/auth.middleware")


const {
  RegistrarCurso,
  ObtenerCursos,
  ObtenerCursosPreceptor,
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
Rutas.get("/cursos/preceptor/mis-cursos", authMiddleware, ObtenerCursosPreceptor)
Rutas.get("/cursos/asignaciones", ObtenerTodasAsignaciones)
Rutas.get("/cursos/:id", ObtenerCursoPorId)
Rutas.put("/cursos/:id", ActualizarCurso)
Rutas.delete("/cursos/:id", EliminarCurso)
Rutas.post("/cursos/asignar", AsignarCursoPreceptor)
Rutas.post("/cursos/desasignar", DesasignarCursoPreceptor)
Rutas.get("/cursos/:id_curso/preceptores", ObtenerPreceptoresPorCurso)


module.exports = Rutas
