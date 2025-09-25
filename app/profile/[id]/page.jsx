"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { User, Car, Phone, CreditCard, FileText, Mail, Edit3, Save, X, ArrowLeft } from "lucide-react"

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingField, setEditingField] = useState(null)
  const [editValue, setEditValue] = useState("")
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [params.id])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/profile/${params.id}`)
      if (response.ok) {
        const result = await response.json()
        setProfile(result.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (field, currentValue) => {
    setEditingField(field)
    setEditValue(currentValue || "")
  }

  const cancelEdit = () => {
    setEditingField(null)
    setEditValue("")
  }

  const saveField = async (field) => {
    if (!editValue.trim()) {
      toast({
        title: "Error",
        description: "Field cannot be empty",
        variant: "destructive",
      })
      return
    }

    setUpdating(true)
    try {
      const updateData = {}
      if (field.includes(".")) {
        const [parent, child] = field.split(".")
        updateData[parent] = { ...profile[parent], [child]: editValue }
      } else {
        updateData[field] = editValue
      }

      const response = await fetch(`/api/profile/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const updatedResult = await response.json()
        setProfile(updatedResult.data)
        setEditingField(null)
        setEditValue("")
        toast({
          title: "Updated",
          description: "Profile updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const renderField = (label, field, value, icon, type = "text", isEditable = true) => {
    const isEditing = editingField === field
    const canEdit = isEditable && !["user.gmail", "user.username", "vehicleId"].includes(field)

    return (
      <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
        <div className="flex items-center gap-3">
          <div className="text-gray-400">{icon}</div>
          <div>
            <Label className="text-sm font-medium text-gray-700">{label}</Label>
            {!isEditing && (
              <div className="text-sm text-gray-900 mt-1">
                {field === "user.status" ? (
                  <Badge variant={value === "enabled" ? "default" : "secondary"} className="text-xs">
                    {value || "Not set"}
                  </Badge>
                ) : (
                  value || "Not set"
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              {type === "select" && field === "gender" ? (
                <Select value={editValue} onValueChange={setEditValue}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={type}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-48"
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              )}
              <Button size="sm" onClick={() => saveField(field)} disabled={updating}>
                <Save className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={cancelEdit} disabled={updating}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              {canEdit && (
                <Button size="sm" variant="ghost" onClick={() => startEdit(field, value)}>
                  <Edit3 className="h-4 w-4" />
                </Button>
              )}
              {!canEdit && (
                <div className="text-gray-400 text-xs px-2">{field === "vehicleId" ? "Auto-generated" : "Fixed"}</div>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Profile not found</p>
            <Button onClick={() => router.push("/")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Driver Profile</h1>
                <p className="text-sm text-gray-500">{profile.user?.gmail}</p>
              </div>
            </div>
            <Badge variant={profile.user?.status === "enabled" ? "default" : "secondary"}>
              {profile.user?.status || "disabled"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-1">
              {/* Personal Information */}
              {renderField("Full Name", "fullName", profile.fullName, <User className="h-4 w-4" />)}
              {renderField("Gender", "gender", profile.gender, <User className="h-4 w-4" />, "select")}
              {renderField(
                "Contact Number",
                "contactNumber",
                profile.contactNumber,
                <Phone className="h-4 w-4" />,
                "tel",
              )}
              {renderField("National ID", "nationalId", profile.nationalId, <CreditCard className="h-4 w-4" />)}

              {/* Vehicle Information */}
              {renderField("Vehicle ID", "vehicleId", profile.vehicleId, <Car className="h-4 w-4" />, "text", false)}
              {renderField("Vehicle Number", "vehicleNumber", profile.vehicleNumber, <Car className="h-4 w-4" />)}
              {renderField(
                "Driving License",
                "drivingLicense",
                profile.drivingLicense,
                <CreditCard className="h-4 w-4" />,
              )}
              {renderField("Road Permit", "roadPermit", profile.roadPermit, <FileText className="h-4 w-4" />)}

              {/* Account Information */}
              {renderField("Email", "user.gmail", profile.user?.gmail, <Mail className="h-4 w-4" />, "email", false)}
              {renderField(
                "Username",
                "user.username",
                profile.user?.username,
                <User className="h-4 w-4" />,
                "text",
                false,
              )}
              {renderField(
                "Account Status",
                "user.status",
                profile.user?.status,
                <User className="h-4 w-4" />,
                "select",
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
