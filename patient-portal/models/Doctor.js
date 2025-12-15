



// import mongoose from "mongoose";

// const availabilitySchema = new mongoose.Schema({
//   day: { type: String, required: true }, // e.g., "Monday"
//   timeSlots: [{ type: String, required: true }], // e.g., ["9:00 AM - 11:00 AM", "2:00 PM - 4:00 PM"]
// });

// const doctorSchema = new mongoose.Schema(
//   {
//     fullName: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     phone: { type: String, required: true },
//     specialization: { type: String, required: true },
//     qualifications: { type: String, required: true },
//     bio: { type: String, required: true },
//     officeAddress: { type: String, required: true },
//     isActive: { type: Boolean, default: true },
//     availability: { type: [availabilitySchema], default: [] },
//   },
//   { timestamps: true }
// );

// const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

// export default Doctor;







import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  day: { type: String, required: true },
  timeSlots: [{ type: String, required: true }], // ["9:00 AM - 11:00 AM"]
});

const doctorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    specialization: { type: String, required: true },
    qualifications: { type: String, required: true },
    bio: { type: String, required: true },
    officeAddress: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    availability: { type: [availabilitySchema], default: [] },
  },
  { timestamps: true }
);

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default Doctor;