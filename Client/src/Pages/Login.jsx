"use client"

import "../components/Css/Login.css"
import loginImg from "../assets/img/login-illustration.png"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../Context/AuthContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [contraseña, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login, isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user?.rol) {
      const redirectPath = user.rol === "admin" ? "/admin/dashboard" : "/preceptor/cursos"
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      console.log("Enviando solicitud de login para:", email)
      const response = await api.login(email, contraseña)
      console.log(" Response recibida:", response)

      if (response.token && response.usuario && response.usuario.rol) {
        console.log(" Login exitoso, guardando datos...")
        login(response.token, response.usuario)
        setSuccess("Inicio de sesión exitoso! Redirigiendo...")
      } else {
        console.log("Response incompleta:", response)
        setError("Respuesta del servidor incompleta. Contacta al administrador.")
        setLoading(false)
      }
    } catch (err) {
      console.log(" Error en login:", err)
      const errorMsg = err.response?.data?.Error || "Error al iniciar sesión. Verifica tus credenciales."
      setError(errorMsg)
      setLoading(false)
    }
  }

  return (
    <div className="login-container fade-down">
      <div className="login-card">
        <div className="login-image-section">
          <img src={loginImg || "/placeholder.svg"} alt="Educación" />
        </div>

        <div className="login-form">
          <h2>Ingreso al Sistema</h2>

          <form onSubmit={handleLogin}>
            <label>Correo institucional</label>
            <input
              type="email"
              placeholder="ejemplo@colegio.edu.ar"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={contraseña}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />

            <button type="submit" className="btn-login2" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <p className="forgot-password" onClick={() => navigate("/forgot-password")}>
            ¿Olvidaste tu contraseña?
          </p>
        </div>
      </div>
    </div>
  )
}
