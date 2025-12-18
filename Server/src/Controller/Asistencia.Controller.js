const db = require("../DataBase/db")

const RegistrarAsistencia = async (req, res) => {
  const { fecha, estado, notificacion, id_usuario, id_alumno } = req.body
  try {
    if (!fecha || !estado || !id_usuario || !id_alumno) {
      return res.status(400).json({ Error: "Faltan datos obligatorios" })
    }
    const query = `INSERT INTO Asistencia (fecha,estado,notificacion,id_usuario,id_alumno) VALUES (?,?,?,?,?)`
    db.run(query, [fecha, estado, notificacion || "", id_usuario, id_alumno], function (error) {
      if (error) {
        console.error("Error al registrar asistencia:", error.message)
        return res.status(400).json({ Error: "Error al registrar la asistencia" })
      }
      res.status(201).json({
        Mensaje: "Asistencia registrada correctamente",
        id_asistencia: this.lastID,
      })
    })
  } catch (error) {
    console.error("Error en RegistrarAsistencia:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const RegistrarAsistenciasMultiples = async (req, res) => {
  const { asistencias, id_usuario } = req.body
  try {
    if (!asistencias || !Array.isArray(asistencias) || asistencias.length === 0) {
      return res.status(400).json({ Error: "Debe proporcionar un array de asistencias" })
    }
    if (!id_usuario) {
      return res.status(400).json({ Error: "Falta el ID del usuario" })
    }

    const query = `INSERT INTO Asistencia (fecha,estado,notificacion,id_usuario,id_alumno) VALUES (?,?,?,?,?)`
    let errores = 0
    let exitosos = 0

    const promises = asistencias.map((asist) => {
      return new Promise((resolve, reject) => {
        db.run(
          query,
          [asist.fecha, asist.estado, asist.notificacion || "", id_usuario, asist.id_alumno],
          function (error) {
            if (error) {
              errores++
              reject(error)
            } else {
              exitosos++
              resolve(this.lastID)
            }
          },
        )
      })
    })

    Promise.allSettled(promises).then((results) => {
      res.status(201).json({
        Mensaje: `Asistencias registradas: ${exitosos} exitosas, ${errores} errores`,
        exitosos,
        errores,
      })
    })
  } catch (error) {
    console.error("Error en RegistrarAsistenciasMultiples:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const ObtenerAsistencias = async (req, res) => {
  try {
    const query = `
      SELECT 
        asist.id_asistencia,
        asist.fecha,
        asist.estado,
        asist.notificacion,
        a.id_alumno,
        a.nombre,
        a.apellido,
        a.email,
        c.curso,
        c.turno,
        u.nombre as usuario_nombre
      FROM Asistencia asist
      JOIN Alumno a ON asist.id_alumno = a.id_alumno
      JOIN Curso c ON a.id_curso = c.id_curso
      JOIN Usuario u ON asist.id_usuario = u.id_user
      ORDER BY asist.fecha DESC
    `
    db.all(query, [], (error, asistencias) => {
      if (error) {
        console.error("Error al obtener asistencias:", error.message)
        return res.status(500).json({ Error: "Error al obtener asistencias" })
      }
      res.status(200).json(asistencias)
    })
  } catch (error) {
    console.error("Error en ObtenerAsistencias:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const ObtenerAsistenciasPorCurso = async (req, res) => {
  try {
    const { id_curso } = req.params
    const query = `
      SELECT 
        asist.id_asistencia,
        asist.fecha,
        asist.estado,
        asist.notificacion,
        a.id_alumno,
        a.nombre,
        a.apellido,
        a.email
      FROM Asistencia asist
      JOIN Alumno a ON asist.id_alumno = a.id_alumno
      WHERE a.id_curso = ?
      ORDER BY asist.fecha DESC
    `
    db.all(query, [id_curso], (error, asistencias) => {
      if (error) {
        console.error("Error al obtener asistencias por curso:", error.message)
        return res.status(500).json({ Error: "Error al obtener asistencias" })
      }
      res.status(200).json(asistencias)
    })
  } catch (error) {
    console.error("Error en ObtenerAsistenciasPorCurso:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const ObtenerAsistenciasPorAlumno = async (req, res) => {
  try {
    const { id_alumno } = req.params
    const query = `
      SELECT 
        asist.id_asistencia,
        asist.fecha,
        asist.estado,
        asist.notificacion,
        u.nombre as usuario_nombre
      FROM Asistencia asist
      JOIN Usuario u ON asist.id_usuario = u.id_user
      WHERE asist.id_alumno = ?
      ORDER BY asist.fecha DESC
    `
    db.all(query, [id_alumno], (error, asistencias) => {
      if (error) {
        console.error("Error al obtener asistencias por alumno:", error.message)
        return res.status(500).json({ Error: "Error al obtener asistencias" })
      }
      res.status(200).json(asistencias)
    })
  } catch (error) {
    console.error("Error en ObtenerAsistenciasPorAlumno:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const ObtenerEstadisticas = async (req, res) => {
  try {
    const queries = {
      totalUsuarios: `SELECT COUNT(*) as total FROM Usuario`,
      cursosActivos: `SELECT COUNT(*) as total FROM Curso`,
      totalAlumnos: `SELECT COUNT(*) as total FROM Alumno`,
      asistenciasHoy: `
        SELECT 
          COUNT(CASE WHEN estado = 'Presente' THEN 1 END) as presentes,
          COUNT(CASE WHEN estado = 'Ausente' THEN 1 END) as ausentes,
          COUNT(*) as total
        FROM Asistencia 
        WHERE date(fecha) = date('now')
      `,
    }

    const resultados = {}

    db.get(queries.totalUsuarios, [], (err, row) => {
      resultados.totalUsuarios = row?.total || 0

      db.get(queries.cursosActivos, [], (err, row) => {
        resultados.cursosActivos = row?.total || 0

        db.get(queries.totalAlumnos, [], (err, row) => {
          resultados.totalAlumnos = row?.total || 0

          db.get(queries.asistenciasHoy, [], (err, row) => {
            resultados.asistenciasHoy = {
              presentes: row?.presentes || 0,
              ausentes: row?.ausentes || 0,
              total: row?.total || 0,
              porcentaje: row?.total > 0 ? Math.round((row?.presentes / row?.total) * 100) : 0,
            }

            res.status(200).json(resultados)
          })
        })
      })
    })
  } catch (error) {
    console.error("Error en ObtenerEstadisticas:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const ObtenerAlumnosPorCurso = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id_curso,
        c.curso,
        c.turno,
        COUNT(a.id_alumno) AS cantidad
      FROM Curso c
      LEFT JOIN Alumno a ON a.id_curso = c.id_curso
      GROUP BY c.id_curso, c.curso, c.turno
      ORDER BY c.curso
    `

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Error en ObtenerAlumnosPorCurso:", err)
        return res.status(500).json({ Error: "Error del servidor" })
      }

      
      const resultado = rows.map(row => ({
        curso: `${row.curso} (${row.turno})`,
        cantidad: row.cantidad
      }))

      res.status(200).json(resultado)
    })
  } catch (error) {
    console.error("Error en ObtenerAlumnosPorCurso:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

module.exports = {
  RegistrarAsistencia,
  RegistrarAsistenciasMultiples,
  ObtenerAsistencias,
  ObtenerAsistenciasPorCurso,
  ObtenerAsistenciasPorAlumno,
  ObtenerEstadisticas,
  ObtenerAlumnosPorCurso,
}
