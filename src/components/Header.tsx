'use client';

import React, { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Bell, 
  Plus, 
  Sparkles, 
  Building2, 
  Tv2, 
  Globe2, 
  Layers, 
  FileText, 
  Receipt, 
  Users, 
  Wallet,
  Calendar,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { CompanyCode, COMPANIES } from '@/lib/types';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';
  const meta = COMPANIES[activeCompany] || COMPANIES.CONSOLIDATED;

  const [searchOpen, setSearchOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  // Derive human-readable page name
  const getPageTitle = () => {
    switch (pathname) {
      case '/': return 'Executive Master Overview';
      case '/contacts': return 'Master Contacts Directory';
      case '/leads': return 'Leads & Polymorphic Pipelines';
      case '/inventory': return 'Inventory & Export Catalogs';
      case '/expenses': return 'Daily Deal Expenses';
      case '/finance': return 'Dual-Entry Accounting & Ledger';
      case '/personal-finance': return 'Personal Finance & Banking Vault';
      case '/reports': return 'Executive Management Reports';
      case '/automations': return 'Automated Email Drips';
      case '/calendar': return 'Calendar & Action Agenda';
      case '/scratchpad': return 'Executive Markdown Scratchpad';
      default: return 'Master CRM Console';
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Breadcrumbs & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <span>{meta.code === 'CONSOLIDATED' ? 'GROUP' : meta.code}</span>
              <span>/</span>
              <span className="text-indigo-400 font-semibold">{getPageTitle()}</span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight truncate">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Center: Search & Quick Global Finder */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search leads, DOOH screens, buyers, expenses... (⌘K)"
              className="w-full rounded-lg border border-slate-800 bg-slate-900/70 pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span className="absolute right-2.5 top-2 rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 border border-slate-700/60">
              ⌘K
            </span>
          </div>
        </div>

        {/* Right: Quick Actions, Currency Ticker, Reminders & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Active Company Live Pill Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-slate-900/90 border border-slate-800 px-2.5 py-1 text-xs">
            {activeCompany === 'BIZMAN' && <Tv2 className="h-3.5 w-3.5 text-blue-400" />}
            {activeCompany === 'ADPRO' && <Building2 className="h-3.5 w-3.5 text-orange-400" />}
            {activeCompany === 'ARIELMC' && <Globe2 className="h-3.5 w-3.5 text-emerald-400" />}
            {activeCompany === 'CONSOLIDATED' && <Layers className="h-3.5 w-3.5 text-indigo-400" />}
            <span className="font-semibold text-slate-200 text-[11px] truncate max-w-[130px]">
              {meta.name.split(' ')[0]}
            </span>
          </div>

          {/* Quick Action Dropdown */}
          <div className="relative">
            <button
              onClick={() => setQuickActionOpen(!quickActionOpen)}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Quick Action</span>
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

          {/* Notifications Bell */}
          <Link
            href={`/calendar?company=${activeCompany}`}
            title="3 High Priority Actions Today"
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
