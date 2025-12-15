

// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Patient from "@/models/Patient";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//     try {
//         await connectDB();

//         const { email, password } = await req.json();
//         if (!email || !password) {
//             return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
//         }

//         const patient = await Patient.findOne({ email });
//         if (!patient) {
//             return NextResponse.json({ error: "Patient not found" }, { status: 404 });
//         }

//         const isMatch = await bcrypt.compare(password, patient.password);
//         if (!isMatch) {
//             return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
//         }

//         // Generate JWT token
//         const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//         return NextResponse.json({
//             message: "Login successful",
//             token,
//             redirect: "/patient/dashboard"
//         }, { status: 200 });

//     } catch (error) {
//         console.error("Login Error:", error);
//         return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//     }
// }




// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Patient from "@/models/Patient";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await connectDB();

//     const { email, password } = await req.json();
//     if (!email || !password) {
//       return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
//     }

//     const patient = await Patient.findOne({ email });
//     if (!patient) {
//       return NextResponse.json({ error: "Patient not found" }, { status: 404 });
//     }

//     const isMatch = await bcrypt.compare(password, patient.password);
//     if (!isMatch) {
//       return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
//     }

//     // ✅ Generate JWT token
//     const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     // ✅ Return token and user details
//     return NextResponse.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: patient._id,
//         name: patient.name,
//         email: patient.email,
//         age: patient.age,
//         weight: patient.weight,
//         height: patient.height,
//       },
//     }, { status: 200 });

//   } catch (error) {
//     console.error("Login Error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }






import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Patient from "@/models/Patient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const patient = await Patient.findOne({ email });
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // ✅ Return token and patient details
    return NextResponse.json({
      message: "Login successful",
      token,
      patient: {
        id: patient._id,
        patientId: patient.patientId,
        fullName: patient.fullName,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        medicalReports: patient.medicalReports,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}