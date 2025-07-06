"use client"

import { Cloud, Shield, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = "/auth/login"
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CloudBackup Pro</h1>
            <p className="text-sm text-gray-500">Multi-Cloud VM Management</p>
          </div>
        </Link>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
            <Cloud className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-700 font-medium">Connected: AWS, Azure, GCP</span>
          </div>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full hover:bg-gray-100">
                  <Avatar className="h-10 w-10 border-2 border-gray-200">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-gray-900">{user.name}</p>
                    <p className="text-xs leading-none text-gray-500">{user.email}</p>
                    <div className="flex items-center mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-3 cursor-pointer hover:bg-gray-50 rounded-md">
                  <User className="mr-3 h-4 w-4 text-gray-500" />
                  <span className="text-sm">Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="p-3 cursor-pointer hover:bg-red-50 rounded-md text-red-600"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="text-sm">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
