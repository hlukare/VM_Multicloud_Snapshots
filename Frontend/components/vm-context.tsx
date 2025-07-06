"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface VM {
  id: string
  instanceId: string
  cloudProvider: "AWS" | "Azure" | "GCP"
  region: string
  createdDate: string
  status: "running" | "stopped" | "terminated"
}

export interface Snapshot {
  id: string
  vmId: string
  vmInstanceId: string
  timestamp: string
  status: "success" | "failed" | "in-progress"
  cloudProvider: "AWS" | "Azure" | "GCP"
  size: number
}

interface VMContextType {
  vms: VM[]
  snapshots: Snapshot[]
  addVM: (vm: Omit<VM, "id" | "createdDate">) => void
  deleteVM: (id: string) => void
  takeSnapshot: (vmId: string) => void
  isLoading: boolean
}

const VMContext = createContext<VMContextType | undefined>(undefined)

export function VMProvider({ children }: { children: React.ReactNode }) {
  const [vms, setVMs] = useState<VM[]>([
    {
      id: "vm-1",
      instanceId: "i-0123456789abcdef0",
      cloudProvider: "AWS",
      region: "us-east-1",
      createdDate: "2024-01-15",
      status: "running",
    },
    {
      id: "vm-2",
      instanceId: "vm-web-server-001",
      cloudProvider: "Azure",
      region: "eastus",
      createdDate: "2024-01-20",
      status: "running",
    },
    {
      id: "vm-3",
      instanceId: "instance-1234567890",
      cloudProvider: "GCP",
      region: "us-central1",
      createdDate: "2024-01-25",
      status: "stopped",
    },
  ])

  const [snapshots, setSnapshots] = useState<Snapshot[]>([
    {
      id: "snap-1",
      vmId: "vm-1",
      vmInstanceId: "i-0123456789abcdef0",
      timestamp: "2024-01-29T10:30:00Z",
      status: "success",
      cloudProvider: "AWS",
      size: 25.6,
    },
    {
      id: "snap-2",
      vmId: "vm-2",
      vmInstanceId: "vm-web-server-001",
      timestamp: "2024-01-29T09:15:00Z",
      status: "success",
      cloudProvider: "Azure",
      size: 18.2,
    },
    {
      id: "snap-3",
      vmId: "vm-1",
      vmInstanceId: "i-0123456789abcdef0",
      timestamp: "2024-01-28T14:20:00Z",
      status: "failed",
      cloudProvider: "AWS",
      size: 0,
    },
    {
      id: "snap-4",
      vmId: "vm-3",
      vmInstanceId: "instance-1234567890",
      timestamp: "2024-01-28T11:45:00Z",
      status: "success",
      cloudProvider: "GCP",
      size: 32.1,
    },
    {
      id: "snap-5",
      vmId: "vm-2",
      vmInstanceId: "vm-web-server-001",
      timestamp: "2024-01-27T16:30:00Z",
      status: "success",
      cloudProvider: "Azure",
      size: 17.8,
    },
  ])

  const [isLoading, setIsLoading] = useState(false)

  const addVM = (vmData: Omit<VM, "id" | "createdDate">) => {
    const newVM: VM = {
      ...vmData,
      id: `vm-${Date.now()}`,
      createdDate: new Date().toISOString().split("T")[0],
      status: "running",
    }
    setVMs((prev) => [...prev, newVM])
  }

  const deleteVM = (id: string) => {
    setVMs((prev) => prev.filter((vm) => vm.id !== id))
    setSnapshots((prev) => prev.filter((snapshot) => snapshot.vmId !== id))
  }

  const takeSnapshot = async (vmId: string) => {
    setIsLoading(true)
    const vm = vms.find((v) => v.id === vmId)
    if (!vm) return

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newSnapshot: Snapshot = {
      id: `snap-${Date.now()}`,
      vmId,
      vmInstanceId: vm.instanceId,
      timestamp: new Date().toISOString(),
      status: Math.random() > 0.1 ? "success" : "failed",
      cloudProvider: vm.cloudProvider,
      size: Math.random() * 50 + 10,
    }

    setSnapshots((prev) => [newSnapshot, ...prev])
    setIsLoading(false)
  }

  return (
    <VMContext.Provider
      value={{
        vms,
        snapshots,
        addVM,
        deleteVM,
        takeSnapshot,
        isLoading,
      }}
    >
      {children}
    </VMContext.Provider>
  )
}

export function useVM() {
  const context = useContext(VMContext)
  if (context === undefined) {
    throw new Error("useVM must be used within a VMProvider")
  }
  return context
}
