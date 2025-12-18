const Express = require("express")
const Rutas = Express.Router()

const {
  RegistrarAsistencia,
  RegistrarAsistenciasMultiples,
  ObtenerAsistencias,
  ObtenerAsistenciasPorCurso,
  ObtenerAsistenciasPorAlumno,
  ObtenerEstadisticas,
  ObtenerAlumnosPorCurso,
  EnviarNotificacion,
} = require("../Controller/Asistencia.Controller")

Rutas.post("/asistencias", RegistrarAsistencia)
Rutas.post("/asistencias/multiples", RegistrarAsistenciasMultiples)
Rutas.get("/asistencias", ObtenerAsistencias)
Rutas.get("/asistencias/curso/:id_curso", ObtenerAsistenciasPorCurso)
Rutas.get("/asistencias/alumno/:id_alumno", ObtenerAsistenciasPorAlumno)
Rutas.post("/asistencias/notificar", EnviarNotificacion)
Rutas.get("/estadisticas", ObtenerEstadisticas)
Rutas.get("/estadisticascursos", ObtenerAlumnosPorCurso)

module.exports = Rutas
