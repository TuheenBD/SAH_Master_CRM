'use client';

import React from 'react';
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
  Flame,
  ShieldCheck,
  ChevronDown,
  Contact,
  Wallet,
  FileSpreadsheet
} from 'lucide-react';
import { CompanyCode, COMPANIES } from '@/lib/types';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';

  const switchCompany = (code: CompanyCode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('company', code);
    router.push(`${pathname}?${params.toString()}`);
  };

  const navItems = [
    { label: 'Master View', href: '/', icon: BarChart3 },
    { label: 'Master Contacts', href: '/contacts', icon: Contact },
    { label: 'Leads & Pipeline', href: '/leads', icon: Users },
    { label: 'Inventory & Catalog', href: '/inventory', icon: Tv2 },
    { label: 'Deal Expenses', href: '/expenses', icon: DollarSign },
    { label: 'Corporate Accounting', href: '/finance', icon: BookOpenCheck },
    { label: 'Personal Finance', href: '/personal-finance', icon: Wallet },
    { label: 'Executive Reports', href: '/reports', icon: FileSpreadsheet },
    { label: 'Email Drips', href: '/automations', icon: Send },
    { label: 'Calendar', href: '/calendar', icon: CalendarDays },
    { label: 'Scratchpad', href: '/scratchpad', icon: FileEdit },
  ];

  const currentMeta = COMPANIES[activeCompany] || COMPANIES.CONSOLIDATED;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      {/* Top Company Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-slate-200">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>MASTER_CRM OS</span>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">v2.4 PERSONAL</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400 font-medium">
            Active Identity: <strong className="text-slate-200">{currentMeta.role}</strong>
          </span>
        </div>

        {/* Multi-Company Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {(Object.keys(COMPANIES) as CompanyCode[]).map((code) => {
            const isSelected = activeCompany === code;
            let badgeStyle = "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-slate-800";
            
            if (isSelected) {
              if (code === 'CONSOLIDATED') badgeStyle = "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30 border-indigo-500";
              if (code === 'BIZMAN') badgeStyle = "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30 border-blue-500";
              if (code === 'ADPRO') badgeStyle = "bg-orange-600 text-white font-semibold shadow-md shadow-orange-600/30 border-orange-500";
              if (code === 'ARIELMC') badgeStyle = "bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/30 border-emerald-500";
            }

            return (
              <button
                key={code}
                onClick={() => switchCompany(code)}
                className={`rounded-md border px-2.5 py-1 text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${badgeStyle}`}
              >
                {code === 'CONSOLIDATED' && <Layers className="h-3 w-3" />}
                {code === 'BIZMAN' && <Tv2 className="h-3 w-3" />}
                {code === 'ADPRO' && <Building2 className="h-3 w-3" />}
                {code === 'ARIELMC' && <Globe2 className="h-3 w-3" />}
                <span>{code}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-6 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const fullHref = `${item.href}?company=${activeCompany}`;
            return (
              <Link
                key={item.href}
                href={fullHref}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800/90 text-slate-100 shadow-inner border border-slate-700/60'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Quick Identity Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-right">
          <div>
            <div className="text-xs font-semibold text-slate-200">{currentMeta.name}</div>
            <div className="text-[10px] text-slate-400 truncate max-w-[220px]">{currentMeta.industry}</div>
          </div>
          <div className="h-7 w-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-slate-300">
            {activeCompany === 'CONSOLIDATED' ? 'ALL' : activeCompany.slice(0, 2)}
          </div>
        </div>
      </div>
    </header>
  );
}

