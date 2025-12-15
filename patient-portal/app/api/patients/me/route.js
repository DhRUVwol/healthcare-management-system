

// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Patient from "@/models/Patient";
// import { verifyToken } from "@/lib/auth";  // Helper function to verify token

// export async function GET(req) {
//     try {
//         await connectDB();  // Ensure MongoDB is connected

//         // Extract token from Authorization header
//         const authHeader = req.headers.get("authorization");
//         if (!authHeader) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }

//         const token = authHeader.split(" ")[1]; // "Bearer <token>"
//         const decoded = verifyToken(token); // Decode JWT token

//         if (!decoded) {
//             return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//         }

//         // Find patient using the decoded token's user ID
//         const patient = await Patient.findById(decoded.id).select("-password"); // Exclude password

//         if (!patient) {
//             return NextResponse.json({ error: "Patient not found" }, { status: 404 });
//         }

//         return NextResponse.json(patient, { status: 200 });

//     } catch (error) {
//         console.error("Error fetching patient data:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }







import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Patient from "@/models/Patient";
import { verifyToken } from "@/lib/auth";  // Helper function to verify token

export async function GET(req) {
    try {
        await connectDB();  // Ensure MongoDB is connected

        // Extract token from Authorization header
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1]; // Extract token
        const decoded = verifyToken(token); // Decode JWT token

        if (!decoded || !decoded.id) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // Find patient using the decoded token's user ID
        const patient = await Patient.findById(decoded.id).select("-password"); // Exclude password

        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        return NextResponse.json({ _id: patient._id, fullName: patient.fullName, email: patient.email }, { status: 200 });

    } catch (error) {
        console.error("Error fetching patient data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}