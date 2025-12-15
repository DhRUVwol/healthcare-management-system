// models/MedicalReport.js
import mongoose from "mongoose";

const MedicalReportSchema = new mongoose.Schema(
  {
    patientId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Patient", 
      required: true 
    },
    doctors: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    }],
    reportType: { 
      type: String, 
      required: true,
      enum: ["lab", "imaging", "pathology", "consultation", "discharge", "other"]
    },
    reportDate: { 
      type: Date, 
      required: true 
    },
    patientName: { 
      type: String, 
      required: true 
    },
    fileName: { 
      type: String, 
      required: true 
    },
    originalFileName: { 
      type: String, 
      required: true 
    },
    fileSize: { 
      type: Number, 
      required: true 
    },
    fileUrl: { 
      type: String, 
      required: true 
    },
    notes: { 
      type: String 
    }
  },
  { timestamps: true }
);

export default mongoose.models.MedicalReport || mongoose.model("MedicalReport", MedicalReportSchema);