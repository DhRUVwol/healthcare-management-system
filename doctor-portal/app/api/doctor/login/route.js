// import { NextResponse } from 'next/server';
// import bcrypt from 'bcrypt';
// import connectDB from '../../../../lib/mongodb';
// import Doctor from '../../../../models/Doctor';

// export async function POST(request) {
//   try {
//     await connectDB();
    
//     // Parse request body
//     const { email, password } = await request.json();
//     if (!email || !password) {
//       return NextResponse.json(
//         { message: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // Check if doctor exists
//     const doctor = await Doctor.findOne({ email });
//     if (!doctor) {
//       return NextResponse.json(
//         { message: "Doctor not found" },
//         { status: 404 }
//       );
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, doctor.password);
//     if (!isMatch) {
//       return NextResponse.json(
//         { message: "Invalid credentials" },
//         { status: 400 }
//       );
//     }

//     // Check if doctor is active
//     if (!doctor.isActive) {
//       return NextResponse.json(
//         { message: "Your account is currently inactive. Please contact the administrator." },
//         { status: 403 }
//       );
//     }

//     // Prepare response
//     const response = NextResponse.json({
//       message: "Login successful",
//       doctor: {
//         id: doctor._id.toString(),
//         fullName: doctor.fullName,
//         email: doctor.email,
//         specialization: doctor.specialization,
//         isAvailable: doctor.isAvailable
//       }
//     });

//     // Set doctor ID in a secure cookie (valid for 1 day)
//     response.cookies.set("doctorId", doctor._id.toString(), {
//       httpOnly: true, // Prevents access from JavaScript
//       secure: process.env.NODE_ENV === "production", // Secure in production
//       sameSite: "Strict", // Prevents CSRF attacks
//       maxAge: 24 * 60 * 60 // 1 day expiration
//     });

//     return response;
    
//   } catch (error) {
//     console.error("Doctor login error:", error);
//     return NextResponse.json(
//       { message: "Server error", error: error.message },
//       { status: 500 }
//     );
//   }
// }


// import { NextResponse } from 'next/server';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import connectDB from '../../../../lib/mongodb';
// import Doctor from '../../../../models/Doctor';

// export async function POST(request) {
//   try {
//     await connectDB();
    
//     // Parse request body
//     const { email, password } = await request.json();
//     if (!email || !password) {
//       return NextResponse.json(
//         { message: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // Check if doctor exists
//     const doctor = await Doctor.findOne({ email });
//     if (!doctor) {
//       return NextResponse.json(
//         { message: "Doctor not found" },
//         { status: 404 }
//       );
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, doctor.password);
//     if (!isMatch) {
//       return NextResponse.json(
//         { message: "Invalid credentials" },
//         { status: 400 }
//       );
//     }

//     // Check if doctor is active
//     if (!doctor.isActive) {
//       return NextResponse.json(
//         { message: "Your account is currently inactive. Please contact the administrator." },
//         { status: 403 }
//       );
//     }

//     // ✅ Generate JWT Token
//     const token = jwt.sign(
//       { id: doctor._id.toString(), email: doctor.email },
//       process.env.JWT_SECRET_KEY, // New version using environment variable, // Replace with an environment variable for security
//       { expiresIn: "1h" }
//     );

//     // ✅ Prepare response with token
//     return NextResponse.json({
//       message: "Login successful",
//       doctor: {
//         id: doctor._id.toString(),
//         fullName: doctor.fullName,
//         email: doctor.email,
//         specialization: doctor.specialization,
//         isAvailable: doctor.isAvailable
//       },
//       token  // ✅ Now returning token
//     });
    
//   } catch (error) {
//     console.error("Doctor login error:", error);
//     return NextResponse.json(
//       { message: "Server error", error: error.message },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import Doctor from '../../../../models/Doctor';

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your_fallback_secret"; // ✅ Use a fallback for local testing

export async function POST(request) {
  try {
    await connectDB();
    
    // Parse request body
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if doctor exists
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Check if doctor is active
    if (!doctor.isActive) {
      return NextResponse.json(
        { message: "Your account is currently inactive. Please contact the administrator." },
        { status: 403 }
      );
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: doctor._id.toString(), email: doctor.email },
      SECRET_KEY, 
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // ✅ Create response object
    const response = NextResponse.json({
      message: "Login successful",
      doctor: {
        id: doctor._id.toString(), // Ensure ID is always a string
        fullName: doctor.fullName,
        email: doctor.email,
        specialization: doctor.specialization,
        isAvailable: doctor.isAvailable
      },
      token  // ✅ Return JWT token in response
    });

    // ✅ Set JWT as httpOnly Cookie (Optional but Recommended)
    response.cookies.set("doctorToken", token, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "Strict", // CSRF protection
      maxAge: 60 * 60 // 1 hour expiration
    });

    return response;
    
  } catch (error) {
    console.error("Doctor login error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
