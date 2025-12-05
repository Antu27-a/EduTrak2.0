import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, Users, BookOpen, GraduationCap, Settings, LogOut, Menu, X, AlertTriangle } from "lucide-react"
import Modal from "../ui/Modal"
import "../Css/Sidebar.css"


export default function Sidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [logoutModalOpen, setLogoutModalOpen] = useState(false)

    const menuItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/admin/usuarios", label: "Usuarios", icon: Users },
        { path: "/admin/cursos", label: "Cursos", icon: BookOpen },
        { path: "/admin/alumnos", label: "Alumnos", icon: GraduationCap },
        { path: "/admin/configuracion", label: "Configuración", icon: Settings },
    ]

    const isActive = (path) => location.pathname === path

    const handleNavClick = () => {
        setMobileMenuOpen(false)
    }

    const handleLogout = () => {
        navigate("/login")
    }


    const handleLogoutConfirm = () => {
        setLogoutModalOpen(false)
        navigate("/login")
    }

    return (
        <>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {mobileMenuOpen && <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />}

            <aside className={`sidebar ${mobileMenuOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <img src=".s/assets/img/EDU-TRAK-LOGO.png" alt="EduTrak Logo" className="logo-img" />
                        <div className="logo-text">
                            <h2>EduTrak</h2>
                            <span>Panel Admin</span>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                            onClick={handleNavClick}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={() => setLogoutModalOpen(true)}>
                        <LogOut size={20} />
                        <span>Cerrar Sesión</span>
                    </button>

                </div>

                <Modal isOpen={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} title="Confirmar Cierre de Sesión">
                    <div className="logout-modal-content">
                        <div className="logout-icon">
                            <AlertTriangle size={48} />
                        </div>
                        <p>¿Estás seguro que deseas cerrar sesión?</p>
                        <div className="logout-modal-actions">
                            <button className="btn-cancel" onClick={() => setLogoutModalOpen(false)}>
                                Cancelar
                            </button>
                            <button className="btn-logout-confirm" onClick={handleLogoutConfirm}>
                                <LogOut size={16} />
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </Modal>
            </aside>
        </>
    )
}
