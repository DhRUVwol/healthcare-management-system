'use client'
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2, FileText, User, Calendar, Clock, Pill } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrescriptionForm() {
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    diagnosis: "",
    medications: [{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }],
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle medication change
  const handleMedicationChange = (index, e) => {
    const newMedications = [...formData.medications]
    newMedications[index][e.target.name] = e.target.value
    setFormData({ ...formData, medications: newMedications })
  }

  // Add new medication field
  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: "", dosage: "", frequency: "", duration: "", instructions: "" }],
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    // Get doctor ID from sessionStorage
    const doctorData = sessionStorage.getItem("doctorData");
    if (!doctorData) {
      setMessage("Doctor authentication failed. Please log in again.");
      setLoading(false);
      return;
    }
  
    const doctor = JSON.parse(doctorData);
    const updatedFormData = { ...formData, doctorId: doctor.id };
  
    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
      });
  
      const data = await res.json();
      if (res.ok) {
        setMessage("Prescription created successfully!");
        setFormData({
          patientId: "",
          patientName: "",
          diagnosis: "",
          medications: [{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }],
          notes: "",
        });
      } else {
        setMessage(data.error || "Something went wrong!");
      }
    } catch (error) {
      setMessage("Server error, please try again.");
    }
  
    setLoading(false);
  };

  // Generate color based on medication index for visual variety
  const getMedicationColor = (index) => {
    const colors = [
      "bg-blue-50 border-blue-200",
      "bg-purple-50 border-purple-200",
      "bg-pink-50 border-pink-200",
      "bg-amber-50 border-amber-200",
      "bg-teal-50 border-teal-200",
    ];
    return colors[index % colors.length];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-lg shadow-md">
          <div className="text-white">
            <h1 className="text-3xl font-bold tracking-tight">Create Prescription</h1>
            <p className="opacity-90">Write and issue prescriptions for your patients</p>
          </div>
         
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Patient Information Card */}
          <Card className="border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
              <CardDescription className="text-blue-600">Enter the patient's details to create a prescription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-700">Patient ID</label>
                <Input 
                  name="patientId" 
                  placeholder="Enter Patient ID" 
                  value={formData.patientId} 
                  onChange={handleChange} 
                  required 
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-700">Patient Name</label>
                <Input 
                  name="patientName" 
                  placeholder="Enter Patient Name" 
                  value={formData.patientName} 
                  onChange={handleChange} 
                  required 
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-700">Diagnosis</label>
                <Textarea 
                  name="diagnosis" 
                  placeholder="Enter diagnosis" 
                  value={formData.diagnosis} 
                  onChange={handleChange} 
                  required 
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Medications Card */}
          <Card className="border-l-4 border-purple-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Pill className="h-5 w-5" />
                Medications
              </CardTitle>
              <CardDescription className="text-purple-600">Add medications to the prescription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {formData.medications.map((med, index) => (
                <div 
                  key={index} 
                  className={`space-y-4 p-4 border-2 rounded-lg ${getMedicationColor(index)} transition-all duration-200 hover:shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800">Medication {index + 1}</h4>
                    {index > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          const newMedications = formData.medications.filter((_, i) => i !== index);
                          setFormData({ ...formData, medications: newMedications });
                        }}
                        className="text-red-500 hover:bg-red-50 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Medication Name</label>
                      <Input 
                        name="name" 
                        placeholder="Enter medication name" 
                        value={med.name} 
                        onChange={(e) => handleMedicationChange(index, e)} 
                        required 
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Dosage</label>
                        <Input 
                          name="dosage" 
                          placeholder="e.g., 500mg" 
                          value={med.dosage} 
                          onChange={(e) => handleMedicationChange(index, e)} 
                          required 
                          className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Frequency</label>
                        <Input 
                          name="frequency" 
                          placeholder="e.g., Twice daily" 
                          value={med.frequency} 
                          onChange={(e) => handleMedicationChange(index, e)} 
                          required 
                          className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Duration</label>
                        <Input 
                          name="duration" 
                          placeholder="e.g., 7 days" 
                          value={med.duration} 
                          onChange={(e) => handleMedicationChange(index, e)} 
                          required 
                          className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Instructions</label>
                        <Input 
                          name="instructions" 
                          placeholder="Special instructions (optional)" 
                          value={med.instructions} 
                          onChange={(e) => handleMedicationChange(index, e)} 
                          className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                type="button" 
                onClick={addMedication} 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Medication
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Notes Card */}
        <Card className="border-l-4 border-teal-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-teal-700">
              <FileText className="h-5 w-5" />
              Additional Notes
            </CardTitle>
            <CardDescription className="text-teal-600">Add any additional information or instructions</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Textarea 
              name="notes" 
              placeholder="Enter any additional notes or instructions" 
              value={formData.notes} 
              onChange={handleChange}
              className="min-h-[100px] border-teal-200 focus:border-teal-500 focus:ring-teal-500"
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Prescription...
              </>
            ) : (
              "Create Prescription"
            )}
          </Button>
        </div>

        {message && (
          <div className={`p-4 rounded-lg shadow-md ${
            message.includes("successfully") 
              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 border-l-4 border-emerald-500" 
              : "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-l-4 border-red-500"
          }`}>
            {message}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}