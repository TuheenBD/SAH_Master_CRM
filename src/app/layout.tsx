import type { Metadata } from 'next';
import { Suspense } from 'react';
import Navigation from '@/components/Navigation';
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
        <Suspense fallback={<div className="h-14 border-b border-slate-800 bg-slate-950" />}>
          <Navigation />
        </Suspense>
        <main className="mx-auto max-w-7xl px-4 py-6">
          <Suspense fallback={<div className="flex justify-center py-20 text-slate-500 text-sm">Loading Executive Console...</div>}>
            {children}
          </Suspense>
        </main>
      </body>
    </html>
  );
}
