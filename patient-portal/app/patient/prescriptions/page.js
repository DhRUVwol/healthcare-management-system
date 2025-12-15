
"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/ui/sidebar";

export default function PrescriptionPage() {
  const [patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('current');

  // More flexible UUID validation that handles both UUID and MongoDB ObjectId
  const isValidId = (id) => {
    if (!id) return false;

    // Check for UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(id)) return true;

    // Check for MongoDB ObjectId format (24 hex characters)
    const objectIdRegex = /^[0-9a-f]{24}$/i;
    if (objectIdRegex.test(id)) return true;

    return false;
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedPatient = localStorage.getItem("patient");
        if (!storedPatient) {
          throw new Error("Please log in to view prescriptions");
        }

        const patientData = JSON.parse(storedPatient);

        if (!patientData?.id || !isValidId(patientData.id)) {
          console.warn("Stored patient ID:", patientData?.id);
          throw new Error("Invalid patient ID in your profile. Please log in again.");
        }

        setPatient(patientData);
        await fetchPrescriptions(patientData.id);
      } catch (err) {
        console.error("Initialization error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  async function fetchPrescriptions(patientId) {
    try {
      setLoading(true);
      setError(null);

      if (!isValidId(patientId)) {
        throw new Error("Invalid patient ID format");
      }

      const res = await fetch(`/api/prescriptions/${patientId}`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch prescriptions");
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Received unexpected data format");
      }

      setPrescriptions(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // ... rest of your component code remains the same ...
  // (filterPrescriptions function and JSX rendering)

  const filterPrescriptions = () => {
    const now = new Date();
    return prescriptions.filter(prescription => {
      try {
        if (!prescription?.createdAt) return false;
        const createdAt = new Date(prescription.createdAt);
        const isRecent = (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24) <= 90;
        return activeTab === 'current' ? isRecent : !isRecent;
      } catch (e) {
        console.error("Date processing error:", e);
        return false;
      }
    });
  };

  const filteredPrescriptions = filterPrescriptions();

  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      <Sidebar />

      <main className="flex-grow p-2 md:p-3 ml-16">
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-3 md:p-4">
            <h1 className="text-xl md:text-2xl font-bold text-center">
              🩺 My Prescription Dashboard
            </h1>
            {patient && (
              <p className="text-center text-blue-100 text-sm mt-1 md:mt-2">
                Welcome, {patient.name || 'Patient'}
              </p>
            )}
          </div>

          <div className="p-3">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 rounded-full p-1 inline-flex space-x-1 md:space-x-2">
                {['current', 'past'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 text-sm rounded-full capitalize transition-all ${activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-600 hover:bg-blue-200'
                      }`}
                  >
                    {tab} Prescriptions
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-center py-6 bg-red-50 rounded-lg">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={() => patient && fetchPrescriptions(patient.id)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <div className="text-center py-6">
                <p className="text-gray-500 animate-pulse">Loading prescriptions...</p>
              </div>
            ) : filteredPrescriptions.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No {activeTab} prescriptions available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {filteredPrescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="bg-white border border-blue-100 rounded-lg shadow-sm hover:shadow-md transition-all p-3 md:p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-lg font-bold text-blue-800">
                        {prescription.patientName}
                      </h2>
                      <span className="text-sm text-blue-500">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-2">

                      
                      <p className="text-sm text-gray-600">
                        <strong>Doctor:</strong> {prescription.doctor?.name || prescription.doctorName || "Unknown Doctor"}
                        {(prescription.doctorSpecialization || prescription.doctor?.specialization) && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({prescription.doctorSpecialization || prescription.doctor?.specialization})
                          </span>
                        )}
                      </p>



                      <p className="text-sm text-gray-600">
                        <strong>Diagnosis:</strong> {prescription.diagnosis}
                      </p>

                      <div className="bg-blue-50 rounded-lg p-3 mt-3">
                        <h3 className="font-bold text-blue-700 mb-2 text-sm">💊 Medications</h3>
                        {prescription.medications?.map((med, index) => (
                          <div key={index} className="mb-2 pb-2 border-b border-blue-100 last:border-b-0">
                            <p className="font-semibold text-blue-800 text-sm">{med.name}</p>
                            <p className="text-xs text-gray-600">
                              {med.dosage} • {med.frequency} • {med.duration}
                            </p>
                            {med.instructions && (
                              <p className="text-xs text-gray-500 italic mt-1">
                                {med.instructions}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );

}