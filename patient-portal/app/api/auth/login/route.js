
// import connectDB from "@/lib/mongodb";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   await connectDB();

//   try {
//     const { email, password } = await req.json();

//     // Validate input
//     if (!email || !password) {
//       return NextResponse.json({ message: "All fields are required" }, { status: 400 });
//     }

//     // Find admin user
//     const user = await User.findOne({ email, role: "admin" });
//     if (!user) {
//       return NextResponse.json({ message: "Admin not found or unauthorized" }, { status: 403 });
//     }

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
//     }

//     // Generate JWT
//     const token = jwt.sign(
//       { userId: user._id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // Set cookie
//     const response = NextResponse.json({
//       message: "Login successful",
//       role: user.role,
//       token,
//     });
//     response.headers.set("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=604800`);

//     return response;
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }






// import bcrypt from "bcryptjs";
// import connectDB from "@/lib/mongodb";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   await connectDB();
  
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       console.log("❌ User not found for email:", email);
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     console.log("✅ User data:", user);
//     console.log("🔹 Entered Password:", password);
//     console.log("🔹 Stored Hashed Password:", user.password);

//     console.log("Entered Password Type:", typeof password);
//     console.log("Stored Hashed Password Type:", typeof user.password);

//     // ✅ Compare password (hash check)
//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log(isMatch);
//     if (!isMatch) {
//       console.log("❌ Password mismatch");
//       return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
//     }

//     return NextResponse.json({ message: "Login successful", redirect: "/admin/dashboard" }, { status: 200 });

//     //return NextResponse.json({ message: "Login successful", user }, { status: 200 });

//   } catch (error) {
//     console.error("Login error:", error);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }




import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // ✅ Ensure MongoDB connection is established before querying
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // ✅ Fetch user from DB
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found for email:", email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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

    if (!isMatch) {
      console.log("❌ Password mismatch");
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    console.log("✅ Login successful");
    return NextResponse.json({ message: "Login successful", redirect: "/admin/dashboard" }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}