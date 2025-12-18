const db = require("../DataBase/db")

const RegistrarAlumno = async (req, res) => {
  const { nombre, apellido, email, id_curso } = req.body
  try {
    if (!nombre || !apellido || !email || !id_curso) {
      return res.status(400).json({ Error: "Faltan datos obligatorios" })
    }
    const query = `INSERT INTO Alumno (nombre,apellido,email,id_curso) VALUES (?,?,?,?)`
    db.run(query, [nombre, apellido, email, id_curso], function (error) {
      if (error) {
        console.error("Error al registrar alumno:", error.message)
        return res.status(400).json({ Error: "Error al registrar el alumno" })
      }
      res.status(201).json({
        Mensaje: "Alumno registrado correctamente",
        id_alumno: this.lastID,
      })
    })
  } catch (error) {
    console.error("Error en RegistrarAlumno:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const ObtenerAlumnos = async (req, res) => {
  try {
    const query = `
      SELECT 
        a.id_alumno, 
        a.nombre, 
        a.apellido, 
        a.email, 
        a.id_curso,
        c.curso,
        c.turno
      FROM Alumno a
      LEFT JOIN Curso c ON a.id_curso = c.id_curso
    `
    db.all(query, [], (error, alumnos) => {
      if (error) {
        console.error("Error al obtener alumnos:", error.message)
        return res.status(500).json({ Error: "Error al obtener alumnos" })
      }
      res.status(200).json(alumnos)
    })
  } catch (error) {
    console.error("Error en ObtenerAlumnos:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const ObtenerAlumnosPorCurso = async (req, res) => {
  try {
    const { id_curso } = req.params
    const query = `
      SELECT 
        a.id_alumno, 
        a.nombre, 
        a.apellido, 
        a.email, 
        a.id_curso,
        c.curso,
        c.turno,
        COUNT(CASE WHEN asist.estado = 'Ausente' THEN 1 END) as faltas
      FROM Alumno a
      LEFT JOIN Curso c ON a.id_curso = c.id_curso
      LEFT JOIN Asistencia asist ON a.id_alumno = asist.id_alumno
      WHERE a.id_curso = ?
      GROUP BY a.id_alumno
    `
    db.all(query, [id_curso], (error, alumnos) => {
      if (error) {
        console.error("Error al obtener alumnos por curso:", error.message)
        return res.status(500).json({ Error: "Error al obtener alumnos" })
      }
      res.status(200).json(alumnos)
    })
  } catch (error) {
    console.error("Error en ObtenerAlumnosPorCurso:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const ActualizarAlumno = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, apellido, email, id_curso } = req.body

    const query = `UPDATE Alumno SET nombre=?, apellido=?, email=?, id_curso=? WHERE id_alumno=?`
    db.run(query, [nombre, apellido, email, id_curso, id], function (error) {
      if (error) {
        console.error("Error al actualizar alumno:", error.message)
        return res.status(500).json({ Error: "Error al actualizar alumno" })
      }
      if (this.changes === 0) {
        return res.status(404).json({ Error: "Alumno no encontrado" })
      }
      res.status(200).json({ Mensaje: "Alumno actualizado correctamente" })
    })
  } catch (error) {
    console.error("Error en ActualizarAlumno:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const EliminarAlumno = async (req, res) => {
  try {
    const { id } = req.params
    const query = `DELETE FROM Alumno WHERE id_alumno=?`
    db.run(query, [id], function (error) {
      if (error) {
        console.error("Error al eliminar alumno:", error.message)
        return res.status(500).json({ Error: "Error al eliminar alumno" })
      }
      if (this.changes === 0) {
        return res.status(404).json({ Error: "Alumno no encontrado" })
      }
      res.status(200).json({ Mensaje: "Alumno eliminado correctamente" })
    })
  } catch (error) {
    console.error("Error en EliminarAlumno:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

module.exports = {
  RegistrarAlumno,
  ObtenerAlumnos,
  ObtenerAlumnosPorCurso,
  ActualizarAlumno,
  EliminarAlumno,
}
