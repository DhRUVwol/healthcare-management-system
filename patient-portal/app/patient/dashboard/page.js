


"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaVenusMars, FaFileMedical } from "react-icons/fa";

export default function PatientDashboard() {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const storedPatient = localStorage.getItem("patient");
    if (storedPatient) {
      setPatient(JSON.parse(storedPatient));
    }
  }, []);

  if (!patient)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold text-gray-700 animate-pulse">Loading Patient Data...</p>
      </div>
    );

  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      <Sidebar />

      <main className="flex-grow p-2 md:p-3 ml-16"> {/* Slightly increased padding */}
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-3 md:p-4"> {/* Slightly increased padding */}
            <h1 className="text-xl md:text-2xl font-bold text-center"> {/* Increased size on medium screens */}
              👨‍⚕️ Patient Dashboard
            </h1>
          </div>

          <div className="p-3"> {/* Increased padding */}
            <div className="grid grid-cols-1 gap-3"> {/* Increased gap */}
              <div className="bg-white border border-blue-100 rounded-lg shadow-sm p-3 md:p-4"> {/* Increased padding */}
                <div className="flex justify-between items-center mb-3"> {/* Increased margin */}
                  <h2 className="text-lg font-bold text-blue-800 flex items-center"> {/* Increased font size */}
                    <FaUser className="mr-2 text-blue-500" /> Patient Overview
                  </h2>
                </div>

                <div className="space-y-2"> {/* Increased spacing */}
                  <p className="text-sm text-gray-600 flex items-center"> {/* Increased font size */}
                    <FaUser className="text-blue-500 mr-2" />
                    <strong className="w-32">Name:</strong> {patient.fullName}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <FaEnvelope className="text-blue-500 mr-2" />
                    <strong className="w-32">Email:</strong> {patient.email}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <FaPhone className="text-blue-500 mr-2" />
                    <strong className="w-32">Phone:</strong> {patient.phone}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <FaCalendarAlt className="text-blue-500 mr-2" />
                    <strong className="w-32">Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <FaVenusMars className="text-blue-500 mr-2" />
                    <strong className="w-32">Gender:</strong> {patient.gender}
                  </p>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}