"use client"

import { useState, useEffect } from "react"
import { UserPlus, Edit, Trash2, Mail, User, GraduationCap } from "lucide-react"
import Modal from "../../components/ui/Modal"
import Alert from "../../components/ui/Alert"
import SearchBar from "../../components/ui/SearchBar"
import "../../components/Css/Alumnos.css"
import api from "../../services/api"

export default function Alumnos() {
  const [alumnos, setAlumnos] = useState([])
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({ nombre: "", apellido: "", email: "", id_curso: "" })

  const [editModal, setEditModal] = useState({ open: false, alumno: null })
  const [deleteModal, setDeleteModal] = useState({ open: false, alumno: null })
  const [alert, setAlert] = useState({ visible: false, message: "", type: "success" })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [alumnosData, cursosData] = await Promise.all([api.getAlumnos(), api.getCursos()])
      setAlumnos(alumnosData)
      setCursos(cursosData)
    } catch (error) {
      console.error("Error al cargar datos:", error)
      showAlert("Error al cargar datos", "error")
    } finally {
      setLoading(false)
    }
  }

  const showAlert = (message, type = "success") => {
    setAlert({ visible: true, message, type })
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.id_curso) return

    try {
      await api.registerStudent(formData.nombre, formData.apellido, formData.email, formData.id_curso)
      setFormData({ nombre: "", apellido: "", email: "", id_curso: "" })
      showAlert("Alumno registrado exitosamente")
      cargarDatos()
    } catch (error) {
      console.error("Error al registrar alumno:", error)
      showAlert("Error al registrar alumno", "error")
    }
  }

  const handleEdit = async () => {
    try {
      await api.updateAlumno(editModal.alumno.id_alumno, {
        nombre: editModal.alumno.nombre,
        apellido: editModal.alumno.apellido,
        email: editModal.alumno.email,
        id_curso: editModal.alumno.id_curso,
      })
      setEditModal({ open: false, alumno: null })
      showAlert("Alumno modificado exitosamente")
      cargarDatos()
    } catch (error) {
      console.error("Error al editar alumno:", error)
      showAlert("Error al modificar alumno", "error")
    }
  }

  const handleDelete = async () => {
    try {
      await api.deleteAlumno(deleteModal.alumno.id_alumno)
      setDeleteModal({ open: false, alumno: null })
      showAlert("Alumno eliminado", "success")
      cargarDatos()
    } catch (error) {
      console.error("Error al eliminar alumno:", error)
      showAlert("Error al eliminar alumno", "error")
    }
  }

  const filteredAlumnos = alumnos.filter(
    (a) =>
      a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.curso && a.curso.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="alumnos-page">
      <Alert
        message={alert.message}
        type={alert.type}
        isVisible={alert.visible}
        onClose={() => setAlert({ ...alert, visible: false })}
      />

      <div className="page-header">
        <h1>Gestión de Alumnos</h1>
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar alumno..." />
      </div>

      <div className="alumnos-container">
        <div className="card form-card">
          <div className="card-header">
            <UserPlus size={24} />
            <h2>Registrar Alumno</h2>
          </div>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Nombre</label>
              <div className="input-icon">
                <User size={18} />
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Carlos"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <div className="input-icon">
                <User size={18} />
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  placeholder="Ej: Mendoza"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <div className="input-icon">
                <Mail size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ej: carlos@mail.com"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Curso</label>
              <div className="input-icon">
                <GraduationCap size={18} />
                <select
                  value={formData.id_curso}
                  onChange={(e) => setFormData({ ...formData, id_curso: e.target.value })}
                  required
                >
                  <option value="">Seleccionar curso</option>
                  {cursos.map((curso) => (
                    <option key={curso.id_curso} value={curso.id_curso}>
                      {curso.curso} - Turno {curso.turno}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="btn-primary">
              <UserPlus size={18} />
              Registrar Alumno
            </button>
          </form>
        </div>

        <div className="card history-card">
          <div className="card-header">
            <h2>Alumnos Registrados</h2>
            <span className="badge">{filteredAlumnos.length}</span>
          </div>
          <div className="history-list">
            {loading ? (
              <p className="empty-message">Cargando alumnos...</p>
            ) : filteredAlumnos.length === 0 ? (
              <p className="empty-message">No hay alumnos registrados</p>
            ) : (
              filteredAlumnos.map((alumno) => (
                <div key={alumno.id_alumno} className="history-item">
                  <div className="item-info">
                    <div className="avatar">
                      {alumno.apellido.charAt(0)}
                      {alumno.nombre.charAt(0)}
                    </div>
                    <div>
                      <h4>
                        {alumno.apellido}, {alumno.nombre}
                      </h4>
                      <p>{alumno.email}</p>
                      <span className="curso-tag">
                        {alumno.curso} - {alumno.turno}
                      </span>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      className="btn-icon edit"
                      onClick={() => setEditModal({ open: true, alumno: { ...alumno } })}
                    >
                      <Edit size={18} />
                    </button>
                    <button className="btn-icon delete" onClick={() => setDeleteModal({ open: true, alumno })}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={editModal.open} onClose={() => setEditModal({ open: false, alumno: null })} title="Editar Alumno">
        {editModal.alumno && (
          <>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={editModal.alumno.nombre}
                onChange={(e) =>
                  setEditModal({
                    ...editModal,
                    alumno: { ...editModal.alumno, nombre: e.target.value },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text"
                value={editModal.alumno.apellido}
                onChange={(e) =>
                  setEditModal({
                    ...editModal,
                    alumno: { ...editModal.alumno, apellido: e.target.value },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={editModal.alumno.email}
                onChange={(e) =>
                  setEditModal({
                    ...editModal,
                    alumno: { ...editModal.alumno, email: e.target.value },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Curso</label>
              <select
                value={editModal.alumno.id_curso}
                onChange={(e) =>
                  setEditModal({
                    ...editModal,
                    alumno: { ...editModal.alumno, id_curso: e.target.value },
                  })
                }
              >
                {cursos.map((curso) => (
                  <option key={curso.id_curso} value={curso.id_curso}>
                    {curso.curso} - Turno {curso.turno}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setEditModal({ open: false, alumno: null })}>
                Cancelar
              </button>
              <button className="btn-confirm" onClick={handleEdit}>
                Guardar Cambios
              </button>
            </div>
          </>
        )}
      </Modal>

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, alumno: null })}
        title="Eliminar Alumno"
      >
        <p>
          ¿Estás seguro de eliminar a{" "}
          <strong>
            {deleteModal.alumno?.apellido}, {deleteModal.alumno?.nombre}
          </strong>
          ?
        </p>
        <p className="warning-text">Esta acción no se puede deshacer.</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={() => setDeleteModal({ open: false, alumno: null })}>
            Cancelar
          </button>
          <button className="btn-confirm btn-danger" onClick={handleDelete}>
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  )
}
