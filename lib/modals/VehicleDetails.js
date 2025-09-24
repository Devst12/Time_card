import mongoose from "mongoose";

const VehicleDetailsSchema = new mongoose.Schema(
  {
    userGmail: { type: String, required: true, lowercase: true, trim: true },

    routes: [
      {
        from: { type: String, required: true },
        to: { type: String, required: true },
        departureTime: { type: String, required: true },
      },
    ],

    drivers: [
      {
        name: { type: String, required: true },
        age: { type: Number },
        gender: {
          type: String,
          enum: ["Male", "Female", "Other"],
          required: true,
        },
        contactNumber: { type: String },
        imageUrl: { type: String }, // driver photo from ImgBB
      },
    ],

    vehicle: {
      name: { type: String, required: true },
      number: { type: String, required: true },
      capacity: { type: Number, required: true },
      images: [{ type: String }], // multiple vehicle photos
    },
  },
  { timestamps: true }
);

// Normalize gender casing
VehicleDetailsSchema.pre("save", function (next) {
  if (this.drivers) {
    this.drivers = this.drivers.map((d) => ({
      ...d,
      gender: d.gender
        ? d.gender.charAt(0).toUpperCase() + d.gender.slice(1).toLowerCase()
        : d.gender,
    }));
  }
  next();
});

export default mongoose.models.VehicleDetails ||
  mongoose.model("VehicleDetails", VehicleDetailsSchema);