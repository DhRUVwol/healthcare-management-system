'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Users, FileText, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingApprovals: 0,
    prescriptionsIssued: 0
  })
  const [appointments, setAppointments] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const doctorData = JSON.parse(sessionStorage.getItem("doctorData"))
        if (!doctorData?.id) {
          console.error("Doctor data not found")
          return
        }

        // Fetch appointments
        const appointmentsRes = await fetch(`/api/appointments?doctorId=${doctorData.id}`)
        const appointmentsData = await appointmentsRes.json()
        
        // Fetch prescriptions
        const prescriptionsRes = await fetch(`/api/prescriptions?doctorId=${doctorData.id}`)
        const prescriptionsData = await prescriptionsRes.json()

        // Calculate stats
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const todayAppointments = appointmentsData.data.filter(apt => 
          new Date(apt.date).toDateString() === today.toDateString()
        )

        const pendingAppointments = appointmentsData.data.filter(apt => 
          apt.status === "Pending"
        )

        // Update state with complete appointment data
        setAppointments(appointmentsData.data)
        setPrescriptions(prescriptionsData)
        setStats({
          totalPatients: new Set(appointmentsData.data.map(apt => apt.patient._id)).size,
          todayAppointments: todayAppointments.length,
          pendingApprovals: pendingAppointments.length,
          prescriptionsIssued: prescriptionsData.length
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statsConfig = [
    { title: "Total Patients", value: stats.totalPatients.toString(), icon: Users, color: "bg-blue-100 text-blue-700" },
    { title: "Today's Appointments", value: stats.todayAppointments.toString(), icon: Calendar, color: "bg-green-100 text-green-700" },
    { title: "Pending Approvals", value: stats.pendingApprovals.toString(), icon: Clock, color: "bg-amber-100 text-amber-700" },
    { title: "Prescriptions Issued", value: stats.prescriptionsIssued.toString(), icon: FileText, color: "bg-purple-100 text-purple-700" },
  ]

  const handleViewAppointment = (appointmentId) => {
    router.push('/doctor/appointments')
  }

  // Add handleStartCall function
  const handleStartCall = (meetLink) => {
    if (meetLink) {
      window.open(meetLink, '_blank')
    } else {
      console.error("No meeting link available")
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsConfig.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <h3 className="text-3xl font-bold">{stat.value}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="appointments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="appointments">Today's Appointments</TabsTrigger>
            <TabsTrigger value="prescriptions">Recent Prescriptions</TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Appointments</CardTitle>
                <CardDescription>
                  You have {stats.todayAppointments} appointments scheduled for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments
                    .filter(apt => new Date(apt.date).toDateString() === new Date().toDateString())
                    .map((appointment) => (
                      <div key={appointment._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{appointment.patient.fullName}</h4>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Clock className="mr-1 h-4 w-4" />
                            {appointment.timeSlot} - {appointment.reason}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              appointment.status === "Confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {appointment.status}
                          </span>
                          {appointment.status === "Confirmed" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStartCall(appointment.meetLink)}
                            >
                              Start Call
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewAppointment(appointment._id)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Prescriptions</CardTitle>
                <CardDescription>Recently issued prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prescriptions.slice(0, 5).map((prescription) => (
                    <div key={prescription._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{prescription.patientName}</h4>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Calendar className="mr-1 h-4 w-4" />
                          {new Date(prescription.createdAt).toLocaleDateString()}
                        </div>
                        <p className="mt-1 text-sm">
                          {prescription.medications.map(med => med.name).join(", ")}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

