
// "use client";
// import { useEffect, useState } from "react";

// export default function AdminDashboard() {
//   const [doctors, setDoctors] = useState([]); // Store doctors data
//   const [loading, setLoading] = useState(true); // Track loading state

//   async function fetchDoctors() {
//     try {
//       const response = await fetch("/api/doctors/for-admin");
//       const data = await response.json();
  
//       console.log("🔹 API Response:", data); // Debugging
  
//       if (data.success && Array.isArray(data.doctors)) {
//         setDoctors(data.doctors);
//       } else {
//         console.error("❌ Unexpected API response:", data);
//         setDoctors([]); // Prevent errors on `.map`
//       }
//     } catch (error) {
//       console.error("❌ Fetch error:", error);
//       setDoctors([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   if (loading) return <p>Loading doctors...</p>; // Display loading message

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Admin Dashboard - Doctors</h1>
//       {doctors.length === 0 ? (
//         <p>No doctors found.</p>
//       ) : (
//         <ul>
//           {doctors.map((doctor) => (
//             <li key={doctor._id} className="border p-3 rounded mb-2">
//               {doctor.name} - {doctor.email}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]); // Store doctors data
  const [loading, setLoading] = useState(true); // Track loading state

  async function fetchDoctors() {
    try {
      const response = await fetch("/api/doctors/for-admin");
      const data = await response.json();
  
      console.log("🔹 API Response:", data); // Debugging
  
      if (data.success && Array.isArray(data.doctors)) {
        setDoctors(data.doctors);
      } else {
        console.error("❌ Unexpected API response:", data);
        setDoctors([]); // Prevent errors on `.map`
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Handle Accept
  async function handleAccept(doctorId) {
    try {
      const response = await fetch(`/api/doctors/accept/${doctorId}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to accept doctor");
      }

      setDoctors((prev) =>
        prev.map((doc) =>
          doc._id === doctorId ? { ...doc, isApproved: true } : doc
        )
      );
    } catch (error) {
      console.error("❌ Accept error:", error);
    }
  }

  // Handle Reject
  async function handleReject(doctorId) {
    try {
      const response = await fetch(`/api/doctors/reject/${doctorId}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to reject doctor");
      }

      setDoctors((prev) => prev.filter((doc) => doc._id !== doctorId));
    } catch (error) {
      console.error("❌ Reject error:", error);
    }
  }

  if (loading) return <p>Loading doctors...</p>; // Display loading message

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard - Doctors</h1>
      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <ul>
          {doctors.map((doctor) => (
            <li key={doctor._id} className="border p-3 rounded mb-2 flex justify-between items-center">
              <span>{doctor.name} - {doctor.email}</span>
              {!doctor.isApproved ? (
                <div>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => handleAccept(doctor._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleReject(doctor._id)}
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <span className="text-green-500">Approved</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}