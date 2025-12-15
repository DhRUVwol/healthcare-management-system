"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"

export function PrescriptionModal({ prescription, isOpen, onClose }) {
  if (!prescription) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Prescription Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Patient Information</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>Name: {prescription.patient?.fullName || prescription.patientName}</p>
              <p>Email: {prescription.patient?.email || "N/A"}</p>
              <p>Phone: {prescription.patient?.phone || "N/A"}</p>
              <p>Date: {format(new Date(prescription.createdAt), "PPP")}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Diagnosis</h3>
            <p className="text-muted-foreground">{prescription.diagnosis}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Medications</h3>
            <div className="space-y-3">
              {prescription.medications.map((medication, index) => (
                <div key={index} className="bg-muted p-4 rounded-lg">
                  <p className="font-medium">{medication.name}</p>
                  <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                    <p>Dosage: {medication.dosage}</p>
                    <p>Frequency: {medication.frequency}</p>
                    <p>Duration: {medication.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {prescription.notes && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Additional Notes</h3>
              <p className="text-muted-foreground">{prescription.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 