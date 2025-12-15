// // File: app/api/doctor/profile/route.js
// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Doctor from '@/models/Doctor';
// // import { getServerSession } from 'next-auth/next';
// // import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// export async function GET() {
//   try {
//     await connectDB();
//     const session = await getServerSession(authOptions);
    
//     if (!session) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
    
//     const doctor = await Doctor.findOne({ email: session.user.email });
    
//     if (!doctor) {
//       return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
//     }
    
//     // Return the doctor data (excluding sensitive information)
//     return NextResponse.json({
//       success: true,
//       data: {
//         name: doctor.fullName,
//         email: doctor.email,
//         phone: doctor.phone,
//         specialization: doctor.specialization,
//         qualification: doctor.qualifications,
//         bio: doctor.bio || '',
//         address: doctor.officeAddress || '',
//         availableDays: doctor.availability.map(item => item.day),
//         timeSlots: doctor.availability.map(item => ({
//           day: item.day,
//           start: item.timeSlots[0]?.startTime || '09:00',
//           end: item.timeSlots[0]?.endTime || '17:00'
//         }))
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching doctor profile:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// export async function PUT(request) {
//   try {
//     await connectDB();
//     const session = await getServerSession(authOptions);
    
//     if (!session) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
    
//     const body = await request.json();
    
//     // Find the doctor by email
//     const doctor = await Doctor.findOne({ email: session.user.email });
    
//     if (!doctor) {
//       return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
//     }
    
//     // Update doctor fields
//     doctor.fullName = body.name;
//     doctor.phone = body.phone;
//     doctor.specialization = body.specialization;
//     doctor.qualifications = body.qualification;
//     doctor.bio = body.bio;
//     doctor.officeAddress = body.address;
    
//     // Update availability
//     doctor.availability = body.availableDays.map(day => {
//       const timeSlot = body.timeSlots.find(slot => slot.day === day);
      
//       return {
//         day,
//         timeSlots: [{
//           startTime: timeSlot?.start || '09:00',
//           endTime: timeSlot?.end || '17:00'
//         }]
//       };
//     });
    
//     await doctor.save();
    
//     return NextResponse.json({
//       success: true,
//       message: 'Profile updated successfully'
//     });
//   } catch (error) {
//     console.error('Error updating doctor profile:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }


// import { NextResponse } from "next/server"
// import connectDB from "@/lib/mongodb"
// import Doctor from "@/models/Doctor" // Ensure correct path to your Doctor model

// export async function GET(req) {
//   try {
//     await connectDB()

//     const doctors = await Doctor.find() // Fetch all doctors

//     return NextResponse.json(doctors, { status: 200 })
//   } catch (error) {
//     console.error("Error fetching doctor profile:", error)
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//   }
// }



import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");

    if (!doctorId) {
      return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 });
    }

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: doctor }, { status: 200 });
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
