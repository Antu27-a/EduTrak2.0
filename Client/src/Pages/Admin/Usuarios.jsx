import { useState } from "react"
import { UserPlus, Edit, Trash2, Mail, User } from "lucide-react"
import Modal from "../../components/ui/Modal"
import Alert from "../../components/ui/Alert"
import SearchBar from "../../components/ui/SearchBar"
import "../../components/Css/Usuarios.css"

export default function Usuarios() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('/api/auth/register', {
                email,
                contraseña: password,
                nombre: name,
                rol: role,
            });
            setSuccess(response.data.Mensaje);
        } catch (err) {
            if (err.response) {
                // El servidor respondió con un error (400, 500, etc)
                setError(err.response.data.Error);
            } else {
                // No hubo respuesta (caída del backend, ruta incorrecta, etc)
                setError("No se pudo conectar con el servidor.");
            }
        }
    };


    const [preceptores, setPreceptores] = useState([
        { id: 1, nombre: "Juan Pérez", email: "juan@edutrak.com" },
        { id: 2, nombre: "María García", email: "maria@edutrak.com" },
    ])
    const [searchTerm, setSearchTerm] = useState("")
    const [formData, setFormData] = useState({ nombre: "", email: "" })

    // Modal states
    const [editModal, setEditModal] = useState({ open: false, preceptor: null })
    const [deleteModal, setDeleteModal] = useState({ open: false, preceptor: null })

    // Alert state
    const [alert, setAlert] = useState({ visible: false, message: "", type: "success" })

    const showAlert = (message, type = "success") => {
        setAlert({ visible: true, message, type })
    }

    const handleAdd = (e) => {
        e.preventDefault()
        if (!formData.nombre || !formData.email) return

        const newPreceptor = {
            id: Date.now(),
            nombre: formData.nombre,
            email: formData.email,
        }
        setPreceptores([...preceptores, newPreceptor])
        setFormData({ nombre: "", email: "" })
        showAlert("Preceptor registrado exitosamente")
    }

    const handleEdit = () => {
        setPreceptores(preceptores.map((p) => (p.id === editModal.preceptor.id ? editModal.preceptor : p)))
        setEditModal({ open: false, preceptor: null })
        showAlert("Preceptor modificado exitosamente")
    }

    const handleDelete = () => {
        setPreceptores(preceptores.filter((p) => p.id !== deleteModal.preceptor.id))
        setDeleteModal({ open: false, preceptor: null })
        showAlert("Preceptor eliminado", "error")
    }

    const filteredPreceptores = preceptores.filter(
        (p) =>
            p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="usuarios-page">
            <Alert
                message={alert.message}
                type={alert.type}
                isVisible={alert.visible}
                onClose={() => setAlert({ ...alert, visible: false })}
            />

            <div className="page-header">
                <h1>Gestión de Preceptores</h1>
                <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar preceptor..." />
            </div>

            <div className="usuarios-container">
                {/* Formulario de registro */}
                <div className="card form-card">
                    <div className="card-header">
                        <UserPlus size={24} />
                        <h2>Registrar Preceptor</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nombre Completo</label>
                            <div className="input-icon">
                                <User size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ej: Juan Pérez"
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Ej: juan@edutrak.com"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Contraseña</label>
                            <div className="input-icon">
                                <Mail size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Ej: juan@edutrak.com"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Rol</label>
                            <div className="input-icon">
                                <Mail size={18} />
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="" disabled>Selecciona un rol</option>
                                    <option value="preceptor">Preceptor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary">
                            <UserPlus size={18} />
                            Registrar Preceptor
                        </button>
                    </form>
                </div>

                {/* Historial */}
                <div className="card history-card">
                    <div className="card-header">
                        <h2>Preceptores Registrados</h2>
                        <span className="badge">{filteredPreceptores.length}</span>
                    </div>
                    <div className="history-list">
                        {filteredPreceptores.length === 0 ? (
                            <p className="empty-message">No hay preceptores registrados</p>
                        ) : (
                            filteredPreceptores.map((preceptor) => (
                                <div key={preceptor.id} className="history-item">
                                    <div className="item-info">
                                        <div className="avatar">{preceptor.nombre.charAt(0)}</div>
                                        <div>
                                            <h4>{preceptor.nombre}</h4>
                                            <p>{preceptor.email}</p>
                                        </div>
                                    </div>
                                    <div className="item-actions">
                                        <button
                                            className="btn-icon edit"
                                            onClick={() => setEditModal({ open: true, preceptor: { ...preceptor } })}
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button className="btn-icon delete" onClick={() => setDeleteModal({ open: true, preceptor })}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Editar */}
            <Modal
                isOpen={editModal.open}
                onClose={() => setEditModal({ open: false, preceptor: null })}
                title="Editar Preceptor"
            >
                {editModal.preceptor && (
                    <>
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={editModal.preceptor.nombre}
                                onChange={(e) =>
                                    setEditModal({
                                        ...editModal,
                                        preceptor: { ...editModal.preceptor, nombre: e.target.value },
                                    })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={editModal.preceptor.email}
                                onChange={(e) =>
                                    setEditModal({
                                        ...editModal,
                                        preceptor: { ...editModal.preceptor, email: e.target.value },
                                    })
                                }
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setEditModal({ open: false, preceptor: null })}>
                                Cancelar
                            </button>
                            <button className="btn-confirm" onClick={handleEdit}>
                                Guardar Cambios
                            </button>
                        </div>
                    </>
                )}
            </Modal>

            {/* Modal Eliminar */}
            <Modal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, preceptor: null })}
                title="Eliminar Preceptor"
            >
                <p>
                    ¿Estás seguro de eliminar a <strong>{deleteModal.preceptor?.nombre}</strong>?
                </p>
                <p className="warning-text">Esta acción no se puede deshacer.</p>
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={() => setDeleteModal({ open: false, preceptor: null })}>
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
