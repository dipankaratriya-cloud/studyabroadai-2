import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";

export const metadata: Metadata = {
  title: "StudyAbroadAI - Your Journey to Study Abroad Starts Here",
  description: "AI-powered guidance for Indian students pursuing global education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-display">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
