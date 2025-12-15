import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';
import MedicalReport from '@/models/MedicalReport';

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await writeFile(path.join(uploadsDir, '.gitkeep'), '');

    // Parse the form data
    const formData = await request.formData();
    
    // Get the file
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Get other form fields
    const reportType = formData.get('reportType');
    const reportDate = formData.get('reportDate');
    const patientName = formData.get('patientName');
    const notes = formData.get('notes');
    const doctorsJson = formData.get('doctors');

    // Parse doctors array
    let doctors = [];
    try {
      doctors = JSON.parse(doctorsJson);
    } catch (error) {
      console.error('Error parsing doctors array:', error);
      return NextResponse.json(
        { message: 'Invalid doctors data' },
        { status: 400 }
      );
    }

    console.log('Received form data:', {
      reportType,
      reportDate,
      patientName,
      notes,
      doctors,
      fileName: file.name,
      fileSize: file.size
    });

    // Validate required fields
    if (!reportType || !reportDate || !patientName || !doctors || doctors.length === 0) {
      console.log('Missing required fields:', {
        reportType: !!reportType,
        reportDate: !!reportDate,
        patientName: !!patientName,
        doctors: doctors?.length
      });
      return NextResponse.json(
        { message: 'Missing required fields', 
          received: { reportType, reportDate, patientName, doctors } 
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueFilename = `${Date.now()}-${uuidv4()}-${file.name}`;
    const filepath = path.join(uploadsDir, uniqueFilename);

    // Save the file
    await writeFile(filepath, buffer);
    console.log('File saved to:', filepath);

    // Get patient ID (using a test ID for now)
    const patientId = '644f89a85c4222c4a888e1a5';
    
    // Get the file path relative to the public directory
    const relativeFilePath = `/uploads/${uniqueFilename}`;
    
    // Create the medical report
    const reportData = {
      patientId,
      patientName: patientName.trim(), // Ensure patient name is trimmed
      doctors, // Add the selected doctors array
      reportType,
      reportDate: new Date(reportDate),
      fileName: uniqueFilename,
      originalFileName: file.name,
      fileSize: file.size,
      fileUrl: relativeFilePath,
      notes: notes || '',
    };

    console.log('Creating report with data:', reportData);
    
    const newReport = new MedicalReport(reportData);
    
    // Save the report
    const savedReport = await newReport.save();
    console.log('Report saved successfully:', savedReport);
    
    // Update the patient's medicalReports array
    await Patient.findByIdAndUpdate(
      patientId,
      { $push: { medicalReports: savedReport._id } }
    );
    console.log('Updated patient with new report');

    // Return success response with more details for debugging
    return NextResponse.json({
      message: 'Report uploaded successfully',
      report: {
        id: savedReport._id,
        filename: file.name,
        type: reportType,
        date: reportDate,
        patientName: savedReport.patientName,
        fileUrl: relativeFilePath,
        doctors: savedReport.doctors
      },
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { message: 'Failed to upload file', error: error.message },
      { status: 500 }
    );
  }
}