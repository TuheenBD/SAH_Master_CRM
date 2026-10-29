'use client';

import React, { useState, useEffect } from 'react';
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
  FolderKanban, 
  Menu, 
  X, 
  Sparkles,
  Lock 
} from 'lucide-react';
import { CompanyCode, COMPANIES } from '@/lib/types';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setMobileOpen(prev => !prev);
    const handleClose = () => setMobileOpen(false);
    window.addEventListener('toggle-mobile-sidebar', handleToggle);
    window.addEventListener('close-mobile-sidebar', handleClose);
    return () => {
      window.removeEventListener('toggle-mobile-sidebar', handleToggle);
      window.removeEventListener('close-mobile-sidebar', handleClose);
    };
  }, []);

  const currentMeta = COMPANIES[activeCompany] || COMPANIES.CONSOLIDATED;

  const menuSections = [
    {
      title: 'CORE CRM & ASSETS',
      items: [
        { label: 'Executive Dashboard', href: '/', icon: BarChart3 },
        { label: 'Master Contacts', href: '/contacts', icon: Contact },
        { label: 'Leads & Pipeline', href: '/leads', icon: Users },
        { label: 'Document Center', href: '/documents', icon: FolderKanban },
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
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Persistent Left Sidebar: Dark Themed (Non-scrollable, fits viewport) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] text-white flex flex-col justify-between transition-transform duration-200 ease-in-out shadow-2xl h-screen overflow-hidden
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full justify-between overflow-hidden">
          {/* Top Section: Brand Header & Active Context */}
          <div>
            {/* Brand Header */}
            <div className="p-3 pb-2 border-b border-[var(--sidebar-border)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg overflow-hidden border border-[#C8A96A]/60 bg-[#0A1628] shadow-md flex items-center justify-center shrink-0 p-0.5">
                    <img src="/logos/master-crm-icon.png" alt="Master CRM" className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-white tracking-tight flex items-center gap-1.5">
                      <span>PERSONAL</span>
                      <span className="text-[var(--sidebar-active-text)] font-extrabold">CRM</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--sidebar-active-text)]" />
                    </div>
                    <div className="text-[8.5px] text-[#C8A96A] font-serif tracking-wider uppercase font-semibold">SYED AKRAMUL HASSAN</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="rounded bg-[var(--sidebar-border)] px-1.5 py-0.5 text-[8.5px] font-mono text-[var(--sidebar-active-text)] font-bold">
                    ERP
                  </span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="lg:hidden p-1 rounded-md text-[var(--sidebar-muted)] hover:text-white hover:bg-[var(--sidebar-hover)]"
                    title="Close Menu"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Selected Active Entity Box with Official Brand Logo */}
              <div className="mt-2 rounded-xl bg-[var(--sidebar-box-bg)] border border-[var(--sidebar-border)] p-2 space-y-1.5">
                <div className="flex items-center justify-between text-[9.5px] font-bold uppercase tracking-wider text-[var(--sidebar-muted)]">
                  <span>Active Context</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--sidebar-active-text)]" />
                </div>

                {/* Line 1: Brand Logos Row (Centered with No Overlap) */}
                <div className="flex items-center justify-center pt-0.5 min-h-[32px]">
                  {activeCompany === 'ARIELMC' && (
                    <div className="h-8 w-16 rounded-lg overflow-hidden border border-[var(--sidebar-border)] bg-white p-0.5 flex items-center justify-center shadow">
                      <img src="/logos/arielmc-logo.png" alt="ArielMC" className="max-h-7 w-auto object-contain" />
                    </div>
                  )}

                  {activeCompany === 'BIZMAN' && (
                    <div className="h-8 w-8 rounded-lg overflow-hidden border border-[var(--sidebar-border)] bg-[#0D3B29] p-0.5 flex items-center justify-center shadow">
                      <img src="/logos/bizman-logo.jpg" alt="Bizman Media" className="h-full w-full object-contain" />
                    </div>
                  )}

                  {activeCompany === 'LINDA' && (
                    <div className="h-8 px-3 rounded-lg overflow-hidden border border-[var(--sidebar-border)] bg-[#112717] flex items-center justify-center shadow">
                      <img src="/logos/linda-logo.png" alt="Linda Resort" className="h-6 w-auto object-contain" />
                    </div>
                  )}

                  {activeCompany === 'CONSOLIDATED' && (
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-11 rounded-md overflow-hidden border border-[var(--sidebar-border)] bg-white p-0.5 shadow flex items-center justify-center">
                        <img src="/logos/arielmc-logo.png" alt="ArielMC" className="max-h-5.5 w-auto object-contain" />
                      </div>
                      <div className="h-7 w-7 rounded-md overflow-hidden border border-[var(--sidebar-border)] bg-[#0D3B29] p-0.5 shadow flex items-center justify-center">
                        <img src="/logos/bizman-logo.jpg" alt="Bizman" className="h-full w-full object-contain" />
                      </div>
                      <div className="h-7 px-2 rounded-md overflow-hidden border border-[var(--sidebar-border)] bg-[#112717] shadow flex items-center justify-center">
                        <img src="/logos/linda-logo.png" alt="Linda Resort" className="h-5 w-auto object-contain" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Line 2 (Under the Logos): Role & Currency Badge - Center Aligned */}
                <div className="border-t border-[var(--sidebar-border)]/60 pt-1.5 flex items-center justify-center gap-1.5 text-center">
                  <span className="text-[10.5px] font-bold text-[var(--sidebar-active-text)] tracking-wide">
                    {currentMeta.role}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-[var(--sidebar-active-text)] opacity-60" />
                  <span className="font-mono text-[8.5px] font-bold text-[var(--sidebar-active-text)] bg-[var(--sidebar-hover)] px-1.5 py-0.5 rounded border border-[var(--sidebar-border)]">
                    {currentMeta.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Links (Compact Spacing to Fit Any Viewport Without Scrolling) */}
            <div className="px-2.5 py-2.5 space-y-3">
              {menuSections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-0.5">
                  <div className="px-2.5 text-[10px] font-black uppercase tracking-widest text-[#C8A96A] mb-1 flex items-center gap-1.5">
                    <span className="h-1 w-1.5 rounded-full bg-[#C8A96A] shrink-0 opacity-80" />
                    <span>{section.title}</span>
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
                          className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-[var(--sidebar-hover)] text-[var(--sidebar-active-text)] border-l-4 border-l-[var(--sidebar-active-text)] shadow-inner'
                              : 'text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-white'
                          }`}
                        >
                          <item.icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-[var(--sidebar-active-text)]' : 'text-[var(--sidebar-muted)]'}`} />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Profile Footer (Always Docked at Bottom) */}
          <div className="p-2.5 border-t border-[var(--sidebar-border)] bg-[var(--sidebar-box-bg)]">
            <div className="flex items-center gap-2 rounded-lg p-1.5 bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)]">
              <div className="h-8 w-8 rounded-full overflow-hidden border border-[#C8A96A]/80 bg-[#0A1628] shadow-sm flex items-center justify-center shrink-0">
                <img src="/logos/master-crm-icon.png" alt="Syed Akramul Hassan" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-white truncate">Syed Akramul Hassan</div>
                <div className="text-[9.5px] text-[var(--sidebar-active-text)] truncate flex items-center gap-1 font-semibold">
                  <span className="h-1 w-1 rounded-full bg-[var(--sidebar-active-text)] inline-block" />
                  <span>Owner & Director</span>
                </div>
              </div>

              {/* Quick Lock Button */}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  window.dispatchEvent(new CustomEvent('lock-crm-vault'));
                }}
                title="Lock Executive Vault"
                className="p-1.5 rounded-lg border border-[var(--sidebar-border)] bg-[var(--sidebar-box-bg)] hover:bg-rose-950/70 text-[#C8A96A] hover:text-rose-300 transition-colors shrink-0"
              >
                <Lock className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
