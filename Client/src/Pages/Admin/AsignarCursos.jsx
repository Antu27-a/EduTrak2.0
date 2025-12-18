"use client"

import { useState, useEffect } from "react"
import { Users, BookOpen, Plus, Trash2, UserCheck } from "lucide-react"
import SearchBar from "../../components/ui/SearchBar"
import Modal from "../../components/ui/Modal"
import Alert from "../../components/ui/Alert"
import api from "../../services/api"
import "../../components/Css/AsignarCursos.css"

export default function AsignarCursos() {
  const [preceptores, setPreceptores] = useState([])
  const [cursos, setCursos] = useState([])
  const [asignaciones, setAsignaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [alert, setAlert] = useState({ isVisible: false, message: "", type: "success" })
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPreceptor, setSelectedPreceptor] = useState(null)
  const [cursosAsignados, setCursosAsignados] = useState([])

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [usuariosData, cursosData, asignacionesData] = await Promise.all([
        api.getUsuarios(),
        api.getCursos(),
        api.getTodasAsignaciones(),
      ])

      const preceptoresData = usuariosData.filter((u) => u.rol === "preceptor")
      console.log("Preceptores cargados:", preceptoresData)
      console.log("Cursos cargados:", cursosData)
      console.log("Asignaciones cargadas:", asignacionesData)

      setPreceptores(preceptoresData)
      setCursos(cursosData)
      setAsignaciones(asignacionesData)
    } catch (error) {
      console.error("Error al cargar datos:", error)
      showAlert("Error al cargar datos", "error")
    } finally {
      setLoading(false)
    }
  }

  const showAlert = (message, type = "success") => {
    setAlert({ isVisible: true, message, type })
    setTimeout(() => setAlert({ isVisible: false, message: "", type: "success" }), 3000)
  }

  const abrirModalAsignacion = (preceptor) => {
    console.log("Abriendo modal para preceptor:", preceptor)
    setSelectedPreceptor(preceptor)

    const cursosAsignadosIds = asignaciones.filter((a) => a.id_usuario === preceptor.id_user).map((a) => a.id_curso)

    console.log("Cursos asignados IDs:", cursosAsignadosIds)

    const asignados = cursos.filter((c) => cursosAsignadosIds.includes(c.id_curso))
    console.log(" Cursos asignados:", asignados)

    setCursosAsignados(asignados)
    setModalOpen(true)
  }

  const asignarCurso = async (id_curso) => {
    try {
      await api.asignarCursoPreceptor(selectedPreceptor.id_user, id_curso)

      const curso = cursos.find((c) => c.id_curso === id_curso)
      setCursosAsignados([...cursosAsignados, curso])

      setAsignaciones([
        ...asignaciones,
        {
          id_usuario: selectedPreceptor.id_user,
          id_curso: id_curso,
          curso: curso.curso,
          turno: curso.turno,
          nombre_preceptor: selectedPreceptor.nombre,
        },
      ])

      showAlert(`Curso "${curso.curso} - ${curso.turno}" asignado a ${selectedPreceptor.nombre}`)
    } catch (error) {
      console.error("Error al asignar curso:", error)
      showAlert(error.response?.data?.Error || "Error al asignar curso", "error")
    }
  }

  const desasignarCurso = async (id_curso) => {
    try {
      await api.desasignarCursoPreceptor(selectedPreceptor.id_user, id_curso)

      const cursoDesasignado = cursosAsignados.find((c) => c.id_curso === id_curso)
      setCursosAsignados(cursosAsignados.filter((c) => c.id_curso !== id_curso))

      setAsignaciones(
        asignaciones.filter((a) => !(a.id_usuario === selectedPreceptor.id_user && a.id_curso === id_curso)),
      )

      showAlert(`Curso "${cursoDesasignado.curso} - ${cursoDesasignado.turno}" desasignado correctamente`)
    } catch (error) {
      console.error("Error al desasignar curso:", error)
      showAlert("Error al desasignar curso", "error")
    }
  }

  const getCursosCount = (preceptorId) => {
    return asignaciones.filter((a) => a.id_usuario === preceptorId).length
  }

  const filteredPreceptores = preceptores.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="asignar-cursos-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Cargando datos...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="asignar-cursos-page">
      <Alert
        message={alert.message}
        type={alert.type}
        isVisible={alert.isVisible}
        onClose={() => setAlert({ ...alert, isVisible: false })}
      />

      <div className="page-header">
        <div>
          <h1>Asignar Cursos</h1>
          <p>Gestiona los cursos asignados a cada preceptor</p>
        </div>
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar preceptor..." />
      </div>

      <div className="preceptores-grid">
        {filteredPreceptores.map((preceptor) => (
          <div key={preceptor.id_user} className="preceptor-card">
            <div className="preceptor-header">
              <div className="preceptor-avatar">
                <Users size={32} />
              </div>
              <div className="preceptor-info">
                <h3>{preceptor.nombre}</h3>
                <p>{preceptor.email}</p>
              </div>
            </div>

            <div className="preceptor-stats">
              <div className="stat-item">
                <BookOpen size={18} />
                <span>{getCursosCount(preceptor.id_user)} cursos asignados</span>
              </div>
            </div>

            <button className="btn-asignar" onClick={() => abrirModalAsignacion(preceptor)}>
              <UserCheck size={18} />
              <span>Gestionar Cursos</span>
            </button>
          </div>
        ))}
      </div>

      {filteredPreceptores.length === 0 && (
        <div className="empty-state">
          <Users size={48} />
          <p>No se encontraron preceptores</p>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Asignar Cursos - ${selectedPreceptor?.nombre}`}
      >
        <div className="modal-asignacion">
          <div className="cursos-section">
            <h4>Cursos Asignados ({cursosAsignados.length})</h4>
            {cursosAsignados.length === 0 ? (
              <p className="empty-message">No tiene cursos asignados</p>
            ) : (
              <div className="cursos-list">
                {cursosAsignados.map((curso) => (
                  <div key={curso.id_curso} className="curso-item asignado">
                    <div className="curso-info">
                      <BookOpen size={16} />
                      <span>
                        {curso.curso} - {curso.turno}
                      </span>
                    </div>
                    <button
                      className="btn-icon-small delete"
                      onClick={() => desasignarCurso(curso.id_curso)}
                      title="Desasignar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="cursos-section">
            <h4>Cursos Disponibles ({cursos.length - cursosAsignados.length})</h4>
            <div className="cursos-list">
              {cursos
                .filter((c) => !cursosAsignados.find((ca) => ca.id_curso === c.id_curso))
                .map((curso) => (
                  <div key={curso.id_curso} className="curso-item disponible">
                    <div className="curso-info">
                      <BookOpen size={16} />
                      <span>
                        {curso.curso} - {curso.turno}
                      </span>
                    </div>
                    <button className="btn-icon-small add" onClick={() => asignarCurso(curso.id_curso)} title="Asignar">
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
            </div>
            {cursos.length === cursosAsignados.length && (
              <p className="empty-message">Todos los cursos están asignados</p>
            )}
          </div>

          <div className="modal-actions">
            <button className="btn-confirm" onClick={() => setModalOpen(false)}>
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
