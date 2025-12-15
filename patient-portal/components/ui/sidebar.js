
"use client"; // Runs on the client side

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
    const pathname = usePathname(); // Get the current route
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication status when the component mounts
    useEffect(() => {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    // If user is not authenticated, do not show the sidebar
    if (!isAuthenticated) return null;

    const links = [
        { href: "/patient/dashboard", label: "🏠 Dashboard" },
        { href: "/patient/appointments", label: "📅 Appointments" },
        { href: "/patient/doctors", label: "👨‍⚕️ Doctors" },  
        { href: "/patient/prescriptions", label: "💊 Prescriptions" },
        // { href: "/patient/profile", label: "👤 Profile" },
        { href: "/patient/chatbot", label: "🤖 AI Chatbot" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token from localStorage
        setIsAuthenticated(false); // Update state
        window.location.href = "/patient/login"; // Redirect to login page
    };

    return (
        <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Patient Portal</h2>
            <nav className="flex flex-col space-y-5">
                {links.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center px-3 py-2 rounded-md transition ${
                            pathname === href
                                ? "text-blue-700 font-bold bg-blue-100"
                                : "text-gray-700 hover:text-blue-600"
                        }`}
                    >
                        {label}
                    </Link>
                ))}
            </nav>
            <button
                onClick={handleLogout}
                className="mt-auto text-left text-gray-700 hover:text-red-500 flex items-center"
            >
                🚪 Logout
            </button>
        </aside>
    );
};

export default Sidebar;