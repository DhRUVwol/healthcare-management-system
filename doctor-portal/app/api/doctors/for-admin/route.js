import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    // Connect to database
    await connectDB();

    // Get token from cookies
    const token = req.cookies.get("adminToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "your_fallback_secret");
      if (decoded.role !== "admin") {
        return NextResponse.json(
          { success: false, error: "Unauthorized access" },
          { status: 401 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Fetch all doctors
    const doctors = await Doctor.find({}, {
      name: 1,
      email: 1,
      specialization: 1,
      isApproved: 1,
      isActive: 1,
      createdAt: 1
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      doctors: doctors.map(doctor => ({
        _id: doctor._id.toString(),
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        isApproved: doctor.isApproved,
        isActive: doctor.isActive,
        createdAt: doctor.createdAt
      }))
    });

  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
} 