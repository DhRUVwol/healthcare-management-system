import connectDB from "@/lib/mongodb";
import Prescription from "@/models/Prescription";
import Patient from "@/models/Patient";
import Doctor from "@/models/Doctor";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const { doctorId, patientId, patientName, diagnosis, medications, notes } = await req.json();

    // Validate required fields
    if (!doctorId || !patientId) {
      return NextResponse.json({ error: "Doctor ID and Patient ID are required" }, { status: 400 });
    }

    // Check if the doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Check if patient exists
    const patient = await Patient.findOne({ _id: patientId, fullName: patientName });
    if (!patient) {
      return NextResponse.json({ error: "Patient not found or name does not match" }, { status: 404 });
    }

    // Create the prescription
    const prescription = await Prescription.create({
      doctorId,
      patientId,
      patientName,
      diagnosis,
      medications,
      notes
    });

    return NextResponse.json({ message: "Prescription created successfully", prescription }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");
    const doctorId = searchParams.get("doctorId");

    if (!patientId && !doctorId) {
      return NextResponse.json({ error: "Either Patient ID or Doctor ID is required" }, { status: 400 });
    }

    let query = {};
    if (patientId) query.patientId = patientId;
    if (doctorId) query.doctorId = doctorId;

    const prescriptions = await Prescription.find(query)
      .populate('doctorId', 'name')
      .populate('patientId', 'fullName');

    return NextResponse.json(prescriptions, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
  