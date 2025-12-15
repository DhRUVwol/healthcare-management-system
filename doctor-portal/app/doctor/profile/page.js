"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function DoctorProfile() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const fetchDoctorProfile = useCallback(async () => {
    try {
      const doctorData = JSON.parse(sessionStorage.getItem("doctorData"));
      const doctorId = doctorData?.id;

      if (!doctorId) {
        throw new Error("Doctor ID not found. Please login again.");
      }

      const response = await fetch(`/api/doctors/${doctorId}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to load profile.");
      }

      setProfile(result.data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      router.push("/doctor/login");
    } finally {
      setLoading(false);
    }
  }, [toast, router]);

  useEffect(() => {
    setIsMounted(true);
    fetchDoctorProfile();

    return () => {
      setIsMounted(false);
    };
  }, [fetchDoctorProfile]);

  if (!isMounted) {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading profile...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center text-red-500">
          <span>Doctor profile not found.</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Doctor Profile</h1>

        <Card>
          <CardContent className="p-6 flex flex-col items-center space-y-4">
            
            <div className="text-center">
              <h2 className="text-xl font-bold">{profile.fullName}</h2>
              <p className="text-sm text-gray-500">{profile.specialization}</p>
              <p className="text-sm text-gray-500">{profile.qualifications}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <p><strong>Bio:</strong> {profile.bio || "No bio available"}</p>
            <p><strong>Office Address:</strong> {profile.officeAddress || "No address available"}</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
