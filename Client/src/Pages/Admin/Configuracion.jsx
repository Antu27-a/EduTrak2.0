import { useState } from "react"
import { Eye, EyeOff, Lock, Save, Shield } from "lucide-react"
import Alert from "../../components/ui/Alert"
import "../../components/Css/Configuracion.css"

export default function Configuracion() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [alert, setAlert] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setAlert({ type: "warning", message: "Todos los campos son obligatorios" })
      return
    }

    if (formData.newPassword.length < 6) {
      setAlert({ type: "warning", message: "La nueva contraseña debe tener al menos 6 caracteres" })
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setAlert({ type: "error", message: "Las contraseñas nuevas no coinciden" })
      return
    }

    // Aquí iría la lógica para cambiar la contraseña en el backend
    setAlert({ type: "success", message: "Contraseña actualizada correctamente" })
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  return (
    <div className="configuracion-container">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="configuracion-header">
        <h1>Configuración</h1>
        <p>Administra la seguridad de tu cuenta</p>
      </div>

      <div className="configuracion-content">
        <div className="password-card">
          <div className="card-header">
            <Shield size={24} />
            <div>
              <h2>Cambiar Contraseña</h2>
              <p>Actualiza tu contraseña para mantener tu cuenta segura</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">
                <Lock size={16} />
                Contraseña Actual
              </label>
              <div className="input-wrapper">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña actual"
                />
                <button type="button" className="toggle-password" onClick={() => togglePassword("current")}>
                  {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">
                <Lock size={16} />
                Nueva Contraseña
              </label>
              <div className="input-wrapper">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Ingresa tu nueva contraseña"
                />
                <button type="button" className="toggle-password" onClick={() => togglePassword("new")}>
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <span className="hint">Mínimo 6 caracteres</span>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <Lock size={16} />
                Confirmar Nueva Contraseña
              </label>
              <div className="input-wrapper">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirma tu nueva contraseña"
                />
                <button type="button" className="toggle-password" onClick={() => togglePassword("confirm")}>
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="save-btn">
              <Save size={18} />
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
