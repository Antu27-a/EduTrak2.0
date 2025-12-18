"use client"

import "../components/Css/ForgotPassword.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, KeyRound, ArrowLeft } from "lucide-react"
import api from "../services/api"

export default function ForgotPassword() {
  const [step, setStep] = useState(1) // 1: Solicitar código, 2: Verificar código, 3: Cambiar contraseña
  const [email, setEmail] = useState("")
  const [codigo, setCodigo] = useState("")
  const [nuevaContraseña, setNuevaContraseña] = useState("")
  const [confirmarContraseña, setConfirmarContraseña] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSolicitarCodigo = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      await api.solicitarRecuperacion(email)
      setSuccess("Código enviado a tu correo electrónico")
      setTimeout(() => {
        setStep(2)
        setSuccess("")
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.Error || "Error al enviar el código")
    } finally {
      setLoading(false)
    }
  }

  const handleVerificarCodigo = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      await api.verificarCodigo(email, codigo)
      setSuccess("Código verificado correctamente")
      setTimeout(() => {
        setStep(3)
        setSuccess("")
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.Error || "Código inválido o expirado")
    } finally {
      setLoading(false)
    }
  }

  const handleCambiarContraseña = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (nuevaContraseña !== confirmarContraseña) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (nuevaContraseña.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)

    try {
      await api.cambiarContraseña(email, codigo, nuevaContraseña)
      setSuccess("Contraseña cambiada correctamente")
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.Error || "Error al cambiar la contraseña")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card fade-in">
        <button className="btn-back-login" onClick={() => navigate("/login")}>
          <ArrowLeft size={20} />
          Volver al inicio de sesión
        </button>

        <div className="forgot-password-header">
          <div className="icon-wrapper">
            {step === 1 && <Mail size={48} />}
            {step === 2 && <KeyRound size={48} />}
            {step === 3 && <Lock size={48} />}
          </div>
          <h2>
            {step === 1 && "Recuperar Contraseña"}
            {step === 2 && "Verificar Código"}
            {step === 3 && "Nueva Contraseña"}
          </h2>
          <p className="subtitle">
            {step === 1 && "Ingresa tu correo electrónico para recibir un código de verificación"}
            {step === 2 && "Ingresa el código de 6 dígitos enviado a tu correo"}
            {step === 3 && "Ingresa tu nueva contraseña"}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSolicitarCodigo} className="forgot-password-form">
            <div className="form-group">
              <label>Correo electrónico</label>
              <div className="input-with-icon">
                <Mail size={20} />
                <input
                  type="email"
                  placeholder="ejemplo@colegio.edu.ar"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar Código"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerificarCodigo} className="forgot-password-form">
            <div className="form-group">
              <label>Código de verificación</label>
              <div className="input-with-icon">
                <KeyRound size={20} />
                <input
                  type="text"
                  placeholder="000000"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={loading}
                  maxLength={6}
                  className="codigo-input"
                  required
                />
              </div>
              <p className="helper-text">El código expira en 15 minutos</p>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Verificando..." : "Verificar Código"}
            </button>

            <button type="button" className="btn-resend" onClick={() => setStep(1)} disabled={loading}>
              Solicitar nuevo código
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleCambiarContraseña} className="forgot-password-form">
            <div className="form-group">
              <label>Nueva contraseña</label>
              <div className="input-with-icon">
                <Lock size={20} />
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={nuevaContraseña}
                  onChange={(e) => setNuevaContraseña(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirmar contraseña</label>
              <div className="input-with-icon">
                <Lock size={20} />
                <input
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={confirmarContraseña}
                  onChange={(e) => setConfirmarContraseña(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Cambiando..." : "Cambiar Contraseña"}
            </button>
          </form>
        )}

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="step-indicator">
          <div className={`step ${step >= 1 ? "active" : ""}`}>1</div>
          <div className="step-line" />
          <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
          <div className="step-line" />
          <div className={`step ${step >= 3 ? "active" : ""}`}>3</div>
        </div>
      </div>
    </div>
  )
}
