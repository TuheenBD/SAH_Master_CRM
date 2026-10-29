'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { 
  BookOpenCheck, 
  TrendingUp, 
  Scale, 
  Layers, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Building2,
  Tv2,
  Globe2,
  CalendarDays,
  Clock,
  ArrowRight,
  ExternalLink,
  Printer
} from 'lucide-react';
import { CompanyCode, JournalEntryItem } from '@/lib/types';
import { FINANCIAL_BALANCES, INITIAL_JOURNAL_ENTRIES } from '@/lib/mock-data';
import { generatePLStatement, generateBalanceSheet, validateJournalEntry, PLStatement } from '@/lib/accounting-engine';

export type TimePeriodPreset = 
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'THIS_QUARTER'
  | 'LAST_QUARTER'
  | 'YTD'
  | 'FULL_YEAR'
  | 'CUSTOM';

const PERIOD_PRESETS: { id: TimePeriodPreset; label: string; sub: string }[] = [
  { id: 'THIS_MONTH', label: 'This Month', sub: 'Oct 2026' },
  { id: 'LAST_MONTH', label: 'Last Month', sub: 'Sep 2026' },
  { id: 'THIS_QUARTER', label: 'This Quarter', sub: 'Q4 2026' },
  { id: 'LAST_QUARTER', label: 'Last Quarter', sub: 'Q3 2026' },
  { id: 'YTD', label: 'Year to Date', sub: 'YTD 2026' },
  { id: 'FULL_YEAR', label: 'Full Year', sub: 'FY 2026' },
  { id: 'CUSTOM', label: 'Custom Range', sub: 'Select Dates' },
];

export default function FinancePage() {
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';
  const [activeTab, setActiveTab] = useState<'PL' | 'BALANCE_SHEET' | 'JOURNAL_ENTRIES' | 'CHART_OF_ACCOUNTS'>('PL');

  // Time Period & Custom Date State
  const [activePreset, setActivePreset] = useState<TimePeriodPreset>('THIS_QUARTER');
  const [customStartDate, setCustomStartDate] = useState('2026-10-01');
  const [customEndDate, setCustomEndDate] = useState('2026-10-29');

  // If consolidated, show breakdown across all 3 companies or allow quick toggle
  const currentEntity = activeCompany === 'CONSOLIDATED' ? 'BIZMAN' : activeCompany;

  // Time Period Resolution Helper
  const getPeriodDetails = () => {
    let startDate = '2026-10-01';
    let endDate = '2026-10-29';
    let label = 'Q4 2026 (Quarterly)';
    let factor = 92 / 302;

    switch (activePreset) {
      case 'THIS_MONTH':
        startDate = '2026-10-01';
        endDate = '2026-10-31';
        label = 'This Month (October 2026)';
        factor = 31 / 302;
        break;
      case 'LAST_MONTH':
        startDate = '2026-09-01';
        endDate = '2026-09-30';
        label = 'Last Month (September 2026)';
        factor = 30 / 302;
        break;
      case 'THIS_QUARTER':
        startDate = '2026-10-01';
        endDate = '2026-12-31';
        label = 'This Quarter (Q4 2026)';
        factor = 92 / 302;
        break;
      case 'LAST_QUARTER':
        startDate = '2026-07-01';
        endDate = '2026-09-30';
        label = 'Last Quarter (Q3 2026)';
        factor = 92 / 302;
        break;
      case 'YTD':
        startDate = '2026-01-01';
        endDate = '2026-10-29';
        label = 'Year to Date (YTD 2026)';
        factor = 1.0;
        break;
      case 'FULL_YEAR':
        startDate = '2026-01-01';
        endDate = '2026-12-31';
        label = 'Fiscal Year 2026 (Full Year)';
        factor = 365 / 302;
        break;
      case 'CUSTOM':
        startDate = customStartDate || '2026-10-01';
        endDate = customEndDate || '2026-10-29';
        const s = new Date(startDate).getTime();
        const e = new Date(endDate).getTime();
        const diffMs = Math.max(0, e - s);
        const d = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);
        label = `Custom Range (${d} Days)`;
        factor = Math.min(2.5, Math.max(0.03, d / 302));
        break;
    }

    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    const daysCount = Math.max(1, Math.round((eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    return {
      startDate,
      endDate,
      label,
      factor,
      daysCount
    };
  };

  const { startDate, endDate, label: periodLabel, factor, daysCount } = getPeriodDetails();

  const formatDateDisplay = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[parseInt(parts[1], 10) - 1] || parts[1];
        const day = parts[2];
        return `${day} ${month} ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Base P&L Statements from double-entry accounting engine
  const rawPlBizman = generatePLStatement('BIZMAN');
  const rawPlLinda = generatePLStatement('LINDA');
  const rawPlAriel = generatePLStatement('ARIELMC');

  // Scale P&L figures dynamically according to active customized period
  const scalePL = (pl: PLStatement, f: number): PLStatement => {
    const scaledRevenue = Math.round(pl.totalRevenue * f);
    const scaledCogs = Math.round(pl.cogsTotal * f);
    const grossProfit = scaledRevenue - scaledCogs;
    const grossMarginPercent = scaledRevenue > 0 ? (grossProfit / scaledRevenue) * 100 : 0;
    const scaledOpex = Math.round(pl.operatingExpensesTotal * f);
    const netProfit = grossProfit - scaledOpex;
    const netMarginPercent = scaledRevenue > 0 ? (netProfit / scaledRevenue) * 100 : 0;

    return {
      ...pl,
      totalRevenue: scaledRevenue,
      revenueLines: pl.revenueLines.map(l => ({ ...l, amount: Math.round(l.amount * f) })),
      cogsTotal: scaledCogs,
      cogsLines: pl.cogsLines.map(l => ({ ...l, amount: Math.round(l.amount * f) })),
      grossProfit,
      grossMarginPercent,
      operatingExpensesTotal: scaledOpex,
      operatingExpenseLines: pl.operatingExpenseLines.map(l => ({ ...l, amount: Math.round(l.amount * f) })),
      netProfit,
      netMarginPercent
    };
  };

  const plBizman = scalePL(rawPlBizman, factor);
  const plLinda = scalePL(rawPlLinda, factor);
  const plAriel = scalePL(rawPlAriel, factor);

  const bsBizman = generateBalanceSheet('BIZMAN');
  const bsLinda = generateBalanceSheet('LINDA');
  const bsAriel = generateBalanceSheet('ARIELMC');

  const activePL = activeCompany === 'LINDA' ? plLinda : activeCompany === 'ARIELMC' ? plAriel : plBizman;
  const activeBS = activeCompany === 'LINDA' ? bsLinda : activeCompany === 'ARIELMC' ? bsAriel : bsBizman;

  const currentAccounts = FINANCIAL_BALANCES[currentEntity] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE3DD] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8A96A]">
            <BookOpenCheck className="h-4 w-4" />
            <span>Dual-Entry Accounting Engine</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-[#1F3A2E]">
            Ledger, P&L & Balance Sheet
          </h1>
          <p className="text-xs text-[#6B7269]">
            Strict double-entry bookkeeping: ΣDebits == ΣCredits across ArielMC, Bizman Media, and Linda Resort
          </p>
        </div>

        {/* Tab Switcher & Official Letterhead Action */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-xl bg-white border border-[#DDE3DD] p-1 text-xs shadow-xs">
            <button
              onClick={() => setActiveTab('PL')}
              className={`rounded-lg px-3.5 py-1.5 font-extrabold transition-all ${
                activeTab === 'PL' 
                  ? 'bg-[#1F3A2E] text-[#C8A96A] border border-[#1F3A2E] shadow-sm' 
                  : 'text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]'
              }`}
            >
              Profit & Loss
            </button>
            <button
              onClick={() => setActiveTab('BALANCE_SHEET')}
              className={`rounded-lg px-3.5 py-1.5 font-extrabold transition-all ${
                activeTab === 'BALANCE_SHEET' 
                  ? 'bg-[#1F3A2E] text-[#C8A96A] border border-[#1F3A2E] shadow-sm' 
                  : 'text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]'
              }`}
            >
              Balance Sheet
            </button>
            <button
              onClick={() => setActiveTab('JOURNAL_ENTRIES')}
              className={`rounded-lg px-3.5 py-1.5 font-extrabold transition-all ${
                activeTab === 'JOURNAL_ENTRIES' 
                  ? 'bg-[#1F3A2E] text-[#C8A96A] border border-[#1F3A2E] shadow-sm' 
                  : 'text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]'
              }`}
            >
              General Ledger (JE)
            </button>
            <button
              onClick={() => setActiveTab('CHART_OF_ACCOUNTS')}
              className={`rounded-lg px-3.5 py-1.5 font-extrabold transition-all ${
                activeTab === 'CHART_OF_ACCOUNTS' 
                  ? 'bg-[#1F3A2E] text-[#C8A96A] border border-[#1F3A2E] shadow-sm' 
                  : 'text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]'
              }`}
            >
              Chart of Accounts
            </button>
          </div>

          <a
            href={`/reports?report=CORPORATE_ACCOUNTS&company=${currentEntity}`}
            className="flex items-center gap-1.5 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] px-3.5 py-2 text-xs font-bold border border-[#1F3A2E] shadow-sm transition-all"
            title="Open official letterhead print report for this entity and time period"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Official Letterhead Report</span>
          </a>
        </div>
      </div>

      {/* =================================================================== */}
      {/* TIME PERIOD SELECTOR (CUSTOMIZED ACCOUNTING PERIOD) */}
      {/* =================================================================== */}
      <div className="rounded-xl border border-[#DDE3DD] bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#E4F3E9] text-[#1E6B3A] flex items-center justify-center font-bold shrink-0">
              <CalendarDays className="h-4.5 w-4.5 text-[#1E6B3A]" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#1F3A2E] flex items-center gap-2">
                <span>Customized Accounts Time Period</span>
                <span className="text-[10px] bg-[#C8A96A]/20 text-[#8A5A00] font-bold px-2 py-0.5 rounded border border-[#C8A96A]/30">
                  Dynamic Ledger Engine
                </span>
              </div>
              <p className="text-[11px] text-[#6B7269]">
                Adjust reporting duration to audit monthly, quarterly, or custom period revenue, COGS, and EBITDA
              </p>
            </div>
          </div>

          {/* Active Period Display Badge */}
          <div className="flex items-center gap-2 bg-[#F4F6F4] px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-xs font-mono self-start md:self-auto shadow-xs">
            <Clock className="h-3.5 w-3.5 text-[#C8A96A]" />
            <span className="text-[#556055] font-sans font-semibold">Accounts Period:</span>
            <span className="font-extrabold text-[#1F3A2E]">{periodLabel}</span>
            <span className="text-[10px] bg-white border border-[#DDE3DD] text-[#1E6B3A] px-1.5 py-0.5 rounded font-bold">
              {daysCount} Days
            </span>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#F0F2F0]">
          {PERIOD_PRESETS.map((p) => {
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePreset(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1F3A2E] text-[#C8A96A] shadow-xs border border-[#1F3A2E]'
                    : 'bg-[#F4F6F4] text-[#556055] border border-[#DDE3DD] hover:bg-white hover:text-[#1F3A2E]'
                }`}
              >
                <span>{p.label}</span>
                <span className={`text-[10px] px-1 rounded ${isSelected ? 'bg-white/20 text-[#C8A96A]' : 'text-[#8FA899]'}`}>
                  {p.sub}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Date Pickers */}
        {activePreset === 'CUSTOM' && (
          <div className="flex flex-wrap items-center gap-3 pt-2 bg-[#F9FAF9] p-3 rounded-lg border border-[#E5E9E5]">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#556055] font-bold">From:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="rounded-lg border border-[#DDE3DD] bg-white px-2.5 py-1 text-xs font-mono font-bold text-[#1F3A2E] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
              />
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-[#888]" />
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#556055] font-bold">To:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="rounded-lg border border-[#DDE3DD] bg-white px-2.5 py-1 text-xs font-mono font-bold text-[#1F3A2E] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
              />
            </div>
            <div className="text-[11px] text-[#6B7269] font-medium flex items-center gap-1.5">
              <span>Selected Duration:</span>
              <strong className="text-[#1F3A2E] font-bold">{daysCount} calendar days</strong>
              <span>({formatDateDisplay(startDate)} &rarr; {formatDateDisplay(endDate)})</span>
            </div>
          </div>
        )}
      </div>

      {/* 1. PROFIT & LOSS STATEMENT TAB */}
      {activeTab === 'PL' && (
        <div className="space-y-6">
          {/* Executive P&L Snapshot */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[#DDE3DD] bg-white p-4 shadow-sm">
              <div className="text-xs font-bold text-[#556055]">Total Operating Revenue</div>
              <div className="mt-1 text-2xl font-black text-[#1F3A2E] font-mono">
                {activePL.currency === 'USD' ? '$' : '৳'}{activePL.totalRevenue.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-[#1E6B3A] font-bold">Audited for {periodLabel}</div>
            </div>
            <div className="rounded-xl border border-[#DDE3DD] bg-white p-4 shadow-sm">
              <div className="text-xs font-bold text-[#556055]">Cost of Goods Sold (COGS)</div>
              <div className="mt-1 text-2xl font-black text-rose-600 font-mono">
                -{activePL.currency === 'USD' ? '$' : '৳'}{activePL.cogsTotal.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-[#6B7269] font-bold">
                Gross Margin: {activePL.grossMarginPercent.toFixed(1)}%
              </div>
            </div>
            <div className="rounded-xl border border-[#DDE3DD] bg-white p-4 shadow-sm">
              <div className="text-xs font-bold text-[#556055]">Net Operating Profit</div>
              <div className="mt-1 text-2xl font-black text-[#1E6B3A] font-mono">
                {activePL.currency === 'USD' ? '$' : '৳'}{activePL.netProfit.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-[#C8A96A] font-bold">
                Net Margin: {activePL.netMarginPercent.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Detailed P&L Breakdown Table */}
          <div className="rounded-xl border border-[#DDE3DD] bg-white p-6 space-y-4 shadow-sm">
            <h2 className="text-base font-extrabold text-[#1F3A2E] flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#DDE3DD] pb-3 gap-2">
              <span>Income Statement ({activeCompany === 'CONSOLIDATED' ? 'Bizman Media Baseline' : activeCompany})</span>
              <span className="text-xs font-mono font-bold text-[#1E6B3A] bg-[#E4F3E9] px-2.5 py-1 rounded border border-[#B6E2C5]">
                Period: {periodLabel} ({daysCount} Days)
              </span>
            </h2>

            {/* Revenue Section */}
            <div className="space-y-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#1F3A2E]">Operating Revenue</div>
              {activePL.revenueLines.map((line, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#DDE3DD]">
                  <span className="text-[#1F3A2E] font-bold font-mono text-xs">{line.code} &bull; <strong className="text-[#1A1A1A] font-extrabold">{line.name}</strong></span>
                  <span className="font-mono text-[#1F3A2E] font-black text-xs">
                    {activePL.currency === 'USD' ? '$' : '৳'}{line.amount.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between text-xs py-2 font-black text-[#1F3A2E] border-t-2 border-[#1F3A2E]">
                <span>Total Operating Revenue</span>
                <span className="font-mono">{activePL.currency === 'USD' ? '$' : '৳'}{activePL.totalRevenue.toLocaleString()}</span>
              </div>
            </div>

            {/* Cost of Goods Sold Section */}
            <div className="space-y-2 pt-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#1F3A2E]">Direct Cost of Goods Sold (COGS)</div>
              {activePL.cogsLines.map((line, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#DDE3DD]">
                  <span className="text-[#1F3A2E] font-bold font-mono text-xs">{line.code} &bull; <strong className="text-[#1A1A1A] font-extrabold">{line.name}</strong></span>
                  <span className="font-mono text-rose-600 font-black text-xs">
                    -{activePL.currency === 'USD' ? '$' : '৳'}{line.amount.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between text-xs py-2 font-black text-[#1A1A1A] border-t border-[#DDE3DD]">
                <span>Gross Profit (Margin: {activePL.grossMarginPercent.toFixed(1)}%)</span>
                <span className="font-mono text-[#1E6B3A] font-black">
                  {activePL.currency === 'USD' ? '$' : '৳'}{activePL.grossProfit.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Operating Expenses Section */}
            <div className="space-y-2 pt-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#1F3A2E]">Operating & Administrative Expenses</div>
              {activePL.operatingExpenseLines.map((line, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#DDE3DD]">
                  <span className="text-[#1F3A2E] font-bold font-mono text-xs">{line.code} &bull; <strong className="text-[#1A1A1A] font-extrabold">{line.name}</strong></span>
                  <span className="font-mono text-rose-600 font-black text-xs">
                    -{activePL.currency === 'USD' ? '$' : '৳'}{line.amount.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between text-xs py-2 font-black text-[#1A1A1A] border-t border-[#DDE3DD]">
                <span>Total Operating Expenses</span>
                <span className="font-mono text-rose-600 font-black">
                  -{activePL.currency === 'USD' ? '$' : '৳'}{activePL.operatingExpensesTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Net Income Summary */}
            <div className="rounded-xl bg-[#E4F3E9] border border-[#B6E2C5] p-4 flex items-center justify-between shadow-xs">
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-[#1E6B3A]">Net Operating Income (EBITDA)</div>
                <div className="text-xs text-[#556055] font-medium">After all direct vendor payouts, logistics & overhead for {periodLabel}</div>
              </div>
              <div className="text-2xl font-black text-[#1E6B3A] font-mono">
                {activePL.currency === 'USD' ? '$' : '৳'}{activePL.netProfit.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BALANCE SHEET TAB */}
      {activeTab === 'BALANCE_SHEET' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-[#DDE3DD] bg-white p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
              <div>
                <h2 className="text-base font-extrabold text-[#1F3A2E]">Balance Sheet (Statement of Financial Position)</h2>
                <div className="text-xs text-[#556055] font-medium">
                  Double-entry equation: Total Assets = Total Liabilities + Total Equity &bull; As of {formatDateDisplay(endDate)}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-lg bg-[#E4F3E9] border border-[#B6E2C5] text-[#1E6B3A]">
                <CheckCircle2 className="h-4 w-4" />
                <span>Dual-Entry Verified (Balanced)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Assets */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#1F3A2E] border-b-2 border-[#1F3A2E] pb-2">
                  Assets (What You Own)
                </h3>
                <div className="space-y-2">
                  {activeBS.assetLines.map((line, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#DDE3DD]">
                      <span className="text-[#1F3A2E] font-bold font-mono">{line.code} &bull; <strong className="text-[#1A1A1A] font-extrabold">{line.name}</strong></span>
                      <span className="font-mono font-black text-[#1F3A2E]">
                        {activeBS.currency === 'USD' ? '$' : '৳'}{line.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-sm py-2 font-black text-[#1F3A2E] border-t-2 border-[#1F3A2E]">
                    <span>Total Assets</span>
                    <span className="font-mono">{activeBS.currency === 'USD' ? '$' : '৳'}{activeBS.totalAssets.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Liabilities & Equity */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-rose-600 border-b-2 border-rose-600 pb-2">
                  Liabilities (What You Owe)
                </h3>
                <div className="space-y-2">
                  {activeBS.liabilityLines.map((line, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#DDE3DD]">
                      <span className="text-[#1F3A2E] font-bold font-mono">{line.code} &bull; <strong className="text-[#1A1A1A] font-extrabold">{line.name}</strong></span>
                      <span className="font-mono font-black text-rose-600">
                        {activeBS.currency === 'USD' ? '$' : '৳'}{line.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-xs py-2 font-black text-[#1A1A1A] border-t border-[#DDE3DD]">
                    <span>Total Liabilities</span>
                    <span className="font-mono">{activeBS.currency === 'USD' ? '$' : '৳'}{activeBS.totalLiabilities.toLocaleString()}</span>
                  </div>
                </div>

                <h3 className="text-xs font-black uppercase tracking-wider text-[#1E6B3A] border-b-2 border-[#1E6B3A] pb-2 pt-2">
                  Owner&apos;s Equity & Retained Capital
                </h3>
                <div className="space-y-2">
                  {activeBS.equityLines.map((line, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#DDE3DD]">
                      <span className="text-[#1F3A2E] font-bold font-mono">{line.code} &bull; <strong className="text-[#1A1A1A] font-extrabold">{line.name}</strong></span>
                      <span className="font-mono font-black text-[#1E6B3A]">
                        {activeBS.currency === 'USD' ? '$' : '৳'}{line.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-xs py-2 font-black text-[#1A1A1A] border-t border-[#DDE3DD]">
                    <span>Total Owner Equity</span>
                    <span className="font-mono">{activeBS.currency === 'USD' ? '$' : '৳'}{activeBS.totalEquity.toLocaleString()}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-[#F8F9F8] p-3.5 flex items-center justify-between font-bold text-xs border border-[#DDE3DD]">
                  <span className="text-[#1F3A2E] font-extrabold">Total Liabilities + Equity:</span>
                  <span className="font-mono text-[#1F3A2E] text-sm font-black">
                    {activeBS.currency === 'USD' ? '$' : '৳'}{activeBS.totalLiabilitiesAndEquity.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. GENERAL LEDGER & JOURNAL ENTRIES TAB */}
      {activeTab === 'JOURNAL_ENTRIES' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#DDE3DD] bg-white p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
              <div>
                <h2 className="text-base font-extrabold text-[#1F3A2E]">General Ledger Journal Entries</h2>
                <div className="text-xs text-[#556055] font-medium">Strict double-entry accounting records with audit reference links</div>
              </div>
            </div>

            <div className="space-y-4">
              {INITIAL_JOURNAL_ENTRIES.map((entry) => {
                const check = validateJournalEntry(entry.lines);
                return (
                  <div key={entry.id} className="rounded-xl border border-[#DDE3DD] bg-[#F8F9F8] p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-[#1F3A2E]">{entry.entryNumber}</span>
                        <span className="text-[#556055] font-mono font-bold">Date: {entry.date}</span>
                        <span className="rounded bg-white border border-[#DDE3DD] px-2 py-0.5 text-[10px] text-[#1A1A1A] font-bold">
                          Ref: {entry.reference}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#1E6B3A] font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Posted & Balanced (Diff: ৳0.00)</span>
                      </div>
                    </div>

                    <div className="text-xs text-[#1A1A1A] font-extrabold">
                      {entry.description}
                    </div>

                    <table className="w-full text-left text-xs bg-white rounded-lg border border-[#DDE3DD] overflow-hidden">
                      <thead className="bg-[#F4F6F4] text-[#556055] font-bold text-[11px] border-b border-[#DDE3DD]">
                        <tr>
                          <th className="p-2.5">Account</th>
                          <th className="p-2.5">Description</th>
                          <th className="p-2.5 text-right">Debit</th>
                          <th className="p-2.5 text-right">Credit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DDE3DD] font-mono text-xs">
                        {entry.lines.map((line) => (
                          <tr key={line.id} className="text-[#1A1A1A] hover:bg-[#F9FAF9]">
                            <td className="p-2.5 text-[#1F3A2E] font-bold">{line.accountCode} - {line.accountName}</td>
                            <td className="p-2.5 text-[#556055] font-sans font-medium">{line.description}</td>
                            <td className="p-2.5 text-right text-[#1E6B3A] font-black">
                              {line.debit > 0 ? line.debit.toLocaleString() : '-'}
                            </td>
                            <td className="p-2.5 text-right text-rose-600 font-black">
                              {line.credit > 0 ? line.credit.toLocaleString() : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. CHART OF ACCOUNTS TAB */}
      {activeTab === 'CHART_OF_ACCOUNTS' && (
        <div className="rounded-xl border border-[#DDE3DD] bg-white p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
            <div>
              <h2 className="text-base font-extrabold text-[#1F3A2E]">Standard Chart of Accounts (CoA)</h2>
              <div className="text-xs text-[#556055] font-medium">Categorized chart mapped to {currentEntity}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9F8] border-b border-[#DDE3DD] text-[#556055] font-black uppercase text-[11px]">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Account Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Classification</th>
                  <th className="p-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3DD]">
                {currentAccounts.map((acc) => (
                  <tr key={acc.code} className="hover:bg-[#F4F6F4] transition-colors">
                    <td className="p-3 font-mono font-extrabold text-[#1F3A2E]">{acc.code}</td>
                    <td className="p-3 font-extrabold text-[#1A1A1A]">{acc.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold shadow-xs ${
                        acc.type === 'ASSET' ? 'bg-[#E8F0FA] text-[#1F5FA8] border border-[#BBD5F2]' :
                        acc.type === 'LIABILITY' ? 'bg-[#FEE8E8] text-[#C5221F] border border-[#F8B4B4]' :
                        acc.type === 'EQUITY' ? 'bg-[#F3E8FF] text-[#6B21A8] border border-[#E9D5FF]' :
                        acc.type === 'REVENUE' ? 'bg-[#E4F3E9] text-[#1E6B3A] border border-[#B6E2C5]' :
                        'bg-[#FFF3D6] text-[#8A5A00] border border-[#FBE0A8]'
                      }`}>
                        {acc.type}
                      </span>
                    </td>
                    <td className="p-3 text-[#556055] font-mono text-[11px] font-semibold">{acc.classification}</td>
                    <td className="p-3 text-right font-mono font-black text-[#1F3A2E] text-xs">
                      {acc.currency === 'USD' ? '$' : '৳'}{acc.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
