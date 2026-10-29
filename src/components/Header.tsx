'use client';

import React, { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Bell, 
  Plus, 
  Building2, 
  Tv2, 
  Globe2, 
  Layers, 
  FileText, 
  Receipt, 
  Users, 
  Wallet,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { CompanyCode, COMPANIES } from '@/lib/types';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';
  const meta = COMPANIES[activeCompany] || COMPANIES.CONSOLIDATED;

  const [quickActionOpen, setQuickActionOpen] = useState(false);

  const switchCompany = (code: CompanyCode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('company', code);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Derive human-readable page name
  const getPageTitle = () => {
    switch (pathname) {
      case '/': return 'Executive Master';
      case '/contacts': return 'Master Contacts';
      case '/leads': return 'Leads & Pipelines';
      case '/inventory': return 'Inventory & Catalog';
      case '/expenses': return 'Deal Expenses';
      case '/finance': return 'Accounting & P&L';
      case '/personal-finance': return 'Personal Finance';
      case '/reports': return 'Executive Reports';
      case '/automations': return 'Email Drips';
      case '/calendar': return 'Calendar & Tasks';
      case '/scratchpad': return 'Executive Scratchpad';
      default: return 'Console';
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:h-16 md:items-center justify-between px-4 sm:px-6 lg:px-8 py-2 md:py-0 gap-3">
        {/* Left: Breadcrumb / Page Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              <span>{meta.code === 'CONSOLIDATED' ? 'GROUP' : meta.code}</span>
              <span>/</span>
              <span className="text-indigo-400 font-semibold">{getPageTitle()}</span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Center: ACTIVE ENTITY VIEW (Placed directly in Header) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
          {(Object.keys(COMPANIES) as CompanyCode[]).map((code) => {
            const isSelected = activeCompany === code;
            let activeStyle = "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60";

            if (isSelected) {
              if (code === 'CONSOLIDATED') activeStyle = "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400";
              if (code === 'BIZMAN') activeStyle = "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30 ring-1 ring-blue-400";
              if (code === 'ADPRO') activeStyle = "bg-orange-600 text-white font-bold shadow-md shadow-orange-600/30 ring-1 ring-orange-400";
              if (code === 'ARIELMC') activeStyle = "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400";
            }

            return (
              <button
                key={code}
                onClick={() => switchCompany(code)}
                className={`rounded-lg px-2.5 sm:px-3 py-1.5 text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${activeStyle}`}
              >
                {code === 'CONSOLIDATED' && <Layers className="h-3.5 w-3.5" />}
                {code === 'BIZMAN' && <Tv2 className="h-3.5 w-3.5" />}
                {code === 'ADPRO' && <Building2 className="h-3.5 w-3.5" />}
                {code === 'ARIELMC' && <Globe2 className="h-3.5 w-3.5" />}
                <span>{code === 'CONSOLIDATED' ? 'ALL ENTITIES' : code}</span>
              </button>
            );
          })}

          {/* Active Role & Currency Badge */}
          <div className="hidden xl:flex items-center gap-2 border-l border-slate-800 pl-2.5 pr-1.5 text-[11px]">
            <span className="text-slate-300 font-medium truncate max-w-[140px]">{meta.role}</span>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono font-bold text-indigo-400 text-[10px]">
              {meta.currency}
            </span>
          </div>
        </div>

        {/* Right: Quick Action Dropdown & Reminders */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          {/* Quick Action Dropdown */}
          <div className="relative">
            <button
              onClick={() => setQuickActionOpen(!quickActionOpen)}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Quick Action</span>
              <ChevronDown className="h-3 w-3 opacity-80" />
            </button>

            {quickActionOpen && (
              <>
                <div 
                  onClick={() => setQuickActionOpen(false)}
                  className="fixed inset-0 z-30"
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl z-40 text-xs">
                  <Link
                    href={`/leads?company=${activeCompany}&action=new`}
                    onClick={() => setQuickActionOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <Users className="h-4 w-4 text-indigo-400" />
                    <span>Create New Lead</span>
                  </Link>

                  <Link
                    href={`/expenses?company=${activeCompany}&action=new`}
                    onClick={() => setQuickActionOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <Receipt className="h-4 w-4 text-rose-400" />
                    <span>Record Deal Expense</span>
                  </Link>

                  <Link
                    href={`/contacts?company=${activeCompany}&action=new`}
                    onClick={() => setQuickActionOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span>Add New Contact</span>
                  </Link>

                  <Link
                    href={`/personal-finance?action=new`}
                    onClick={() => setQuickActionOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800 transition-colors border-t border-slate-800 mt-1 pt-1.5"
                  >
                    <Wallet className="h-4 w-4 text-emerald-400" />
                    <span>Log Personal Inflow/Outflow</span>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Agenda Reminder Bell */}
          <Link
            href={`/calendar?company=${activeCompany}`}
            title="Today's Priority Agenda"
            className="relative rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          </Link>
        </div>
      </div>
    </header>
  );
}
