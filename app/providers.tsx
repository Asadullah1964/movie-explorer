'use client';

import { SessionProvider } from "next-auth/react";
import AppThemeProvider from "./_components/ThemeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppThemeProvider>
        {children}
      </AppThemeProvider>
    </SessionProvider>
  );
}