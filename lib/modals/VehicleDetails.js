import mongoose from "mongoose"

const VehicleDetailsSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    routes: [
      {
        from: { type: String, required: true, trim: true },
        to: { type: String, required: true, trim: true },
        departureTime: { type: String, required: true },
      },
    ],
    drivers: [
      {
        name: { type: String, required: true, trim: true },
        age: { type: Number, required: true },
        gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
        contactNumber: { type: String, required: true, trim: true },
        imageUrl: { type: String, default: "" },
      },
    ],
    vehicle: {
      name: { type: String, required: true, trim: true },
      number: { type: String, required: true, trim: true },
      capacity: { type: Number, required: true },
      images: [{ type: String }],
    },
  },
  { timestamps: true },
)

export default mongoose.models.VehicleDetails || mongoose.model("VehicleDetails", VehicleDetailsSchema)
