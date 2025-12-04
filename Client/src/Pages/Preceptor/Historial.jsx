import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Calendar, ArrowLeft, Filter, Check, X, AlertCircle, Download, BookOpen } from "lucide-react"
import Table from "../../components/ui/Table"
import SearchBar from "../../components/ui/SearchBar"
import "../../components/Css/Historial.css"

export default function Historial() {
    const { cursoId } = useParams()
    const [searchTerm, setSearchTerm] = useState("")
    const [filtroFecha, setFiltroFecha] = useState("")

    const cursoInfo = {
        id: cursoId || 1,
        curso: "2°",
        division: "2",
        turno: "Mañana",
        cantidadAlumnos: 5,
    }

    const historialData = [
        { id: 1, fecha: "2024-01-15", alumno: "García, Juan", estado: "presente", email: "juan.garcia@gmail.com" },
        { id: 2, fecha: "2024-01-15", alumno: "López, María", estado: "ausente", email: "maria.lopez@gmail.com" },
        { id: 3, fecha: "2024-01-15", alumno: "Martínez, Carlos", estado: "presente", email: "carlos.martinez@gmail.com" },
        { id: 4, fecha: "2024-01-14", alumno: "García, Juan", estado: "presente", email: "juan.garcia@gmail.com" },
        { id: 5, fecha: "2024-01-14", alumno: "López, María", estado: "justificado", email: "maria.lopez@gmail.com" },
        { id: 6, fecha: "2024-01-14", alumno: "Rodríguez, Ana", estado: "ausente", email: "ana.rodriguez@gmail.com" },
        { id: 7, fecha: "2024-01-13", alumno: "Fernández, Pedro", estado: "presente", email: "pedro.fernandez@gmail.com" },
        { id: 8, fecha: "2024-01-13", alumno: "García, Juan", estado: "ausente", email: "juan.garcia@gmail.com" },
    ]

    const filteredHistorial = historialData.filter((item) => {
        const matchSearch = item.alumno.toLowerCase().includes(searchTerm.toLowerCase())
        const matchFecha = filtroFecha ? item.fecha === filtroFecha : true
        return matchSearch && matchFecha
    })

    const getEstadoIcon = (estado) => {
        switch (estado) {
            case "presente":
                return <Check size={16} />
            case "ausente":
                return <X size={16} />
            case "justificado":
                return <AlertCircle size={16} />
            default:
                return null
        }
    }

    const columns = ["Fecha", "Alumno", "Estado", "Email"]

    const renderRow = (item, index) => (
        <tr key={item.id}>
            <td>
                <div className="fecha-cell">
                    <Calendar size={16} />
                    <span>{new Date(item.fecha).toLocaleDateString("es-AR")}</span>
                </div>
            </td>
            <td>{item.alumno}</td>
            <td>
                <span className={`estado-tag ${item.estado}`}>
                    {getEstadoIcon(item.estado)}
                    <span>{item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}</span>
                </span>
            </td>
            <td className="email-cell">{item.email}</td>
        </tr>
    )

    // Estadísticas
    const stats = {
        presentes: historialData.filter((h) => h.estado === "presente").length,
        ausentes: historialData.filter((h) => h.estado === "ausente").length,
        justificados: historialData.filter((h) => h.estado === "justificado").length,
    }

    return (
        <div className="historial-page">
            <div className="page-header">
                <div className="header-left">
                    <Link to={`/preceptor/asistencia/${cursoId || 1}`} className="btn-back">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="header-info">
                        <h1>Historial de Asistencia</h1>
                        <div className="curso-badge">
                            <BookOpen size={18} />
                            <span>
                                {cursoInfo.curso}
                                {cursoInfo.division}
                            </span>
                            <span className="turno-badge">Turno {cursoInfo.turno}</span>
                        </div>
                    </div>
                </div>
                {/* <button className="btn-export">
                    <Download size={18} />
                    <span>Exportar</span>
                </button> */}
            </div>

            <div className="stats-row">
                <div className="stat-card presentes">
                    <Check size={24} />
                    <div>
                        <span className="stat-value">{stats.presentes}</span>
                        <span className="stat-label">Presentes</span>
                    </div>
                </div>
                <div className="stat-card ausentes">
                    <X size={24} />
                    <div>
                        <span className="stat-value">{stats.ausentes}</span>
                        <span className="stat-label">Ausentes</span>
                    </div>
                </div>
                <div className="stat-card justificados">
                    <AlertCircle size={24} />
                    <div>
                        <span className="stat-value">{stats.justificados}</span>
                        <span className="stat-label">Justificados</span>
                    </div>
                </div>
            </div>

            <div className="filters-row">
                <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar alumno..." />
                <div className="date-filter">
                    <Filter size={18} />
                    <input type="date" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
                </div>
            </div>

            <div className="table-section">
                <Table columns={columns} data={filteredHistorial} renderRow={renderRow} />
            </div>
        </div>
    )
}
