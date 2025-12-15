import Link from "next/link";
import Sidebar from "@/components/ui/sidebar";

export default function PatientProfile() {
    return (
        <div className="flex h-screen bg-gray-100">
          
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Patient Profile</h1>
                    <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-lg hover:scale-105 transition">
                        ✏️ Edit Profile
                    </button>
                </div>

                {/* Profile Details */}
                <div className="bg-white p-6 shadow-lg rounded-xl">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
                    <div className="grid grid-cols-2 gap-6 text-gray-700">
                        <p><strong>👤 Name:</strong> John Doe</p>
                        <p><strong>🎂 Age:</strong> 29</p>
                        <p><strong>⚧ Gender:</strong> Male</p>
                        <p><strong>📞 Contact:</strong> +1 234 567 890</p>
                        <p><strong>🩸 Blood Type:</strong> O+</p>
                        <p><strong>🚨 Allergies:</strong> Peanuts, Penicillin</p>
                    </div>
                </div>

                {/* Medical History */}
                <div className="mt-6 p-6 bg-green-50 shadow-lg rounded-xl">
                    <h2 className="text-xl font-semibold text-green-800">Medical History</h2>

                    {/* Recent Visits */}
                    <div className="mt-4 bg-white p-5 shadow-md rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800">Recent Visits</h3>
                        <ul className="list-disc list-inside text-gray-700 mt-2">
                            <li>📅 March 15, 2025 - General Check-up</li>
                            <li>📅 February 10, 2025 - Flu Treatment</li>
                            <li>📅 December 20, 2024 - Routine Blood Test</li>
                        </ul>
                    </div>

                    {/* Diagnosed Conditions */}
                    <div className="mt-4 bg-white p-5 shadow-md rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800">Diagnosed Conditions</h3>
                        <ul className="list-disc list-inside text-gray-700 mt-2">
                            <li>⚕️ Hypertension - Under medication</li>
                            <li>⚕️ Seasonal Allergies</li>
                        </ul>
                    </div>

                    {/* Current Medications */}
                    <div className="mt-4 bg-white p-5 shadow-md rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800">Current Medications</h3>
                        <ul className="list-disc list-inside text-gray-700 mt-2">
                            <li>💊 Lisinopril - 10mg (Daily)</li>
                            <li>💊 Antihistamines (As needed)</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}