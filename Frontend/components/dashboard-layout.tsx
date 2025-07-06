"use client"

import type React from "react"
import { useAuth } from "@/components/auth-context"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

const publicRoutes = ["/auth/login", "/auth/signup", "/auth/forgot-password"]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const pathname = usePathname()

  const isPublicRoute = publicRoutes.includes(pathname)

  if (isPublicRoute || !user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
