import type { Metadata } from 'next';
import { Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <div className="flex min-h-screen">
          {/* Left Side Panel */}
          <Suspense fallback={<div className="w-64 border-r border-slate-800 bg-slate-950" />}>
            <Sidebar />
          </Suspense>

          {/* Main Content Area (offset by sidebar width on desktop) */}
          <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
              <Suspense fallback={<div className="flex justify-center py-20 text-slate-500 text-sm">Loading Executive Console...</div>}>
                {children}
              </Suspense>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
