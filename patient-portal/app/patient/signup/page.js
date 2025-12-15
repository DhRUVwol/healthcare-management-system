

// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function PatientSignup() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [dob, setDob] = useState("");
//   const [gender, setGender] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null); // To handle errors
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           email,
//           phone,
//           dateOfBirth: dob, // Ensure field names match backend
//           gender,
//           password,
//           role: "patient", // Change to "admin" if needed
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         setError(errorData.error || "Signup failed");
//         return;
//       }

//       const data = await res.json();
//       console.log("Signup Success:", data);

//       router.push("/login/patient/dashboard"); // Redirect after successful signup
//     } catch (error) {
//       console.error("Signup Request Failed:", error);
//       setError("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-lg shadow-md border border-gray-300 w-96"
//       >
//         <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Patient Signup</h2>

//         {error && <p className="text-red-500 text-center mb-3">{error}</p>}

//         <label className="block text-gray-700 font-medium mb-1">Name</label>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900 focus:border-blue-400"
//           required
//         />

//         <label className="block text-gray-700 font-medium mb-1">Email</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900 focus:border-blue-400"
//           required
//         />

//         <label className="block text-gray-700 font-medium mb-1">Phone</label>
//         <input
//           type="tel"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900 focus:border-blue-400"
//           required
//         />

//         <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
//         <input
//           type="date"
//           value={dob}
//           onChange={(e) => setDob(e.target.value)}
//           className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900 focus:border-blue-400"
//           required
//         />

//         <label className="block text-gray-700 font-medium mb-1">Gender</label>
//         <select
//           value={gender}
//           onChange={(e) => setGender(e.target.value)}
//           className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900 focus:border-blue-400"
//           required
//         >
//           <option value="" disabled>Select Gender</option>
//           <option value="male">Male</option>
//           <option value="female">Female</option>
//           <option value="other">Other</option>
//         </select>

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
//           className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition"
//         >
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// }










// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function PatientSignup() {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [dob, setDob] = useState("");
//   const [gender, setGender] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null); // Reset error state

//     try {
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           fullName,
//           email,
//           phone,
//           dateOfBirth: dob,
//           gender,
//           password,
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         setError(errorData.error || "Signup failed");
//         return;
//       }

//       const data = await res.json();
//       console.log("Signup Success:", data);

//       // Redirect to the patient dashboard
//       router.push("/patient/dashboard");

//     } catch (error) {
//       console.error("Signup Request Failed:", error);
//       setError("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-lg shadow-md border border-gray-300 w-96"
//       >
//         <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Patient Signup</h2>

//         {error && <p className="text-red-500 text-center mb-3">{error}</p>}

//         <label className="block text-gray-700 font-medium mb-1">Full Name</label>
//         <input
//           type="text"
//           value={fullName}
//           onChange={(e) => setFullName(e.target.value)}
//           className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900"
//           required
//         />

//         <label className="block text-gray-700 font-medium mb-1">Email</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900"
//           required
//         />

//         <label className="block text-gray-700 font-medium mb-1">Phone</label>
//         <input
//           type="tel"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900"
//           required
//         />

//         <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
//         <input
//           type="date"
//           value={dob}
//           onChange={(e) => setDob(e.target.value)}
//           className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900"
//           required
//         />

//         <label className="block text-gray-700 font-medium mb-1">Gender</label>
//         <select
//           value={gender}
//           onChange={(e) => setGender(e.target.value)}
//           className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900"
//           required
//         >
//           <option value="" disabled>Select Gender</option>
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//           <option value="Other">Other</option>
//         </select>

//         <label className="block text-gray-700 font-medium mb-1">Password</label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900"
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition"
//         >
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// }











"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PatientSignup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          dateOfBirth: dob, // ✅ ensure this matches the schema
          gender,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      // Success — redirect
      router.push("/patient/login");
    } catch (error) {
      console.error("Signup Request Failed:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md border border-gray-300 w-96"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Patient Signup</h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <label className="block text-gray-700 font-medium mb-1">Full Name</label>
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900" required />

        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900" required />

        <label className="block text-gray-700 font-medium mb-1">Phone</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900" required />

        <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900" required />

        <label className="block text-gray-700 font-medium mb-1">Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900" required>
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label className="block text-gray-700 font-medium mb-1">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full p-3 border rounded-md mb-3 bg-gray-100 text-gray-900" required />

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition">
          Sign Up
        </button>
      </form>
    </div>
  );
}