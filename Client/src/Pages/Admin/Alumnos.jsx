import { useState } from "react"
import { UserPlus, Edit, Trash2, Mail, User, GraduationCap } from "lucide-react"
import Modal from "../../components/ui/Modal"
import Alert from "../../components/ui/Alert"
import SearchBar from "../../components/ui/SearchBar"
import "../../components/Css/Alumnos.css"

export default function Alumnos() {
    const [alumnos, setAlumnos] = useState([
        { id: 1, nombre: "Carlos Mendoza", email: "carlos@mail.com", curso: "3ro A" },
        { id: 2, nombre: "Ana López", email: "ana@mail.com", curso: "2do B" },
    ])
    const [searchTerm, setSearchTerm] = useState("")
    const [formData, setFormData] = useState({ nombre: "", email: "", curso: "" })

    const [editModal, setEditModal] = useState({ open: false, alumno: null })
    const [deleteModal, setDeleteModal] = useState({ open: false, alumno: null })
    const [alert, setAlert] = useState({ visible: false, message: "", type: "success" })

    const showAlert = (message, type = "success") => {
        setAlert({ visible: true, message, type })
    }

    const handleAdd = (e) => {
        e.preventDefault()
        if (!formData.nombre || !formData.email || !formData.curso) return

        const newAlumno = { id: Date.now(), ...formData }
        setAlumnos([...alumnos, newAlumno])
        setFormData({ nombre: "", email: "", curso: "" })
        showAlert("Alumno registrado exitosamente")
    }

    const handleEdit = () => {
        setAlumnos(alumnos.map((a) => (a.id === editModal.alumno.id ? editModal.alumno : a)))
        setEditModal({ open: false, alumno: null })
        showAlert("Alumno modificado exitosamente")
    }

    const handleDelete = () => {
        setAlumnos(alumnos.filter((a) => a.id !== deleteModal.alumno.id))
        setDeleteModal({ open: false, alumno: null })
        showAlert("Alumno eliminado", "error")
    }

    const filteredAlumnos = alumnos.filter(
        (a) =>
            a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.curso.toLowerCase().includes(searchTerm.toLowerCase()),
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
                            <label>Nombre Completo</label>
                            <div className="input-icon">
                                <User size={18} />
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder="Ej: Carlos Mendoza"
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
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Curso</label>
                            <div className="input-icon">
                                <GraduationCap size={18} />
                                <input
                                    type="text"
                                    value={formData.curso}
                                    onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                                    placeholder="Ej: 3ro A"
                                />
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
                        {filteredAlumnos.length === 0 ? (
                            <p className="empty-message">No hay alumnos registrados</p>
                        ) : (
                            filteredAlumnos.map((alumno) => (
                                <div key={alumno.id} className="history-item">
                                    <div className="item-info">
                                        <div className="avatar">{alumno.nombre.charAt(0)}</div>
                                        <div>
                                            <h4>{alumno.nombre}</h4>
                                            <p>{alumno.email}</p>
                                            <span className="curso-tag">{alumno.curso}</span>
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
                            <input
                                type="text"
                                value={editModal.alumno.curso}
                                onChange={(e) =>
                                    setEditModal({
                                        ...editModal,
                                        alumno: { ...editModal.alumno, curso: e.target.value },
                                    })
                                }
                            />
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
                    ¿Estás seguro de eliminar a <strong>{deleteModal.alumno?.nombre}</strong>?
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
