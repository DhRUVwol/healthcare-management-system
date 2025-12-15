import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MedicalReport from '@/models/MedicalReport';

export async function GET(request) {
  try {
    await connectDB();
    console.log('Connected to MongoDB in reports API');

    // Get doctor ID from Authorization header
    const doctorId = request.headers.get('Authorization');
    if (!doctorId) {
      return NextResponse.json(
        { message: 'Doctor not authenticated' },
        { status: 401 }
      );
    }
    
    // Find reports where the doctor is in the doctors array
    const reports = await MedicalReport.find({ doctors: doctorId })
      .select('patientName reportType reportDate fileName originalFileName fileSize fileUrl notes')
      .sort({ reportDate: -1 });

    console.log('Fetched reports:', reports);

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { message: 'Failed to fetch reports', error: error.message },
      { status: 500 }
    );
  }
}
