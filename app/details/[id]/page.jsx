"use client"

import { useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Minus, Upload, Car, Users, MapPin, X, CheckCircle, AlertCircle } from "lucide-react"

export default function VehicleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    routes: [{ from: "", to: "", departureTime: "" }],
    drivers: [{ name: "", age: "", gender: "", contactNumber: "", imageUrl: "" }],
    vehicle: { name: "", number: "", capacity: "", images: [] },
  })

  // Routes management
  const updateRoute = (index, field, value) => {
    const updated = [...form.routes]
    updated[index][field] = value
    setForm({ ...form, routes: updated })
  }

  const addRoute = () => {
    setForm({
      ...form,
      routes: [...form.routes, { from: "", to: "", departureTime: "" }],
    })
  }

  const removeRoute = (index) => {
    if (form.routes.length > 1) {
      setForm({
        ...form,
        routes: form.routes.filter((_, i) => i !== index),
      })
    }
  }

  // Drivers management
  const updateDriver = (index, field, value) => {
    const updated = [...form.drivers]
    updated[index][field] = value
    setForm({ ...form, drivers: updated })
  }

  const addDriver = () => {
    setForm({
      ...form,
      drivers: [...form.drivers, { name: "", age: "", gender: "", contactNumber: "", imageUrl: "" }],
    })
  }

  const removeDriver = (index) => {
    if (form.drivers.length > 1) {
      setForm({
        ...form,
        drivers: form.drivers.filter((_, i) => i !== index),
      })
    }
  }

  // Vehicle management
  const updateVehicle = (field, value) => {
    setForm({
      ...form,
      vehicle: { ...form.vehicle, [field]: value },
    })
  }

  const addVehicleImage = (imageUrl) => {
    setForm({
      ...form,
      vehicle: {
        ...form.vehicle,
        images: [...form.vehicle.images, imageUrl],
      },
    })
  }

  const removeVehicleImage = (index) => {
    setForm({
      ...form,
      vehicle: {
        ...form.vehicle,
        images: form.vehicle.images.filter((_, i) => i !== index),
      },
    })
  }

  // Image upload simulation (replace with actual upload logic)
  const handleImageUpload = async (file, type, index = null) => {
    // Simulate image upload - replace with actual ImgBB or other service
    const fakeUrl = `/placeholder.svg?height=200&width=300&text=${type}`

    if (type === "vehicle") {
      addVehicleImage(fakeUrl)
    } else if (type === "driver" && index !== null) {
      updateDriver(index, "imageUrl", fakeUrl)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/vehicle/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/vehicles")
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to save vehicle details")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Success!</h2>
            <p className="text-muted-foreground mb-4">Vehicle details have been saved successfully.</p>
            <p className="text-sm text-muted-foreground">Redirecting to vehicles list...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-balance">Add Vehicle Details</h1>
            <p className="text-muted-foreground">Vehicle ID: {params.id}</p>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Vehicle Information */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Car className="h-5 w-5" />
                Step 1: Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicleName">Vehicle Name</Label>
                  <Input
                    id="vehicleName"
                    placeholder="Enter vehicle name"
                    value={form.vehicle.name}
                    onChange={(e) => updateVehicle("name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                  <Input
                    id="vehicleNumber"
                    placeholder="Enter vehicle number"
                    value={form.vehicle.number}
                    onChange={(e) => updateVehicle("number", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="Enter passenger capacity"
                    value={form.vehicle.capacity}
                    onChange={(e) => updateVehicle("capacity", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Vehicle Images */}
              <div>
                <Label>Vehicle Images</Label>
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-dashed"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Vehicle Images
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      Array.from(e.target.files || []).forEach((file) => handleImageUpload(file, "vehicle"))
                    }}
                  />
                </div>
                {form.vehicle.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {form.vehicle.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Vehicle ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeVehicleImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Routes */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                <MapPin className="h-5 w-5" />
                Step 2: Routes Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {form.routes.map((route, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Route {index + 1}</Badge>
                    {form.routes.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeRoute(index)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label>From</Label>
                      <Input
                        placeholder="Starting location"
                        value={route.from}
                        onChange={(e) => updateRoute(index, "from", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>To</Label>
                      <Input
                        placeholder="Destination"
                        value={route.to}
                        onChange={(e) => updateRoute(index, "to", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Departure Time</Label>
                      <Input
                        type="time"
                        value={route.departureTime}
                        onChange={(e) => updateRoute(index, "departureTime", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addRoute} className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Route
              </Button>
            </CardContent>
          </Card>

          {/* Step 3: Drivers */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Users className="h-5 w-5" />
                Step 3: Driver Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {form.drivers.map((driver, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Driver {index + 1}</Badge>
                    {form.drivers.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeDriver(index)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Driver Name</Label>
                      <Input
                        placeholder="Enter driver name"
                        value={driver.name}
                        onChange={(e) => updateDriver(index, "name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Age</Label>
                      <Input
                        type="number"
                        placeholder="Enter age"
                        value={driver.age}
                        onChange={(e) => updateDriver(index, "age", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <Select value={driver.gender} onValueChange={(value) => updateDriver(index, "gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Contact Number</Label>
                      <Input
                        placeholder="Enter contact number"
                        value={driver.contactNumber}
                        onChange={(e) => updateDriver(index, "contactNumber", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Driver Photo</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement("input")
                          input.type = "file"
                          input.accept = "image/*"
                          input.onchange = (e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file, "driver", index)
                          }
                          input.click()
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                      {driver.imageUrl && (
                        <div className="relative">
                          <img
                            src={driver.imageUrl || "/placeholder.svg"}
                            alt={`Driver ${index + 1}`}
                            className="h-12 w-12 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-5 w-5"
                            onClick={() => updateDriver(index, "imageUrl", "")}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addDriver} className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Driver
              </Button>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={loading} className="min-w-32">
              {loading ? "Saving..." : "Save Vehicle Details"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
