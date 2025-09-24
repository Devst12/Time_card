"use client";

import { useState } from "react";
import { User, Shield, Car, Phone, Fingerprint, MapPin } from "lucide-react"; // For nice icons

function DriverForm() {
  const initialFormData = {
    fullName: "",
    drivingLicense: "",
    roadPermit: "",
    nationalId: "",
    gender: "",
    contactNumber: "",
    vehicleNumber: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  // A generic handler to update state for any input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear the error for a field once the user starts typing in it
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Simple validation check for empty fields
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        // Create a more readable error message from the key
        const fieldName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        newErrors[key] = `${fieldName} is required.`;
      }
    });

    // Specific validation for contact number
    if (formData.contactNumber && !/^\d{7,15}$/.test(formData.contactNumber)) {
        newErrors.contactNumber = "Please enter a valid contact number (7-15 digits)."
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setErrors({});
    console.log("Form cancelled and cleared.");
  };

  const handleSubmit = () => {
    // Here you would typically send the data to an API
    console.log("Submitting the following data:", formData);
    alert("Profile submitted successfully!");
    setShowPreview(false);
    setFormData(initialFormData); // Clear form after successful submission
  };

  const renderInputField = (name, label, placeholder, Icon, type = "text") => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-5 w-5 text-gray-400" />
        </span>
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-3 py-2 border ${
            errors[name] ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
        />
      </div>
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Driver & Vehicle Details</h1>
        <p className="text-gray-500 mb-8">Please fill in all the required information accurately.</p>

        <form onSubmit={handlePreview} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInputField("fullName", "Full Name", "e.g., John Doe", User)}
            {renderInputField("drivingLicense", "Driving License No.", "e.g., NPL-1234567", Shield)}
            {renderInputField("roadPermit", "Road Permit No.", "e.g., RP-987654", MapPin)}
            {renderInputField("nationalId", "National ID No.", "e.g., 1122334455", Fingerprint)}
            {renderInputField("vehicleNumber", "Vehicle Number", "e.g., BA 1 PA 1234", Car)}
            {renderInputField("contactNumber", "Contact Number", "e.g., 98XXXXXXXX", Phone, "tel")}
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full py-2 px-3 border ${
                  errors.gender ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              >
                <option value="" disabled>Select your gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Preview & Confirm
            </button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Please Confirm Your Details</h2>
            <div className="space-y-3 text-gray-600">
              {Object.entries(formData).map(([key, value]) => {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return (
                  <div key={key} className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold text-gray-800">{label}:</span>
                    <span className="text-right">{value}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none"
              >
                Edit
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverForm;