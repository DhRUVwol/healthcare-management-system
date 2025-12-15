  // "use client";
  // import { useState } from "react";
  // import { useRouter } from "next/navigation";
  // import { Mail, Lock, Eye, EyeOff } from "lucide-react";

  // export default function DoctorLogin() {
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  //   const [error, setError] = useState(null);
  //   const [isLoading, setIsLoading] = useState(false);
  //   const [showPassword, setShowPassword] = useState(false);
  //   const router = useRouter();

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     setIsLoading(true);
  //     setError(null);

  //     try {
  //       const res = await fetch("/api/doctor/login", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ email, password })
  //       });

  //       const data = await res.json();

  //       if (!res.ok) {
  //         setError(data.message || "Login failed");
  //         setIsLoading(false);
  //         return;
  //       }

  //       console.log("Login Success:", data);

  //       // Store token and doctor info in localStorage
  //       localStorage.setItem("doctorToken", data.token);
        
  //       // Store doctor data
  //       const doctorData = {
  //         id: data.doctor.id,
  //         fullName: data.doctor.fullName,
  //         email: data.doctor.email,
  //         specialization: data.doctor.specialization,
  //         isAvailable: data.doctor.isAvailable
  //       };
        
  //       localStorage.setItem("doctorData", JSON.stringify(doctorData));

  //       // Redirect to the doctor dashboard
  //       router.push("/doctor/dashboard");
  //     } catch (error) {
  //       console.error("Login Request Failed:", error);
  //       setError("Something went wrong. Please try again.");
  //       setIsLoading(false);
  //     }
  //   };

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);  // Reset error state

    try {
      const res = await fetch("/api/doctor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setIsLoading(false);
        return;
      }

      console.log("Login Success:", data);

      // ✅ Store token in sessionStorage
      sessionStorage.setItem("doctorToken", data.token);

      // ✅ Store doctor data in sessionStorage
      sessionStorage.setItem("doctorData", JSON.stringify({
        id: data.doctor.id,
        fullName: data.doctor.fullName,
        email: data.doctor.email,
        specialization: data.doctor.specialization,
        isAvailable: data.doctor.isAvailable
      }));

      // Redirect to the doctor dashboard
      router.push("/doctor/dashboard");
    } catch (err) {
      console.error("Login Request Failed:", err);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
};

  


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Doctor Login</h1>
            <p className="mt-2 text-sm text-gray-600">
              Access your medical dashboard
            </p>
          </div>
          
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="doctor@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 pr-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="mr-2 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-base font-medium text-gray-800">
          Wanna Join Us? Email Us At{" "}
          <a href="mailto:8saumy@gmail.com" className="font-bold text-blue-600 hover:underline">
            8saumy@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
