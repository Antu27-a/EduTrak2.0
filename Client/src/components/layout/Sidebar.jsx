import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Users, BookOpen, GraduationCap, Settings, LogOut } from "lucide-react"
import "../Css/Sidebar.css"

export default function Sidebar() {
    const location = useLocation()

    const menuItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/admin/usuarios", label: "Usuarios", icon: Users },
        { path: "/admin/cursos", label: "Cursos", icon: BookOpen },
        { path: "/admin/alumnos", label: "Alumnos", icon: GraduationCap },
        { path: "/admin/configuracion", label: "Configuración", icon: Settings },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <aside className="sidebar">
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
                    <Link key={item.path} to={item.path} className={`nav-link ${isActive(item.path) ? "active" : ""}`}>
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn">
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    )
}
