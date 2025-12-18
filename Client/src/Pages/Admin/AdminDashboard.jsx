"use client"

import { useEffect, useState } from "react"
import api from "../../services/api"
import "../../components/Css/Sidebar.css"

import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)


export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    cursosActivos: 0,
    totalAlumnos: 0,
    asistenciasHoy: { porcentaje: 0 },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const data = await api.getEstadisticas()
        setStats(data)
      } catch (error) {
        console.error("Error al cargar estadísticas:", error)
      } finally {
        setLoading(false)
      }
    }
    cargarEstadisticas()
  }, [])

  if (loading) {
    return (
      <div className="admin-dashboard">
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#07454e" }}>Cargando...</h1>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#07454e", marginBottom: "8px" }}>Dashboard</h1>
      <p style={{ color: "#666", marginBottom: "32px", fontSize: "19px" }}>Bienvenido al panel de administración</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {[
          { title: "Total Usuarios", value: stats.totalUsuarios, color: "#07454e" },
          { title: "Cursos Activos", value: stats.cursosActivos, color: "#438791" },
          { title: "Alumnos", value: stats.totalAlumnos, color: "#00796b" },
          { title: "Asistencia Hoy", value: `${stats.asistenciasHoy.porcentaje}%`, color: "#558b2f" },
        ].map((card, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderLeft: `4px solid ${card.color}`,
            }}
          >
            <p style={{ color: "#666", fontSize: "17px", marginBottom: "8px" }}>{card.title}</p>
            <p style={{ fontSize: "32px", fontWeight: "700", color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
