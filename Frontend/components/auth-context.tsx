"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  provider: "email" | "google"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (email === "admin@cloudbackup.com" && password === "password") {
      const userData: User = {
        id: "1",
        email,
        name: "Admin User",
        provider: "email",
      }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
    } else {
      throw new Error("Invalid credentials")
    }

    setIsLoading(false)
  }

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const userData: User = {
      id: Date.now().toString(),
      email,
      name,
      provider: "email",
    }

    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    setIsLoading(false)
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const userData: User = {
      id: "google_" + Date.now(),
      email: "user@gmail.com",
      name: "Google User",
      avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      provider: "google",
    }

    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        loginWithGoogle,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
