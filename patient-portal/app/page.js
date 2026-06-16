import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600">Patient Portal</h1>
          <p className="mt-2 text-gray-600">Manage your healthcare journey easily</p>
        </div>
        <div className="space-y-4">
          <Link href="/patient/login" className="w-full block">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
              Login
            </button>
          </Link>
          <Link href="/patient/signup" className="w-full block mt-2">
            <button className="w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded transition-colors">
              Sign Up
            </button>
          </Link>
          <div className="text-center text-sm text-gray-500 pt-4">
            <p>Book appointments, view prescriptions, and chat with your doctor</p>
          </div>
        </div>
      </div>
    </div>
  );
}
