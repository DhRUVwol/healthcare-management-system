import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    qualifications: { type: String, required: true },
    bio: { type: String },
    officeAddress: { type: String },
    isActive: { type: Boolean, default: true },
    availability: [
      {
        _id: false,
        day: {
          type: String,
          required: true,
          enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        },
        timeSlots: [
          {
            _id: false,
            startTime: { type: String, required: true },
            endTime: { type: String, required: true }
          }
        ]
      }
    ]
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// // Virtual field for isAvailable
// DoctorSchema.virtual("isAvailable").get(function () {
//   return this.availability && this.availability.length > 0;
// });

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);

export default Doctor;
