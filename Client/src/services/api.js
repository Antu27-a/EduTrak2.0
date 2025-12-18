import axios from "axios"

const API_URL = "http://localhost:3000/api"

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ========== AUTENTICACIÓN ==========
const login = async (email, contraseña) => {
  const response = await apiClient.post("/IniciarSesion", { email, contraseña })
  return response.data
}

const register = async (email, password, name, role) => {
  const response = await apiClient.post("/RegistrarUsuario", {
    email,
    contraseña: password,
    nombre: name,
    rol: role,
  })
  return response.data
}

// ========== USUARIOS ==========
const getUsuarios = async () => {
  const response = await apiClient.get("/usuarios")
  return response.data
}

const getUsuarioPorId = async (id) => {
  const response = await apiClient.get(`/usuarios/${id}`)
  return response.data
}

const updateUsuario = async (id, data) => {
  const response = await apiClient.put(`/usuarios/${id}`, data)
  return response.data
}

const deleteUsuario = async (id) => {
  const response = await apiClient.delete(`/usuarios/${id}`)
  return response.data
}

// ========== ALUMNOS ==========
const getAlumnos = async () => {
  const response = await apiClient.get("/alumnos")
  return response.data
}

const getAlumnosPorCurso = async (id_curso) => {
  const response = await apiClient.get(`/alumnos/curso/${id_curso}`)
  return response.data
}

const registerStudent = async (nombre, apellido, email, id_curso) => {
  const response = await apiClient.post("/alumnos", {
    nombre,
    apellido,
    email,
    id_curso,
  })
  return response.data
}

const updateAlumno = async (id, data) => {
  const response = await apiClient.put(`/alumnos/${id}`, data)
  return response.data
}

const deleteAlumno = async (id) => {
  const response = await apiClient.delete(`/alumnos/${id}`)
  return response.data
}

// ========== CURSOS ==========
const getCursos = async () => {
  const response = await apiClient.get("/cursos")
  return response.data
}

const getCursoPorId = async (id) => {
  const response = await apiClient.get(`/cursos/${id}`)
  return response.data
}

const registerCourse = async (curso, turno) => {
  const response = await apiClient.post("/cursos", { curso, turno })
  return response.data
}

const updateCurso = async (id, data) => {
  const response = await apiClient.put(`/cursos/${id}`, data)
  return response.data
}

const deleteCurso = async (id) => {
  const response = await apiClient.delete(`/cursos/${id}`)
  return response.data
}

// ========== ASISTENCIAS ==========
const getAsistencias = async () => {
  const response = await apiClient.get("/asistencias")
  return response.data
}

const getAsistenciasPorCurso = async (id_curso) => {
  const response = await apiClient.get(`/asistencias/curso/${id_curso}`)
  return response.data
}

const getAsistenciasPorAlumno = async (id_alumno) => {
  const response = await apiClient.get(`/asistencias/alumno/${id_alumno}`)
  return response.data
}

const registerAttendance = async (fecha, estado, notificacion, id_usuario, id_alumno) => {
  const response = await apiClient.post("/asistencias", {
    fecha,
    estado,
    notificacion,
    id_usuario,
    id_alumno,
  })
  return response.data
}

const registerMultipleAttendances = async (asistencias, id_usuario) => {
  const response = await apiClient.post("/asistencias/multiples", {
    asistencias,
    id_usuario,
  })
  return response.data
}

const getEstadisticas = async () => {
  const response = await apiClient.get("/estadisticas")
  return response.data
}

export { API_URL, apiClient }

export default {
  // Autenticación
  login,
  register,
  // Usuarios
  getUsuarios,
  getUsuarioPorId,
  updateUsuario,
  deleteUsuario,
  // Alumnos
  getAlumnos,
  getAlumnosPorCurso,
  registerStudent,
  updateAlumno,
  deleteAlumno,
  // Cursos
  getCursos,
  getCursoPorId,
  registerCourse,
  updateCurso,
  deleteCurso,
  // Asistencias
  getAsistencias,
  getAsistenciasPorCurso,
  getAsistenciasPorAlumno,
  registerAttendance,
  registerMultipleAttendances,
  getEstadisticas,
  // URL
  API_URL,
}
