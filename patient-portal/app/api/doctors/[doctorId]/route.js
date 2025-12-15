// app/api/doctors/[doctorId]/route.js
import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();
  const { doctorId } = params;

  try {
    const doctor = await Doctor.findById(doctorId).lean();

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json(doctor, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching doctor by ID:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}