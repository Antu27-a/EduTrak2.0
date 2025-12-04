import { BookOpen, ClipboardList, Users, Calendar } from "lucide-react"
import { Link } from "react-router-dom"
import "../../components/Css/PreceptorHome.css"

export default function PreceptorHome() {
    const stats = [
        { label: "Cursos Asignados", value: 4, icon: BookOpen, color: "#ff8f00" },
        { label: "Total Alumnos", value: 120, icon: Users, color: "#07454e" },
        { label: "Asistencias Hoy", value: 98, icon: ClipboardList, color: "#558b2f" },
        { label: "Faltas Hoy", value: 22, icon: Calendar, color: "#b71c1c" },
    ]

    return (
        <div className="preceptor-home">
            <div className="page-header">
                <h1>Bienvenido, Preceptor</h1>
                <p>Panel de control de asistencias</p>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
                        <div className="stat-icon" style={{ background: stat.color }}>
                            <stat.icon size={24} color="white" />
                        </div>
                        <div className="stat-info">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="quick-actions">
                <h2>Acciones Rápidas</h2>
                <div className="actions-grid">
                    <Link to="/preceptor/cursos" className="action-card">
                        <BookOpen size={32} />
                        <span>Ver Mis Cursos</span>
                    </Link>
                    <Link to="/preceptor/asistencia" className="action-card">
                        <ClipboardList size={32} />
                        <span>Tomar Asistencia</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
