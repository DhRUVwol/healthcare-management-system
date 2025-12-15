

import connectDB from "@/lib/mongodb";
import Patient from "@/models/Patient";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"; // Import UUID for unique patient ID
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing

// ✅ Handle GET request (fetching all patients)
export async function GET() {
  await connectDB();
  try {
    const patients = await Patient.find();
    return NextResponse.json(patients, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// ✅ Handle POST request (Create new patient)
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.fullName || !body.email || !body.phone || !body.dateOfBirth || !body.gender || !body.password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if email already exists
    const existingPatient = await Patient.findOne({ email: body.email });
    if (existingPatient) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Generate Unique Patient ID
    const patientId = uuidv4();

    // Hash Password before saving
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create new patient
    const patient = new Patient({
      patientId, // Unique ID
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      dateOfBirth: body.dateOfBirth,
      gender: body.gender,
      password: hashedPassword, // Store hashed password
      medicalReports: [],
    });

    await patient.save();

    return NextResponse.json({ message: "Patient created successfully", patientId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}