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
import { useTheme, THEMES } from '@/lib/theme';

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
    <header className="sticky top-0 z-40 border-b border-[#2C5240] bg-[#1F3A2E] text-white shadow-md">
      <div className="flex flex-col md:flex-row md:h-16 md:items-center justify-between px-4 sm:px-6 lg:px-8 py-2 md:py-0 gap-3">
        {/* Left: Breadcrumb / Page Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#CFE0D5] font-mono uppercase tracking-wider">
              <span>{meta.code === 'CONSOLIDATED' ? 'GROUP' : meta.code}</span>
              <span>/</span>
              <span style={{ color: '#C8A96A' }} className="font-bold">{getPageTitle()}</span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Center: ACTIVE ENTITY VIEW */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#162B22] p-1 rounded-xl border border-[#2C5240]">
          {(Object.keys(COMPANIES) as CompanyCode[]).map((code) => {
            const isSelected = activeCompany === code;
            let activeStyle = "text-[#CFE0D5] hover:text-white hover:bg-[#2C5240]";

            if (isSelected) {
              activeStyle = "bg-[#C8A96A] text-[#1F3A2E] font-extrabold shadow-md";
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
          <div className="hidden xl:flex items-center gap-2 border-l border-[#2C5240] pl-2.5 pr-1.5 text-[11px]">
            <span className="text-[#CFE0D5] font-medium truncate max-w-[140px]">{meta.role}</span>
            <span className="rounded bg-[#2C5240] px-1.5 py-0.5 font-mono font-bold text-[#C8A96A] text-[10px]">
              {meta.currency}
            </span>
          </div>
        </div>

        {/* Right: Theme Switcher, Quick Action & Notifications */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          {/* Theme Dropdown */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              title="Change Color Theme"
              className="flex items-center gap-1.5 rounded-lg border border-[#2C5240] bg-[#162B22] hover:bg-[#2C5240] text-[#CFE0D5] hover:text-white px-2.5 py-1.5 text-xs font-semibold transition-all shadow-sm"
            >
              <Palette className="h-3.5 w-3.5 text-[#C8A96A]" />
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  {activeThemeMeta.palette.slice(0, 3).map((col, idx) => (
                    <span 
                      key={idx} 
                      className="h-2.5 w-2.5 rounded-full ring-1 ring-[#1F3A2E] inline-block"
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
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#2C5240] bg-[#1F3A2E] text-white p-2 shadow-2xl z-40 text-xs space-y-1">
                  <div className="px-2.5 py-1.5 border-b border-[#2C5240] flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#CFE0D5]">Select Visual Palette</span>
                    <span className="text-[9px] text-[#C8A96A] font-mono">Curated Themes</span>
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
                              ? 'bg-[#27493A] border border-[#C8A96A] text-white' 
                              : 'hover:bg-[#2C5240] border border-transparent text-[#CFE0D5]'
                          }`}
                        >
                          <div className="space-y-1 min-w-0 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-semibold text-xs ${isSelected ? 'text-[#C8A96A]' : 'text-white'}`}>
                                {t.name}
                              </span>
                              {isSelected && <Check className="h-3.5 w-3.5 text-[#C8A96A]" />}
                            </div>
                            <div className="text-[10px] text-[#8FA899] line-clamp-1">{t.description}</div>
                          </div>

                          <div className="flex items-center -space-x-1 shrink-0 pl-1">
                            {t.palette.map((col, cIdx) => (
                              <span
                                key={cIdx}
                                className="h-4 w-4 rounded-full ring-2 ring-[#1F3A2E] shadow-sm inline-block"
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

          {/* Quick Action Button: Ariel Imperial Gold */}
          <div className="relative">
            <button
              onClick={() => setQuickActionOpen(!quickActionOpen)}
              className="flex items-center gap-1.5 rounded-lg bg-[#C8A96A] hover:bg-[#dbae64] text-[#1F3A2E] px-3.5 py-1.5 text-xs font-extrabold shadow-md transition-all"
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
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#2C5240] bg-[#1F3A2E] text-white p-1.5 shadow-2xl z-40 text-xs">
                  <Link
                    href={`/leads?company=${activeCompany}&action=new`}
                    onClick={() => setQuickActionOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[#CFE0D5] hover:bg-[#2C5240] hover:text-white transition-colors"
                  >
                    <Users className="h-4 w-4 text-[#C8A96A]" />
                    <span>Create New Lead</span>
                  </Link>

                  <Link
                    href={`/expenses?company=${activeCompany}&action=new`}
                    onClick={() => setQuickActionOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[#CFE0D5] hover:bg-[#2C5240] hover:text-white transition-colors"
                  >
                    <Receipt className="h-4 w-4 text-rose-400" />
                    <span>Record Deal Expense</span>
                  </Link>

                  <Link
                    href={`/contacts?company=${activeCompany}&action=new`}
                    onClick={() => setQuickActionOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[#CFE0D5] hover:bg-[#2C5240] hover:text-white transition-colors"
                  >
                    <FileText className="h-4 w-4 text-[#88BDF2]" />
                    <span>Add New Contact</span>
                  </Link>

                  <Link
                    href={`/personal-finance?action=new`}
                    onClick={() => setQuickActionOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[#CFE0D5] hover:bg-[#2C5240] hover:text-white transition-colors border-t border-[#2C5240] mt-1 pt-1.5"
                  >
                    <Wallet className="h-4 w-4 text-[#C8A96A]" />
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
            className="relative rounded-lg border border-[#2C5240] bg-[#162B22] p-2 text-[#CFE0D5] hover:text-white hover:bg-[#2C5240] transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          </Link>
        </div>
      </div>
    </header>
  );
}
