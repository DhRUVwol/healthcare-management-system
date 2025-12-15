import mongoose from "mongoose";

const MedicalReportSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ["pdf", "jpg", "jpeg"], required: true },
}, { timestamps: true });

export default mongoose.models.MedicalReport || mongoose.model("MedicalReport", MedicalReportSchema);