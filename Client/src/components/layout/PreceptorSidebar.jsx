"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { BookOpen, ClipboardList, Settings, LogOut, GraduationCap, AlertTriangle, Menu, X } from "lucide-react"
import Modal from "../ui/Modal"
import { useAuth } from "../../Context/AuthContext"
import "../Css/Sidebar.css"

export default function PreceptorSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    { path: "/preceptor/cursos", label: "Cursos", icon: BookOpen },
    { path: "/preceptor/asistencia", label: "Tomar Asistencia", icon: ClipboardList },
    { path: "/preceptor/configuracion", label: "Configuración", icon: Settings },
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/")

  const handleLogoutConfirm = () => {
    setLogoutModalOpen(false)
    logout()
    navigate("/login", { replace: true })
  }

  const handleNavClick = () => {
    setMobileMenuOpen(false)
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
            <GraduationCap size={32} style={{ color: "#07454e" }} />
            <div className="logo-text">
              <h2>EduTrak</h2>
              <span>Preceptor</span>
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
          {user && <p className="user-name">{user.nombre || user.email}</p>}
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
