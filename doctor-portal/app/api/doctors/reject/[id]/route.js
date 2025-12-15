import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import jwt from "jsonwebtoken";

export async function PUT(req, { params }) {
  try {
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

    const { id } = params;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    doctor.isApproved = false;
    doctor.isActive = false;
    await doctor.save();

    return NextResponse.json({
      success: true,
      message: "Doctor rejected successfully",
      doctor: {
        _id: doctor._id.toString(),
        name: doctor.name,
        email: doctor.email,
        isApproved: doctor.isApproved,
        isActive: doctor.isActive
      }
    });

  } catch (error) {
    console.error("Error rejecting doctor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reject doctor" },
      { status: 500 }
    );
  }
} 