import type { Metadata } from "next"
import { Lexend } from "next/font/google"
import "./globals.css"

const lexend = Lexend({ subsets: ["latin"], variable: "--font-display" })

export const metadata: Metadata = {
  title: "StudyAbroadAI - Your Journey to Study Abroad Starts Here",
  description: "AI-powered guidance for Indian students pursuing global education",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={lexend.variable}>{children}</body>
    </html>
  )
}
