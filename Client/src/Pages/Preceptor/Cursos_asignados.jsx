"use client"

import { useState, useEffect } from "react"
import { BookOpen, Users, Clock, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import SearchBar from "../../components/ui/SearchBar"
import "../../components/Css/CursosAsignados.css"
import api from "../../services/api"

export default function CursosAsignados() {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    cargarCursos()
  }, [])

  const cargarCursos = async () => {
    try {
      setLoading(true)
      const data = await api.getCursos()
      setCursos(data)
    } catch (error) {
      console.error("Error al cargar cursos:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCursos = cursos.filter(
    (curso) =>
      curso.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            <span className="summary-value">{cursos.length}</span>
            <span className="summary-label">Cursos Asignados</span>
          </div>
        </div>
        <div className="summary-card">
          <Users size={24} />
          <div>
            <span className="summary-value">{cursos.reduce((acc, c) => acc + (c.cantidadAlumnos || 0), 0)}</span>
            <span className="summary-label">Total Alumnos</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Cargando cursos...</p>
        </div>
      ) : (
        <div className="cursos-grid">
          {filteredCursos.map((curso) => (
            <div key={curso.id_curso} className="curso-card">
              <div className="curso-header">
                <div className="curso-avatar">
                  <BookOpen size={28} />
                </div>
                <div className="curso-title">
                  <h3>{curso.curso}</h3>
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
                <Link to={`/preceptor/asistencia/${curso.id_curso}`} className="btn-tomar-asistencia">
                  <span>Tomar Asistencia</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredCursos.length === 0 && !loading && (
        <div className="empty-state">
          <BookOpen size={48} />
          <p>No se encontraron cursos</p>
        </div>
      )}
    </div>
  )
}
