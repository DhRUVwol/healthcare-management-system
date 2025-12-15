import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  patientName: { type: String, required: true },
  medications: [
    {
      name: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
      duration: { type: String, required: true },
      instructions: { type: String }
    }
  ],
  diagnosis: { type: String, required: true },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.models.Prescription || mongoose.model("Prescription", PrescriptionSchema);
