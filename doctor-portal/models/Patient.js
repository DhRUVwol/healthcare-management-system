import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const PatientSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, default: uuidv4 },
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    password: { type: String, required: true },
    medicalReports: [{ type: mongoose.Schema.Types.ObjectId, ref: "MedicalReport" }],
  },
  { timestamps: true }
);

export default mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
