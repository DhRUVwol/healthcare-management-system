import connectDB from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const { name, email, phone, password, role } = await req.json();

    // ✅ Validate input
    if (!name || !email || !phone || !password || !role) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword, // Store hashed password
      role,
    });

    await newUser.save();

    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
    try {
      await connectDB(); // Ensure MongoDB is connected
  
      const users = await User.find({}); // Fetch all users
      return NextResponse.json(users, { status: 200 });
  
    } catch (error) {
      console.error("GET Users Error:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }


// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// connectDB();

// // GET all users
// export async function GET() {
//   try {
//     const users = await User.find();
//     return NextResponse.json({ users }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
//   }
// }

// // Create a new user
// export async function POST(req) {
//   try {
//     const body = await req.json();

//     if (!body.name || !body.email || !body.phone || !body.password) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const existingUser = await User.findOne({ email: body.email });
//     if (existingUser) {
//       return NextResponse.json({ error: "User already exists" }, { status: 400 });
//     }

//     // Hash password before saving
//     const hashedPassword = await bcrypt.hash(body.password, 10);

//     const newUser = new User({
//       name: body.name,
//       email: body.email,
//       phone: body.phone,
//       password: hashedPassword,
//       role: body.role || "patient",
//     });

//     await newUser.save();
//     return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return NextResponse.json({ error: "Error creating user" }, { status: 500 });
//   }
// }