import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";
import Patient from "@/models/Patient";
import { NextResponse } from "next/server";

// ✅ Handle GET request (Fetch appointments by doctor or patient ID)
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");
    const patientId = searchParams.get("patientId");

    if (!doctorId && !patientId) {
      return NextResponse.json({ success: false, error: "Doctor ID or Patient ID is required" }, { status: 400 });
    }

    const filter = doctorId ? { doctor: doctorId } : { patient: patientId };
    
    // Populate both patient and doctor information with correct field names
    const appointments = await Appointment.find(filter)
      .populate('patient', 'fullName')
      .populate('doctor', 'name')
      .sort({ date: 1, timeSlot: 1 });

    return NextResponse.json({ success: true, data: appointments }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ Handle POST request (Create new appointment)
export async function POST(req) {
  await connectDB();
  try {
    const { doctor, patient, date, timeSlot, reason } = await req.json();

    if (!doctor || !patient || !date || !timeSlot || !reason) {
      return NextResponse.json({ error: "Doctor ID, Patient ID, Date, Time Slot, and Reason are required" }, { status: 400 });
    }

    // Validate doctor and patient existence
    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Convert date to a weekday (e.g., "Monday")
    const appointmentDate = new Date(date);
    const options = { weekday: "long" };
    const appointmentDay = appointmentDate.toLocaleDateString("en-US", options);

    // Check if doctor is available on the selected day
    const availability = doctorExists.availability.find(day => day.day === appointmentDay);

    if (!availability) {
      return NextResponse.json({ error: `Doctor is not available on ${appointmentDay}` }, { status: 400 });
    }

    // Parse the requested time slot
    const [requestStart, requestEnd] = timeSlot.split(" - ");
    
    // Check if doctor is available at the selected time slot
    const isTimeSlotAvailable = availability.timeSlots.some(slot => {
      return slot.startTime <= requestStart && slot.endTime >= requestEnd;
    });

    if (!isTimeSlotAvailable) {
      return NextResponse.json({ error: `Doctor is not available at ${timeSlot} on ${appointmentDay}` }, { status: 400 });
    }

    // Ensure the doctor isn't already booked at this time
    const existingAppointment = await Appointment.findOne({ doctor, date, timeSlot });
    if (existingAppointment) {
      return NextResponse.json({ error: `Time slot ${timeSlot} on ${appointmentDay} is already booked` }, { status: 400 });
    }

    // Create the appointment with all required fields including reason
    const newAppointment = await Appointment.create({
      doctor: doctor,
      patient: patient,
      date: appointmentDate,
      day: appointmentDay,
      timeSlot: timeSlot,
      reason: reason
    });

    return NextResponse.json(newAppointment, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// In your API route file
export async function PATCH(req) {
  await connectDB();
  try {
    const { appointmentId, status, meetLink, amount, date, timeSlot } = await req.json();

    if (!appointmentId || !status) {
      return NextResponse.json({ success: false, error: "Appointment ID and status are required" }, { status: 400 });
    }

    // Validate status
    const validStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    // If status is Confirmed, meetLink is required
    if (status === "Confirmed" && !meetLink) {
      return NextResponse.json({ success: false, error: "Google Meet link is required when confirming an appointment" }, { status: 400 });
    }

    const updateData = { status };
    if (meetLink) updateData.meetLink = meetLink;
    if (amount !== null && amount !== undefined) updateData.amount = amount;
    if (date) updateData.date = new Date(date);
    if (timeSlot) updateData.timeSlot = timeSlot;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true }
    ).populate('patient', 'fullName')
     .populate('doctor', 'name');

    if (!updatedAppointment) {
      return NextResponse.json({ success: false, error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedAppointment }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}