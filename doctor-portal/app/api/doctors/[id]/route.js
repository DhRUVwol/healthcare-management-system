import Doctor from "@/models/Doctor";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // Get id from the URL instead of params
    const id = request.url.split('/').pop();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Doctor ID." }, { status: 400 });
    }

    const doctor = await Doctor.findById(id).lean();
    return doctor
      ? NextResponse.json({ success: true, data: doctor }, { status: 200 })
      : NextResponse.json({ error: "Doctor not found." }, { status: 404 });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // Get token from cookies
    const token = request.cookies.get("adminToken")?.value;

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Doctor ID." }, { status: 400 });
    }

    const doctor = await Doctor.findByIdAndDelete(id);

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Doctor removed successfully"
    });

  } catch (error) {
    console.error("Error removing doctor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove doctor" },
      { status: 500 }
    );
  }
}
