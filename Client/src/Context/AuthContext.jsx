"use client"

import { createContext, useContext, useState, useEffect } from "react"

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("userData")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        if (parsedUser && parsedUser.rol) {
          setUser(parsedUser)
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem("token")
          localStorage.removeItem("userData")
        }
      } catch (error) {
        console.error("Error parseando datos:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("userData")
      }
    }
    setLoading(false)
  }, [])

  const login = (token, userData) => {
    localStorage.setItem("token", token)
    localStorage.setItem("userData", JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
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
