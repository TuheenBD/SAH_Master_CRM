'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { 
  Building2, 
  Tv2, 
  Globe2, 
  Layers, 
  Users, 
  DollarSign, 
  BookOpenCheck, 
  Send, 
  CalendarDays, 
  FileEdit, 
  BarChart3,
  Contact,
  Wallet,
  FileSpreadsheet,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { CompanyCode, COMPANIES } from '@/lib/types';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';
  const [mobileOpen, setMobileOpen] = useState(false);

  const switchCompany = (code: CompanyCode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('company', code);
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentMeta = COMPANIES[activeCompany] || COMPANIES.CONSOLIDATED;

  const menuSections = [
    {
      title: 'CORE CRM & ASSETS',
      items: [
        { label: 'Executive Dashboard', href: '/', icon: BarChart3 },
        { label: 'Master Contacts', href: '/contacts', icon: Contact },
        { label: 'Leads & Pipeline', href: '/leads', icon: Users },
        { label: 'Inventory & Catalog', href: '/inventory', icon: Tv2 },
      ],
    },
    {
      title: 'FINANCE & COMMERCE',
      items: [
        { label: 'Deal Expenses', href: '/expenses', icon: DollarSign },
        { label: 'Corporate Accounting', href: '/finance', icon: BookOpenCheck },
        { label: 'Personal Finance Vault', href: '/personal-finance', icon: Wallet },
        { label: 'Executive Reports', href: '/reports', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'PRODUCTIVITY & AUTOMATION',
      items: [
        { label: 'Email Drips', href: '/automations', icon: Send },
        { label: 'Calendar & Tasks', href: '/calendar', icon: CalendarDays },
        { label: 'Executive Scratchpad', href: '/scratchpad', icon: FileEdit },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Top Navbar with Hamburger Toggle */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold text-white text-sm">MASTER_CRM</span>
          <span className="text-[10px] rounded bg-slate-800 text-slate-400 px-1.5 py-0.5 font-mono">v2.4</span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        />
      )}

      {/* Persistent Left Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-800/80 bg-slate-950 flex flex-col justify-between transition-transform duration-200 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white shadow-md shadow-indigo-600/30">
                  M
                </div>
                <div>
                  <div className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
                    <span>MASTER_CRM</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">EXECUTIVE OS</div>
                </div>
              </div>

              <span className="rounded bg-slate-900 border border-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-400">
                PRO
              </span>
            </div>

            {/* Active Company Selector */}
            <div className="mt-4 space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Active Entity View
              </div>

              <div className="grid grid-cols-2 gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
                {(Object.keys(COMPANIES) as CompanyCode[]).map((code) => {
                  const isSelected = activeCompany === code;
                  return (
                    <button
                      key={code}
                      onClick={() => {
                        switchCompany(code);
                        setMobileOpen(false);
                      }}
                      className={`rounded px-2 py-1 text-[11px] font-semibold transition-all flex items-center justify-center gap-1 ${
                        isSelected
                          ? code === 'CONSOLIDATED' ? 'bg-indigo-600 text-white shadow' :
                            code === 'BIZMAN' ? 'bg-blue-600 text-white shadow' :
                            code === 'ADPRO' ? 'bg-orange-600 text-white shadow' :
                            'bg-emerald-600 text-white shadow'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      {code === 'CONSOLIDATED' ? 'ALL' : code}
                    </button>
                  );
                })}
              </div>

              {/* Active Role Sub-banner */}
              <div className="rounded bg-slate-900/40 border border-slate-800/60 p-2 text-[10px] mt-1.5 text-slate-300 flex items-center justify-between">
                <span className="truncate">{currentMeta.role}</span>
                <span className="font-mono text-indigo-400 font-bold shrink-0">{currentMeta.currency}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links Grouped by Section */}
          <div className="flex-1 px-3 py-4 space-y-6">
            {menuSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {section.title}
                </div>

                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    const fullHref = `${item.href}?company=${activeCompany}`;
                    return (
                      <Link
                        key={item.href}
                        href={fullHref}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/30 shadow-sm'
                            : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                        }`}
                      >
                        <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* User Profile Footer */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
            <div className="flex items-center gap-2.5 rounded-lg bg-slate-900/70 p-2 border border-slate-800/70">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
                SH
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">Syed Akramul Hassan</div>
                <div className="text-[10px] text-emerald-400 truncate flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>Owner & Director</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

