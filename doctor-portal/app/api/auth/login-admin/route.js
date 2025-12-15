import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // ✅ Ensure MongoDB connection is established before querying
    await connectDB();
    
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    
    // ✅ Check if user exists
    const user = await User.findOne({ email });
    
    // ✅ Handle email not found
    if (!user) {
      console.log("❌ User not found for email:", email);
      return NextResponse.json({ 
        success: false,
        error: "No account found with this email address" 
      }, { status: 404 });
    }
    
    console.log("✅ User data:", user);
    console.log("🔹 Entered Password:", password);
    console.log("🔹 Stored Hashed Password:", user.password);
    
    // ✅ Ensure the password exists before comparing
    if (!user.password) {
      console.log("❌ User password is missing in DB");
      return NextResponse.json({ error: "Password not set. Please reset your password." }, { status: 400 });
    }
    
    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch);
    
    // ✅ Handle password mismatch
    if (!isMatch) {
      console.log("❌ Password mismatch for email:", email);
      return NextResponse.json({ 
        success: false,
        error: "Incorrect password" 
      }, { status: 401 });
    }
    
    console.log("✅ Login successful");
    
    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role || "user" },
      process.env.JWT_SECRET_KEY || "your_fallback_secret",
      { expiresIn: "1h" }
    );
    
    // ✅ Create response object
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || "user"
      }
    });
    
    // ✅ Set JWT as httpOnly Cookie
    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 // 1 hour expiration
    });
    
    return response;
    
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ 
      success: false,
      error: "Authentication failed. Please try again later." 
    }, { status: 500 });
  }
}