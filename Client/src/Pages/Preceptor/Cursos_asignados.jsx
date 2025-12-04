import { useState } from "react"
import { BookOpen, Users, Clock, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import SearchBar from "../../components/ui/SearchBar"
import "../../components/Css/CursosAsignados.css"

export default function CursosAsignados() {
    const [searchTerm, setSearchTerm] = useState("")

    const cursosAsignados = [
        { id: 1, curso: "2°", division: "2", turno: "Mañana", cantidadAlumnos: 28 },
        { id: 2, curso: "3°", division: "8", turno: "Tarde", cantidadAlumnos: 32 },
        { id: 3, curso: "4°", division: "1", turno: "Mañana", cantidadAlumnos: 25 },
        { id: 4, curso: "5°", division: "3", turno: "Tarde", cantidadAlumnos: 30 },
    ]

    const filteredCursos = cursosAsignados.filter(
        (curso) =>
            `${curso.curso}${curso.division}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            curso.turno.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="cursos-asignados-page">
            <div className="page-header">
                <div>
                    <h1>Mis Cursos Asignados</h1>
                    <p>Gestiona la asistencia de tus cursos</p>
                </div>
                <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar curso..." />
            </div>

            <div className="cursos-summary">
                <div className="summary-card">
                    <BookOpen size={24} />
                    <div>
                        <span className="summary-value">{cursosAsignados.length}</span>
                        <span className="summary-label">Cursos Asignados</span>
                    </div>
                </div>
                <div className="summary-card">
                    <Users size={24} />
                    <div>
                        <span className="summary-value">{cursosAsignados.reduce((acc, c) => acc + c.cantidadAlumnos, 0)}</span>
                        <span className="summary-label">Total Alumnos</span>
                    </div>
                </div>
            </div>

            <div className="cursos-grid">
                {filteredCursos.map((curso) => (
                    <div key={curso.id} className="curso-card">
                        <div className="curso-header">
                            <div className="curso-avatar">
                                <BookOpen size={28} />
                            </div>
                            <div className="curso-title">
                                <h3>
                                    {curso.curso}
                                    {curso.division}
                                </h3>
                                <div className="curso-turno">
                                    <Clock size={14} />
                                    <span>Turno {curso.turno}</span>
                                </div>
                            </div>
                        </div>

                        <div className="curso-body">
                            <div className="curso-stat">
                                <Users size={18} />
                                <span>{curso.cantidadAlumnos} Alumnos</span>
                            </div>
                        </div>

                        <div className="curso-actions">
                            <Link to={`/preceptor/asistencia/${curso.id}`} className="btn-tomar-asistencia">
                                <span>Tomar Asistencia</span>
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCursos.length === 0 && (
                <div className="empty-state">
                    <BookOpen size={48} />
                    <p>No se encontraron cursos</p>
                </div>
            )}
        </div>
    )
}
