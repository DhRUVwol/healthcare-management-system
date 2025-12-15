import connectDB from "@/lib/mongodb";
import Patient from "@/models/Patient";
import { NextResponse } from "next/server";

// GET a specific patient
export async function GET(_, { params }) {
  await connectDB();
  try {
    const { patientId } = params;
    const patient = await Patient.findOne({ patientId });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE a specific patient
export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { patientId } = params;
    const body = await req.json();

    const updatedPatient = await Patient.findOneAndUpdate(
      { patientId },
      { $set: body },
      { new: true }
    );

    if (!updatedPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Patient updated", patient: updatedPatient }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a specific patient
export async function DELETE(_, { params }) {
  await connectDB();
  try {
    const { patientId } = params;

    const deletedPatient = await Patient.findOneAndDelete({ patientId });

    if (!deletedPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Patient deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}