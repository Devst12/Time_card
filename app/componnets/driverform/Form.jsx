"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Shield, Car, Phone, Fingerprint, MapPin } from "lucide-react";

export default function DriverForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    drivingLicense: "",
    roadPermit: "",
    nationalId: "",
    gender: "",
    contactNumber: "",
    vehicleNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key} is required`;
      }
    });
    if (formData.contactNumber && !/^\d{7,15}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Enter valid phone (7-15 digits).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/vehicle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/");
      } else {
        alert("Submission failed.");
      }
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (id, label, placeholder, Icon, type = "text") => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-5 w-5 text-gray-400" />
        </span>
        <input
          type={type}
          id={id}
          name={id}
          value={formData[id]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
            errors[id] ? "border-red-500" : "border-gray-300"
          } focus:ring-indigo-500 focus:border-indigo-500 text-black`}
        />
      </div>
      {errors[id] && <p className="text-xs text-red-600 mt-1">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Driver & Vehicle Form
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderInput("fullName", "Full Name", "John Doe", User)}
          {renderInput("drivingLicense", "Driving License No.", "DL-123456", Shield)}
          {renderInput("roadPermit", "Road Permit No.", "RP-987654", MapPin)}
          {renderInput("nationalId", "National ID No.", "1122334455", Fingerprint)}
          {renderInput("vehicleNumber", "Vehicle Number", "BA 2 PA 4567", Car)}
          {renderInput("contactNumber", "Contact Number", "98XXXXXXXX", Phone, "tel")}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full py-2 px-3 rounded-lg border ${
                errors.gender ? "border-red-500" : "border-gray-300"
              } focus:ring-indigo-500 focus:border-indigo-500 text-black`}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-xs text-red-600 mt-1">{errors.gender}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}