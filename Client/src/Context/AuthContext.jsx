"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    console.log("[v0] AuthContext: Cargando datos del localStorage...")
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("userData")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        console.log("[v0] AuthContext: Usuario encontrado:", parsedUser)
        if (parsedUser && parsedUser.rol) {
          setUser(parsedUser)
          setIsAuthenticated(true)
        } else {
          console.log("[v0] AuthContext: Datos invalidos, limpiando...")
          localStorage.removeItem("token")
          localStorage.removeItem("userData")
        }
      } catch (error) {
        console.log("[v0] AuthContext: Error parseando datos:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("userData")
      }
    } else {
      console.log("[v0] AuthContext: No hay datos en localStorage")
    }
    setLoading(false)
  }, [])

  const login = (token, userData) => {
    console.log("[v0] AuthContext login(): Guardando token y usuario:", userData)
    localStorage.setItem("token", token)
    localStorage.setItem("userData", JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
    console.log("[v0] AuthContext login(): Estado actualizado - isAuthenticated: true")
  }

  const logout = () => {
    console.log("[v0] AuthContext logout(): Limpiando sesion...")
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
