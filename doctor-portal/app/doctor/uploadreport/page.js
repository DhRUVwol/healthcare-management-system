"use client";

// pages/upload-reports.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadReportsPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [patientName, setPatientName] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors');
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const data = await response.json();
      setDoctors(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load doctors. Please try again later.');
      setLoading(false);
    }
  };

  const handleDoctorSelection = (doctorId) => {
    setSelectedDoctors(prev => {
      if (prev.includes(doctorId)) {
        return prev.filter(id => id !== doctorId);
      } else {
        return [...prev, doctorId];
      }
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;
    
    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF, JPEG, or PNG file');
      setFile(null);
      return;
    }
    
    // Check file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!file || !reportType || !reportDate || !patientName || selectedDoctors.length === 0) {
      setError('Please fill all required fields and select at least one doctor');
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('reportType', reportType);
      formData.append('reportDate', reportDate);
      formData.append('patientName', patientName);
      formData.append('notes', notes);
      formData.append('doctors', JSON.stringify(selectedDoctors));
      
      const response = await fetch('/api/upload-report', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error uploading report');
      }
      
      setSuccess('Your report has been uploaded successfully!');
      
      // Reset form after successful upload
      setFile(null);
      setReportType('');
      setReportDate('');
      setPatientName('');
      setNotes('');
      setSelectedDoctors([]);
      
      // Option to redirect after successful upload
      // setTimeout(() => router.push('/patient-dashboard'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to upload the report. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Medical Reports</h1>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            id="reportFile"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <label
            htmlFor="reportFile" 
            className="cursor-pointer block"
          >
            <div className="flex flex-col items-center justify-center">
              {file ? (
                <>
                  <span className="text-green-600 font-medium mb-2">
                    File selected: {file.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    Click to change file
                  </span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop your medical report here, or click to select
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    (Accepted formats: PDF, JPEG, PNG. Max size: 5MB)
                  </p>
                </>
              )}
            </div>
          </label>
        </div>

        <div>
          <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
            Patient Name*
          </label>
          <input
            type="text"
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Enter patient name"
          />
        </div>

        <div>
          <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
            Report Type*
          </label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Report Type</option>
            <option value="lab">Laboratory Test</option>
            <option value="imaging">Imaging/Radiology</option>
            <option value="pathology">Pathology</option>
            <option value="consultation">Consultation Note</option>
            <option value="discharge">Discharge Summary</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="reportDate" className="block text-sm font-medium text-gray-700 mb-1">
            Report Date*
          </label>
          <input
            type="date"
            id="reportDate"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Doctors to Share With*
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedDoctors.includes(doctor._id)
                    ? 'bg-blue-50 border-blue-500'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
                onClick={() => handleDoctorSelection(doctor._id)}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedDoctors.includes(doctor._id)}
                    onChange={() => handleDoctorSelection(doctor._id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{doctor.fullName}</p>
                    <p className="text-sm text-gray-500">{doctor.specialization}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add any relevant notes about this medical report..."
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUploading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isUploading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload Report'}
          </button>
        </div>
      </form>
    </div>
  );
}