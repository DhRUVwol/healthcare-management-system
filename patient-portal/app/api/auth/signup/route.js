
// import { connectDB } from "@/lib/mongodb";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export default async function handler(req, res) {
//   if (req.method !== "POST") return res.status(405).end();

//   try {
//     const { name, email, phone, dob, gender, password, role } = req.body;
//     const { db } = await connectToDatabase();

//     // Check if user already exists
//     const existingUser = await db.collection("users").findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Define default user data
//     let userData = {
//       name,
//       email,
//       phone,
//       dob,
//       gender,
//       password: hashedPassword,
//       role,
//     };

//     // If role is "doctor", set "isApproved: false"
//     if (role === "doctor") {
//       userData.isApproved = false; // Doctor needs admin approval
//     }

//     // If role is "admin", reject signup (admin should be added manually)
//     if (role === "admin") {
//       return res.status(403).json({ message: "Admin signup is not allowed." });
//     }

//     // Insert user into MongoDB
//     const newUser = await db.collection("users").insertOne(userData);

//     // Generate JWT Token
//     const token = jwt.sign(
//       { userId: newUser.insertedId, email, role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // Set HTTP-only cookie
//     res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=604800`);

//     res.status(201).json({ message: "User registered", role, token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }



// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// connectDB();

// export async function POST(req) {
//   try {
//     const body = await req.json(); // Ensure this line works properly

//     if (!body.name || !body.email || !body.password) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(body.password, 10);

//     const newUser = new User({
//       name: body.name,
//       email: body.email,
//       phone: body.phone,
//       dateOfBirth: body.dateOfBirth,
//       gender: body.gender,
//       password: hashedPassword,
//       role: body.role || "patient", // Default role to patient
//     });

//     await newUser.save();
//     return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });

//   } catch (error) {
//     console.error("Signup Error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }






// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Patient from "@/models/Patient";
// import bcrypt from "bcryptjs";

// connectDB();

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     if (!body.fullName || !body.email || !body.password) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     // Check if email already exists
//     const existingPatient = await Patient.findOne({ email: body.email });
//     if (existingPatient) {
//       return NextResponse.json({ error: "Email already exists" }, { status: 400 });
//     }

//     // Hash password before saving
//     const hashedPassword = await bcrypt.hash(body.password, 10);

//     // Create new patient object with automatic patientId
//     const newPatient = new Patient({
//       fullName: body.fullName,
//       email: body.email,
//       phone: body.phone,
//       dateOfBirth: body.dateOfBirth,
//       gender: body.gender,
//       password: hashedPassword,
//     });

//     // Save to MongoDB
//     await newPatient.save();

//     // Send data to external API (http://localhost:3001/api/patients)
//     await fetch("http://localhost:3001/api/patients", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newPatient),
//     });

//     return NextResponse.json({ message: "User created successfully", patientId: newPatient.patientId }, { status: 201 });

//   } catch (error) {
//     console.error("Signup Error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }





import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Patient from "@/models/Patient";
import bcrypt from "bcryptjs";

connectDB();

export async function POST(req) {
  try {
    const body = await req.json();

    // Check for missing required fields
    if (!body.fullName || !body.email || !body.password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if email already exists
    const existingPatient = await Patient.findOne({ email: body.email });
    if (existingPatient) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // 🔹 Hash password before saving
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create new patient object
    const newPatient = new Patient({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      dateOfBirth: body.dateOfBirth,
      gender: body.gender,
      password: hashedPassword,  // ✅ Store hashed password
    });

    // Save to MongoDB
    await newPatient.save();

    return NextResponse.json({ message: "User created successfully", patientId: newPatient.patientId }, { status: 201 });

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}