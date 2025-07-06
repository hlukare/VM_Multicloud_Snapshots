"use client"

import { useState } from "react"
import { useVM } from "@/components/vm-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Camera, Trash2, Search, Filter, Server, Plus, Activity } from "lucide-react"
import Link from "next/link"

const CLOUD_COLORS = {
  AWS: "bg-orange-100 text-orange-800 border-orange-200",
  Azure: "bg-blue-100 text-blue-800 border-blue-200",
  GCP: "bg-green-100 text-green-800 border-green-200",
}

const STATUS_COLORS = {
  running: "bg-green-100 text-green-800 border-green-200",
  stopped: "bg-yellow-100 text-yellow-800 border-yellow-200",
  terminated: "bg-red-100 text-red-800 border-red-200",
}

export default function VMManagement() {
  const { vms, deleteVM, takeSnapshot, isLoading } = useVM()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProvider, setFilterProvider] = useState<string>("all")
  const [takingSnapshot, setTakingSnapshot] = useState<string | null>(null)

  const filteredVMs = vms.filter((vm) => {
    const matchesSearch =
      vm.instanceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vm.region.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProvider = filterProvider === "all" || vm.cloudProvider === filterProvider
    return matchesSearch && matchesProvider
  })

  const handleTakeSnapshot = async (vmId: string, instanceId: string) => {
    setTakingSnapshot(vmId)
    try {
      await takeSnapshot(vmId)
      toast({
        title: "Snapshot Created",
        description: `Snapshot for ${instanceId} has been created successfully.`,
      })
    } catch (error) {
      toast({
        title: "Snapshot Failed",
        description: `Failed to create snapshot for ${instanceId}.`,
        variant: "destructive",
      })
    } finally {
      setTakingSnapshot(null)
    }
  }

  const handleDeleteVM = (vmId: string, instanceId: string) => {
    deleteVM(vmId)
    toast({
      title: "VM Deleted",
      description: `${instanceId} has been removed from monitoring.`,
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">VM Management</h1>
            <p className="text-indigo-100 text-lg">Manage your virtual machines across cloud providers</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/vms/add">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm h-12 px-6">
                <Plus className="w-5 h-5 mr-2" />
                Add New VM
              </Button>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Activity className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by Instance ID or Region..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 h-12 border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={filterProvider} onValueChange={setFilterProvider}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-indigo-500 rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="AWS">AWS</SelectItem>
                  <SelectItem value="Azure">Azure</SelectItem>
                  <SelectItem value="GCP">GCP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VM List */}
      <div className="grid gap-6">
        {filteredVMs.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Server className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No VMs Found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {searchTerm || filterProvider !== "all"
                    ? "No VMs match your current filters. Try adjusting your search criteria."
                    : "You haven't added any VMs yet. Get started by adding your first virtual machine."}
                </p>
                <Link href="/vms/add">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First VM
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredVMs.map((vm) => (
            <Card key={vm.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{vm.instanceId}</h3>
                      <Badge className={`${CLOUD_COLORS[vm.cloudProvider]} px-3 py-1 font-medium`}>
                        {vm.cloudProvider}
                      </Badge>
                      <Badge className={`${STATUS_COLORS[vm.status]} px-3 py-1 font-medium`}>{vm.status}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="font-medium text-gray-700">Region:</span>
                        <span className="ml-2 text-gray-900">{vm.region}</span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="font-medium text-gray-700">Created:</span>
                        <span className="ml-2 text-gray-900">{new Date(vm.createdDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => handleTakeSnapshot(vm.id, vm.instanceId)}
                      disabled={takingSnapshot === vm.id || vm.status === "terminated"}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      {takingSnapshot === vm.id ? "Taking..." : "Take Snapshot"}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 border-2 border-red-200 hover:border-red-300 hover:bg-red-50 rounded-xl bg-transparent"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl">Delete VM</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600">
                            Are you sure you want to remove <strong className="text-gray-900">{vm.instanceId}</strong>{" "}
                            from monitoring? This will also delete all associated snapshots. This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteVM(vm.id, vm.instanceId)}
                            className="bg-red-600 hover:bg-red-700 rounded-xl"
                          >
                            Delete VM
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-gray-100">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-indigo-600 mb-1">{filteredVMs.length}</div>
              <div className="text-sm text-gray-600 font-medium">Total VMs</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {filteredVMs.filter((vm) => vm.status === "running").length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Running</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {filteredVMs.filter((vm) => vm.status === "stopped").length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Stopped</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {filteredVMs.filter((vm) => vm.status === "terminated").length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Terminated</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
