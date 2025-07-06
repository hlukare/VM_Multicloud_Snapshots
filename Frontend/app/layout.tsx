import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { VMProvider } from "@/components/vm-context"
import { AuthProvider } from "@/components/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CloudBackup Pro - VM Backup & Recovery Dashboard",
  description: "Multi-cloud virtual machine backup and recovery management platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <VMProvider>
            <AuthGuard>
              <DashboardLayout>{children}</DashboardLayout>
            </AuthGuard>
          </VMProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
