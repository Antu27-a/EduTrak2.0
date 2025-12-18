"use client"

import { useState, useEffect, useContext } from "react"
import { User, Lock, Save, Mail } from "lucide-react"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Alert from "../../components/ui/Alert"
import { AuthContext } from "../../Context/AuthContext"
import api from "../../services/api"
import "../../components/Css/Configuracion.css"

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState("perfil")
  const { user } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
  })
  const [passwordData, setPasswordData] = useState({
    passwordNueva: "",
    passwordConfirm: "",
  })
  const [alert, setAlert] = useState({ isVisible: false, message: "", type: "success" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      if (user?.id_user) {
        const userData = await api.getUsuarioPorId(user.id_user)
        setFormData({
          nombre: userData.nombre || "",
          email: userData.email || "",
        })
      }
    } catch (error) {
      console.error("Error al cargar datos:", error)
      showAlert("Error al cargar datos del usuario", "error")
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: "perfil", label: "Perfil", icon: User },
    { id: "seguridad", label: "Seguridad", icon: Lock },
  ]

  const showAlert = (message, type = "success") => {
    setAlert({ isVisible: true, message, type })
    setTimeout(() => setAlert({ isVisible: false, message: "", type: "success" }), 3000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitPerfil = async (e) => {
    e.preventDefault()

    if (!formData.nombre.trim()) {
      showAlert("El nombre es obligatorio", "error")
      return
    }

    if (!formData.email.trim()) {
      showAlert("El email es obligatorio", "error")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      showAlert("El email no es válido", "error")
      return
    }

    try {
      await api.updateUsuario(user.id_user, {
        nombre: formData.nombre,
        email: formData.email,
      })
      showAlert("Perfil actualizado correctamente", "success")
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      showAlert(error.response?.data?.Error || "Error al actualizar perfil", "error")
    }
  }

  const handleSubmitPassword = async (e) => {
    e.preventDefault()

    if (!passwordData.passwordNueva || !passwordData.passwordConfirm) {
      showAlert("Por favor completa todos los campos", "error")
      return
    }

    if (passwordData.passwordNueva !== passwordData.passwordConfirm) {
      showAlert("Las contraseñas no coinciden", "error")
      return
    }

    if (passwordData.passwordNueva.length < 6) {
      showAlert("La contraseña debe tener al menos 6 caracteres", "error")
      return
    }

    try {
      await api.updateUsuario(user.id_user, {
        contraseña: passwordData.passwordNueva,
      })
      showAlert("Contraseña actualizada correctamente", "success")
      setPasswordData({
        passwordNueva: "",
        passwordConfirm: "",
      })
    } catch (error) {
      console.error("Error al actualizar contraseña:", error)
      showAlert(error.response?.data?.Error || "Error al actualizar contraseña", "error")
    }
  }

  if (loading) {
    return (
      <div className="configuracion-page">
        <div className="page-header">
          <div className="loading-container">
            <div className="spinner"></div>
            <h2>Cargando configuración...</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="configuracion-page">
      <Alert
        message={alert.message}
        type={alert.type}
        isVisible={alert.isVisible}
        onClose={() => setAlert({ ...alert, isVisible: false })}
      />

      <div className="page-header">
        <h1>Configuración</h1>
        <p>Administra tu cuenta y preferencias</p>
      </div>

      <div className="config-container">
        <div className="config-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`config-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="config-content">
          {activeTab === "perfil" && (
            <form onSubmit={handleSubmitPerfil} className="config-form">
              <h2>Información Personal</h2>
              <p className="form-description">Actualiza tus datos personales</p>

              <div className="user-info-display">
                <div className="user-avatar">
                  <User size={48} />
                </div>
                <div className="user-details">
                  <h3>{formData.nombre || "Usuario"}</h3>
                  <p className="user-role">
                    <Mail size={16} />
                    {formData.email}
                  </p>
                </div>
              </div>

              <div className="form-grid">
                <Input
                  label="Nombre Completo"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ingresa tu nombre completo"
                  required
                />
                <Input
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <Button type="submit" variant="primary">
                <Save size={16} />
                Guardar Cambios
              </Button>
            </form>
          )}

          {activeTab === "seguridad" && (
            <form onSubmit={handleSubmitPassword} className="config-form">
              <h2>Cambiar Contraseña</h2>
              <p className="form-description">Asegúrate de usar una contraseña segura</p>
              <div className="form-stack">
                <Input
                  label="Nueva Contraseña"
                  name="passwordNueva"
                  type="password"
                  value={passwordData.passwordNueva}
                  onChange={handlePasswordChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <Input
                  label="Confirmar Contraseña"
                  name="passwordConfirm"
                  type="password"
                  value={passwordData.passwordConfirm}
                  onChange={handlePasswordChange}
                  placeholder="Repite la contraseña"
                  required
                />
              </div>
              <div className="password-requirements">
                <p>La contraseña debe tener:</p>
                <ul>
                  <li className={passwordData.passwordNueva.length >= 6 ? "valid" : ""}>Al menos 6 caracteres</li>
                  <li
                    className={
                      passwordData.passwordNueva === passwordData.passwordConfirm && passwordData.passwordNueva !== ""
                        ? "valid"
                        : ""
                    }
                  >
                    Ambas contraseñas deben coincidir
                  </li>
                </ul>
              </div>
              <Button type="submit" variant="primary">
                <Lock size={16} />
                Actualizar Contraseña
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
