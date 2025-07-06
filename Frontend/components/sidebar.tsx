"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Server, Plus, History, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "VM Management", href: "/vms", icon: Server },
  { name: "Add New VM", href: "/vms/add", icon: Plus },
  { name: "Snapshot History", href: "/snapshots", icon: History },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 shadow-sm",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto flex hover:bg-gray-100 rounded-lg p-2"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  collapsed && "justify-center px-2",
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive ? "text-blue-600" : "text-gray-500",
                    !collapsed && "mr-3",
                  )}
                />
                {!collapsed && <span className="truncate">{item.name}</span>}
                {!collapsed && isActive && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>}
              </Link>
            )
          })}
        </nav>

        {!collapsed && (
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Need Help?</h4>
              <p className="text-xs text-gray-600 mb-3">Check our documentation for guides and tutorials.</p>
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                View Docs
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
