"use client"

import { useEffect, useState } from "react"
import api from "../../services/api"
import "../../components/Css/Sidebar.css"

import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js"

import ChartDataLabels from "chartjs-plugin-datalabels"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels)


export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    cursosActivos: 0,
    totalAlumnos: 0,
    asistenciasHoy: { porcentaje: 0 },
  })

  const [alumnosPorCurso, setAlumnosPorCurso] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const data = await api.getEstadisticas()

        const cursos = await api.getEstadisticasCursos()

        setStats(data)

        setAlumnosPorCurso(cursos)

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
  const generarColor = index => {
    const hue = (index * 360) / alumnosPorCurso.length
    return `hsl(${hue}, 65%, 55%)`
  }

  const oscurecerHSL = index => {
    const hue = (index * 360) / alumnosPorCurso.length
    return `hsl(${hue}, 65%, 35%)`
  }

  const chartData = {
    labels: alumnosPorCurso.map(item => item.curso),
    datasets: [
      {
        label: "Alumnos",
        data: alumnosPorCurso.map(item => Number(item.cantidad)),
        backgroundColor: alumnosPorCurso.map((_, i) => generarColor(i)),
        hoverBackgroundColor: alumnosPorCurso.map((_, i) => oscurecerHSL(i)),
        borderRadius: 12,
        maxBarThickness: 60,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#07454e",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 8,
      },
      datalabels: {
        color: "#07454e",
        anchor: "end",
        align: "end",
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: value => value,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#555",
          font: {
            size: 13,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
        ticks: {
          color: "#777",
          stepSize: 5,
        },
      },
    },
  }

  const exportarExcel = () => {
    const datos = alumnosPorCurso.map(item => ({
      Curso: item.curso,
      "Cantidad de alumnos": item.cantidad,
    }))

    const worksheet = XLSX.utils.json_to_sheet(datos)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, "Alumnos por curso")

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    })

    const blob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })

    saveAs(blob, "alumnos_por_curso.xlsx")
  }



  console.log("Alumnos por curso:", alumnosPorCurso)

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
        <div
          style={{
            marginTop: "40px",
            background: "white",
            padding: "28px",
            borderRadius: "16px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            width: "150%",
          }}
        >
          <button
            onClick={exportarExcel}
            style={{
              marginBottom: "16px",
              padding: "10px 18px",
              backgroundColor: "#07454e",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Exportar a Excel
          </button>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#07454e",
              marginBottom: "20px",
            }}
          >
            Alumnos por curso
          </h2>

          <div style={{ height: "340px" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "40px",
          background: "white",
          padding: "28px",
          borderRadius: "16px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
      >
        <button
          onClick={exportarExcel}
          style={{
            marginBottom: "16px",
            padding: "10px 18px",
            backgroundColor: "#07454e",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Exportar a Excel
        </button>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#07454e",
            marginBottom: "20px",
          }}
        >
          Alumnos por curso
        </h2>

        <div style={{ height: "340px" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

    </div>
  )
}
