import mongoose from "mongoose"

const VehicleSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullName: { type: String, required: true, trim: true },
    drivingLicense: { type: String, required: true, trim: true },
    roadPermit: { type: String, required: true, trim: true },
    nationalId: { type: String, required: true, trim: true },
    gender: { type: String, required: true },
    contactNumber: { type: String, required: true },
    vehicleNumber: { type: String, required: true, trim: true },
    user: {
      gmail: { type: String, lowercase: true, trim: true },
      username: { type: String, trim: true },
      status: {
        type: String,
        enum: ["enabled", "disabled"],
        default: "disabled",
      },
    },
  },
  { timestamps: true },
)

VehicleSchema.index({ vehicleId: 1 })
VehicleSchema.index({ "user.gmail": 1 })

export default mongoose.models.Vehicle || mongoose.model("Vehicle", VehicleSchema)
