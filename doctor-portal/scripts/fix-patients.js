const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config({ path: "../.env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

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

const Patient = mongoose.models.Patient || mongoose.model("Patient", PatientSchema);

async function fixPatients() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas.");

    await Patient.deleteMany({});
    console.log("Cleared old patients.");

    const hashedPassword = await bcrypt.hash("password123", 10);

    await Patient.create({
      id: uuidv4(),
      fullName: "John Doe",
      email: "john@example.com",
      phone: "555-1111",
      dateOfBirth: new Date("1980-05-15"),
      gender: "Male",
      password: hashedPassword,
    });

    await Patient.create({
      id: uuidv4(),
      fullName: "Jane Smith",
      email: "jane@example.com",
      phone: "555-2222",
      dateOfBirth: new Date("1992-08-20"),
      gender: "Female",
      password: hashedPassword,
    });

    console.log("Successfully recreated patients with passwords!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

fixPatients();
