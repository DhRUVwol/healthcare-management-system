

import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import { NextResponse } from "next/server";

// 🔹 Generate unique doctorId
async function generateDoctorId() {
  const lastDoctor = await Doctor.findOne().sort({ doctorId: -1 });
  if (!lastDoctor || !lastDoctor.doctorId) {
    return "D01";
  }
  const lastNumber = parseInt(lastDoctor.doctorId.substring(1)) + 1;
  return `D${lastNumber.toString().padStart(2, "0")}`; // ✅ Corrected Template String
}

// ✅ GET all doctors
export async function GET() {
  await connectDB();
  try {
    const doctors = await Doctor.find({ isActive: true }).lean();

    // Ensure virtual field isAvailable is included
    doctors.forEach(doctor => {
      doctor.isAvailable = doctor.availability && doctor.availability.length > 0;
    });

    return NextResponse.json(doctors, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST new doctor
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const existingDoctor = await Doctor.findOne({ email: body.email });

    if (existingDoctor) {
      return NextResponse.json({ error: "Doctor with this email already exists." }, { status: 400 });
    }

    // 🔹 Generate doctorId
    const doctorId = await generateDoctorId();

    const doctor = await Doctor.create({
      ...body,
      doctorId,
      isActive: body.isActive === false ? false : true // ✅ Default to true if missing
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// ✅ PATCH to update availability
export async function PATCH(req) {
  await connectDB();
  try {
    const { id, ...updateFields } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Doctor ID is required." }, { status: 400 });
    }

    // Ensure fields exist in schema before updating
    const allowedFields = [
      "fullName", "email", "phone", "password", "specialization",
      "qualifications", "bio", "officeAddress", "isActive", "availability"
    ];

    // Filter out invalid fields
    const filteredUpdates = {};
    Object.keys(updateFields).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updateFields[key];
      }
    });

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json({ error: "No valid fields provided for update." }, { status: 400 });
    }

    // Update doctor in database
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: filteredUpdates },
      { new: true, lean: true }
    );

    if (!updatedDoctor) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }

    // Ensure virtual field `isAvailable` is included
    updatedDoctor.isAvailable = updatedDoctor.availability && updatedDoctor.availability.length > 0;

    return NextResponse.json({ message: "Doctor updated successfully", doctor: updatedDoctor }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
