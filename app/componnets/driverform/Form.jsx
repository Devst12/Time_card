"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Shield, Car, Phone, Fingerprint, MapPin } from "lucide-react"

export default function DriverForm() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    fullName: "",
    drivingLicense: "",
    roadPermit: "",
    nationalId: "",
    gender: "",
    contactNumber: "",
    vehicleNumber: "",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: null }))
    setApiError("")
    setSuccessMessage("")
  }

  const validateForm = () => {
    const newErrors = {}
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key} is required`
      }
    })
    if (formData.contactNumber && !/^\d{7,15}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Enter valid phone (7-15 digits)."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading) return

    if (!validateForm()) return
    setLoading(true)
    setApiError("")
    setSuccessMessage("")

    try {
      const res = await fetch("/api/vehicle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSuccessMessage("Driver registration successful!")
        setFormData({
          fullName: "",
          drivingLicense: "",
          roadPermit: "",
          nationalId: "",
          gender: "",
          contactNumber: "",
          vehicleNumber: "",
        })
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        setApiError(data.error || "Submission failed.")
      }
    } catch (err) {
      console.error("Submission error:", err)
      setApiError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderInput = (id, label, placeholder, Icon, type = "text") => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </span>
        <input
          type={type}
          id={id}
          name={id}
          value={formData[id]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
            errors[id] ? "border-destructive" : "border-input"
          } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring`}
        />
      </div>
      {errors[id] && <p className="text-xs text-destructive mt-1">{errors[id]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-3xl bg-card shadow-md rounded-lg p-8 border">
        <h1 className="text-2xl font-bold text-foreground mb-4">Driver & Vehicle Registration</h1>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg">{successMessage}</div>
        )}

        {apiError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">{apiError}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderInput("fullName", "Full Name", "John Doe", User)}
          {renderInput("drivingLicense", "Driving License No.", "DL-123456", Shield)}
          {renderInput("roadPermit", "Road Permit No.", "RP-987654", MapPin)}
          {renderInput("nationalId", "National ID No.", "1122334455", Fingerprint)}
          {renderInput("vehicleNumber", "Vehicle Number", "BA 2 PA 4567", Car)}
          {renderInput("contactNumber", "Contact Number", "98XXXXXXXX", Phone, "tel")}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full py-2 px-3 rounded-lg border ${
                errors.gender ? "border-destructive" : "border-input"
              } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring`}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-xs text-destructive mt-1">{errors.gender}</p>}
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primary text-primary-foreground font-medium py-2 rounded-lg hover:bg-primary/90 transition disabled:opacity-50 ${
                loading ? "pointer-events-none" : ""
              }`}
            >
              {loading ? "Submitting..." : "Submit Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
