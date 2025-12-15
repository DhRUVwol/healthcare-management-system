import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Doctor from '../../../../models/Doctor';

export async function GET(request) {
  try {
    await connectDB();

    // Read doctorId from cookies
    const doctorId = request.cookies.get("doctorId")?.value;
    if (!doctorId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    // Fetch doctor details from MongoDB
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
    }

    // Return doctor details
    return NextResponse.json({
      doctor: {
        id: doctor._id.toString(),
        fullName: doctor.fullName,
        email: doctor.email,
        specialization: doctor.specialization,
        isAvailable: doctor.isAvailable,
        bio: doctor.bio,
        officeAddress: doctor.officeAddress
      }
    });

  } catch (error) {
    console.error("Error fetching doctor:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
