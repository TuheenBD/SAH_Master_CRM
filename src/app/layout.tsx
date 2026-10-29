import type { Metadata } from 'next';
import { Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ThemeProvider } from '@/lib/theme';
import './globals.css';

export const metadata: Metadata = {
  title: 'Master CRM - Personal Executive OS',
  description: 'Multi-Company CRM & Double-Entry Financial Engine for Bizman Media Limited, Linda Resort Limited, and Ariel Marketing & Communications',
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
          <div className="flex min-h-screen">
            {/* Left Side Panel (Dark Theme Tone) */}
            <Suspense fallback={<div className="w-64 border-r border-[#2C5240] bg-[#1F3A2E]" />}>
              <Sidebar />
            </Suspense>

            {/* Main Content Area (Offset by sidebar width on desktop) */}
            <div className="flex-1 lg:pl-64 flex flex-col min-w-0 bg-[var(--main-bg)]">
              {/* Sticky Top Header Panel (Dark Theme Tone) */}
              <Suspense fallback={<div className="h-16 border-b border-[#2C5240] bg-[#1F3A2E]" />}>
                <Header />
              </Suspense>

              {/* Page Body (Light Theme Canvas with White Cards) */}
              <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto bg-[var(--main-bg)]">
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
