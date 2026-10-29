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
  FolderKanban,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { CompanyCode, COMPANIES } from '@/lib/types';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';
  const [mobileOpen, setMobileOpen] = useState(false);

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
      {/* Mobile Top Navbar */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between border-b border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--sidebar-active-text)] animate-pulse" />
          <span className="font-extrabold text-sm tracking-wide">
            MASTER_<span className="text-[var(--sidebar-active-text)] font-extrabold">CRM</span>
          </span>
          <span className="text-[10px] rounded bg-[var(--sidebar-hover)] text-[var(--sidebar-muted)] px-1.5 py-0.5 font-mono">v2.4</span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-white"
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

      {/* Persistent Left Sidebar: Dark Themed */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] text-white flex flex-col justify-between transition-transform duration-200 ease-in-out shadow-xl
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="p-4 border-b border-[var(--sidebar-border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl overflow-hidden border border-[#C8A96A]/60 bg-[#0A1628] shadow-md flex items-center justify-center shrink-0 p-0.5">
                  <img src="/logos/master-crm-icon.png" alt="Master CRM" className="h-full w-full object-contain" />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
                    <span>MASTER</span>
                    <span className="text-[var(--sidebar-active-text)] font-extrabold">CRM</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--sidebar-active-text)]" />
                  </div>
                  <div className="text-[9px] text-[#C8A96A] font-serif tracking-wider uppercase font-semibold">SYED AKRAMUL HASSAN</div>
                </div>
              </div>

              <span className="rounded bg-[var(--sidebar-border)] px-1.5 py-0.5 text-[9px] font-mono text-[var(--sidebar-active-text)] font-bold">
                ERP
              </span>
            </div>

            {/* Selected Active Entity Box with Official Brand Logo */}
            <div className="mt-4 rounded-xl bg-[var(--sidebar-box-bg)] border border-[var(--sidebar-border)] p-2.5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-muted)]">
                <span>Active Context</span>
                <span className="h-2 w-2 rounded-full bg-[var(--sidebar-active-text)]" />
              </div>

              {/* Brand Logo Display */}
              <div className="flex items-center gap-2.5 pt-0.5">
                {activeCompany === 'ARIELMC' && (
                  <div className="h-9 w-12 rounded-lg overflow-hidden border border-[var(--sidebar-border)] bg-white shrink-0 p-0.5 flex items-center justify-center shadow">
                    <img src="/logos/arielmc-logo.png" alt="ArielMC" className="max-h-8 w-auto object-contain" />
                  </div>
                )}

                {activeCompany === 'BIZMAN' && (
                  <div className="h-9 w-9 rounded-lg overflow-hidden border border-[var(--sidebar-border)] bg-[#0D3B29] shrink-0 p-0.5 flex items-center justify-center shadow">
                    <img src="/logos/bizman-logo.jpg" alt="Bizman Media" className="h-full w-full object-contain" />
                  </div>
                )}

                {activeCompany === 'LINDA' && (
                  <div className="h-9 px-2.5 rounded-lg overflow-hidden border border-[var(--sidebar-border)] bg-black shrink-0 flex items-center justify-center shadow">
                    <img src="/logos/linda-logo.png" alt="Linda Resort" className="h-6 w-auto object-contain" />
                  </div>
                )}

                {activeCompany === 'CONSOLIDATED' && (
                  <div className="flex items-center -space-x-1 shrink-0">
                    <div className="h-7 w-8 rounded-md overflow-hidden border border-[var(--sidebar-border)] bg-white p-0.5 shadow flex items-center justify-center">
                      <img src="/logos/arielmc-logo.png" alt="ArielMC" className="max-h-6 w-auto object-contain" />
                    </div>
                    <div className="h-7 w-7 rounded-md overflow-hidden border border-[var(--sidebar-border)] bg-[#0D3B29] p-0.5 shadow flex items-center justify-center">
                      <img src="/logos/bizman-logo.jpg" alt="Bizman" className="h-full w-full object-contain" />
                    </div>
                    <div className="h-7 px-1.5 rounded-md overflow-hidden border border-[var(--sidebar-border)] bg-black shadow flex items-center justify-center shrink-0">
                      <img src="/logos/linda-logo.png" alt="Linda" className="h-4 w-auto object-contain" />
                    </div>
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-white truncate">{currentMeta.name}</div>
                  <div className="text-[10px] text-[var(--sidebar-muted)] truncate flex items-center justify-between">
                    <span>{currentMeta.role}</span>
                    <span className="font-mono font-bold text-[var(--sidebar-active-text)]">{currentMeta.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-3 py-4 space-y-5">
            {menuSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-muted)]/70 mb-1.5">
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
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-[var(--sidebar-hover)] text-[var(--sidebar-active-text)] border-l-4 border-l-[var(--sidebar-active-text)] shadow-inner'
                            : 'text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-white'
                        }`}
                      >
                        <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[var(--sidebar-active-text)]' : 'text-[var(--sidebar-muted)]'}`} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* User Profile Footer */}
          <div className="p-3 border-t border-[var(--sidebar-border)] bg-[var(--sidebar-box-bg)]">
            <div className="flex items-center gap-2.5 rounded-lg p-2 bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)]">
              <div className="h-9 w-9 rounded-full overflow-hidden border border-[#C8A96A]/80 bg-[#0A1628] shadow-sm flex items-center justify-center shrink-0">
                <img src="/logos/master-crm-icon.png" alt="Syed Akramul Hassan" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">Syed Akramul Hassan</div>
                <div className="text-[10px] text-[var(--sidebar-active-text)] truncate flex items-center gap-1 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--sidebar-active-text)] inline-block" />
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
