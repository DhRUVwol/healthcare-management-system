import { connectDB } from "@/lib/mongodb";
import MedicalReport from "@/models/MedicalReport";

export async function GET(req) {
    await connectDB();
    const reports = await MedicalReport.find().populate("patient doctor");
    return Response.json(reports);
}

export async function POST(req) {
    await connectDB();
    const body = await req.json();
    const newReport = await MedicalReport.create(body);
    return Response.json(newReport);
}