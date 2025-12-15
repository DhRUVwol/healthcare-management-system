"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/ui/sidebar"; // Adjust import path as needed

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [id, setId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchPatientId = async () => {
      try {
        const storedPatient = localStorage.getItem("patient");
        if (!storedPatient) {
          setError("User not logged in.");
          return;
        }

        const patientData = JSON.parse(storedPatient);
        if (!patientData.id) {
          setError("Patient ID not found.");
          return;
        }

        setId(patientData.id);
      } catch (err) {
        console.error("❌ Error fetching patient ID:", err.message);
        setError("Failed to retrieve patient details.");
      }
    };

    fetchPatientId();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/appointments?patient=${id}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data) throw new Error("Invalid JSON response");

        setAppointments(data);
      } catch (err) {
        console.error("❌ Fetch Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [id]);

  const getDoctorName = (appointment) => {
    if (appointment.doctor?.fullName) {
      return appointment.doctor.fullName;
    }
    return "Unknown Doctor";
  };

  const getDoctorSpecialization = (appointment) => {
    if (appointment.doctor?.specialization) {
      return appointment.doctor.specialization;
    }
    return "Not specified";
  };

  const filterAppointments = () => {
    const now = new Date();
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      
      switch(activeFilter) {
        case 'upcoming':
          return appointmentDate > now;
        case 'past':
          return appointmentDate < now;
        default:
          return true;
      }
    });
  };

const filteredAppointments = filterAppointments();

return (
  <div className="flex min-h-screen w-full bg-gray-100">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content Area */}
    <div className="flex-grow p-2 md:p-4 ml-0 sm:ml-16"> {/* Reduced padding and margin */}
      <div className="w-full h-full bg-white rounded-lg shadow-md overflow-hidden"> {/* Reduced shadow and rounded corners */}
        <div className="bg-indigo-600 text-white p-3 sm:p-4"> {/* Reduced padding */}
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold"> {/* Slightly smaller text */}
            📅 My Appointment Dashboard
          </h1>
        </div>

        <div className="p-3 sm:p-4"> {/* Reduced padding */}
          <div className="flex justify-center mb-4"> {/* Reduced margin */}
            <div className="bg-indigo-100 rounded-full p-1 inline-flex space-x-1">
              {['all', 'upcoming', 'past'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-2 sm:px-3 py-1 text-xs rounded-full capitalize transition-all ${
                    activeFilter === filter 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-indigo-600 hover:bg-indigo-200'
                  }`}
                >
                  {filter} Appointments
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 animate-pulse">Loading appointments...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No {activeFilter} appointments available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"> {/* Reduced gap */}
              {filteredAppointments.map((appointment) => (
                <div 
                  key={appointment._id} 
                  className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-all p-3"> {/* Reduced padding and rounded corners */}
                
                  <div className="flex justify-between items-center mb-3"> {/* Reduced margin */}
                    <h2 className="text-base font-semibold text-indigo-800"> {/* Slightly smaller text */}
                      {getDoctorName(appointment)}
                    </h2>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-1.5 mb-3"> {/* Reduced spacing */}
                    <p className="text-xs text-gray-600 flex items-center"> {/* Smaller text */}
                      <span className="mr-1">🩺</span> {/* Reduced margin */}
                      {getDoctorSpecialization(appointment)}
                    </p>
                    <p className="text-xs text-gray-600 flex items-center">
                      <span className="mr-1">📅</span>
                      {new Date(appointment.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-gray-600 flex items-center">
                      <span className="mr-1">🕒</span>
                      {appointment.timeSlot}
                    </p>
                  </div>

                  {appointment.meetLink && (
                    <a 
                      href={appointment.meetLink.startsWith('http') ? appointment.meetLink : `https://${appointment.meetLink}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full block text-center text-xs bg-indigo-600 text-white py-1.5 rounded-md hover:bg-indigo-700 transition"
                      onClick={(e) => {
                        e.preventDefault();
                        const url = appointment.meetLink.startsWith('http') ? appointment.meetLink : `https://${appointment.meetLink}`;
                        window.location.href = url;
                      }}
                    >
                      Join Video Consultation
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}

export default AppointmentsPage;









