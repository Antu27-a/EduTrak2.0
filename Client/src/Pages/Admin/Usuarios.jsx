import { useState, useEffect } from "react"
import { UserPlus, Edit, Trash2, Mail, User, Shield, Lock } from "lucide-react"
import Modal from "../../components/ui/Modal"
import Alert from "../../components/ui/Alert"
import SearchBar from "../../components/ui/SearchBar"
import "../../components/Css/Usuarios.css"
import api from "../../services/api"

export default function Usuarios() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [role, setRole] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [editModal, setEditModal] = useState({ open: false, usuario: null })
    const [deleteModal, setDeleteModal] = useState({ open: false, usuario: null })
    const [alert, setAlert] = useState({ visible: false, message: "", type: "success" })

    useEffect(() => {
        cargarUsuarios()
    }, [])

    const cargarUsuarios = async () => {
        try {
            setLoading(true)
            const data = await api.getUsuarios()
            setUsuarios(data)
        } catch (error) {
            console.error("Error al cargar usuarios:", error)
            showAlert("Error al cargar usuarios", "error")
        } finally {
            setLoading(false)
        }
    }

    const showAlert = (message, type = "success") => {
        setAlert({ visible: true, message, type })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        try {
            const response = await api.register(email, password, name, role)
            showAlert(response.Mensaje || "Usuario registrado exitosamente")
            setEmail("")
            setPassword("")
            setName("")
            setRole("")
            cargarUsuarios()
        } catch (err) {
            if (err.response) {
                setError(err.response.data.Error || "Error al registrar usuario")
                showAlert(err.response.data.Error || "Error al registrar usuario", "error")
            } else {
                setError("No se pudo conectar con el servidor.")
                showAlert("No se pudo conectar con el servidor.", "error")
            }
        }
    }

    const handleEdit = async () => {
        try {
            await api.updateUsuario(editModal.usuario.id_user, {
                email: editModal.usuario.email,
                nombre: editModal.usuario.nombre,
                rol: editModal.usuario.rol,
            })
            setEditModal({ open: false, usuario: null })
            showAlert("Usuario modificado exitosamente")
            cargarUsuarios()
        } catch (error) {
            console.error("Error al editar usuario:", error)
            showAlert("Error al modificar usuario", "error")
        }
    }

    const handleDelete = async () => {
        try {
            await api.deleteUsuario(deleteModal.usuario.id_user)
            setDeleteModal({ open: false, usuario: null })
            showAlert("Usuario eliminado", "success")
            cargarUsuarios()
        } catch (error) {
            console.error("Error al eliminar usuario:", error)
            showAlert("Error al eliminar usuario", "error")
        }
    }

    const [permissionsModal, setPermissionsModal] = useState({
        open: false,
        preceptor: null
    })

    const [permissions, setPermissions] = useState({
        asistenciaRegistrar: false,
        asistenciaEditar: false,
        verHistorial: false,
        administrarUsuarios: false,
    })

    const filteredUsuarios = usuarios.filter(
        (u) =>
            u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()),
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
                <h1>Gestión de Usuarios</h1>
                <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar usuario..." />
            </div>

            <div className="usuarios-container">
                <div className="card form-card">
                    <div className="card-header">
                        <UserPlus size={24} />
                        <h2>Registrar Usuario</h2>
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
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <div className="input-icon">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Contraseña segura"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Rol</label>
                            <div className="input-icon">
                                <User size={18} />
                                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                                    <option value="" disabled>
                                        Selecciona un rol
                                    </option>
                                    <option value="preceptor">Preceptor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn-primary">
                            <UserPlus size={18} />
                            Registrar Usuario
                        </button>
                    </form>
                </div>

                <div className="card history-card">
                    <div className="card-header">
                        <h2>Usuarios Registrados</h2>
                        <span className="badge">{filteredUsuarios.length}</span>
                    </div>
                    <div className="history-list">
                        {loading ? (
                            <p className="empty-message">Cargando usuarios...</p>
                        ) : filteredUsuarios.length === 0 ? (
                            <p className="empty-message">No hay usuarios registrados</p>
                        ) : (
                            filteredUsuarios.map((usuario) => (
                                <div key={usuario.id_user} className="history-item">
                                    <div className="item-info">
                                        <div className="avatar">{usuario.nombre.charAt(0)}</div>
                                        <div>
                                            <h4>{usuario.nombre}</h4>
                                            <p>{usuario.email}</p>
                                            <span className="rol-tag">{usuario.rol}</span>
                                        </div>
                                    </div>
                                    <div className="item-actions">
                                        <button
                                            className="btn-icon permisos"
                                            title="Permisos"
                                            onClick={() =>
                                                setPermissionsModal({ open: true, preceptor: usuario })
                                            }
                                        >
                                            <Shield size={18} />
                                        </button>

                                        <button
                                            className="btn-icon edit"
                                            onClick={() => setEditModal({ open: true, usuario: { ...usuario } })}
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button className="btn-icon delete" onClick={() => setDeleteModal({ open: true, usuario })}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={editModal.open}
                onClose={() => setEditModal({ open: false, usuario: null })}
                title="Editar Usuario"
            >
                {editModal.usuario && (
                    <>
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={editModal.usuario.nombre}
                                onChange={(e) =>
                                    setEditModal({
                                        ...editModal,
                                        usuario: { ...editModal.usuario, nombre: e.target.value },
                                    })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={editModal.usuario.email}
                                onChange={(e) =>
                                    setEditModal({
                                        ...editModal,
                                        usuario: { ...editModal.usuario, email: e.target.value },
                                    })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Rol</label>
                            <select
                                value={editModal.usuario.rol}
                                onChange={(e) =>
                                    setEditModal({
                                        ...editModal,
                                        usuario: { ...editModal.usuario, rol: e.target.value },
                                    })
                                }
                            >
                                <option value="preceptor">Preceptor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setEditModal({ open: false, usuario: null })}>
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
                onClose={() => setDeleteModal({ open: false, usuario: null })}
                title="Eliminar Usuario"
            >
                <p>
                    ¿Estás seguro de eliminar a <strong>{deleteModal.usuario?.nombre}</strong>?
                </p>
                <p className="warning-text">Esta acción no se puede deshacer.</p>
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={() => setDeleteModal({ open: false, usuario: null })}>
                        Cancelar
                    </button>
                    <button className="btn-confirm btn-danger" onClick={handleDelete}>
                        Eliminar
                    </button>
                </div>
            </Modal>


            <Modal
                isOpen={permissionsModal.open}
                onClose={() =>
                    setPermissionsModal({ open: false, preceptor: null })
                }
                title="Gestión de Permisos"
            >
                <p>
                    Permisos para{" "}
                    <strong>{permissionsModal.preceptor?.nombre}</strong>
                </p>
                <div className="permissions-grid">

                    <label className="permission-item">
                        <span className="permission-text">Registrar asistencias</span>

                        <input
                            type="checkbox"
                            checked={permissions.asistenciaRegistrar}
                            onChange={(e) =>
                                setPermissions({
                                    ...permissions,
                                    asistenciaRegistrar: e.target.checked,
                                })
                            }
                        />
                        <span className="custom-checkbox"></span>
                    </label>

                    <label className="permission-item">
                        <span className="permission-text">Editar asistencias</span>

                        <input
                            type="checkbox"
                            checked={permissions.asistenciaEditar}
                            onChange={(e) =>
                                setPermissions({
                                    ...permissions,
                                    asistenciaEditar: e.target.checked,
                                })
                            }
                        />
                        <span className="custom-checkbox"></span>
                    </label>

                    <label className="permission-item">
                        <span className="permission-text">Ver historial</span>

                        <input
                            type="checkbox"
                            checked={permissions.verHistorial}
                            onChange={(e) =>
                                setPermissions({
                                    ...permissions,
                                    verHistorial: e.target.checked,
                                })
                            }
                        />
                        <span className="custom-checkbox"></span>
                    </label>

                    <div className="modal-actions">
                        <button
                            className="btn-cancel"
                            onClick={() =>
                                setPermissionsModal({ open: false, preceptor: null })
                            }
                        >
                            Cancelar
                        </button>

                        <button
                            className="btn-confirm"
                            onClick={() => {
                                console.log(
                                    "Permisos de",
                                    permissionsModal.preceptor?.nombre,
                                    permissions
                                )
                                setPermissionsModal({ open: false, preceptor: null })
                            }}
                        >
                            Guardar permisos
                        </button>
                    </div>

                </div>

            </Modal>

        </div>
    )
}
