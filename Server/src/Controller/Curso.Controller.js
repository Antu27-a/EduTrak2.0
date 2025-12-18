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

module.exports = {
  RegistrarCurso,
  ObtenerCursos,
  ObtenerCursoPorId,
  ActualizarCurso,
  EliminarCurso,
}
