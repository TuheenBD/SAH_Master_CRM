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
  Check,
  Palmtree,
  FolderPlus,
  FolderKanban
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
      case '/documents': return 'Document Center';
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
    <header className="sticky top-0 z-40 border-b border-[var(--header-border)] bg-[var(--header-bg)] text-[var(--header-text)] shadow-md">
      <div className="flex flex-col md:flex-row md:min-h-16 md:items-center justify-between px-4 sm:px-6 lg:px-8 py-2 gap-3">
        {/* Left: Breadcrumb / Page Title with Active Entity Logo */}
        <div className="flex items-center gap-3 shrink-0">
          {activeCompany === 'ARIELMC' && (
            <div className="h-8 w-11 rounded-lg overflow-hidden border border-[var(--header-border)] bg-white p-0.5 shadow flex items-center justify-center shrink-0">
              <img src="/logos/arielmc-logo.png" alt="ArielMC" className="max-h-7 w-auto object-contain" />
            </div>
          )}
          {activeCompany === 'BIZMAN' && (
            <div className="h-8 w-8 rounded-lg overflow-hidden border border-[var(--header-border)] bg-[#0D3B29] p-0.5 shadow flex items-center justify-center shrink-0">
              <img src="/logos/bizman-logo.jpg" alt="Bizman Media" className="h-full w-full object-contain" />
            </div>
          )}
          {activeCompany === 'LINDA' && (
            <div className="h-9 px-2.5 rounded-lg overflow-hidden border border-[var(--header-border)] bg-black shadow flex items-center justify-center shrink-0">
              <img src="/logos/linda-logo.png" alt="Linda Resort" className="h-6 w-auto object-contain" />
            </div>
          )}
          {activeCompany === 'CONSOLIDATED' && (
            <div className="h-9 w-9 rounded-xl overflow-hidden border border-[#C8A96A]/60 bg-[#0A1628] shadow flex items-center justify-center shrink-0 p-0.5">
              <img src="/logos/master-crm-icon.png" alt="Master CRM" className="h-full w-full object-contain" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--header-sub)] font-mono uppercase tracking-wider">
              <span>{meta.code === 'CONSOLIDATED' ? 'GROUP' : meta.code === 'ARIELMC' ? 'ArielMC' : meta.code}</span>
              <span>/</span>
              <span className="text-[var(--header-accent)] font-bold">{getPageTitle()}</span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Center: ACTIVE ENTITY VIEW with Brand Logos & Centered Designation */}
        <div className="flex flex-col items-center justify-center gap-1.5 bg-[var(--sidebar-box-bg)] px-3.5 py-1.5 rounded-xl border border-[var(--header-border)] shadow-sm md:mx-auto">
          {/* Top Row: Entity Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full justify-center">
            {(Object.keys(COMPANIES) as CompanyCode[]).map((code) => {
              const isSelected = activeCompany === code;
              let activeStyle = "text-[var(--header-sub)] hover:text-white hover:bg-[var(--sidebar-hover)]";

              if (isSelected) {
                activeStyle = "bg-[var(--header-accent)] text-[var(--header-bg)] font-extrabold shadow-md";
              }

              return (
                <button
                  key={code}
                  onClick={() => switchCompany(code)}
                  className={`rounded-lg px-2.5 sm:px-3 py-1 text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${activeStyle}`}
                >
                  {code === 'CONSOLIDATED' && (
                    <img src="/logos/master-crm-icon.png" alt="Master CRM" className="h-4 w-4 rounded-full object-contain shrink-0 border border-[#C8A96A]/40" />
                  )}
                  {code === 'ARIELMC' && (
                    <img src="/logos/arielmc-logo.png" alt="ArielMC" className="h-4 w-auto object-contain shrink-0 bg-white px-0.5 rounded shadow-xs" />
                  )}
                  {code === 'BIZMAN' && (
                    <img src="/logos/bizman-logo.jpg" alt="Bizman" className="h-4 w-4 rounded object-contain shrink-0 shadow-xs" />
                  )}
                  {code === 'LINDA' && (
                    <img src="/logos/linda-logo.png" alt="Linda Resort" className="h-4 w-auto object-contain shrink-0 bg-black px-1 rounded border border-white/20 shadow-xs" />
                  )}
                  <span>{code === 'CONSOLIDATED' ? 'ALL ENTITIES' : code === 'ARIELMC' ? 'ArielMC' : code === 'BIZMAN' ? 'Bizman' : 'Linda Resort'}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Row: Active Designation in Dead Center */}
          <div className="flex items-center justify-center gap-2 text-[11px] pt-1 border-t border-[var(--header-border)]/70 w-full text-center">
            <span className="text-[var(--header-sub)]/80 text-[10px] uppercase tracking-wider font-semibold">Designation:</span>
            <span className="text-white font-extrabold tracking-wide">{meta.role}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--header-accent)] opacity-80" />
            <span className="rounded bg-[var(--sidebar-hover)] px-1.5 py-0.5 font-mono font-bold text-[var(--header-accent)] text-[10px]">
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
              className="flex items-center gap-1.5 rounded-lg border border-[var(--header-border)] bg-[var(--sidebar-box-bg)] hover:bg-[var(--sidebar-hover)] text-[var(--header-sub)] hover:text-white px-2.5 py-1.5 text-xs font-semibold transition-all shadow-sm"
            >
              <Palette className="h-3.5 w-3.5 text-[var(--header-accent)]" />
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  {activeThemeMeta.palette.slice(0, 3).map((col, idx) => (
                    <span 
                      key={idx} 
                      className="h-2.5 w-2.5 rounded-full ring-1 ring-[var(--sidebar-bg)] inline-block"
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
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] text-white p-2 shadow-2xl z-40 text-xs space-y-1">
                  <div className="px-2.5 py-1.5 border-b border-[var(--sidebar-border)] flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-muted)]">Select Visual Palette</span>
                    <span className="text-[9px] text-[var(--sidebar-active-text)] font-mono">Curated Themes</span>
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
                              ? 'bg-[var(--sidebar-hover)] border border-[var(--sidebar-active-text)] text-white' 
                              : 'hover:bg-[var(--sidebar-hover)] border border-transparent text-[var(--sidebar-muted)]'
                          }`}
                        >
                          <div className="space-y-1 min-w-0 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-semibold text-xs ${isSelected ? 'text-[var(--sidebar-active-text)]' : 'text-white'}`}>
                                {t.name}
                              </span>
                              {isSelected && <Check className="h-3.5 w-3.5 text-[var(--sidebar-active-text)]" />}
                            </div>
                            <div className="text-[10px] text-[var(--sidebar-muted)]/80 line-clamp-1">{t.description}</div>
                          </div>

                          <div className="flex items-center -space-x-1 shrink-0 pl-1">
                            {t.palette.map((col, cIdx) => (
                              <span
                                key={cIdx}
                                className="h-4 w-4 rounded-full ring-2 ring-[var(--sidebar-bg)] shadow-sm inline-block"
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

          {/* Quick Action Button: Imperial Gold Accent */}
          <div className="relative">
            <button
              onClick={() => setQuickActionOpen(!quickActionOpen)}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--header-accent)] hover:opacity-90 text-[var(--header-bg)] px-3.5 py-1.5 text-xs font-extrabold shadow-md transition-all"
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
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] text-white p-1.5 shadow-2xl z-40 text-xs">
                  <Link
                    href={`/leads?company=${activeCompany}&action=new`}
                    onClick={() => setQuickActionOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-white transition-colors"
                  >
                    <Users className="h-4 w-4 text-[var(--sidebar-active-text)]" />
                    <span>Create New Lead</span>
                  </Link>

                  <Link
                    href={`/expenses?company=${activeCompany}&action=new`}
                    onClick={() => setQuickActionOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-white transition-colors"
                  >
                    <Receipt className="h-4 w-4 text-rose-400" />
                    <span>Record Deal Expense</span>
                  </Link>

                  <Link
                    href={`/contacts?company=${activeCompany}&action=new`}
                    onClick={() => setQuickActionOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-white transition-colors"
                  >
                    <FileText className="h-4 w-4 text-[#88BDF2]" />
                    <span>Add New Contact</span>
                  </Link>

                  <Link
                    href={`/documents?company=${activeCompany}&action=upload`}
                    onClick={() => setQuickActionOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-white transition-colors"
                  >
                    <FolderPlus className="h-4 w-4 text-[#C8A96A]" />
                    <span>Upload Document</span>
                  </Link>

                  <Link
                    href={`/personal-finance?action=new`}
                    onClick={() => setQuickActionOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-white transition-colors border-t border-[var(--sidebar-border)] mt-1 pt-1.5"
                  >
                    <Wallet className="h-4 w-4 text-[var(--sidebar-active-text)]" />
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
