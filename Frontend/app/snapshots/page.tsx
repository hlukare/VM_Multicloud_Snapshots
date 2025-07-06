"use client"

import { useState } from "react"
import { useVM } from "@/components/vm-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Search, Filter, RotateCcw, CheckCircle, XCircle, Clock, Calendar, HardDrive } from "lucide-react"

const CLOUD_COLORS = {
  AWS: "bg-orange-100 text-orange-800 border-orange-200",
  Azure: "bg-blue-100 text-blue-800 border-blue-200",
  GCP: "bg-green-100 text-green-800 border-green-200",
}

const STATUS_COLORS = {
  success: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
}

export default function SnapshotHistory() {
  const { snapshots, vms } = useVM()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProvider, setFilterProvider] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("all")

  // Filter snapshots
  const filteredSnapshots = snapshots
    .filter((snapshot) => {
      const matchesSearch =
        snapshot.vmInstanceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snapshot.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesProvider = filterProvider === "all" || snapshot.cloudProvider === filterProvider
      const matchesStatus = filterStatus === "all" || snapshot.status === filterStatus

      let matchesDate = true
      if (dateRange !== "all") {
        const snapshotDate = new Date(snapshot.timestamp)
        const now = new Date()
        const daysAgo = Number.parseInt(dateRange)
        const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
        matchesDate = snapshotDate >= cutoffDate
      }

      return matchesSearch && matchesProvider && matchesStatus && matchesDate
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const handleRestore = (snapshotId: string, vmInstanceId: string) => {
    // This would typically make an API call to restore the snapshot
    toast({
      title: "Restore Initiated",
      description: `Restore process for ${vmInstanceId} has been started. This may take several minutes.`,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  // Calculate summary stats
  const totalSnapshots = filteredSnapshots.length
  const successfulSnapshots = filteredSnapshots.filter((s) => s.status === "success").length
  const failedSnapshots = filteredSnapshots.filter((s) => s.status === "failed").length
  const totalStorage = filteredSnapshots.filter((s) => s.status === "success").reduce((sum, s) => sum + s.size, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Snapshot History</h1>
        <p className="text-gray-600 mt-2">View and manage all VM snapshots across cloud providers</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Snapshots</p>
                <p className="text-2xl font-bold">{totalSnapshots}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">{successfulSnapshots}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{failedSnapshots}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold">{totalStorage.toFixed(1)} GB</p>
              </div>
              <HardDrive className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search snapshots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterProvider} onValueChange={setFilterProvider}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Providers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="AWS">AWS</SelectItem>
                <SelectItem value="Azure">Azure</SelectItem>
                <SelectItem value="GCP">GCP</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="1">Last 24 Hours</SelectItem>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Snapshots Table */}
      <Card>
        <CardHeader>
          <CardTitle>Snapshot History ({filteredSnapshots.length} results)</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSnapshots.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Snapshots Found</h3>
              <p className="text-gray-500">
                {searchTerm || filterProvider !== "all" || filterStatus !== "all" || dateRange !== "all"
                  ? "No snapshots match your current filters."
                  : "No snapshots have been created yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Snapshot ID</TableHead>
                    <TableHead>VM Instance</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSnapshots.map((snapshot) => (
                    <TableRow key={snapshot.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(snapshot.status)}
                          <Badge className={STATUS_COLORS[snapshot.status]}>{snapshot.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{snapshot.id}</TableCell>
                      <TableCell className="font-medium">{snapshot.vmInstanceId}</TableCell>
                      <TableCell>
                        <Badge className={CLOUD_COLORS[snapshot.cloudProvider]}>{snapshot.cloudProvider}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(snapshot.timestamp).toLocaleDateString()}</div>
                          <div className="text-gray-500">{new Date(snapshot.timestamp).toLocaleTimeString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {snapshot.status === "success" ? (
                          <span className="text-sm font-medium">{snapshot.size.toFixed(1)} GB</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestore(snapshot.id, snapshot.vmInstanceId)}
                          disabled={snapshot.status !== "success"}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Restore
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
