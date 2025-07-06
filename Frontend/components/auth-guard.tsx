"use client"

import type React from "react"
import { useAuth } from "@/components/auth-context"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

const publicRoutes = ["/auth/login", "/auth/signup", "/auth/forgot-password"]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    if (!isLoading) {
      if (!user && !isPublicRoute) {
        router.push("/auth/login")
      } else if (user && isPublicRoute) {
        router.push("/")
      }
    }
  }, [user, isLoading, isPublicRoute, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user && !isPublicRoute) {
    return null
  }

  if (user && isPublicRoute) {
    return null
  }

  return <>{children}</>
}
