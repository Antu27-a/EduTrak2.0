"use client"

import { useState } from "react"
import { User, Bell, Lock, Palette, Save } from "lucide-react"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import "../../components/Css/Configuracion.css"

export default function Configuracion() {
    const [activeTab, setActiveTab] = useState("perfil")
    const [formData, setFormData] = useState({
        nombre: "Juan",
        apellido: "Pérez",
        email: "juan.perez@edutrak.com",
        telefono: "11-1234-5678",
        notificacionEmail: true,
        notificacionApp: true,
        tema: "claro",
    })

    const tabs = [
        { id: "perfil", label: "Perfil", icon: User },
        { id: "seguridad", label: "Seguridad", icon: Lock },

    ]

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        alert("Configuración guardada correctamente")
    }

    return (
        <div className="configuracion-page">
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
                        <form onSubmit={handleSubmit} className="config-form">
                            <h2>Información Personal</h2>
                            <div className="form-grid">
                                <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
                                <Input label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} />
                                <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                                <Input label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} />
                            </div>
                            <Button type="submit" variant="primary">
                                <Save size={16} />
                                Guardar Cambios
                            </Button>
                        </form>
                    )}

                    {activeTab === "seguridad" && (
                        <form onSubmit={handleSubmit} className="config-form">
                            <h2>Cambiar Contraseña</h2>
                            <div className="form-stack">
                                <Input label="Contraseña Actual" name="passwordActual" type="password" />
                                <Input label="Nueva Contraseña" name="passwordNueva" type="password" />
                                <Input label="Confirmar Contraseña" name="passwordConfirm" type="password" />
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
