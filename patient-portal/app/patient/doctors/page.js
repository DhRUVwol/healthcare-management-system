"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import { Search, Calendar, MapPin, Clock, Star } from "lucide-react";

export default function AvailableDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [patientId, setPatientId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [specializationFilter, setSpecializationFilter] = useState("all");

    useEffect(() => {
        async function fetchDoctors() {
            try {
                const response = await fetch("/api/doctors");
                const data = await response.json();
                if (Array.isArray(data)) {
                    setDoctors(data);
                } else {
                    console.error("Invalid API response:", data);
                    setDoctors([]);
                }
            } catch (error) {
                console.error("Failed to fetch doctors:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDoctors();

        async function fetchPatientId() {
            try {
                const storedPatient = localStorage.getItem("patient");
                if (storedPatient) {
                    const patientData = JSON.parse(storedPatient);
                    setPatientId(patientData.id);
                }
            } catch (error) {
                console.error("Error fetching patient ID:", error);
            }
        }
        fetchPatientId();
    }, []);

    async function requestAppointment(doctor_id) {
        try {
            if (!patientId) {
                alert("You must be logged in as a patient to request an appointment.");
                return;
            }

            const response = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ doctor_id, patient_id: patientId }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Failed to request appointment.");
            } else {
                alert("Appointment request sent successfully!");
            }
        } catch (error) {
            console.error("❌ Error requesting appointment:", error);
            alert("Something went wrong. Try again later.");
        }
    }

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialization = specializationFilter === "all" || 
                                    doctor.specialization === specializationFilter;
        return matchesSearch && matchesSpecialization;
    });

    const specializations = [...new Set(doctors.map(doctor => doctor.specialization))];

    return (
        <div className="flex min-h-screen w-full bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-grow p-4 md:p-6 ml-0 sm:ml-16">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Doctors</h1>
                        
                        {/* Search and Filter Section */}
                        <div className="mb-8 space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search doctors by name or specialization..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                <button
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                                        specializationFilter === "all"
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                    onClick={() => setSpecializationFilter("all")}
                                >
                                    All Specializations
                                </button>
                                {specializations.map((spec) => (
                                    <button
                                        key={spec}
                                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                                            specializationFilter === spec
                                                ? "bg-indigo-600 text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                        onClick={() => setSpecializationFilter(spec)}
                                    >
                                        {spec}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Doctors Grid */}
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : filteredDoctors.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No doctors found matching your criteria.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredDoctors.map((doctor) => (
                                    <div key={doctor._id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-all p-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-800">{doctor.fullName}</h2>
                                                <p className="text-indigo-600 font-medium">{doctor.specialization}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-3">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                <span>{doctor.officeAddress}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                                <span>Available Today</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                <span>Next available: Tomorrow</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => requestAppointment(doctor._id)}
                                            className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            Request Appointment
                                        </button>
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