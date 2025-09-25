import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import connectDB from "@/lib/mongoose"
import Vehicle from "@/lib/modals/Vehicle"
export async function GET(request, { params }) {
  try {
    await connectDB()

    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Vehicle ID is required" }, { status: 400 })
    }

    let vehicle

    // Try to find by vehicleId first
    vehicle = await Vehicle.findOne({ vehicleId: id })

    // If not found, try to find by MongoDB _id
    if (!vehicle) {
      try {
        vehicle = await Vehicle.findById(id)
      } catch (error) {
        // Invalid ObjectId format
        return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
      }
    }

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: vehicle,
    })
  } catch (error) {
    console.error("Error fetching vehicle profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Vehicle ID is required" }, { status: 400 })
    }

    let vehicle

    // Try to find by vehicleId first
    vehicle = await Vehicle.findOne({ vehicleId: id })

    // If not found, try to find by MongoDB _id
    if (!vehicle) {
      try {
        vehicle = await Vehicle.findById(id)
      } catch (error) {
        return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
      }
    }

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    const sessionEmail = session.user.email.toLowerCase().trim()
    const vehicleEmail = vehicle.user.gmail.toLowerCase().trim()

    if (vehicleEmail !== sessionEmail) {
      return NextResponse.json({ error: "Forbidden: You can only update your own vehicle" }, { status: 403 })
    }

    const allowedFields = [
      "fullName",
      "drivingLicense",
      "roadPermit",
      "nationalId",
      "gender",
      "contactNumber",
      "vehicleNumber",
    ]

    const updateData = {}
    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    })

    if (body.vehicleNumber && body.vehicleNumber !== vehicle.vehicleNumber) {
      updateData.vehicleId = body.vehicleNumber.replace(/\s+/g, "-").toLowerCase()
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(vehicle._id, updateData, { new: true, runValidators: true })

    return NextResponse.json({
      success: true,
      message: "Vehicle profile updated successfully",
      data: updatedVehicle,
    })
  } catch (error) {
    console.error("Error updating vehicle profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Vehicle ID is required" }, { status: 400 })
    }

    let vehicle

    // Try to find by vehicleId first
    vehicle = await Vehicle.findOne({ vehicleId: id })

    // If not found, try to find by MongoDB _id
    if (!vehicle) {
      try {
        vehicle = await Vehicle.findById(id)
      } catch (error) {
        return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
      }
    }

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    const sessionEmail = session.user.email.toLowerCase().trim()
    const vehicleEmail = vehicle.user.gmail.toLowerCase().trim()

    if (vehicleEmail !== sessionEmail) {
      return NextResponse.json({ error: "Forbidden: You can only delete your own vehicle" }, { status: 403 })
    }

    await Vehicle.findByIdAndDelete(vehicle._id)

    return NextResponse.json({
      success: true,
      message: "Vehicle profile deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting vehicle profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
