"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Calendar, ArrowLeft, Filter, Check, X, AlertCircle, BookOpen } from "lucide-react"
import Table from "../../components/ui/Table"
import SearchBar from "../../components/ui/SearchBar"
import api from "../../services/api"
import "../../components/Css/Historial.css"

export default function Historial() {
  const { cursoId } = useParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroFecha, setFiltroFecha] = useState("")
  const [cursoInfo, setCursoInfo] = useState(null)
  const [historialData, setHistorialData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [cursoId])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [curso, asistencias] = await Promise.all([api.getCursoPorId(cursoId), api.getAsistenciasPorCurso(cursoId)])

      setCursoInfo(curso)
      setHistorialData(asistencias)
    } catch (error) {
      console.error("Error al cargar datos:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatearFechaLocal = (fechaISO) => {
    const fecha = new Date(fechaISO)
    const fechaLocal = new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000)
    return fechaLocal.toLocaleDateString("es-AR")
  }

  const getFechaLocal = (fechaISO) => {
    const fecha = new Date(fechaISO)
    const fechaLocal = new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000)
    const year = fechaLocal.getFullYear()
    const month = String(fechaLocal.getMonth() + 1).padStart(2, "0")
    const day = String(fechaLocal.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const filteredHistorial = historialData.filter((item) => {
    const nombreCompleto = `${item.nombre} ${item.apellido}`.toLowerCase()
    const matchSearch = nombreCompleto.includes(searchTerm.toLowerCase())
    const matchFecha = filtroFecha ? getFechaLocal(item.fecha) === filtroFecha : true
    return matchSearch && matchFecha
  })

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "presente":
      case "Presente":
        return <Check size={16} />
      case "ausente":
      case "Ausente":
        return <X size={16} />
      case "justificado":
      case "Justificado":
        return <AlertCircle size={16} />
      default:
        return null
    }
  }

  const columns = ["Fecha", "Alumno", "Estado", "Email"]

  const renderRow = (item, index) => (
    <tr key={`${item.id_asistencia}-${index}`}>
      <td>
        <div className="fecha-cell">
          <Calendar size={16} />
          <span>{formatearFechaLocal(item.fecha)}</span>
        </div>
      </td>
      <td>{`${item.apellido}, ${item.nombre}`}</td>
      <td>
        <span className={`estado-tag ${item.estado.toLowerCase()}`}>
          {getEstadoIcon(item.estado)}
          <span>{item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}</span>
        </span>
      </td>
      <td className="email-cell">{item.email}</td>
    </tr>
  )

  const stats = {
    presentes: filteredHistorial.filter((h) => h.estado.toLowerCase() === "presente").length,
    ausentes: filteredHistorial.filter((h) => h.estado.toLowerCase() === "ausente").length,
    justificados: filteredHistorial.filter((h) => h.estado.toLowerCase() === "justificado").length,
  }

  if (loading) {
    return (
      <div className="historial-page">
        <div className="page-header">
          <h1>Cargando...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="historial-page">
      <div className="page-header">
        <div className="header-left">
          <Link to={`/preceptor/asistencia/${cursoId}`} className="btn-back">
            <ArrowLeft size={20} />
          </Link>
          <div className="header-info">
            <h1>Historial de Asistencia</h1>
            {cursoInfo && (
              <div className="curso-badge">
                <BookOpen size={18} />
                <span>{cursoInfo.curso}</span>
                <span className="turno-badge">Turno {cursoInfo.turno}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card presentes">
          <Check size={24} />
          <div>
            <span className="stat-value">{stats.presentes}</span>
            <span className="stat-label">Presentes{filtroFecha ? " (día seleccionado)" : ""}</span>
          </div>
        </div>
        <div className="stat-card ausentes">
          <X size={24} />
          <div>
            <span className="stat-value">{stats.ausentes}</span>
            <span className="stat-label">Ausentes{filtroFecha ? " (día seleccionado)" : ""}</span>
          </div>
        </div>
        <div className="stat-card justificados">
          <AlertCircle size={24} />
          <div>
            <span className="stat-value">{stats.justificados}</span>
            <span className="stat-label">Justificados{filtroFecha ? " (día seleccionado)" : ""}</span>
          </div>
        </div>
      </div>

      <div className="filters-row">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar alumno..." />
        <div className="date-filter">
          <Filter size={18} />
          <input type="date" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
          {filtroFecha && (
            <button className="clear-filter" onClick={() => setFiltroFecha("")} title="Limpiar filtro">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="table-section">
        <Table columns={columns} data={filteredHistorial} renderRow={renderRow} />
      </div>
    </div>
  )
}
