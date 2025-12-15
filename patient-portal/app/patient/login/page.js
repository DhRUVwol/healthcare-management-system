

// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function PatientLogin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch("/api/auth/login-patient", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || "Login failed. Please try again.");
//         setLoading(false);
//         return;
//       }

//       // ✅ Store token & user details in localStorage
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("patient", JSON.stringify(data.patient));
//       localStorage.setItem("patient_id", data.patient._id);

//       // ✅ Redirect to dashboard
//       router.push("/patient/dashboard");
//     } catch (error) {
//       setError("An unexpected error occurred.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-lg shadow-md border border-gray-300 w-96"
//       >
//         <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Patient Login</h2>

//         {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

//         <label className="block text-gray-700 font-medium mb-1">Email</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900 focus:border-blue-400"
//           required
//         />

//         <label className="block text-gray-700 font-medium mb-1">Password</label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900 focus:border-blue-400"
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
//           disabled={loading}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// }













"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PatientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      // ✅ Store token & user details in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("patient", JSON.stringify(data.patient));
      localStorage.setItem("patient_id", data.patient._id);

      // ✅ Redirect to dashboard
      router.push("/patient/dashboard");
    } catch (error) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleSignupRedirect = () => {
    router.push("/patient/signup");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md border border-gray-300 w-96"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Patient Login</h2>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900 focus:border-blue-400"
          required
        />

        <label className="block text-gray-700 font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900 focus:border-blue-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Sign Up Button */}
        <button
          type="button"
          onClick={handleSignupRedirect}
          className="w-full mt-4 border border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold py-2 rounded-md transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}