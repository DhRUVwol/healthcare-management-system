// // pages/patient/dashboard.tsx (or wherever)
// import ChatBot from '@/components/ui/chatbot';
// import Sidebar from '@/components/ui/sidebar';
// export default function PatientDashboard() {
//   return (

    

//     <div className="min-h-screen bg-gray-900 text-white p-4">
//       <h1 className="text-2xl font-bold mb-6">Welcome, Patient</h1>
//       {/* Other dashboard components */}
//       <ChatBot />
//     </div>
//   );
// }







"use client";

import ChatBot from "@/components/ui/chatbot";
import Sidebar from "@/components/ui/sidebar";

export default function PatientDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Welcome, Patient</h1>

        {/* Other dashboard components */}
        <ChatBot />
      </div>
    </div>
  );
}