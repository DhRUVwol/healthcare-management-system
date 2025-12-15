import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "./mongodb";
import Doctor from "@/models/Doctor";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password");
        }

        await connectDB();
        const doctor = await Doctor.findOne({ email: credentials.email });

        if (!doctor) {
          throw new Error("No doctor found with this email");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          doctor.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: doctor._id.toString(),
          email: doctor.email,
          name: doctor.name,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 