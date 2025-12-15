'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { useToast } from '../components/ui/toast.js'

export default function PrescriptionForm() {
  const { toast } = useToast()
  const [patientName, setPatientName] = useState('')
  const [patientId, setPatientId] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [medications, setMedications] = useState([
    { name: '', dosage: '', frequency: '', duration: '' }
  ])
  const [notes, setNotes] = useState('')

  const handleAddMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }])
  }

  const handleRemoveMedication = (index) => {
    const updatedMedications = [...medications]
    updatedMedications.splice(index, 1)
    setMedications(updatedMedications)
  }

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...medications]
    updatedMedications[index][field] = value
    setMedications(updatedMedications)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // In a real app, you would send this data to your API
    console.log({
      patientName,
      patientId,
      diagnosis,
      medications,
      notes
    })
    
    toast({
      title: "Prescription created",
      description: `Prescription for ${patientName} has been created successfully.`,
    })
    
    // Reset form
    setPatientName('')
    setPatientId('')
    setDiagnosis('')
    setMedications([{ name: '', dosage: '', frequency: '', duration: '' }])
    setNotes('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Prescription</CardTitle>
        <CardDescription>
          Fill out the form below to create a new prescription
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea
                id="diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Medications */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Medications</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddMedication}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Medication
              </Button>
            </div>
            
            {medications.map((medication, index) => (
              <div key={index} className="p-4 border rounded-md space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Medication {index + 1}</h4>
                  {medications.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMedication(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`medication-${index}-name`}>Medication Name</Label>
                    <Input
                      id={`medication-${index}-name`}
                      value={medication.name}
                      onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`medication-${index}-dosage`}>Dosage</Label>
                    <Input
                      id={`medication-${index}-dosage`}
                      value={medication.dosage}
                      onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`medication-${index}-frequency`}>Frequency</Label>
                    <Select
                      value={medication.frequency}
                      onValueChange={(value) => handleMedicationChange(index, 'frequency', value)}
                      required
                    >
                      <SelectTrigger id={`medication-${index}-frequency`}>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Once daily">Once daily</SelectItem>
                        <SelectItem value="Twice daily">Twice daily</SelectItem>
                        <SelectItem value="Three times daily">Three times daily</SelectItem>
                        <SelectItem value="Four times daily">Four times daily</SelectItem>
                        <SelectItem value="As needed">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`medication-${index}-duration`}>Duration</Label>
                    <Select
                      value={medication.duration}
                      onValueChange={(value) => handleMedicationChange(index, 'duration', value)}
                      required
                    >
                      <SelectTrigger id={`medication-${index}-duration`}>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3 days">3 days</SelectItem>
                        <SelectItem value="5 days">5 days</SelectItem>
                        <SelectItem value="7 days">7 days</SelectItem>
                        <SelectItem value="10 days">10 days</SelectItem>
                        <SelectItem value="14 days">14 days</SelectItem>
                        <SelectItem value="30 days">30 days</SelectItem>
                        <SelectItem value="60 days">60 days</SelectItem>
                        <SelectItem value="90 days">90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions or notes..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit">Create Prescription</Button>
        </CardFooter>
      </form>
    </Card>
  )
}