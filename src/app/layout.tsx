import type { Metadata } from 'next';
import { Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ThemeProvider } from '@/lib/theme';
import './globals.css';

export const metadata: Metadata = {
  title: 'Master CRM - Personal Executive OS',
  description: 'Multi-Company CRM & Double-Entry Financial Engine for Bizman Media, Adpro Communications, and Ariel Marketing & Communications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased selection:bg-emerald-600 selection:text-white" style={{ backgroundColor: '#F4F6F4', color: '#1A1A1A' }}>
        <ThemeProvider>
          <div className="flex min-h-screen">
            {/* Left Side Panel (Dark Forest Pine #1F3A2E) */}
            <Suspense fallback={<div className="w-64 border-r border-[#2C5240] bg-[#1F3A2E]" />}>
              <Sidebar />
            </Suspense>

            {/* Main Content Area (Offset by sidebar width on desktop) */}
            <div className="flex-1 lg:pl-64 flex flex-col min-w-0" style={{ backgroundColor: '#F4F6F4' }}>
              {/* Sticky Top Header Panel (Dark Forest Pine #1F3A2E) */}
              <Suspense fallback={<div className="h-16 border-b border-[#2C5240] bg-[#1F3A2E]" />}>
                <Header />
              </Suspense>

              {/* Page Body (Light Off-White Canvas #F4F6F4 with Pure White Cards) */}
              <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto" style={{ backgroundColor: '#F4F6F4' }}>
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
