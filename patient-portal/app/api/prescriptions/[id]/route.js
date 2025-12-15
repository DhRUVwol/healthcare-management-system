// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb"; // Ensure DB connection
// import Prescription from "@/models/Prescription"; // Import Prescription model

// export async function GET(req, { params }) {
//   try {
//     await connectDB();

//     const patientId = params.id; // ✅ Ensure params is properly awaited

//     // Fetch prescriptions for the given patient, populating doctor details
//     const prescriptions = await Prescription.find({ patientId }).populate("doctorId", "name email");

//     return NextResponse.json(prescriptions, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching prescriptions:", error);
//     return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 });
//   }
// }









// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Prescription from "@/models/Prescription";

// export async function GET(req, { params }) {
//   try {
//     await connectDB();

//     const patientId = params.id;
    
//     // Validate patientId
//     if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
//       return NextResponse.json(
//         { error: "Invalid patient ID format" },
//         { status: 400 }
//       );
//     }

//     const prescriptions = await Prescription.find({ patientId })
//       .populate({
//         path: "doctorId",
//         select: "name email",
//         model: "Doctor"
//       })
//       .populate({
//         path: "patientId",
//         select: "name",
//         model: "Patient"
//       })
//       .sort({ createdAt: -1 })
//       .lean(); // Convert to plain JavaScript objects

//     if (!prescriptions || prescriptions.length === 0) {
//       return NextResponse.json(
//         { message: "No prescriptions found for this patient" },
//         { status: 200 }
//       );
//     }

//     // Transform the data for better client-side consumption
//     const transformedPrescriptions = prescriptions.map(prescription => ({
//       ...prescription,
//       patientName: prescription.patientId?.name || prescription.patientName,
//       doctorName: prescription.doctorId?.name || "Unknown Doctor"
//     }));

//     return NextResponse.json(transformedPrescriptions, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching prescriptions:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch prescriptions. Please try again later." },
//       { status: 500 }
//     );
//   }
// }








import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Prescription from "@/models/Prescription";

export async function GET(request, { params }) {
  try {
    await connectDB();

    // Extract patientId from params
    const { id: patientId } = params;

    // Flexible ID validation
    const isValidId = (id) => {
      if (!id) return false;
      
      // UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(id)) return true;
      
      // MongoDB ObjectId format
      const objectIdRegex = /^[0-9a-f]{24}$/i;
      if (objectIdRegex.test(id)) return true;
      
      return false;
    };

    if (!patientId || !isValidId(patientId)) {
      return NextResponse.json(
        { error: "Invalid patient ID format" },
        { status: 400 }
      );
    }

    // Find prescriptions (works with both UUID and ObjectId)
    const prescriptions = await Prescription.find({ patientId })
      .populate({
        path: "doctorId",
        select: "fullName email specialization",
        model: "Doctor"
      })
      .sort({ createdAt: -1 })
      .lean();

    if (!prescriptions || prescriptions.length === 0) {
      return NextResponse.json(
        { message: "No prescriptions found for this patient" },
        { status: 200 }
      );
    }

    // Transform data for client
    const result = prescriptions.map(prescription => ({
      ...prescription,
      id: prescription._id.toString(),
      doctorName: prescription.doctorId?.fullName || "Unknown Doctor",
      doctorSpecialization: prescription.doctorId?.specialization || "",
      _id: undefined,
      doctorId: undefined
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch prescriptions",
        ...(process.env.NODE_ENV === "development" && { details: error.message })
      },
      { status: 500 }
    );
  }
}