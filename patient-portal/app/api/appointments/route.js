import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";
import Patient from "@/models/Patient"
import { NextResponse } from "next/server";

// 🔹 Convert 12-hour time (AM/PM) to 24-hour format
function convertTo24Hour(time) {
  const [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

// ✅ GET: Fetch appointments
export async function GET(req) {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    const { searchParams } = req.nextUrl;
    const doctorId = searchParams.get("doctorId");
    const id = searchParams.get("patient");
    
    let query = {};
    if (doctorId) query.doctorId = doctorId;
    if (id) query.patient = id;

    const appointments = await Appointment.find(query)
      .populate({
        path: 'doctor',
        select: 'fullName specialization',
        model: 'Doctor'
      })
      .lean();

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("❌ API Error (GET /appointments):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



export async function POST(req) {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    const body = await req.json();
    console.log("📩 Received request body:", body);

    // Extract fields from request body
    const doctorId = body.doctor_id;
    const patientId = body.patient_id;
    // const date = body.date;
    // const timeSlot = body.timeSlot; // Changed from 'time' to 'timeSlot'
    // const reason = body.reason;

    // Validate request body
    if (!doctorId || !patientId ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    if (!doctor.isActive) {
      return NextResponse.json({ error: "Doctor is inactive" }, { status: 403 });
    }

    // Convert time to 24-hour format for consistency (if needed)
    // const formattedTime = convertTo24Hour(timeSlot);
    // console.log("⏰ Converted Time:", formattedTime);

    // Check if appointment slot is available
    // const existingAppointment = await Appointment.findOne({
    //   doctor: doctorId,  // Changed from doctorId to match model
    //   // date,
    //   // timeSlot,          // Changed from formattedTime to match model
    // });

    // if (existingAppointment) {
    //   return NextResponse.json({ error: "Appointment slot is already booked" }, { status: 400 });
    // }

    // Create and save the new appointment
    const appointment = new Appointment({
      doctor: doctorId,  // Changed from doctorId to doctor
      patient: patientId, // Changed from patientId to patient
      // date,
      // timeSlot,          // Changed from time to timeSlot
      // reason,
    });

    await appointment.save();
    console.log("✅ Appointment saved:", appointment);

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("❌ API Error (POST /appointments):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}