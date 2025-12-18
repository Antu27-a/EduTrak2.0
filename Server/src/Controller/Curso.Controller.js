const db = require("../DataBase/db")

const RegistrarCurso = async (req, res) => {
  const { curso, turno } = req.body
  try {
    if (!curso || !turno) {
      return res.status(400).json({ Error: "Faltan datos obligatorios" })
    }
    const query = `INSERT INTO Curso (curso,turno) VALUES (?,?)`
    db.run(query, [curso, turno], function (error) {
      if (error) {
        console.error("Error al registrar curso:", error.message)
        return res.status(400).json({ Error: "Error al registrar el curso" })
      }
      res.status(201).json({
        Mensaje: "Curso registrado correctamente",
        id_curso: this.lastID,
      })
    })
  } catch (error) {
    console.error("Error en RegistrarCurso:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const ObtenerCursos = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id_curso, 
        c.curso, 
        c.turno,
        COUNT(a.id_alumno) as cantidadAlumnos
      FROM Curso c
      LEFT JOIN Alumno a ON c.id_curso = a.id_curso
      GROUP BY c.id_curso
    `
    db.all(query, [], (error, cursos) => {
      if (error) {
        console.error("Error al obtener cursos:", error.message)
        return res.status(500).json({ Error: "Error al obtener cursos" })
      }
      res.status(200).json(cursos)
    })
  } catch (error) {
    console.error("Error en ObtenerCursos:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const ObtenerCursosPreceptor = async (req, res) => {
  try {
    const id_usuario = req.userId // del middleware de autenticación

    const query = `
      SELECT 
        c.id_curso, 
        c.curso, 
        c.turno,
        COUNT(a.id_alumno) as cantidadAlumnos
      FROM Curso c
      INNER JOIN Curso_Preceptor cp ON c.id_curso = cp.id_curso
      LEFT JOIN Alumno a ON c.id_curso = a.id_curso
      WHERE cp.id_usuario = ?
      GROUP BY c.id_curso
    `
    db.all(query, [id_usuario], (error, cursos) => {
      if (error) {
        console.error("Error al obtener cursos del preceptor:", error.message)
        return res.status(500).json({ Error: "Error al obtener cursos" })
      }
      res.status(200).json(cursos)
    })
  } catch (error) {
    console.error("Error en ObtenerCursosPreceptor:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const ObtenerCursoPorId = async (req, res) => {
  try {
    const { id } = req.params
    const query = `
      SELECT 
        c.id_curso, 
        c.curso, 
        c.turno,
        COUNT(a.id_alumno) as cantidadAlumnos
      FROM Curso c
      LEFT JOIN Alumno a ON c.id_curso = a.id_curso
      WHERE c.id_curso = ?
      GROUP BY c.id_curso
    `
    db.get(query, [id], (error, curso) => {
      if (error) {
        console.error("Error al obtener curso:", error.message)
        return res.status(500).json({ Error: "Error al obtener curso" })
      }
      if (!curso) {
        return res.status(404).json({ Error: "Curso no encontrado" })
      }
      res.status(200).json(curso)
    })
  } catch (error) {
    console.error("Error en ObtenerCursoPorId:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const ActualizarCurso = async (req, res) => {
  try {
    const { id } = req.params
    const { curso, turno } = req.body

    const query = `UPDATE Curso SET curso=?, turno=? WHERE id_curso=?`
    db.run(query, [curso, turno, id], function (error) {
      if (error) {
        console.error("Error al actualizar curso:", error.message)
        return res.status(500).json({ Error: "Error al actualizar curso" })
      }
      if (this.changes === 0) {
        return res.status(404).json({ Error: "Curso no encontrado" })
      }
      res.status(200).json({ Mensaje: "Curso actualizado correctamente" })
    })
  } catch (error) {
    console.error("Error en ActualizarCurso:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const EliminarCurso = async (req, res) => {
  try {
    const { id } = req.params
    const query = `DELETE FROM Curso WHERE id_curso=?`
    db.run(query, [id], function (error) {
      if (error) {
        console.error("Error al eliminar curso:", error.message)
        return res.status(500).json({ Error: "Error al eliminar curso" })
      }
      if (this.changes === 0) {
        return res.status(404).json({ Error: "Curso no encontrado" })
      }
      res.status(200).json({ Mensaje: "Curso eliminado correctamente" })
    })
  } catch (error) {
    console.error("Error en EliminarCurso:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const AsignarCursoPreceptor = async (req, res) => {
  try {
    const { id_usuario, id_curso } = req.body

    if (!id_usuario || !id_curso) {
      return res.status(400).json({ Error: "Faltan datos obligatorios" })
    }

    const query = `INSERT INTO Curso_Preceptor (id_usuario, id_curso) VALUES (?, ?)`
    db.run(query, [id_usuario, id_curso], (error) => {
      if (error) {
        if (error.message.includes("UNIQUE")) {
          return res.status(400).json({ Error: "El curso ya está asignado a este preceptor" })
        }
        console.error("Error al asignar curso:", error.message)
        return res.status(500).json({ Error: "Error al asignar curso" })
      }
      res.status(201).json({ Mensaje: "Curso asignado correctamente" })
    })
  } catch (error) {
    console.error("Error en AsignarCursoPreceptor:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const DesasignarCursoPreceptor = async (req, res) => {
  try {
    const { id_usuario, id_curso } = req.body

    const query = `DELETE FROM Curso_Preceptor WHERE id_usuario = ? AND id_curso = ?`
    db.run(query, [id_usuario, id_curso], function (error) {
      if (error) {
        console.error("Error al desasignar curso:", error.message)
        return res.status(500).json({ Error: "Error al desasignar curso" })
      }
      if (this.changes === 0) {
        return res.status(404).json({ Error: "Asignación no encontrada" })
      }
      res.status(200).json({ Mensaje: "Curso desasignado correctamente" })
    })
  } catch (error) {
    console.error("Error en DesasignarCursoPreceptor:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const ObtenerPreceptoresPorCurso = async (req, res) => {
  try {
    const { id_curso } = req.params

    const query = `
      SELECT 
        u.id_user,
        u.nombre,
        u.email
      FROM Usuario u
      INNER JOIN Curso_Preceptor cp ON u.id_user = cp.id_usuario
      WHERE cp.id_curso = ? AND u.rol = 'preceptor'
    `
    db.all(query, [id_curso], (error, preceptores) => {
      if (error) {
        console.error("Error al obtener preceptores:", error.message)
        return res.status(500).json({ Error: "Error al obtener preceptores" })
      }
      res.status(200).json(preceptores)
    })
  } catch (error) {
    console.error("Error en ObtenerPreceptoresPorCurso:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const ObtenerTodasAsignaciones = async (req, res) => {
  try {
    const query = `
      SELECT 
        cp.id_usuario,
        cp.id_curso,
        c.curso,
        c.turno,
        u.nombre as nombre_preceptor
      FROM Curso_Preceptor cp
      INNER JOIN Curso c ON cp.id_curso = c.id_curso
      INNER JOIN Usuario u ON cp.id_usuario = u.id_user
      WHERE u.rol = 'preceptor'
    `
    db.all(query, [], (error, asignaciones) => {
      if (error) {
        console.error("Error al obtener asignaciones:", error.message)
        return res.status(500).json({ Error: "Error al obtener asignaciones" })
      }
      res.status(200).json(asignaciones)
    })
  } catch (error) {
    console.error("Error en ObtenerTodasAsignaciones:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

module.exports = {
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
}
