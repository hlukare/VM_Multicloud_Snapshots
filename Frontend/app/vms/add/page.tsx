"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useVM } from "@/components/vm-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, Cloud } from "lucide-react"
import Link from "next/link"

const CLOUD_REGIONS = {
  AWS: [
    "us-east-1",
    "us-east-2",
    "us-west-1",
    "us-west-2",
    "eu-west-1",
    "eu-west-2",
    "eu-central-1",
    "ap-southeast-1",
    "ap-southeast-2",
    "ap-northeast-1",
  ],
  Azure: [
    "eastus",
    "eastus2",
    "westus",
    "westus2",
    "northeurope",
    "westeurope",
    "centralus",
    "southeastasia",
    "eastasia",
    "japaneast",
  ],
  GCP: [
    "us-central1",
    "us-east1",
    "us-west1",
    "us-west2",
    "europe-west1",
    "europe-west2",
    "europe-west3",
    "asia-southeast1",
    "asia-east1",
    "asia-northeast1",
  ],
}

interface FormData {
  cloudProvider: "AWS" | "Azure" | "GCP" | ""
  instanceId: string
  region: string
}

interface FormErrors {
  cloudProvider?: string
  instanceId?: string
  region?: string
}

export default function AddVM() {
  const router = useRouter()
  const { addVM } = useVM()
  const { toast } = useToast()

  const [formData, setFormData] = useState<FormData>({
    cloudProvider: "",
    instanceId: "",
    region: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.cloudProvider) {
      newErrors.cloudProvider = "Cloud provider is required"
    }

    if (!formData.instanceId.trim()) {
      newErrors.instanceId = "Instance ID is required"
    } else if (formData.instanceId.trim().length < 3) {
      newErrors.instanceId = "Instance ID must be at least 3 characters"
    }

    if (!formData.region) {
      newErrors.region = "Region is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      addVM({
        cloudProvider: formData.cloudProvider as "AWS" | "Azure" | "GCP",
        instanceId: formData.instanceId.trim(),
        region: formData.region,
        status: "running",
      })

      toast({
        title: "VM Added Successfully",
        description: `${formData.instanceId} has been added to your monitoring dashboard.`,
      })

      router.push("/vms")
    } catch (error) {
      toast({
        title: "Error Adding VM",
        description: "There was an error adding your VM. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    // Reset region when cloud provider changes
    if (field === "cloudProvider") {
      setFormData((prev) => ({ ...prev, region: "" }))
    }
  }

  const availableRegions = formData.cloudProvider ? CLOUD_REGIONS[formData.cloudProvider] : []

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vms">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New VM</h1>
          <p className="text-gray-600 mt-2">Register a new virtual machine for backup monitoring</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            VM Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cloud Provider */}
            <div className="space-y-2">
              <Label htmlFor="cloudProvider">Cloud Provider *</Label>
              <Select
                value={formData.cloudProvider}
                onValueChange={(value) => handleInputChange("cloudProvider", value)}
              >
                <SelectTrigger className={errors.cloudProvider ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a cloud provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AWS">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      Amazon Web Services (AWS)
                    </div>
                  </SelectItem>
                  <SelectItem value="Azure">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Microsoft Azure
                    </div>
                  </SelectItem>
                  <SelectItem value="GCP">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      Google Cloud Platform (GCP)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.cloudProvider && <p className="text-sm text-red-600">{errors.cloudProvider}</p>}
            </div>

            {/* Instance ID */}
            <div className="space-y-2">
              <Label htmlFor="instanceId">Instance ID *</Label>
              <Input
                id="instanceId"
                type="text"
                placeholder="e.g., i-0123456789abcdef0"
                value={formData.instanceId}
                onChange={(e) => handleInputChange("instanceId", e.target.value)}
                className={errors.instanceId ? "border-red-500" : ""}
              />
              {errors.instanceId && <p className="text-sm text-red-600">{errors.instanceId}</p>}
              <p className="text-sm text-gray-500">Enter the unique identifier for your VM instance</p>
            </div>

            {/* Region */}
            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => handleInputChange("region", value)}
                disabled={!formData.cloudProvider}
              >
                <SelectTrigger className={errors.region ? "border-red-500" : ""}>
                  <SelectValue
                    placeholder={formData.cloudProvider ? "Select a region" : "Select cloud provider first"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableRegions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && <p className="text-sm text-red-600">{errors.region}</p>}
              <p className="text-sm text-gray-500">Select the region where your VM is located</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                {isSubmitting ? "Adding VM..." : "Add VM"}
              </Button>
              <Link href="/vms">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <strong>AWS:</strong> Instance IDs start with "i-" followed by 17 characters
            </p>
            <p>
              <strong>Azure:</strong> VM names are user-defined, typically descriptive
            </p>
            <p>
              <strong>GCP:</strong> Instance names are user-defined, must be lowercase
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
