'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Calendar, FileText, Home, LogOut, Menu, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '../components/ui/toast.js'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export default function DashboardLayout({ children }) {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [doctorData, setDoctorData] = useState(null)

  useEffect(() => {
    setIsMounted(true)
    
    // Check if user is logged in and get doctor data
    const token = sessionStorage.getItem('doctorToken')
    const data = JSON.parse(sessionStorage.getItem('doctorData') || '{}')
    
    if (!token) {
      router.push('/doctor/login')
    } else {
      setDoctorData(data)
    }
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem('doctorToken')
    sessionStorage.removeItem('doctorData')
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    })
    router.push('/doctor/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/doctor/dashboard', icon: Home },
    { name: 'Appointments', href: '/doctor/appointments', icon: Calendar },
    { name: 'Prescriptions', href: '/doctor/prescriptions', icon: FileText },
    { name: 'Reports', href: '/doctor/reports', icon: FileText },
    { name: 'Profile', href: '/doctor/profile', icon: User },
  ]

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold">Doctor Portal</h1>
          </div>
          <div className="flex flex-col flex-grow px-4 mt-5">
            <nav className="flex-1 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-foreground' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="mt-auto pb-4">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden absolute top-4 left-4 z-10">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h1 className="text-xl font-bold">Doctor Portal</h1>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-foreground' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-end h-16 px-4 md:px-6">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt={doctorData?.fullName || 'Doctor'} />
                <AvatarFallback>
                  {doctorData?.fullName?.split(' ').map(n => n[0]).join('') || 'D'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{doctorData?.fullName || 'Loading...'}</div>
                <div className="text-xs text-gray-500">{doctorData?.specialization || 'Loading...'}</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}