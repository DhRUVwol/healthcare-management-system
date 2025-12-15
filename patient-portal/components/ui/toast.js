"use client"

import * as React from "react"
import { X } from 'lucide-react'

import { cn } from "../../lib/utils.js"

const ToastContext = React.createContext({})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([])

  return (
    <ToastContext.Provider value={{ toasts, setToasts }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  
  const { toasts, setToasts } = context
  
  const toast = ({ title, description, variant = "default" }) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, variant }
    
    setToasts((prevToasts) => [...prevToasts, newToast])
    
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, 5000)
  }
  
  return { toast, setToasts }
}

export function Toaster() {
  const { toasts, setToasts } = React.useContext(ToastContext)
  
  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-md w-full">
      {toasts && toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => {
            setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toast.id))
          }}
        />
      ))}
    </div>
  )
}

export function Toast({ toast, onClose }) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        toast.variant === "destructive"
          ? "border-destructive bg-destructive text-destructive-foreground"
          : "border-border bg-background text-foreground"
      )}
    >
      <div className="grid gap-1">
        {toast.title && <div className="font-semibold">{toast.title}</div>}
        {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
      </div>
      <button
        onClick={onClose}
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}