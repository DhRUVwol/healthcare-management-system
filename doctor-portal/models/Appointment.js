import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  date: { type: Date, required: true },
  day: { type: String, required: true },
  timeSlot: { type: String, required: true },
  amount: { type: String },
  reason: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending" },
  meetLink: { type: String }
}, { timestamps: true });

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);
