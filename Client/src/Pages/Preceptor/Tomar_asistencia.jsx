"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import { Users, Calendar, Mail, Check, X, AlertCircle, History, Send, BookOpen } from "lucide-react"
import Table from "../../components/ui/Table"
import Button from "../../components/ui/Button"
import Alert from "../../components/ui/Alert"
import Modal from "../../components/ui/Modal"
import { AuthContext } from "../../Context/AuthContext"
import api from "../../services/api"
import "../../components/Css/TomarAsistencia.css"

export default function TomarAsistencia() {
  const { cursoId } = useParams()
  const { user } = useContext(AuthContext)
  const [alert, setAlert] = useState({ isVisible: false, message: "", type: "success" })
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAlumno, setSelectedAlumno] = useState(null)
  const [cursoInfo, setCursoInfo] = useState(null)
  const [alumnos, setAlumnos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [cursoId])

  const cargarDatos = async () => {
    try {
      const [cursoData, alumnosData] = await Promise.all([api.getCursoPorId(cursoId), api.getAlumnosPorCurso(cursoId)])

      setCursoInfo(cursoData)
      setAlumnos(alumnosData.map((a) => ({ ...a, estado: null })))
    } catch (error) {
      console.error("Error al cargar datos:", error)
      setAlert({
        isVisible: true,
        message: "Error al cargar los datos del curso",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const fechaHoy = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleEstadoChange = (alumnoId, nuevoEstado) => {
    setAlumnos((prev) =>
      prev.map((alumno) => {
        if (alumno.id_alumno === alumnoId) {
          return { ...alumno, estado: nuevoEstado }
        }
        return alumno
      }),
    )
  }

  const handleEnviarNotificacion = (alumno) => {
    setSelectedAlumno(alumno)
    setModalOpen(true)
  }

  const confirmarEnvioNotificacion = () => {
    setModalOpen(false)
    setAlert({
      isVisible: true,
      message: `Notificación enviada a ${selectedAlumno.email}`,
      type: "success",
    })
  }

  const guardarAsistencia = async () => {
    const sinMarcar = alumnos.filter((a) => a.estado === null).length
    if (sinMarcar > 0) {
      setAlert({
        isVisible: true,
        message: `Hay ${sinMarcar} alumno(s) sin marcar asistencia`,
        type: "warning",
      })
      return
    }

    try {
      const ahora = new Date()
      const year = ahora.getFullYear()
      const month = String(ahora.getMonth() + 1).padStart(2, "0")
      const day = String(ahora.getDate()).padStart(2, "0")
      const fecha = `${year}-${month}-${day}`

      const asistencias = alumnos.map((a) => ({
        fecha,
        estado: a.estado === "presente" ? "Presente" : a.estado === "ausente" ? "Ausente" : "Justificado",
        notificacion: "",
        id_alumno: a.id_alumno,
      }))

      await api.registerMultipleAttendances(asistencias, user.id_user)

      setAlert({
        isVisible: true,
        message: "Asistencia guardada correctamente",
        type: "success",
      })

      setTimeout(() => {
        setAlumnos((prev) => prev.map((a) => ({ ...a, estado: null })))
      }, 2000)
    } catch (error) {
      console.error("Error al guardar asistencia:", error)
      setAlert({
        isVisible: true,
        message: "Error al guardar la asistencia",
        type: "error",
      })
    }
  }

  const columns = ["Alumno", "Fecha", "Estado", "Email", "Faltas", "Notificar"]

  const renderRow = (alumno, index) => (
    <tr key={alumno.id_alumno}>
      <td>
        <div className="alumno-info">
          <div className="alumno-avatar">
            {alumno.apellido.charAt(0)}
            {alumno.nombre.charAt(0)}
          </div>
          <span>
            {alumno.apellido}, {alumno.nombre}
          </span>
        </div>
      </td>
      <td>
        <div className="fecha-cell">
          <Calendar size={16} />
          <span>{new Date().toLocaleDateString("es-AR")}</span>
        </div>
      </td>
      <td>
        <div className="estado-buttons">
          <button
            className={`estado-btn presente ${alumno.estado === "presente" ? "active" : ""}`}
            onClick={() => handleEstadoChange(alumno.id_alumno, "presente")}
            title="Presente"
          >
            <Check size={16} />
          </button>
          <button
            className={`estado-btn ausente ${alumno.estado === "ausente" ? "active" : ""}`}
            onClick={() => handleEstadoChange(alumno.id_alumno, "ausente")}
            title="Ausente"
          >
            <X size={16} />
          </button>
          <button
            className={`estado-btn justificado ${alumno.estado === "justificado" ? "active" : ""}`}
            onClick={() => handleEstadoChange(alumno.id_alumno, "justificado")}
            title="Justificado"
          >
            <AlertCircle size={16} />
          </button>
        </div>
      </td>
      <td>
        <div className="email-cell">
          <Mail size={16} />
          <span>{alumno.email}</span>
        </div>
      </td>
      <td>
        <span className={`faltas-badge ${alumno.faltas >= 5 ? "critical" : alumno.faltas >= 3 ? "warning" : ""}`}>
          {alumno.faltas} faltas
        </span>
      </td>
      <td>
        {alumno.faltas >= 3 && (
          <button
            className="btn-notificar"
            onClick={() => handleEnviarNotificacion(alumno)}
            title="Enviar notificación por faltas"
          >
            <Send size={16} />
          </button>
        )}
      </td>
    </tr>
  )

  if (loading) {
    return <div className="tomar-asistencia-page">Cargando...</div>
  }

  if (!cursoInfo) {
    return <div className="tomar-asistencia-page">Curso no encontrado</div>
  }

  return (
    <div className="tomar-asistencia-page">
      <Alert
        message={alert.message}
        type={alert.type}
        isVisible={alert.isVisible}
        onClose={() => setAlert({ ...alert, isVisible: false })}
      />

      <div className="page-header">
        <div className="header-info">
          <h1>Tomar Asistencia</h1>
          <div className="curso-badge">
            <BookOpen size={20} />
            <span>{cursoInfo.curso}</span>
            <span className="turno-badge">Turno {cursoInfo.turno}</span>
            <span className="alumnos-badge">
              <Users size={16} />
              {alumnos.length} alumnos
            </span>
          </div>
        </div>
        <div className="header-actions">
          <Link to={`/preceptor/historial/${cursoId || 1}`} className="btn-historial">
            <History size={20} />
            <span>Ver Historial</span>
          </Link>
        </div>
      </div>

      <div className="fecha-banner">
        <Calendar size={20} />
        <span>{fechaHoy}</span>
      </div>

      <div className="table-section">
        <Table columns={columns} data={alumnos} renderRow={renderRow} />
      </div>

      <div className="actions-footer">
        <div className="resumen">
          <span className="resumen-item presentes">
            <Check size={16} />
            {alumnos.filter((a) => a.estado === "presente").length} Presentes
          </span>
          <span className="resumen-item ausentes">
            <X size={16} />
            {alumnos.filter((a) => a.estado === "ausente").length} Ausentes
          </span>
          <span className="resumen-item justificados">
            <AlertCircle size={16} />
            {alumnos.filter((a) => a.estado === "justificado").length} Justificados
          </span>
        </div>
        <Button variant="success" icon={Check} onClick={guardarAsistencia}>
          Guardar Asistencia
        </Button>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Enviar Notificación">
        {selectedAlumno && (
          <div className="modal-notification">
            <p>¿Desea enviar una notificación de faltas a:</p>
            <div className="alumno-detail">
              <strong>
                {selectedAlumno.apellido}, {selectedAlumno.nombre}
              </strong>
              <span>{selectedAlumno.email}</span>
              <span className="faltas-info">Acumuladas: {selectedAlumno.faltas} faltas</span>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
              <button className="btn-confirm" onClick={confirmarEnvioNotificacion}>
                <Send size={16} />
                Enviar Notificación
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
