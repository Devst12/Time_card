import { connectDB } from "@/lib/mongoose"
import Vehicle from "@/lib/modals/Vehicle"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const gmail = searchParams.get("gmail")
    let vehicles
    if (gmail) {
      vehicles = await Vehicle.find({ "user.gmail": gmail }).sort({ createdAt: -1 })
    } else {
      vehicles = await Vehicle.find({}).sort({ createdAt: -1 })
    }
    return NextResponse.json({ success: true, data: vehicles })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch vehicles" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }
    const body = await request.json()
    const gmail = session.user.email
    const username = session.user.name || gmail.split("@")[0]
    if (!body.vehicleNumber) {
      return NextResponse.json({ success: false, error: "Vehicle number is required" }, { status: 400 })
    }
    const existing = await Vehicle.findOne({ "user.gmail": gmail })
    if (existing) {
      existing.set({
        ...body,
        user: { gmail, username, status: "enabled" },
        updatedAt: new Date(),
      })
      await existing.save()
      return NextResponse.json({ success: true, data: existing, message: "Updated user with vehicle details" })
    } else {
      const vehicleId = body.vehicleNumber.replace(/\s+/g, "-").toLowerCase()
      const vehicleData = {
        vehicleId,
        fullName: body.fullName,
        drivingLicense: body.drivingLicense,
        roadPermit: body.roadPermit,
        nationalId: body.nationalId,
        gender: body.gender,
        contactNumber: body.contactNumber,
        vehicleNumber: body.vehicleNumber,
        user: { gmail, username, status: "enabled" },
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const vehicle = new Vehicle(vehicleData)
      const savedVehicle = await vehicle.save()
      return NextResponse.json({ success: true, data: savedVehicle, message: "Created new user vehicle details" }, { status: 201 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || "Failed to process vehicle" }, { status: 500 })
  }
}
