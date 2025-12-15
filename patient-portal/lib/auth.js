import jwt from "jsonwebtoken";

export function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret key
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}