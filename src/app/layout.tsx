import type { Metadata } from 'next';
import { Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SoundAndGlassProvider from '@/components/SoundAndGlassProvider';
import { ThemeProvider } from '@/lib/theme';
import './globals.css';

export const metadata: Metadata = {
  title: 'Master CRM | Syed Akramul Hassan - Executive OS',
  description: 'Multi-Company CRM & Double-Entry Financial Engine for ArielMC, Bizman Media Limited, and Linda Resort Limited - Owned by Syed Akramul Hassan',
  icons: {
    icon: '/logos/master-crm-icon.png',
    shortcut: '/logos/master-crm-icon.png',
    apple: '/logos/master-crm-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased selection:bg-emerald-600 selection:text-white bg-[var(--main-bg)] text-[var(--main-text)]">
        <ThemeProvider>
          <SoundAndGlassProvider />
          <div className="flex min-h-screen">
            {/* Left Side Panel (Dark Theme Tone) - Hidden in Print */}
            <div className="print:hidden">
              <Suspense fallback={<div className="w-64 border-r border-[#2C5240] bg-[#1F3A2E]" />}>
                <Sidebar />
              </Suspense>
            </div>

            {/* Main Content Area (Offset by sidebar width on desktop) */}
            <div className="flex-1 lg:pl-64 print:pl-0 print:m-0 flex flex-col min-w-0 bg-[var(--main-bg)] print:bg-white">
              {/* Sticky Top Header Panel (Dark Theme Tone) - Hidden in Print */}
              <div className="print:hidden">
                <Suspense fallback={<div className="h-16 border-b border-[#2C5240] bg-[#1F3A2E]" />}>
                  <Header />
                </Suspense>
              </div>

              {/* Page Body (Light Theme Canvas with White Cards) */}
              <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 print:p-0 print:m-0 print:max-w-none max-w-7xl w-full mx-auto bg-[var(--main-bg)] print:bg-white">
                <Suspense fallback={<div className="flex justify-center py-20 text-[#6B7269] text-sm">Loading Executive Console...</div>}>
                  {children}
                </Suspense>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
