import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Doctor from "@/models/Doctor";
import Patient from "@/models/Patient";
import Appointment from "@/models/Appointment";
import Prescription from "@/models/Prescription";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();

    // 1. Wipe database
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    await Prescription.deleteMany({});

    console.log("Database wiped clean.");

    // 2. Create Admin
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "Super Admin",
      email: "admin@hospital.com",
      phone: "1234567890",
      password: hashedPassword, // The pre-save hook might double hash if we pass plaintext, so let's pass plain text and let the hook do it.
      role: "admin",
    });
    // Wait, the pre save hook hashes the password if it's modified.
    // Let's update Admin to use plain text during creation so the hook works properly:
    await User.deleteMany({});
    await User.create({
      name: "Super Admin",
      email: "admin@hospital.com",
      phone: "1234567890",
      password: "password123",
      role: "admin",
    });

    // 3. Create Doctors
    const doc1 = await Doctor.create({
      fullName: "Dr. Gregory House",
      email: "house@hospital.com",
      phone: "555-0101",
      password: "password123", // Assuming Doctor doesn't have a pre-save hook? Wait, let's check Doctor.js. It doesn't have one! 
      specialization: "Diagnostic Medicine",
      qualifications: "MD, Nephrology, Infectious Diseases",
      bio: "Brilliant diagnostician with a terrible bedside manner.",
      officeAddress: "Room 201, PPTH",
      isActive: true,
      availability: [
        { day: "Monday", timeSlots: [{ startTime: "09:00", endTime: "12:00" }] },
        { day: "Wednesday", timeSlots: [{ startTime: "13:00", endTime: "17:00" }] },
      ]
    });

    // Wait, since Doctor.js has no pre-save hook, I should hash its password manually.
    await Doctor.deleteMany({});
    const hashedDocPassword = await bcrypt.hash("password123", 10);
    const doctor1 = await Doctor.create({
      fullName: "Dr. Gregory House",
      email: "house@hospital.com",
      phone: "555-0101",
      password: hashedDocPassword,
      specialization: "Diagnostic Medicine",
      qualifications: "MD, Nephrology",
      bio: "Brilliant diagnostician.",
      officeAddress: "Room 201",
      isActive: true,
      availability: [
        { day: "Monday", timeSlots: [{ startTime: "09:00", endTime: "12:00" }] },
      ]
    });

    const doctor2 = await Doctor.create({
      fullName: "Dr. James Wilson",
      email: "wilson@hospital.com",
      phone: "555-0102",
      password: hashedDocPassword,
      specialization: "Oncology",
      qualifications: "MD, Oncology",
      bio: "Head of Oncology.",
      officeAddress: "Room 202",
      isActive: true,
      availability: [
        { day: "Tuesday", timeSlots: [{ startTime: "10:00", endTime: "14:00" }] },
      ]
    });

    // Create Doctor Users in User collection (Doctor portal login checks User collection in [...nextauth])
    await User.create({
      name: doctor1.fullName,
      email: doctor1.email,
      phone: doctor1.phone,
      password: "password123",
      role: "doctor",
    });
    
    await User.create({
      name: doctor2.fullName,
      email: doctor2.email,
      phone: doctor2.phone,
      password: "password123",
      role: "doctor",
    });

    // 4. Create Patients
    // Check Patient.js - it doesn't have a password field in the doctor portal's model! 
    // But wait, patient-portal has its own model or uses the same db? 
    // We'll create Patient anyway.
    const patient1 = await Patient.create({
      fullName: "John Doe",
      email: "john@example.com",
      phone: "555-1111",
      dateOfBirth: new Date("1980-05-15"),
      gender: "Male",
      password: await bcrypt.hash("password123", 10), // Adding password just in case patient portal needs it
    });

    const patient2 = await Patient.create({
      fullName: "Jane Smith",
      email: "jane@example.com",
      phone: "555-2222",
      dateOfBirth: new Date("1992-08-20"),
      gender: "Female",
      password: await bcrypt.hash("password123", 10),
    });

    // Patient portal login checks Patient collection.

    // 5. Create Appointments
    const appt1 = await Appointment.create({
      doctor: doctor1._id,
      patient: patient1._id,
      date: new Date("2024-07-01"),
      day: "Monday",
      timeSlot: "09:00 - 09:30",
      reason: "Chronic Leg Pain",
      status: "Confirmed",
      meetLink: "https://meet.google.com/abc-defg-hij"
    });

    const appt2 = await Appointment.create({
      doctor: doctor2._id,
      patient: patient2._id,
      date: new Date("2024-07-02"),
      day: "Tuesday",
      timeSlot: "10:00 - 10:30",
      reason: "Routine Checkup",
      status: "Pending",
    });

    // 6. Create Prescription
    await Prescription.create({
      doctorId: doctor1._id,
      patientId: patient1._id,
      appointmentId: appt1._id,
      patientName: patient1.fullName,
      medications: [
        {
          name: "Vicodin",
          dosage: "5mg",
          frequency: "Twice daily",
          duration: "7 days",
          instructions: "Take with food"
        }
      ],
      diagnosis: "Muscle strain",
      notes: "Patient needs to rest and avoid heavy lifting."
    });

    return NextResponse.json({ message: "Database seeded successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
