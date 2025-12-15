import connectDB from "@/lib/mongodb";
import Prescription from "@/models/Prescription";

export async function GET(req) {
    await connectDB();
    const prescriptions = await Prescription.find().populate("appointment");
    return Response.json(prescriptions);
}

export async function POST(req) {
    await connectDB();
    const body = await req.json();
    const newPrescription = await Prescription.create(body);
    return Response.json(newPrescription);
}