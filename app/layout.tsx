import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppThemeProvider from './_components/ThemeProvider';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Movie Explorer',
  description: 'Discover and explore popular movies easily',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-dvh antialiased bg-background text-foreground`}>
        <AppThemeProvider>
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 md:px-6">{children}</main>
          <Footer />
        </AppThemeProvider>
      </body>
    </html>
  );
}
