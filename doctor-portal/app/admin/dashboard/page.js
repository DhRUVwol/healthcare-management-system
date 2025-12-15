"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDoctorId, setDeleteDoctorId] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctors/for-admin");
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch doctors");
      }
      
      setDoctors(data.doctors);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching doctors:", err);
      toast({
        title: "Error",
        description: "Failed to fetch doctors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (doctorId) => {
    try {
      const res = await fetch(`/api/doctors/reject/${doctorId}`, {
        method: "PUT",
      });
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to reject doctor");
      }
      
      // Update the doctor's status in the local state
      setDoctors(doctors.map(doctor => 
        doctor._id === doctorId 
          ? { ...doctor, isApproved: false, isActive: false }
          : doctor
      ));
      
      toast({
        title: "Success",
        description: "Doctor rejected successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to reject doctor",
        variant: "destructive",
      });
      console.error("Error rejecting doctor:", err);
    }
  };

  const handleDelete = async (doctorId) => {
    try {
      const res = await fetch(`/api/doctors/${doctorId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to delete doctor");
      }
      
      // Remove the doctor from the local state
      setDoctors(doctors.filter(doctor => doctor._id !== doctorId));
      setDeleteDoctorId(null);
      
      toast({
        title: "Success",
        description: "Doctor removed successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to remove doctor",
        variant: "destructive",
      });
      console.error("Error removing doctor:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left">Name</th>
              <th className="px-6 py-3 border-b text-left">Email</th>
              <th className="px-6 py-3 border-b text-left">Specialization</th>
              <th className="px-6 py-3 border-b text-left">Status</th>
              <th className="px-6 py-3 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">
                  {doctor.firstName} {doctor.lastName}
                </td>
                <td className="px-6 py-4 border-b">{doctor.email}</td>
                <td className="px-6 py-4 border-b">{doctor.specialization}</td>
                <td className="px-6 py-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    doctor.isApproved 
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {doctor.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 border-b">
                  <div className="flex gap-2">
                    {doctor.isApproved && (
                      <button
                        onClick={() => handleReject(doctor._id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteDoctorId(doctor._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteDoctorId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to remove this doctor?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteDoctorId(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteDoctorId)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

