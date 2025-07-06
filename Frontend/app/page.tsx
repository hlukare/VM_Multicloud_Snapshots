"use client"

import { useVM } from "@/components/vm-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server, Camera, HardDrive, TrendingUp, CheckCircle, XCircle, Clock, Activity } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const COLORS = {
  AWS: "#FF9500",
  Azure: "#0078D4",
  GCP: "#4285F4",
}

export default function Dashboard() {
  const { vms, snapshots } = useVM()

  const totalVMs = vms.length
  const totalSnapshots = snapshots.length
  const successfulSnapshots = snapshots.filter((s) => s.status === "success").length
  const successRate = totalSnapshots > 0 ? (successfulSnapshots / totalSnapshots) * 100 : 0

  const storageByCloud = snapshots
    .filter((s) => s.status === "success")
    .reduce(
      (acc, snapshot) => {
        acc[snapshot.cloudProvider] = (acc[snapshot.cloudProvider] || 0) + snapshot.size
        return acc
      },
      {} as Record<string, number>,
    )

  const storageData = Object.entries(storageByCloud).map(([provider, size]) => ({
    name: provider,
    value: Number(size.toFixed(1)),
    color: COLORS[provider as keyof typeof COLORS],
  }))

  const recentSnapshots = snapshots
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

  const successRateData = [
    { date: "Jan 25", rate: 95 },
    { date: "Jan 26", rate: 88 },
    { date: "Jan 27", rate: 92 },
    { date: "Jan 28", rate: 85 },
    { date: "Jan 29", rate: Math.round(successRate) },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-blue-100 text-lg">Monitor your multi-cloud VM backup infrastructure</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <Activity className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total VMs</CardTitle>
            <div className="p-2 bg-blue-600 rounded-lg">
              <Server className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{totalVMs}</div>
            <p className="text-xs text-blue-700 mt-1">Across {Object.keys(COLORS).length} cloud providers</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Total Snapshots</CardTitle>
            <div className="p-2 bg-green-600 rounded-lg">
              <Camera className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{totalSnapshots}</div>
            <p className="text-xs text-green-700 mt-1">{successfulSnapshots} successful</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Storage Used</CardTitle>
            <div className="p-2 bg-purple-600 rounded-lg">
              <HardDrive className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              {Object.values(storageByCloud)
                .reduce((a, b) => a + b, 0)
                .toFixed(1)}{" "}
              <span className="text-lg">GB</span>
            </div>
            <p className="text-xs text-purple-700 mt-1">Across all clouds</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Success Rate</CardTitle>
            <div className="p-2 bg-orange-600 rounded-lg">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">{successRate.toFixed(1)}%</div>
            <p className="text-xs text-orange-700 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Storage Usage Pie Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">Storage Usage by Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={storageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}GB`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {storageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Success Rate Trend */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">Backup Success Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={successRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis domain={[0, 100]} stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: "#3B82F6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Snapshots */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">Recent Snapshots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSnapshots.map((snapshot) => (
              <div
                key={snapshot.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm">
                    {snapshot.status === "success" ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : snapshot.status === "failed" ? (
                      <XCircle className="w-6 h-6 text-red-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{snapshot.vmInstanceId}</p>
                    <p className="text-sm text-gray-500">{new Date(snapshot.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    className="px-3 py-1 text-white font-medium"
                    style={{ backgroundColor: COLORS[snapshot.cloudProvider] }}
                  >
                    {snapshot.cloudProvider}
                  </Badge>
                  <Badge
                    variant={snapshot.status === "success" ? "default" : "destructive"}
                    className={`px-3 py-1 font-medium ${
                      snapshot.status === "success"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    {snapshot.status}
                  </Badge>
                  {snapshot.status === "success" && (
                    <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-lg">
                      {snapshot.size.toFixed(1)} GB
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
