'use client';

import React, { useState, useEffect } from 'react';
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
  FolderKanban,
  Volume2,
  VolumeX,
  Menu,
  Lock,
  Clock,
  AlertTriangle,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { CompanyCode, COMPANIES, isRenewalDue, getDaysUntilExpiration, DocumentRecord } from '@/lib/types';
import { INITIAL_DOCUMENTS } from '@/lib/mock-data';
import { useTheme, THEMES } from '@/lib/theme';
import { isAudioEnabled, toggleAudioEnabled } from '@/lib/sound';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';
  const meta = COMPANIES[activeCompany] || COMPANIES.CONSOLIDATED;

  const { currentTheme, setTheme } = useTheme();

  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const [expiringDocs, setExpiringDocs] = useState<{ id: string; title: string; companyCode: string; daysLeft: number; expiryDate: string }[]>([]);

  useEffect(() => {
    setSoundEnabled(isAudioEnabled());
    const onSoundChange = (e: Event) => {
      const custom = e as CustomEvent<{ enabled: boolean }>;
      if (custom.detail !== undefined) {
        setSoundEnabled(custom.detail.enabled);
      }
    };
    window.addEventListener('sound-toggle-change', onSoundChange);
    return () => window.removeEventListener('sound-toggle-change', onSoundChange);
  }, []);

  // Sync Pending Tasks count and Expiring Documents (30-day renewal threshold)
  useEffect(() => {
    const updateNotifications = () => {
      // 1. Pending Tasks
      try {
        const storedTasks = localStorage.getItem('sah_master_crm_tasks_v3') || localStorage.getItem('sah_master_crm_tasks');
        if (storedTasks) {
          const parsed = JSON.parse(storedTasks);
          if (Array.isArray(parsed)) {
            const pending = parsed.filter((t: any) => t.status === 'PENDING');
            setPendingTasks(pending);
          } else {
            setPendingTasks([]);
          }
        } else {
          setPendingTasks([]);
        }
      } catch (e) {
        setPendingTasks([]);
      }

      // 2. Expiring Documents (Within 30 Days)
      try {
        let docs: DocumentRecord[] = INITIAL_DOCUMENTS;
        const storedDocs = localStorage.getItem('sah_master_crm_documents_v2');
        if (storedDocs) {
          const parsed = JSON.parse(storedDocs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            docs = parsed;
          }
        }

        const dueList = docs
          .filter(d => isRenewalDue(d.expiryDate))
          .map(d => ({
            id: d.id,
            title: d.title,
            companyCode: d.companyCode,
            daysLeft: getDaysUntilExpiration(d.expiryDate) ?? 0,
            expiryDate: d.expiryDate ?? ''
          }))
          .sort((a, b) => a.daysLeft - b.daysLeft);

        setExpiringDocs(dueList);
      } catch (e) {
        setExpiringDocs([]);
      }
    };

    updateNotifications();
    window.addEventListener('storage', updateNotifications);
    window.addEventListener('calendar-tasks-updated', updateNotifications);
    window.addEventListener('documents-updated', updateNotifications);
    return () => {
      window.removeEventListener('storage', updateNotifications);
      window.removeEventListener('calendar-tasks-updated', updateNotifications);
      window.removeEventListener('documents-updated', updateNotifications);
    };
  }, []);

  const totalAlertsCount = pendingTasks.length + expiringDocs.length;

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
    <header className="sticky top-0 z-40 border-b border-[var(--header-border)] bg-[var(--header-bg)] text-[var(--header-text)] shadow-md w-full">
      <div className="flex flex-col md:flex-row md:min-h-16 md:items-center justify-between px-3 sm:px-6 lg:px-8 py-2 gap-2.5 w-full max-w-full">
        {/* Row 1 on Mobile / Left on Desktop: Hamburger + Breadcrumb / Page Title */}
        <div className="flex items-center justify-between md:justify-start gap-2.5 w-full md:w-auto shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))}
              className="lg:hidden p-2 rounded-lg border border-[var(--header-border)] bg-[var(--sidebar-box-bg)] hover:bg-[var(--sidebar-hover)] text-white shadow-xs shrink-0"
              title="Open Navigation Menu"
            >
              <Menu className="h-4 w-4 text-[var(--header-accent)]" />
            </button>

            {/* Active Entity Logo */}
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
              <div className="h-8 px-2 rounded-lg overflow-hidden border border-[var(--header-border)] bg-[#112717] shadow flex items-center justify-center shrink-0">
                <img src="/logos/linda-logo.png" alt="Linda Resort" className="h-6 w-auto object-contain" />
              </div>
            )}
            {activeCompany === 'CONSOLIDATED' && (
              <div className="h-8 w-8 rounded-xl overflow-hidden border border-[#C8A96A]/60 bg-[#0A1628] shadow flex items-center justify-center shrink-0 p-0.5">
                <img src="/logos/master-crm-icon.png" alt="Master CRM" className="h-full w-full object-contain" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[9.5px] text-[var(--header-sub)] font-mono uppercase tracking-wider truncate">
                <span>{meta.code === 'CONSOLIDATED' ? 'GROUP' : meta.code === 'ARIELMC' ? 'ArielMC' : meta.code}</span>
                <span>/</span>
                <span className="text-[var(--header-accent)] font-bold">{getPageTitle()}</span>
              </div>
              <h1 className="text-xs sm:text-base font-extrabold text-white tracking-tight leading-tight truncate">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Mobile Right Actions: Quick Action + Sound (Hidden on Desktop) */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            {/* Quick Action Button for Mobile */}
            <Link
              href={`/leads?company=${activeCompany}&action=new`}
              className="flex items-center gap-1 rounded-lg bg-[var(--header-accent)] text-[var(--header-bg)] px-2.5 py-1.5 text-[11px] font-black shadow-sm"
              title="New Lead / Deal"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Lead</span>
            </Link>

            {/* Audio Toggle for Mobile */}
            <button
              onClick={() => {
                const next = toggleAudioEnabled();
                setSoundEnabled(next);
              }}
              className="p-1.5 rounded-lg border border-[var(--header-border)] bg-[var(--sidebar-box-bg)] text-[var(--header-sub)]"
              title="Toggle Audio"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-[#C8A96A]" /> : <VolumeX className="h-3.5 w-3.5 opacity-60" />}
            </button>
          </div>
        </div>

        {/* Center: ACTIVE ENTITY VIEW with Brand Logos & Centered Designation */}
        <div className="flex flex-col items-center justify-center gap-1 bg-[var(--sidebar-box-bg)] px-2.5 py-1.5 rounded-xl border border-[var(--header-border)] shadow-sm w-full md:w-auto md:mx-auto overflow-hidden">
          {/* Top Row: Entity Switcher Pills (Touch-scrollable on mobile) */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full justify-start sm:justify-center w-full py-0.5 no-scrollbar">
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
                  className={`rounded-lg px-2 sm:px-3 py-1 text-[11px] sm:text-xs transition-all whitespace-nowrap flex items-center gap-1 shrink-0 ${activeStyle}`}
                >
                  {code === 'CONSOLIDATED' && (
                    <img src="/logos/master-crm-icon.png" alt="Master CRM" className="h-3.5 w-3.5 rounded-full object-contain shrink-0 border border-[#C8A96A]/40" />
                  )}
                  {code === 'ARIELMC' && (
                    <img src="/logos/arielmc-logo.png" alt="ArielMC" className="h-3.5 w-auto object-contain shrink-0 bg-white px-0.5 rounded shadow-xs" />
                  )}
                  {code === 'BIZMAN' && (
                    <img src="/logos/bizman-logo.jpg" alt="Bizman" className="h-3.5 w-3.5 rounded object-contain shrink-0 shadow-xs" />
                  )}
                  {code === 'LINDA' && (
                    <img src="/logos/linda-logo.png" alt="Linda Resort" className="h-3.5 w-auto max-w-[50px] object-contain shrink-0 shadow-xs" />
                  )}
                  <span>{code === 'CONSOLIDATED' ? 'ALL ENTITIES' : code === 'ARIELMC' ? 'ArielMC' : code === 'BIZMAN' ? 'Bizman' : 'Linda Resort'}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Row: Active Designation in Dead Center */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] pt-1 border-t border-[var(--header-border)]/70 w-full text-center">
            <span className="text-[var(--header-sub)]/80 text-[9.5px] uppercase tracking-wider font-semibold">Designation:</span>
            <span className="text-white font-extrabold tracking-wide truncate max-w-[180px] sm:max-w-none">{meta.role}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--header-accent)] opacity-80" />
            <span className="rounded bg-[var(--sidebar-hover)] px-1.5 py-0.2 font-mono font-bold text-[var(--header-accent)] text-[9.5px]">
              {meta.currency}
            </span>
          </div>
        </div>

        {/* Right on Desktop: Theme Switcher, Quick Action & Notifications */}
        <div className="hidden md:flex items-center gap-2 shrink-0 self-end md:self-auto">
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
                    href={`/leads?company=${activeCompany}&action=new-company`}
                    onClick={() => setQuickActionOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-white transition-colors"
                  >
                    <Building2 className="h-4 w-4 text-[var(--sidebar-active-text)]" />
                    <span>List New Company Account</span>
                  </Link>

                  <Link
                    href={`/leads?company=${activeCompany}&action=new`}
                    onClick={() => setQuickActionOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-white transition-colors"
                  >
                    <Users className="h-4 w-4 text-[var(--sidebar-active-text)]" />
                    <span>Create New Lead / Deal</span>
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

          {/* Executive Audio Feedback Toggle */}
          <button
            onClick={() => {
              const next = toggleAudioEnabled();
              setSoundEnabled(next);
            }}
            title={soundEnabled ? 'Glass Sound Effects: Enabled (Click to Mute)' : 'Glass Sound Effects: Muted (Click to Enable)'}
            className={`relative rounded-lg border p-2 transition-all ${
              soundEnabled
                ? 'border-[#2C5240] bg-[#162B22] text-[#C8A96A] hover:text-white hover:bg-[#2C5240]'
                : 'border-[var(--header-border)] bg-black/20 text-[var(--header-sub)] hover:text-white'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4 opacity-60" />
            )}
          </button>

          {/* Executive Notification Center (Bell with Dynamic 30-Day Renewal & Task Alerts) */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              title={totalAlertsCount > 0 ? `${totalAlertsCount} Active Alert(s) - Click to review` : "Notification Center: All Clear (0 Alerts)"}
              className={`relative rounded-lg border p-2 transition-all ${
                notificationOpen 
                  ? 'border-[#C8A96A] bg-[#2C5240] text-white' 
                  : 'border-[#2C5240] bg-[#162B22] text-[#CFE0D5] hover:text-white hover:bg-[#2C5240]'
              }`}
            >
              <Bell className="h-4 w-4" />
              {totalAlertsCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            {notificationOpen && (
              <>
                <div 
                  onClick={() => setNotificationOpen(false)}
                  className="fixed inset-0 z-30"
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#2C5240] bg-[#0E1F18] text-white p-3.5 shadow-2xl z-40 text-xs space-y-3">
                  {/* Top Header */}
                  <div className="flex items-center justify-between border-b border-[#2C5240] pb-2 px-0.5">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-[#1F3A2E] text-[#C8A96A] flex items-center justify-center font-bold">
                        <Bell className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-extrabold text-[#F4F6F4]">Executive Notification Center</span>
                    </div>
                    {totalAlertsCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-900/80 text-rose-200 border border-rose-700">
                        {totalAlertsCount} Active {totalAlertsCount === 1 ? 'Alert' : 'Alerts'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-900/80 text-emerald-200 border border-emerald-700">
                        All Clear
                      </span>
                    )}
                  </div>

                  {/* Section 1: 📄 Document Renewal Alerts (30 Days Threshold) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1 text-[11px] font-bold text-[#C8A96A] uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        <span>Document Renewals (&le; 30 Days)</span>
                      </span>
                      <span className="text-[10px] font-mono text-[#8FA899]">{expiringDocs.length} Due</span>
                    </div>

                    {expiringDocs.length === 0 ? (
                      <div className="rounded-xl border border-[#2C5240]/50 bg-[#142A20]/40 p-2.5 text-center text-[11px] text-[#A3B8AC]">
                        <Check className="h-3.5 w-3.5 text-emerald-400 inline mr-1" />
                        All vault documents current. No renewals due within 30 days.
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {expiringDocs.map(doc => (
                          <Link
                            key={doc.id}
                            href={`/documents?company=${doc.companyCode}`}
                            onClick={() => setNotificationOpen(false)}
                            className="block p-2 rounded-xl border border-amber-500/40 bg-amber-950/30 hover:bg-amber-950/50 transition-all text-[11px] space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-200 truncate max-w-[210px]">{doc.title}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
                                {doc.daysLeft < 0 ? `Expired ${Math.abs(doc.daysLeft)}d ago` : `${doc.daysLeft}d left`}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#A3B8AC] flex items-center justify-between">
                              <span>Expires: {doc.expiryDate}</span>
                              <span className="font-mono text-[#C8A96A] uppercase font-bold">{doc.companyCode}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section 2: 📅 Pending Action Items */}
                  <div className="space-y-1.5 border-t border-[#2C5240] pt-2.5">
                    <div className="flex items-center justify-between px-1 text-[11px] font-bold text-[#C8A96A] uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        <span>Action Items & Agenda</span>
                      </span>
                      <span className="text-[10px] font-mono text-[#8FA899]">{pendingTasks.length} Pending</span>
                    </div>

                    {pendingTasks.length === 0 ? (
                      <div className="rounded-xl border border-[#2C5240]/50 bg-[#142A20]/40 p-2.5 text-center text-[11px] text-[#A3B8AC]">
                        <Check className="h-3.5 w-3.5 text-emerald-400 inline mr-1" />
                        Agenda clear. 0 pending action items.
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {pendingTasks.slice(0, 4).map(task => (
                          <Link
                            key={task.id}
                            href={`/calendar?company=${task.company}`}
                            onClick={() => setNotificationOpen(false)}
                            className="block p-2 rounded-xl border border-[#2C5240] bg-[#142A20] hover:bg-[#1E3B2D] transition-all text-[11px] space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#F4F6F4] truncate max-w-[210px]">{task.title}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                {task.priority}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#8FA899] flex items-center justify-between">
                              <span>Due: {task.dueDate} &bull; {task.dueTime}</span>
                              <span className="font-mono text-[#C8A96A] font-bold">{task.company}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Quick Links */}
                  <div className="border-t border-[#2C5240] pt-2 flex items-center justify-between px-1 text-[11px]">
                    <Link
                      href="/documents"
                      onClick={() => setNotificationOpen(false)}
                      className="text-[#C8A96A] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Document Center</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link
                      href="/calendar"
                      onClick={() => setNotificationOpen(false)}
                      className="text-[#CFE0D5] hover:text-white flex items-center gap-1 font-semibold"
                    >
                      <span>Calendar & Tasks</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Executive Vault Lock Button */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('lock-crm-vault'))}
            title="Lock Executive Vault (Requires Passcode / Biometric to return)"
            className="flex items-center gap-1.5 rounded-lg border border-[#C8A96A]/60 bg-[#162B22] hover:bg-rose-950/70 p-2 text-[#C8A96A] hover:text-rose-300 transition-all shadow-xs shrink-0"
          >
            <Lock className="h-4 w-4" />
            <span className="hidden xl:inline text-xs font-bold">Lock Vault</span>
          </button>
        </div>
      </div>
    </header>
  );
}
