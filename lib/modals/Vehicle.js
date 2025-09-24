import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    drivingLicense: { type: String, required: true, trim: true },
    roadPermit: { type: String, required: true, trim: true },
    nationalId: { type: String, required: true, trim: true },
    gender: { type: String, required: true },
    contactNumber: { type: String, required: true },
    vehicleNumber: { type: String, required: true, trim: true },

    user: {
      gmail: { type: String, required: true, lowercase: true, trim: true },
      username: { type: String, required: true, trim: true },
      status: {
        type: String,
        enum: ["enabled", "disabled"],
        default: "disabled",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Vehicle ||
  mongoose.model("Vehicle", VehicleSchema);