"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
          color: "#07454e",
        }}
      >
        Cargando...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.rol !== requiredRole) {
    // Redirigir al dashboard correcto según el rol del usuario
    const correctPath = user?.rol === "admin" ? "/admin/dashboard" : "/preceptor/cursos"
    return <Navigate to={correctPath} replace />
  }

  return children
}
