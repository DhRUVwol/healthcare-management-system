

// import { connectDB } from "@/lib/mongodb";

// export default async function handler(req, res) {
//   if (req.method !== "POST") return res.status(405).end();

//   try {
//     const { email } = req.body;
//     const { db } = await connectToDatabase();

//     // Update doctor approval status
//     const updated = await db.collection("users").updateOne(
//       { email, role: "doctor" },
//       { $set: { isApproved: true } }
//     );

//     if (!updated.modifiedCount) {
//       return res.status(400).json({ message: "Doctor not found or already approved" });
//     }

//     res.status(200).json({ message: "Doctor approved successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }



import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const { doctorId, status } = await req.json();

    // ✅ Ensure valid status
    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    // ✅ Update doctor's status
    await Doctor.findByIdAndUpdate(doctorId, { status });

    return NextResponse.json({ message: `Doctor ${status} successfully` });
  } catch (error) {
    console.error("Error updating doctor status:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}