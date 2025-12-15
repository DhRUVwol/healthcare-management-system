import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import { NextResponse } from "next/server";

// 🔹 Convert 12-hour time (AM/PM) to 24-hour format
function convertTo24Hour(time) {
  const [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}


export async function GET(req) {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    const { searchParams } = req.nextUrl;
    const statusFilter = searchParams.get("status");

    let doctors;
    if (statusFilter === "pending") {
      doctors = await Doctor.find({ isActive: false }).lean();
    } else {
      doctors = await Doctor.find({ isActive: true }).lean();

      const currentTime = new Date();
      const currentDay = currentTime.toLocaleString("en-US", { weekday: "long" });
      const currentTimeString = `${currentTime.getHours().toString().padStart(2, "0")}:${currentTime.getMinutes().toString().padStart(2, "0")}`;

      doctors = doctors.map((doctor) => {
        let isCurrentlyAvailable = doctor.availability?.some((slot) => {
          if (slot.day === currentDay) {
            return slot.timeSlots.some((timeSlot) => {
              if (typeof timeSlot === "string" && timeSlot.includes(" - ")) {
                const [startTime, endTime] = timeSlot.split(" - ").map((time) => convertTo24Hour(time.trim()));
                return currentTimeString >= startTime && currentTimeString <= endTime;
              }
              return false; // Ignore invalid timeSlots
            });
          }
          return false;
        });

        return { ...doctor, isAvailable: isCurrentlyAvailable };
      });
    }

    return NextResponse.json(doctors, { status: 200 });
  } catch (error) {
    console.error("❌ API Error (GET /doctors):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// ✅ POST: Add a new doctor
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const existingDoctor = await Doctor.findOne({ email: body.email });

    if (existingDoctor) {
      return NextResponse.json({ error: "Doctor with this email already exists." }, { status: 400 });
    }

    const doctor = await Doctor.create(body);
    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error("API Error (POST /doctors):", error);
    return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
  }
}

// ✅ PATCH: Update doctor's availability
export async function PATCH(req) {
  await connectDB();
  try {
    const { _id, availability } = await req.json(); // ✅ Fix: Using `_id` instead of `doctorId`

    if (!_id || !Array.isArray(availability)) {
      return NextResponse.json({ error: "Invalid doctor ID or availability data." }, { status: 400 });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      _id,
      { availability },
      { new: true, lean: true }
    );

    if (!updatedDoctor) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }

    return NextResponse.json(updatedDoctor, { status: 200 });
  } catch (error) {
    console.error("API Error (PATCH /doctors):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}