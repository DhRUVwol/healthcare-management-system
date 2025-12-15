"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    const res = await fetch("/api/auth/login-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role: "admin" }),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      setError(errorData.error || "Login failed. Please try again.");
      return;
    }
  
    const data = await res.json();
    console.log("API Response:", data);
  
    if (data.success) {
      // Store admin data in sessionStorage
      sessionStorage.setItem("adminData", JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role
      }));
      
      router.push("/admin/dashboard");
    } else {
      setError(data.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Admin Login
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 mt-1 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 mt-1 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}




// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function AdminLogin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await fetch("http://localhost:3001/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         router.push("/admin/dashboard");
//       } else {
//         setError(data.message || "Invalid credentials");
//       }
//     } catch (err) {
//       setError("Something went wrong. Try again.");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <form
//         onSubmit={handleLogin}
//         className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg"
//       >
//         <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
//           Admin Login
//         </h2>

//         {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-medium">
//             Email
//           </label>
//           <input
//             type="email"
//             placeholder="Enter email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full p-2 mt-1 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-medium">
//             Password
//           </label>
//           <input
//             type="password"
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full p-2 mt-1 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }