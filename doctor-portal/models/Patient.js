import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    medicalReports: [{ type: mongoose.Schema.Types.ObjectId, ref: "MedicalReport" }],
  },
  { timestamps: true }
);

export default mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
