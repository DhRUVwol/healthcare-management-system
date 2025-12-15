"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  Clock,
  User,
  Video,
  MessageSquare,
  CheckCircle,
  XCircle,
  FileText,
  CalendarClock,
  AlertCircle,
} from "lucide-react"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [showMeetLinkDialog, setShowMeetLinkDialog] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [meetLink, setMeetLink] = useState("")
  const [showDateTimeDialog, setShowDateTimeDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Function to update appointment status
  const updateAppointmentStatus = async (appointmentId, newStatus, meetLink = null) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId,
          status: newStatus,
          meetLink
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the appointments state with the new data
        setAppointments(prevAppointments =>
          prevAppointments.map(app =>
            app._id === appointmentId
              ? {
                ...app,
                status: newStatus,
                meetLink: meetLink || app.meetLink
              }
              : app
          )
        );
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle approve appointment
  const handleApprove = (appointment) => {
    setSelectedAppointment(appointment);
    // Initialize with current date and empty time
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSelectedTime("");
    // Show date/time dialog first
    setShowDateTimeDialog(true);
  };

  // Handle date and time submission
  const handleDateTimeSubmit = () => {
    if (!selectedDate) {
      setError("Please select a date");
      return;
    }

    if (!selectedTime) {
      setError("Please select a time");
      return;
    }

    // After date and time are selected, proceed to meet link dialog
    setShowDateTimeDialog(false);
    setShowMeetLinkDialog(true);
  };

  // Handle meet link submission
  const handleMeetLinkSubmit = async () => {
    if (!meetLink.trim()) {
      setError("Please enter a valid Google Meet link");
      return;
    }

    try {
      const response = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: selectedAppointment._id,
          status: "Confirmed",
          meetLink: meetLink,
          date: selectedDate,
          timeSlot: selectedTime
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAppointments(prevAppointments =>
          prevAppointments.map(app =>
            app._id === selectedAppointment._id
              ? {
                ...app,
                status: "Confirmed",
                meetLink: meetLink,
                date: selectedDate,
                timeSlot: selectedTime
              }
              : app
          )
        );

        setShowMeetLinkDialog(false);
        setMeetLink("");
        setSelectedDate("");
        setSelectedTime("");
        fetchAppointments(); // Refresh appointments after updating
      } else {
        throw new Error(data.error || "Failed to update appointment");
      }
    } catch (error) {
      setError(error.message || "Failed to update appointment status");
    }
  };

  // Handle start video call
  const handleStartCall = (meetLink) => {
    if (meetLink) {
      window.open(meetLink, '_blank');
    } else {
      setError("No meeting link available");
    }
  };

  // Handle decline appointment
  const handleDecline = async (appointmentId) => {
    await updateAppointmentStatus(appointmentId, "Cancelled");
  };

  // Fetch appointments from API
  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const doctorData = JSON.parse(sessionStorage.getItem("doctorData"));
      const doctorId = doctorData ? doctorData.id : null;

      if (!doctorId) {
        throw new Error('Doctor not logged in');
      }

      const response = await fetch(`/api/appointments?doctorId=${doctorId}`);
      const data = await response.json();

      if (data.success) {
        // In the fetchAppointments function, update the transformation
        const transformedAppointments = data.data.map(appointment => ({
          _id: appointment._id,
          patientName: appointment.patient?.fullName || 'Unknown Patient',
          patientId: appointment.patient?._id || 'Unknown ID', // Extract patient ID here
          doctorName: appointment.doctor?.name || 'Unknown Doctor',
          // Rest of the transformation remains the same
          date: appointment.date ? new Date(appointment.date).toLocaleDateString() : 'Not specified',
          day: appointment.date ? new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long' }) : 'Not specified',
          time: appointment.timeSlot || 'Not specified',
          status: appointment.status ?
            appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) :
            'Pending',
          reason: appointment.reason || 'No reason provided',
          meetLink: appointment.meetLink || ''
        }));

        console.log('Transformed appointments:', transformedAppointments);
        setAppointments(transformedAppointments);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Categorize appointments based on status
  const pendingAppointments = appointments.filter((app) => app.status === "Pending");
  const upcomingAppointments = appointments.filter((app) => app.status === "Confirmed");
  const pastAppointments = appointments.filter((app) => app.status === "Completed" || app.status === "Cancelled");

  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  const renderSkeletonLoader = () => {
    return Array(3)
      .fill()
      .map((_, index) => (
        <div key={`skeleton-${index}`} className="mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-3 w-full md:w-2/3">
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 rounded-full bg-gray-200"></div>
                <div className="h-5 w-40 bg-gray-200 rounded"></div>
                <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-4 w-4 rounded-full bg-gray-200"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-4 rounded-full bg-gray-200"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <div className="h-9 w-24 bg-gray-200 rounded-md"></div>
              <div className="h-9 w-24 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
      ))
  }

  const renderEmptyState = (type) => {
    const emptyStateContent = {
      pending: {
        icon: <CalendarClock className="h-16 w-16 text-amber-300" />,
        title: "No pending appointments",
        description: "You don't have any appointments waiting for approval.",
      },
      upcoming: {
        icon: <Calendar className="h-16 w-16 text-emerald-300" />,
        title: "No upcoming appointments",
        description: "You don't have any confirmed appointments scheduled.",
      },
      past: {
        icon: <FileText className="h-16 w-16 text-blue-300" />,
        title: "No past appointments",
        description: "You don't have any completed appointments in your history.",
      },
    }

    const content = emptyStateContent[type]

    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        {content.icon}
        <h3 className="mt-4 text-xl font-medium text-gray-700">{content.title}</h3>
        <p className="mt-2 text-gray-500">{content.description}</p>
      </div>
    )
  }

  const renderAppointmentCard = (appointment, index) => {
    const statusConfig = {
      Pending: {
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        icon: <Clock className="h-4 w-4 text-amber-500" />,
      },
      Confirmed: {
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
      },
      Completed: {
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        icon: <FileText className="h-4 w-4 text-blue-500" />,
      },
      Cancelled: {
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-700",
        icon: <XCircle className="h-4 w-4 text-red-500" />,
      },
    }

    const config = statusConfig[appointment.status]

    return (
      <div key={appointment._id || index} className="mb-4">
        <div
          className={`border-l-4 ${config.borderColor} shadow-sm hover:shadow-md transition-all duration-300 rounded-lg bg-white`}
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${config.bgColor}`}>
                    <User className="h-5 w-5 text-gray-700" />
                  </div>
                  <h3 className="font-medium text-gray-800">{appointment.patientName}</h3>
                  <Badge className={`${config.bgColor} ${config.textColor} border flex items-center gap-1`}>
                    {config.icon}
                    {appointment.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span>{appointment.day}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-teal-500" />
                    <span>{appointment.time}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-700">
                  <span className="font-medium text-indigo-600">Patient Id:</span> {appointment.patientId}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                {appointment.status === "Pending" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-300"
                      onClick={() => handleApprove(appointment)}
                    >
                      <CheckCircle className="mr-1.5 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="transition-all duration-300"
                      onClick={() => handleDecline(appointment._id)}
                    >
                      <XCircle className="mr-1.5 h-4 w-4" />
                      Decline
                    </Button>
                  </>
                )}

                {appointment.status === "Confirmed" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 transition-all duration-300"
                      onClick={() => handleStartCall(appointment.meetLink)}
                    >
                      <Video className="mr-1.5 h-4 w-4" />
                      Start Call
                    </Button>
                    
                  </>
                )}

                {appointment.status === "Completed" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-teal-300 text-teal-700 hover:bg-teal-50 transition-all duration-300"
                  >
                    <FileText className="mr-1.5 h-4 w-4" />
                    View Details
                  </Button>
                )}

                {appointment.status === "Cancelled" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50 transition-all duration-300"
                  >
                    <XCircle className="mr-1.5 h-4 w-4" />
                    Cancelled
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-xl shadow-inner">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-indigo-800 mb-1">Appointments</h1>
            <p className="text-indigo-600 text-sm">Manage your schedule and patient meetings</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Error loading appointments</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <Tabs defaultValue="pending" value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-md rounded-lg p-1">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 transition-all duration-300"
            >
              Pending
              <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                {loading ? "..." : pendingAppointments.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900 transition-all duration-300"
            >
              Upcoming
              <Badge variant="outline" className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200">
                {loading ? "..." : upcomingAppointments.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 transition-all duration-300"
            >
              Past
              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                {loading ? "..." : pastAppointments.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="transition-opacity duration-300">
            {loading ? (
              <div>{renderSkeletonLoader()}</div>
            ) : (
              <>
                <TabsContent value="pending" className="mt-0">
                  {pendingAppointments.length === 0 ? (
                    renderEmptyState("pending")
                  ) : (
                    <div>{pendingAppointments.map(renderAppointmentCard)}</div>
                  )}
                </TabsContent>
                <TabsContent value="upcoming" className="mt-0">
                  {upcomingAppointments.length === 0 ? (
                    renderEmptyState("upcoming")
                  ) : (
                    <div>{upcomingAppointments.map(renderAppointmentCard)}</div>
                  )}
                </TabsContent>
                <TabsContent value="past" className="mt-0">
                  {pastAppointments.length === 0 ? (
                    renderEmptyState("past")
                  ) : (
                    <div>{pastAppointments.map(renderAppointmentCard)}</div>
                  )}
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </div>

      {/* Date and Time Selection Dialog */}
      {showDateTimeDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Select Appointment Date & Time</h2>

            {error && <div className="mb-4 text-red-500">{error}</div>}

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border rounded-md"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Start Time</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDateTimeDialog(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDateTimeSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meet Link Dialog */}
      <Dialog open={showMeetLinkDialog} onOpenChange={setShowMeetLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Google Meet Link</DialogTitle>
            <DialogDescription>
              Please provide the Google Meet link for this appointment. This link will be used to start the video call.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter Google Meet link"
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMeetLinkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMeetLinkSubmit}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}