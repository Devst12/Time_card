import { NextResponse } from "next/server"
import Vehicle from "@/lib/modals/Vehicle"
import VehicleDetails from "@/lib/modals/VehicleDetails"
import mongoose from "mongoose"

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI)
  } catch (error) {
    console.error("MongoDB connection error:", error)
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB()

    const { id } = params

    // Fetch both vehicle basic info and detailed info using vehicleId
    const [vehicle, vehicleDetails] = await Promise.all([
      Vehicle.findOne({ vehicleId: id }),
      VehicleDetails.findOne({ vehicleId: id }),
    ])

    if (!vehicle && !vehicleDetails) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    // Combine data from both schemas
    const combinedData = {
      vehicleId: id,
      // Basic vehicle info from Vehicle schema
      basicInfo: vehicle
        ? {
            fullName: vehicle.fullName,
            drivingLicense: vehicle.drivingLicense,
            roadPermit: vehicle.roadPermit,
            nationalId: vehicle.nationalId,
            gender: vehicle.gender,
            contactNumber: vehicle.contactNumber,
            vehicleNumber: vehicle.vehicleNumber,
            user: vehicle.user,
          }
        : null,
      // Detailed info from VehicleDetails schema
      detailedInfo: vehicleDetails
        ? {
            routes: vehicleDetails.routes,
            drivers: vehicleDetails.drivers,
            vehicle: vehicleDetails.vehicle,
            user: vehicleDetails.user,
          }
        : null,
      createdAt: vehicle?.createdAt || vehicleDetails?.createdAt,
      updatedAt: vehicle?.updatedAt || vehicleDetails?.updatedAt,
    }

    return NextResponse.json(combinedData)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB()

    const { id } = params

    // Delete from both collections
    await Promise.all([Vehicle.deleteOne({ vehicleId: id }), VehicleDetails.deleteOne({ vehicleId: id })])

    return NextResponse.json({ message: "Vehicle deleted successfully" })
  } catch (error) {
    console.error("Delete Error:", error)
    return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    await connectDB()

    const { id } = params
    const body = await request.json()

    // Create new vehicle details with the provided vehicleId
    const vehicleDetailsData = {
      vehicleId: id,
      routes: body.routes || [],
      drivers: body.drivers || [],
      vehicle: body.vehicle || {},
      user: body.user || {},
    }

    const newVehicleDetails = new VehicleDetails(vehicleDetailsData)
    await newVehicleDetails.save()

    return NextResponse.json(
      {
        message: "Vehicle details created successfully",
        data: newVehicleDetails,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("POST Error:", error)
    if (error.code === 11000) {
      return NextResponse.json({ error: "Vehicle with this ID already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to create vehicle details" }, { status: 500 })
  }
}
