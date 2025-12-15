"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FileText, Download, Filter, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';

export default function MedicalReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // Get doctor data from sessionStorage
      const doctorData = JSON.parse(sessionStorage.getItem('doctorData'));
      if (!doctorData?.id) {
        router.push('/doctor/login');
        return;
      }

      const response = await fetch('/api/reports', {
        headers: {
          'Authorization': doctorData.id
        }
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          // Doctor not authenticated, redirect to login
          router.push('/doctor/login');
          return;
        }
        throw new Error(data.message || 'Failed to fetch reports');
      }
      const data = await response.json();
      setReports(data.reports);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports
    .filter(report => {
      const matchesSearch = searchTerm === '' || 
        (report.originalFileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (report.patientName?.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesType = filterType === 'all' || report.reportType === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.reportDate) - new Date(a.reportDate);
      } else if (sortBy === 'name') {
        return (a.patientName || '').localeCompare(b.patientName || '');
      }
      return 0;
    });

  const handleDownload = async (report) => {
    try {
      const response = await fetch(report.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = report.originalFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading file:', err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500 text-center">
            <p className="text-xl font-semibold">Error loading reports</p>
            <p className="mt-2">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Medical Reports</h1>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by patient name or file..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="lab">Laboratory Test</option>
              <option value="imaging">Imaging/Radiology</option>
              <option value="pathology">Pathology</option>
              <option value="consultation">Consultation Note</option>
              <option value="discharge">Discharge Summary</option>
            </select>
            <select
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Patient Name</option>
            </select>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {report.originalFileName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Patient: {report.patientName || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(report.reportDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(report)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {report.reportType}
                  </span>
                </div>
                {report.notes && (
                  <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                    {report.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 