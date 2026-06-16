import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ToastProvider } from "@/components/ui/toast.js"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Doctor Dashboard",
  description: "Doctor Dashboard Application",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  )
}
