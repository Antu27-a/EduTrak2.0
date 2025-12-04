import { useState } from "react"
import { BookPlus, Edit, Trash2, BookOpen, Users, Clock } from "lucide-react"
import Modal from "../../components/ui/Modal"
import Alert from "../../components/ui/Alert"
import SearchBar from "../../components/ui/SearchBar"
import "../../components/Css/Cursos.css"

export default function Cursos() {
    const [cursos, setCursos] = useState([
        { id: 1, nombre: "3ro A", turno: "Mañana", cantidadAlumnos: 25 },
        { id: 2, nombre: "2do B", turno: "Tarde", cantidadAlumnos: 30 },
    ])
    const [searchTerm, setSearchTerm] = useState("")
    const [formData, setFormData] = useState({ nombre: "", turno: "", cantidadAlumnos: "" })

    const [editModal, setEditModal] = useState({ open: false, curso: null })
    const [deleteModal, setDeleteModal] = useState({ open: false, curso: null })
    const [alert, setAlert] = useState({ visible: false, message: "", type: "success" })

    const showAlert = (message, type = "success") => {
        setAlert({ visible: true, message, type })
    }

    const handleAdd = (e) => {
        e.preventDefault()
        if (!formData.nombre || !formData.turno) return

        const newCurso = {
            id: Date.now(),
            nombre: formData.nombre,
            turno: formData.turno,
            cantidadAlumnos: Number.parseInt(formData.cantidadAlumnos) || 0,
        }
        setCursos([...cursos, newCurso])
        setFormData({ nombre: "", turno: "", cantidadAlumnos: "" })
        showAlert("Curso creado exitosamente")
    }

    const handleEdit = () => {
        setCursos(cursos.map((c) => (c.id === editModal.curso.id ? editModal.curso : c)))
        setEditModal({ open: false, curso: null })
        showAlert("Curso modificado exitosamente")
    }

    const handleDelete = () => {
        setCursos(cursos.filter((c) => c.id !== deleteModal.curso.id))
        setDeleteModal({ open: false, curso: null })
        showAlert("Curso eliminado", "error")
    }

    const filteredCursos = cursos.filter(
        (c) =>
            c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.turno.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="cursos-page">
            <Alert
                message={alert.message}
                type={alert.type}
                isVisible={alert.visible}
                onClose={() => setAlert({ ...alert, visible: false })}
            />

            <div className="page-header">
                <h1>Gestión de Cursos</h1>
                <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar curso..." />
            </div>

            <div className="cursos-container">
                <div className="card form-card">
                    <div className="card-header">
                        <BookPlus size={24} />
                        <h2>Crear Curso</h2>
                    </div>
                    <form onSubmit={handleAdd}>
                        <div className="form-group">
                            <label>Nombre del Curso</label>
                            <div className="input-icon">
                                <BookOpen size={18} />
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder="Ej: 3ro A o 1°8"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Turno</label>
                            <div className="input-icon">
                                <Clock size={18} />
                                <select value={formData.turno} onChange={(e) => setFormData({ ...formData, turno: e.target.value })}>
                                    <option value="">Seleccionar turno</option>
                                    <option value="Mañana">Mañana</option>
                                    <option value="Tarde">Tarde</option>
                                    <option value="Noche">Noche</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Cantidad de Alumnos</label>
                            <div className="input-icon">
                                <Users size={18} />
                                <input
                                    type="number"
                                    value={formData.cantidadAlumnos}
                                    onChange={(e) => setFormData({ ...formData, cantidadAlumnos: e.target.value })}
                                    placeholder="Ej: 25"
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary">
                            <BookPlus size={18} />
                            Crear Curso
                        </button>
                    </form>
                </div>

                <div className="card history-card">
                    <div className="card-header">
                        <h2>Cursos Registrados</h2>
                        <span className="badge">{filteredCursos.length}</span>
                    </div>
                    <div className="history-list">
                        {filteredCursos.length === 0 ? (
                            <p className="empty-message">No hay cursos registrados</p>
                        ) : (
                            filteredCursos.map((curso) => (
                                <div key={curso.id} className="history-item">
                                    <div className="item-info">
                                        <div className="avatar-curso">
                                            <BookOpen size={22} />
                                        </div>
                                        <div>
                                            <h4>{curso.nombre}</h4>
                                            <div className="curso-details">
                                                <span className="turno-tag">{curso.turno}</span>
                                                <span className="alumnos-count">
                                                    <Users size={14} /> {curso.cantidadAlumnos} alumnos
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item-actions">
                                        <button className="btn-icon edit" onClick={() => setEditModal({ open: true, curso: { ...curso } })}>
                                            <Edit size={18} />
                                        </button>
                                        <button className="btn-icon delete" onClick={() => setDeleteModal({ open: true, curso })}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <Modal isOpen={editModal.open} onClose={() => setEditModal({ open: false, curso: null })} title="Editar Curso">
                {editModal.curso && (
                    <>
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={editModal.curso.nombre}
                                onChange={(e) =>
                                    setEditModal({
                                        ...editModal,
                                        curso: { ...editModal.curso, nombre: e.target.value },
                                    })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Turno</label>
                            <select
                                value={editModal.curso.turno}
                                onChange={(e) =>
                                    setEditModal({
                                        ...editModal,
                                        curso: { ...editModal.curso, turno: e.target.value },
                                    })
                                }
                            >
                                <option value="Mañana">Mañana</option>
                                <option value="Tarde">Tarde</option>
                                <option value="Noche">Noche</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Cantidad de Alumnos</label>
                            <input
                                type="number"
                                value={editModal.curso.cantidadAlumnos}
                                onChange={(e) =>
                                    setEditModal({
                                        ...editModal,
                                        curso: { ...editModal.curso, cantidadAlumnos: Number.parseInt(e.target.value) || 0 },
                                    })
                                }
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setEditModal({ open: false, curso: null })}>
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
                onClose={() => setDeleteModal({ open: false, curso: null })}
                title="Eliminar Curso"
            >
                <p>
                    ¿Estás seguro de eliminar el curso <strong>{deleteModal.curso?.nombre}</strong>?
                </p>
                <p className="warning-text">Esta acción no se puede deshacer.</p>
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={() => setDeleteModal({ open: false, curso: null })}>
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
