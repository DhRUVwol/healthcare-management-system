import Link from 'next/link'
import { Button } from '../components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Doctor Portal</h1>
          <p className="mt-2 text-gray-600">Manage your appointments and patients efficiently</p>
        </div>
        <div className="space-y-4">
          <Link href="doctor/login" className="w-full">
            <Button className="w-full">Login</Button>
          </Link>
          <div className="text-center text-sm text-gray-500">
            <p>Access your dashboard to manage appointments, prescriptions, and more</p>
          </div>
        </div>
      </div>
    </div>
  )
}