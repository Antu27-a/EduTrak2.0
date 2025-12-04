"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Users, Calendar, Mail, Check, X, AlertCircle, History, Send, BookOpen } from "lucide-react"
import Table from "../../components/ui/Table"
import Button from "../../components/ui/Button"
import Alert from "../../components/ui/Alert"
import Modal from "../../components/ui/Modal"
import "../../components/Css/TomarAsistencia.css"

export default function TomarAsistencia() {
    const { cursoId } = useParams()
    const [alert, setAlert] = useState({ isVisible: false, message: "", type: "success" })
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedAlumno, setSelectedAlumno] = useState(null)
    const [cursoInfo, setCursoInfo] = useState(null)

    const cursosDB = {
        1: { id: 1, curso: "2°", division: "2", turno: "Mañana", cantidadAlumnos: 5 },
        2: { id: 2, curso: "3°", division: "8", turno: "Tarde", cantidadAlumnos: 6 },
        3: { id: 3, curso: "4°", division: "1", turno: "Mañana", cantidadAlumnos: 4 },
        4: { id: 4, curso: "5°", division: "3", turno: "Tarde", cantidadAlumnos: 5 },
    }

    const alumnosPorCurso = {
        1: [
            { id: 1, nombre: "Juan", apellido: "García", email: "juan.garcia@gmail.com", estado: null, faltas: 2 },
            { id: 2, nombre: "María", apellido: "López", email: "maria.lopez@gmail.com", estado: null, faltas: 5 },
            { id: 3, nombre: "Carlos", apellido: "Martínez", email: "carlos.martinez@gmail.com", estado: null, faltas: 1 },
            { id: 4, nombre: "Ana", apellido: "Rodríguez", email: "ana.rodriguez@gmail.com", estado: null, faltas: 8 },
            { id: 5, nombre: "Pedro", apellido: "Fernández", email: "pedro.fernandez@gmail.com", estado: null, faltas: 3 },
        ],
        2: [
            { id: 1, nombre: "Lucía", apellido: "Gómez", email: "lucia.gomez@gmail.com", estado: null, faltas: 1 },
            { id: 2, nombre: "Diego", apellido: "Sánchez", email: "diego.sanchez@gmail.com", estado: null, faltas: 4 },
            { id: 3, nombre: "Sofía", apellido: "Díaz", email: "sofia.diaz@gmail.com", estado: null, faltas: 0 },
            { id: 4, nombre: "Mateo", apellido: "Torres", email: "mateo.torres@gmail.com", estado: null, faltas: 6 },
            { id: 5, nombre: "Valentina", apellido: "Ruiz", email: "valentina.ruiz@gmail.com", estado: null, faltas: 2 },
            { id: 6, nombre: "Tomás", apellido: "Flores", email: "tomas.flores@gmail.com", estado: null, faltas: 3 },
        ],
        3: [
            { id: 1, nombre: "Martín", apellido: "Herrera", email: "martin.herrera@gmail.com", estado: null, faltas: 0 },
            { id: 2, nombre: "Camila", apellido: "Castro", email: "camila.castro@gmail.com", estado: null, faltas: 2 },
            { id: 3, nombre: "Nicolás", apellido: "Moreno", email: "nicolas.moreno@gmail.com", estado: null, faltas: 7 },
            { id: 4, nombre: "Isabella", apellido: "Vargas", email: "isabella.vargas@gmail.com", estado: null, faltas: 1 },
        ],
        4: [
            { id: 1, nombre: "Benjamín", apellido: "Mendoza", email: "benjamin.mendoza@gmail.com", estado: null, faltas: 3 },
            { id: 2, nombre: "Emma", apellido: "Rojas", email: "emma.rojas@gmail.com", estado: null, faltas: 0 },
            { id: 3, nombre: "Joaquín", apellido: "Silva", email: "joaquin.silva@gmail.com", estado: null, faltas: 5 },
            { id: 4, nombre: "Mía", apellido: "Ortiz", email: "mia.ortiz@gmail.com", estado: null, faltas: 2 },
            { id: 5, nombre: "Santiago", apellido: "Reyes", email: "santiago.reyes@gmail.com", estado: null, faltas: 4 },
        ],
    }

    const [alumnos, setAlumnos] = useState([])

    useEffect(() => {
        const id = Number.parseInt(cursoId) || 1
        setCursoInfo(cursosDB[id] || cursosDB[1])
        setAlumnos(alumnosPorCurso[id] || alumnosPorCurso[1])
    }, [cursoId])

    const fechaHoy = new Date().toLocaleDateString("es-AR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    const handleEstadoChange = (alumnoId, nuevoEstado) => {
        setAlumnos((prev) =>
            prev.map((alumno) => {
                if (alumno.id === alumnoId) {
                    const sumarFalta = nuevoEstado === "ausente" && alumno.estado !== "ausente"
                    return {
                        ...alumno,
                        estado: nuevoEstado,
                        faltas: sumarFalta ? alumno.faltas + 1 : alumno.faltas,
                    }
                }
                return alumno
            }),
        )
    }

    const handleEnviarNotificacion = (alumno) => {
        setSelectedAlumno(alumno)
        setModalOpen(true)
    }

    const confirmarEnvioNotificacion = () => {
        setModalOpen(false)
        setAlert({
            isVisible: true,
            message: `Notificación enviada a ${selectedAlumno.email}`,
            type: "success",
        })
    }

    const guardarAsistencia = () => {
        const sinMarcar = alumnos.filter((a) => a.estado === null).length
        if (sinMarcar > 0) {
            setAlert({
                isVisible: true,
                message: `Hay ${sinMarcar} alumno(s) sin marcar asistencia`,
                type: "warning",
            })
            return
        }
        setAlert({
            isVisible: true,
            message: "Asistencia guardada correctamente",
            type: "success",
        })
    }

    const columns = ["Alumno", "Fecha", "Estado", "Email", "Faltas", "Notificar"]

    const renderRow = (alumno, index) => (
        <tr key={alumno.id}>
            <td>
                <div className="alumno-info">
                    <div className="alumno-avatar">
                        {alumno.apellido.charAt(0)}
                        {alumno.nombre.charAt(0)}
                    </div>
                    <span>
                        {alumno.apellido}, {alumno.nombre}
                    </span>
                </div>
            </td>
            <td>
                <div className="fecha-cell">
                    <Calendar size={16} />
                    <span>{new Date().toLocaleDateString("es-AR")}</span>
                </div>
            </td>
            <td>
                <div className="estado-buttons">
                    <button
                        className={`estado-btn presente ${alumno.estado === "presente" ? "active" : ""}`}
                        onClick={() => handleEstadoChange(alumno.id, "presente")}
                        title="Presente"
                    >
                        <Check size={16} />
                    </button>
                    <button
                        className={`estado-btn ausente ${alumno.estado === "ausente" ? "active" : ""}`}
                        onClick={() => handleEstadoChange(alumno.id, "ausente")}
                        title="Ausente"
                    >
                        <X size={16} />
                    </button>
                    <button
                        className={`estado-btn justificado ${alumno.estado === "justificado" ? "active" : ""}`}
                        onClick={() => handleEstadoChange(alumno.id, "justificado")}
                        title="Justificado"
                    >
                        <AlertCircle size={16} />
                    </button>
                </div>
            </td>
            <td>
                <div className="email-cell">
                    <Mail size={16} />
                    <span>{alumno.email}</span>
                </div>
            </td>
            <td>
                <span className={`faltas-badge ${alumno.faltas >= 5 ? "critical" : alumno.faltas >= 3 ? "warning" : ""}`}>
                    {alumno.faltas} faltas
                </span>
            </td>
            <td>
                {alumno.faltas >= 3 && (
                    <button
                        className="btn-notificar"
                        onClick={() => handleEnviarNotificacion(alumno)}
                        title="Enviar notificación por faltas"
                    >
                        <Send size={16} />
                    </button>
                )}
            </td>
        </tr>
    )

    if (!cursoInfo) {
        return <div className="tomar-asistencia-page">Cargando...</div>
    }

    return (
        <div className="tomar-asistencia-page">
            <Alert
                message={alert.message}
                type={alert.type}
                isVisible={alert.isVisible}
                onClose={() => setAlert({ ...alert, isVisible: false })}
            />

            <div className="page-header">
                <div className="header-info">
                    <h1>Tomar Asistencia</h1>
                    <div className="curso-badge">
                        <BookOpen size={20} />
                        <span>
                            {cursoInfo.curso}
                            {cursoInfo.division}
                        </span>
                        <span className="turno-badge">Turno {cursoInfo.turno}</span>
                        <span className="alumnos-badge">
                            <Users size={16} />
                            {alumnos.length} alumnos
                        </span>
                    </div>
                </div>
                <div className="header-actions">
                    <Link to={`/preceptor/historial/${cursoId || 1}`} className="btn-historial">
                        <History size={20} />
                        <span>Ver Historial</span>
                    </Link>
                </div>
            </div>

            <div className="fecha-banner">
                <Calendar size={20} />
                <span>{fechaHoy}</span>
            </div>

            <div className="table-section">
                <Table columns={columns} data={alumnos} renderRow={renderRow} />
            </div>

            <div className="actions-footer">
                <div className="resumen">
                    <span className="resumen-item presentes">
                        <Check size={16} />
                        {alumnos.filter((a) => a.estado === "presente").length} Presentes
                    </span>
                    <span className="resumen-item ausentes">
                        <X size={16} />
                        {alumnos.filter((a) => a.estado === "ausente").length} Ausentes
                    </span>
                    <span className="resumen-item justificados">
                        <AlertCircle size={16} />
                        {alumnos.filter((a) => a.estado === "justificado").length} Justificados
                    </span>
                </div>
                <Button variant="success" icon={Check} onClick={guardarAsistencia}>
                    Guardar Asistencia
                </Button>
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Enviar Notificación">
                {selectedAlumno && (
                    <div className="modal-notification">
                        <p>¿Desea enviar una notificación de faltas a:</p>
                        <div className="alumno-detail">
                            <strong>
                                {selectedAlumno.apellido}, {selectedAlumno.nombre}
                            </strong>
                            <span>{selectedAlumno.email}</span>
                            <span className="faltas-info">Acumuladas: {selectedAlumno.faltas} faltas</span>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setModalOpen(false)}>
                                Cancelar
                            </button>
                            <button className="btn-confirm" onClick={confirmarEnvioNotificacion}>
                                <Send size={16} />
                                Enviar Notificación
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
