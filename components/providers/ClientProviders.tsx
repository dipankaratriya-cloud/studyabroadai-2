'use client';

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="studyabroadai-theme">
      {children}
    </ThemeProvider>
  );
}
