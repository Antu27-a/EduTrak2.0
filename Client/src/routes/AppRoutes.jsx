import { Routes, Route, Navigate } from "react-router-dom"
import AdminLayout from "../components/layout/AdminLayout"
import AdminDashboard from "../Pages/Admin/AdminDashboard"
import Usuarios from "../Pages/Admin/Usuarios"
import Alumnos from "../Pages/Admin/Alumnos"
import Cursos from "../Pages/Admin/Cursos"
import Configuracion from "../Pages/Admin/Configuracion"
import Login from "../Pages/Login"
import Landing from "../Pages/Landing"
import PreceptorLayout from "../components/layout/PreceptorLayout"
import CursosAsignados from "../Pages/Preceptor/Cursos_asignados"
import TomarAsistencia from "../Pages/Preceptor/Tomar_asistencia"
import Historial from "../Pages/Preceptor/Historial"
import PreceptorConfiguracion from "../Pages/Preceptor/Configuracion"
import ProtectedRoute from "../components/ProtectedRoute"

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="alumnos" element={<Alumnos />} />
        <Route path="cursos" element={<Cursos />} />
        <Route path="configuracion" element={<Configuracion />} />
      </Route>

      <Route
        path="/preceptor"
        element={
          <ProtectedRoute requiredRole="preceptor">
            <PreceptorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/preceptor/cursos" replace />} />
        <Route path="cursos" element={<CursosAsignados />} />
        <Route path="asistencia" element={<TomarAsistencia />} />
        <Route path="asistencia/:cursoId" element={<TomarAsistencia />} />
        <Route path="historial" element={<Historial />} />
        <Route path="historial/:cursoId" element={<Historial />} />
        <Route path="configuracion" element={<PreceptorConfiguracion />} />
      </Route>

      {/* Ruta 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
