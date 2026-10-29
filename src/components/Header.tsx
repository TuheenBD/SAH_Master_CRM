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
  Sparkles,
  Palette,
  Check
} from 'lucide-react';
import { CompanyCode, COMPANIES } from '@/lib/types';
import { useTheme, THEMES, ThemeId } from '@/lib/theme';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';
  const meta = COMPANIES[activeCompany] || COMPANIES.CONSOLIDATED;

  const { currentTheme, setTheme } = useTheme();

  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

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

  const activeThemeMeta = THEMES.find(t => t.id === currentTheme) || THEMES[0];

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

        {/* Center: ACTIVE ENTITY VIEW */}
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

        {/* Right: Theme Switcher, Quick Action & Notifications */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          {/* THEME SWITCHER DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              title="Change Color Theme"
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 text-xs font-medium transition-all shadow-sm"
            >
              <Palette className="h-3.5 w-3.5 text-indigo-400" />
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  {activeThemeMeta.palette.slice(0, 3).map((col, idx) => (
                    <span 
                      key={idx} 
                      className="h-2.5 w-2.5 rounded-full ring-1 ring-slate-900 inline-block"
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
                <span className="hidden lg:inline text-[11px] font-semibold">{activeThemeMeta.name.split(' ')[0]}</span>
              </div>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {themeDropdownOpen && (
              <>
                <div 
                  onClick={() => setThemeDropdownOpen(false)}
                  className="fixed inset-0 z-30"
                />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-40 text-xs space-y-1">
                  <div className="px-2.5 py-1.5 border-b border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Visual Palette</span>
                    <span className="text-[9px] text-slate-500 font-mono">6 Curated Styles</span>
                  </div>

                  <div className="py-1 space-y-1 max-h-[360px] overflow-y-auto">
                    {THEMES.map((t) => {
                      const isSelected = currentTheme === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id);
                            setThemeDropdownOpen(false);
                          }}
                          className={`w-full rounded-xl p-2.5 text-left transition-all flex items-center justify-between ${
                            isSelected 
                              ? 'bg-indigo-950/70 border border-indigo-500/50 shadow-sm' 
                              : 'hover:bg-slate-800/60 border border-transparent'
                          }`}
                        >
                          <div className="space-y-1 min-w-0 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-semibold text-xs ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                {t.name}
                              </span>
                              {isSelected && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                            </div>
                            <div className="text-[10px] text-slate-400 line-clamp-1">{t.description}</div>
                          </div>

                          {/* 4 Swatch Circles from Uploaded Images */}
                          <div className="flex items-center -space-x-1 shrink-0 pl-1">
                            {t.palette.map((col, cIdx) => (
                              <span
                                key={cIdx}
                                className="h-4 w-4 rounded-full ring-2 ring-slate-900 shadow-sm inline-block"
                                style={{ backgroundColor: col }}
                                title={col}
                              />
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
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
