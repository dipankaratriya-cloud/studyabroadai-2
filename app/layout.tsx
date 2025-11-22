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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className={lexend.variable}>{children}</body>
    </html>
  )
}
