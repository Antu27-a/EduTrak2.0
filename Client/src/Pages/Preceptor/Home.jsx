"use client"

import { useEffect, useState } from "react"
import { BookOpen, ClipboardList, Users, Calendar } from "lucide-react"
import { Link } from "react-router-dom"
import "../../components/Css/PreceptorHome.css"
import api from "../../services/api"

export default function PreceptorHome() {
  const [stats, setStats] = useState({
    cursosAsignados: 0,
    totalAlumnos: 0,
    asistenciasHoy: 0,
    faltasHoy: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarEstadisticas()
  }, [])

  const cargarEstadisticas = async () => {
    try {
      setLoading(true)
      const [cursosData, estadisticas] = await Promise.all([api.getCursos(), api.getEstadisticas()])

      setStats({
        cursosAsignados: cursosData.length,
        totalAlumnos: estadisticas.totalAlumnos,
        asistenciasHoy: estadisticas.asistenciasHoy.presentes,
        faltasHoy: estadisticas.asistenciasHoy.ausentes,
      })
    } catch (error) {
      console.error("Error al cargar estadísticas:", error)
    } finally {
      setLoading(false)
    }
  }

  const statsDisplay = [
    { label: "Cursos Asignados", value: stats.cursosAsignados, icon: BookOpen, color: "#ff8f00" },
    { label: "Total Alumnos", value: stats.totalAlumnos, icon: Users, color: "#07454e" },
    { label: "Asistencias Hoy", value: stats.asistenciasHoy, icon: ClipboardList, color: "#558b2f" },
    { label: "Faltas Hoy", value: stats.faltasHoy, icon: Calendar, color: "#b71c1c" },
  ]

  if (loading) {
    return (
      <div className="preceptor-home">
        <div className="page-header">
          <h1>Cargando...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="preceptor-home">
      <div className="page-header">
        <h1>Bienvenido, Preceptor</h1>
        <p>Panel de control de asistencias</p>
      </div>

      <div className="stats-grid">
        {statsDisplay.map((stat, index) => (
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
          <Link to="/preceptor/cursos" className="action-card">
            <ClipboardList size={32} />
            <span>Tomar Asistencia</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
