'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Share2,
  Copy, 
  Check, 
  CheckCircle2, 
  FileText, 
  DollarSign, 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  Eye, 
  Layers, 
  MessageSquare, 
  Sparkles, 
  X,
  Calendar,
  CalendarDays,
  Clock,
  ArrowRight,
  TrendingUp,
  Receipt,
  Scale
} from 'lucide-react';
import { CompanyCode } from '@/lib/types';
import { INITIAL_LEADS } from '@/lib/mock-data';
import { generatePLStatement, PLStatement } from '@/lib/accounting-engine';

export type ReportType = 
  | 'CONSOLIDATED_EXECUTIVE'
  | 'CORPORATE_ACCOUNTS'
  | 'DEAL_PROFITABILITY'
  | 'DOOH_OCCUPANCY'
  | 'EXPORT_CONSIGNMENT'
  | 'PERSONAL_FINANCIAL_STATEMENT';

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

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const initialCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';
  const initialReport = (searchParams.get('report') as ReportType) || 'CONSOLIDATED_EXECUTIVE';

  const [selectedReport, setSelectedReport] = useState<ReportType>(initialReport);
  const [viewMode, setViewMode] = useState<'STANDARD' | 'LETTERHEAD'>('STANDARD');
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Time Period & Custom Date State
  const [activePreset, setActivePreset] = useState<TimePeriodPreset>('THIS_QUARTER');
  const [customStartDate, setCustomStartDate] = useState('2026-10-01');
  const [customEndDate, setCustomEndDate] = useState('2026-10-29');

  // Corporate Accounts entity filter
  const [accountsEntity, setAccountsEntity] = useState<'ALL' | 'ARIELMC' | 'BIZMAN' | 'LINDA'>(
    initialCompany === 'CONSOLIDATED' ? 'ALL' : initialCompany
  );

  // Time Period Resolution Helper
  const getPeriodDetails = () => {
    let startDate = '2026-10-01';
    let endDate = '2026-10-29';
    let label = 'Q4 2026 (Quarterly)';
    let factor = 92 / 302;
    let codeSuffix = 'Q4';

    switch (activePreset) {
      case 'THIS_MONTH':
        startDate = '2026-10-01';
        endDate = '2026-10-31';
        label = 'This Month (October 2026)';
        factor = 31 / 302;
        codeSuffix = 'M10';
        break;
      case 'LAST_MONTH':
        startDate = '2026-09-01';
        endDate = '2026-09-30';
        label = 'Last Month (September 2026)';
        factor = 30 / 302;
        codeSuffix = 'M09';
        break;
      case 'THIS_QUARTER':
        startDate = '2026-10-01';
        endDate = '2026-12-31';
        label = 'This Quarter (Q4 2026)';
        factor = 92 / 302;
        codeSuffix = 'Q4';
        break;
      case 'LAST_QUARTER':
        startDate = '2026-07-01';
        endDate = '2026-09-30';
        label = 'Last Quarter (Q3 2026)';
        factor = 92 / 302;
        codeSuffix = 'Q3';
        break;
      case 'YTD':
        startDate = '2026-01-01';
        endDate = '2026-10-29';
        label = 'Year to Date (YTD 2026)';
        factor = 1.0;
        codeSuffix = 'YTD';
        break;
      case 'FULL_YEAR':
        startDate = '2026-01-01';
        endDate = '2026-12-31';
        label = 'Fiscal Year 2026 (Full Year)';
        factor = 365 / 302;
        codeSuffix = 'FY26';
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
        codeSuffix = 'CUST';
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
      codeSuffix,
      daysCount
    };
  };

  const { startDate, endDate, label: periodLabel, factor, codeSuffix, daysCount } = getPeriodDetails();

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

  // Trigger Print View (Letterhead)
  const handlePrint = () => {
    window.print();
  };

  // Trigger Download PDF (Print Format)
  const handleDownloadPDF = () => {
    window.print();
  };

  // Generate Reference ID based on report and customized period
  const getReportRefId = () => {
    switch (selectedReport) {
      case 'CONSOLIDATED_EXECUTIVE':
        return `REF: AMC-GRP/2026/${codeSuffix}-01`;
      case 'CORPORATE_ACCOUNTS':
        return `REF: ACC-${accountsEntity}/2026/${codeSuffix}-02`;
      case 'DEAL_PROFITABILITY':
        return `REF: AMC-GRP/2026/${codeSuffix}-03`;
      case 'DOOH_OCCUPANCY':
        return `REF: BIZ-DOOH/2026/${codeSuffix}-04`;
      case 'EXPORT_CONSIGNMENT':
        return `REF: AMC-EXP/2026/${codeSuffix}-05`;
      case 'PERSONAL_FINANCIAL_STATEMENT':
        return `REF: PFS-SAH-2026-${codeSuffix}`;
    }
  };

  // Generate WhatsApp Share Text based on active report and customized time period
  const getWhatsAppShareText = () => {
    const today = '29 October 2026';
    const periodString = `${periodLabel} (${formatDateDisplay(startDate)} – ${formatDateDisplay(endDate)})`;
    
    if (selectedReport === 'PERSONAL_FINANCIAL_STATEMENT') {
      return `💼 *CONFIDENTIAL PERSONAL FINANCIAL STATEMENT (PFS)*
*Syed Akramul Hassan — Private Financial Record*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 *Audit Date / Period:* ${periodString}
📅 *Date of Issuance:* ${today}
🔒 *Classification:* Strictly Personal & Confidential

💰 *Audited Personal Assets:*
• Liquid Savings & EBL Priority: ৳ 24,70,000
• Fixed Term Deposits (IDLC FDR): ৳ 35,00,000
• BRAC Bank Millionaire DPS: ৳ 12,50,000
• HSBC International Offshore USD: $42,500 (৳ 51,00,000)
*Total Personal Assets:* ৳ 1,23,20,000

💳 *Personal Liabilities:*
• Standard Chartered Credit Card: -৳ 1,42,000
• Personal Loans / Mortgages: ৳ 0.00 (Debt Free)

⭐ *AUDITED PERSONAL NET WORTH:* ৳ 1,21,78,000 (~$101,480 USD)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✍️ *Attested by:* Syed Akramul Hassan (Individual / Director)`;
    }

    let reportTitle = '';
    let specificContent = '';

    if (selectedReport === 'CONSOLIDATED_EXECUTIVE') {
      reportTitle = 'Consolidated Group Financial & Operating Brief';
      specificContent = `📊 *Consolidated Financial Performance (${periodLabel}):*
• Operating Revenue: $${plAriel.totalRevenue.toLocaleString()} USD + ৳ ${(plBizman.totalRevenue + plLinda.totalRevenue).toLocaleString()} BDT
• Cost of Sales (COGS): -$${plAriel.cogsTotal.toLocaleString()} USD - ৳ ${(plBizman.cogsTotal + plLinda.cogsTotal).toLocaleString()} BDT
• Gross Operating Profit: +$${plAriel.grossProfit.toLocaleString()} USD + ৳ ${(plBizman.grossProfit + plLinda.grossProfit).toLocaleString()} BDT
• Net Operating Profit (EBITDA): +$${plAriel.netProfit.toLocaleString()} USD + ৳ ${(plBizman.netProfit + plLinda.netProfit).toLocaleString()} BDT
• Entity Margins: ArielMC ${plAriel.netMarginPercent.toFixed(1)}% | Bizman ${plBizman.netMarginPercent.toFixed(1)}% | Linda ${plLinda.netMarginPercent.toFixed(1)}%`;
    } else if (selectedReport === 'CORPORATE_ACCOUNTS') {
      reportTitle = `Corporate Accounts & Comprehensive P&L (${accountsEntity === 'ALL' ? 'Consolidated Group' : accountsEntity})`;
      if (accountsEntity === 'ARIELMC') {
        specificContent = `📈 *ArielMC Accounts P&L Statement (${periodLabel}):*
• Recognized Revenue: $${plAriel.totalRevenue.toLocaleString()} USD
• Cost of Goods Sold (COGS): -$${plAriel.cogsTotal.toLocaleString()} USD
• Gross Profit: +$${plAriel.grossProfit.toLocaleString()} USD (${plAriel.grossMarginPercent.toFixed(1)}%)
• Operating Expenses (SG&A): -$${plAriel.operatingExpensesTotal.toLocaleString()} USD
• Net Operating Profit (EBITDA): +$${plAriel.netProfit.toLocaleString()} USD (${plAriel.netMarginPercent.toFixed(1)}%)`;
      } else if (accountsEntity === 'BIZMAN') {
        specificContent = `📈 *Bizman Media Accounts P&L Statement (${periodLabel}):*
• Recognized Revenue: ৳ ${plBizman.totalRevenue.toLocaleString()} BDT
• Vendor Billboard Rentals & COGS: -৳ ${plBizman.cogsTotal.toLocaleString()} BDT
• Gross Profit: +৳ ${plBizman.grossProfit.toLocaleString()} BDT (${plBizman.grossMarginPercent.toFixed(1)}%)
• Operating Expenses: -৳ ${plBizman.operatingExpensesTotal.toLocaleString()} BDT
• Net Operating Profit (EBITDA): +৳ ${plBizman.netProfit.toLocaleString()} BDT (${plBizman.netMarginPercent.toFixed(1)}%)`;
      } else if (accountsEntity === 'LINDA') {
        specificContent = `📈 *Linda Resort Accounts P&L Statement (${periodLabel}):*
• Recognized Revenue: ৳ ${plLinda.totalRevenue.toLocaleString()} BDT
• Resort Food & Amenities COGS: -৳ ${plLinda.cogsTotal.toLocaleString()} BDT
• Gross Profit: +৳ ${plLinda.grossProfit.toLocaleString()} BDT (${plLinda.grossMarginPercent.toFixed(1)}%)
• Operating Expenses: -৳ ${plLinda.operatingExpensesTotal.toLocaleString()} BDT
• Net Operating Profit (EBITDA): +৳ ${plLinda.netProfit.toLocaleString()} BDT (${plLinda.netMarginPercent.toFixed(1)}%)`;
      } else {
        specificContent = `📈 *Consolidated Corporate Accounts P&L (${periodLabel}):*
• Group Operating Revenue: $${plAriel.totalRevenue.toLocaleString()} USD + ৳ ${(plBizman.totalRevenue + plLinda.totalRevenue).toLocaleString()} BDT
• Group COGS / Direct Fulfilment: -$${plAriel.cogsTotal.toLocaleString()} USD - ৳ ${(plBizman.cogsTotal + plLinda.cogsTotal).toLocaleString()} BDT
• Gross Operating Margin: +$${plAriel.grossProfit.toLocaleString()} USD + ৳ ${(plBizman.grossProfit + plLinda.grossProfit).toLocaleString()} BDT
• Net Profit (EBITDA): +$${plAriel.netProfit.toLocaleString()} USD + ৳ ${(plBizman.netProfit + plLinda.netProfit).toLocaleString()} BDT`;
      }
    } else if (selectedReport === 'DEAL_PROFITABILITY') {
      reportTitle = 'Deal Margin & Client Profitability Micro-P&L';
      specificContent = `🎯 *Deal-Wise Margin Highlights (${periodLabel}):*
• Grameenphone DOOH Mega: ৳ 12,500,000 | Net Margin: 38.0% (+৳ 4.75M)
• Unilever Bangladesh DOOH: ৳ 6,000,000 | Net Margin: 38.0% (+৳ 2.28M)
• EcoLiving UK Jute Export: $78,000 USD | Net Margin: 45.0% (+$35.1K)
• Munich Living Terracotta: $46,500 USD | Net Margin: 45.0% (+$20.9K)
• Standard Chartered Banquet: ৳ 2,500,000 | Net Margin: 45.0% (+৳ 1.12M)`;
    } else if (selectedReport === 'DOOH_OCCUPANCY') {
      reportTitle = 'DOOH Screen Network Utilization & Vendor Audit';
      specificContent = `📺 *Screen Network Utilization (${periodLabel}):*
• Own LED Displays (Prime Dhaka Hubs): 20 Screens (High Margin)
• Partner Vendor Displays: 50+ Countrywide Displays
• Prime Slot Occupancy: 72.4% (Q4 Dhaka slots 88% booked)
• Vendor Risk Status: Reconciled & Fully Collateralized`;
    } else if (selectedReport === 'EXPORT_CONSIGNMENT') {
      reportTitle = 'ArielMC Export Consignment & Realization Ledger';
      specificContent = `🚢 *Global Export Consignments (${periodLabel}):*
• EXP-AMC-2026-004: EcoLiving UK Ltd (Felixstowe Port, UK) — $78,000 USD (In Prod)
• EXP-AMC-2026-005: Munich Living GmbH (Hamburg Port, Germany) — $46,500 USD (LC Review)
• Realization Timeline: 100% on schedule across UK & EU channels`;
    }

    return `🏛️ *OFFICIAL EXECUTIVE REPORT & MEMORANDUM*
*ArielMC • Bizman Media Limited • Linda Resort Limited*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *Report:* ${reportTitle}
🔖 *Reference:* ${getReportRefId()}
📅 *Reporting Period:* ${periodString}
📅 *Date of Issuance:* ${today}
🔒 *Classification:* Strictly Confidential (Board of Directors)

${specificContent}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✍️ *Attested by:* Syed Akramul Hassan
• Managing Director — ArielMC (Ariel Marketing & Communications Ltd)
• Director & CEO — Bizman Media Limited
• Executive Director — Linda Resort Limited
🌐 www.arielmc.com • www.bizmanbd.com • www.lindaresort.com`;
  };

  const handleCopyWhatsApp = () => {
    const text = getWhatsAppShareText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchWhatsApp = () => {
    const text = getWhatsAppShareText();
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  // Helper for accounts active entity selection
  const activeAccountPL = accountsEntity === 'ARIELMC' ? plAriel : accountsEntity === 'LINDA' ? plLinda : plBizman;

  return (
    <div className="space-y-6">
      {/* =================================================================== */}
      {/* TOP HEADER CONTROLS (Screen Only - Hidden in Print) */}
      {/* =================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#DDE3DD] pb-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8A96A]">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Executive Reporting & Audit Suite</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-[#1F3A2E] tracking-tight">
            Standard Management & Financial Reports
          </h1>
          <p className="text-xs text-[#6B7269]">
            Certified reports for Board of Directors, Customized Accounts P&L, Client Margins, and Confidential Personal Assets
          </p>
        </div>

        {/* 3 Universal Action Buttons: Print View, Download PDF & WhatsApp */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Action 1: Print View (Letterhead) */}
          <button
            onClick={() => setViewMode(viewMode === 'LETTERHEAD' ? 'STANDARD' : 'LETTERHEAD')}
            title="Toggle authentic A4 Letterhead sheet preview on screen"
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all shadow-sm border ${
              viewMode === 'LETTERHEAD'
                ? 'bg-[#1F3A2E] text-white border-[#1F3A2E]'
                : 'bg-white text-[#1F3A2E] border-[#DDE3DD] hover:bg-[#F4F6F4]'
            }`}
          >
            <Eye className="h-3.5 w-3.5 text-[#C8A96A]" />
            <span>{viewMode === 'LETTERHEAD' ? 'Standard Console View' : 'Print View (Letterhead)'}</span>
          </button>

          {/* Action 2: Download PDF (Print Format) */}
          <button
            onClick={handleDownloadPDF}
            title="Export high-resolution vector PDF in A4 Print Format with letterhead"
            className="flex items-center gap-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white border border-[#1F3A2E] px-3.5 py-2 text-xs font-extrabold transition-all shadow-sm"
          >
            <Download className="h-3.5 w-3.5 text-[#C8A96A]" />
            <span>Download PDF (Print Format)</span>
          </button>

          {/* Action 3: Share via WhatsApp */}
          <button
            onClick={() => setWhatsAppModalOpen(true)}
            title="Generate and send official formatted report summary to WhatsApp"
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 px-3.5 py-2 text-xs font-extrabold transition-all shadow-sm"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Share via WhatsApp</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* TIME PERIOD SELECTOR (CUSTOMIZED REPORTING PERIOD ENGINE) */}
      {/* =================================================================== */}
      <div className="rounded-xl border border-[#DDE3DD] bg-white p-4 shadow-xs print:hidden space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#E4F3E9] text-[#1E6B3A] flex items-center justify-center font-bold shrink-0">
              <CalendarDays className="h-4.5 w-4.5 text-[#1E6B3A]" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#1F3A2E] flex items-center gap-2">
                <span>Customized Reporting Time Period</span>
                <span className="text-[10px] bg-[#C8A96A]/20 text-[#8A5A00] font-bold px-2 py-0.5 rounded border border-[#C8A96A]/30">
                  Accounts & Audits
                </span>
              </div>
              <p className="text-[11px] text-[#6B7269]">
                Select quick quarterly/monthly presets or choose custom dates to recompute revenues, direct COGS, and margins
              </p>
            </div>
          </div>

          {/* Active Period Display Badge */}
          <div className="flex items-center gap-2 bg-[#F4F6F4] px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-xs font-mono self-start md:self-auto shadow-xs">
            <Clock className="h-3.5 w-3.5 text-[#C8A96A]" />
            <span className="text-[#556055] font-sans font-semibold">Active Period:</span>
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

        {/* Custom Date Pickers (Active when CUSTOM is clicked) */}
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

      {/* =================================================================== */}
      {/* REPORT SELECTION TABS (Placed in 2 Clean Balanced Lines) */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs print:hidden">
        {/* Line 1: Corporate Core & Accounts Suite */}
        <button
          onClick={() => setSelectedReport('CONSOLIDATED_EXECUTIVE')}
          className={`rounded-xl px-4 py-3 font-bold transition-all border text-left flex items-center justify-between shadow-xs ${
            selectedReport === 'CONSOLIDATED_EXECUTIVE'
              ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow-sm'
              : 'bg-white border-[#DDE3DD] text-[#1F3A2E] hover:border-[#1F3A2E] hover:bg-[#F4F6F4]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs opacity-75">1.</span>
            <span>Consolidated Group Brief</span>
          </div>
          <span className="text-[10px] font-mono opacity-80 bg-black/10 px-1.5 py-0.5 rounded">Matrix P&L</span>
        </button>

        <button
          onClick={() => setSelectedReport('CORPORATE_ACCOUNTS')}
          className={`rounded-xl px-4 py-3 font-bold transition-all border text-left flex items-center justify-between shadow-xs ${
            selectedReport === 'CORPORATE_ACCOUNTS'
              ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow-sm'
              : 'bg-white border-[#DDE3DD] text-[#1F3A2E] hover:border-[#1F3A2E] hover:bg-[#F4F6F4]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs opacity-75">2.</span>
            <span>Corporate Accounts & P&L</span>
          </div>
          <span className="text-[10px] font-mono opacity-80 bg-black/10 px-1.5 py-0.5 rounded">Full CoA</span>
        </button>

        <button
          onClick={() => setSelectedReport('DEAL_PROFITABILITY')}
          className={`rounded-xl px-4 py-3 font-bold transition-all border text-left flex items-center justify-between shadow-xs ${
            selectedReport === 'DEAL_PROFITABILITY'
              ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow-sm'
              : 'bg-white border-[#DDE3DD] text-[#1F3A2E] hover:border-[#1F3A2E] hover:bg-[#F4F6F4]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs opacity-75">3.</span>
            <span>Deal Margin & Profitability</span>
          </div>
          <span className="text-[10px] font-mono opacity-80 bg-black/10 px-1.5 py-0.5 rounded">Micro-P&L</span>
        </button>

        {/* Line 2: Operations, Global Export & Personal Accounts */}
        <button
          onClick={() => setSelectedReport('DOOH_OCCUPANCY')}
          className={`rounded-xl px-4 py-3 font-bold transition-all border text-left flex items-center justify-between shadow-xs ${
            selectedReport === 'DOOH_OCCUPANCY'
              ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow-sm'
              : 'bg-white border-[#DDE3DD] text-[#1F3A2E] hover:border-[#1F3A2E] hover:bg-[#F4F6F4]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs opacity-75">4.</span>
            <span>DOOH Screen Network Audit</span>
          </div>
          <span className="text-[10px] font-mono opacity-80 bg-black/10 px-1.5 py-0.5 rounded">Bizman 70+</span>
        </button>

        <button
          onClick={() => setSelectedReport('EXPORT_CONSIGNMENT')}
          className={`rounded-xl px-4 py-3 font-bold transition-all border text-left flex items-center justify-between shadow-xs ${
            selectedReport === 'EXPORT_CONSIGNMENT'
              ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow-sm'
              : 'bg-white border-[#DDE3DD] text-[#1F3A2E] hover:border-[#1F3A2E] hover:bg-[#F4F6F4]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs opacity-75">5.</span>
            <span>ArielMC Export Consignments</span>
          </div>
          <span className="text-[10px] font-mono opacity-80 bg-black/10 px-1.5 py-0.5 rounded">UK & EU</span>
        </button>

        <button
          onClick={() => setSelectedReport('PERSONAL_FINANCIAL_STATEMENT')}
          className={`rounded-xl px-4 py-3 font-bold transition-all border text-left flex items-center justify-between shadow-xs ${
            selectedReport === 'PERSONAL_FINANCIAL_STATEMENT'
              ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow-sm'
              : 'bg-white border-[#DDE3DD] text-[#1F3A2E] hover:border-[#1F3A2E] hover:bg-[#F4F6F4]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs opacity-75">6.</span>
            <span>Personal Accounts Report</span>
          </div>
          <span className="text-[10px] font-mono opacity-80 bg-black/10 px-1.5 py-0.5 rounded">No Letterhead</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* REPORT DOCUMENT CONTAINER */}
      {/* Adapts between Standard Console Card and Photorealistic Letterhead */}
      {/* =================================================================== */}
      <div className={`letterhead-sheet transition-all ${
        viewMode === 'LETTERHEAD'
          ? 'max-w-[850px] mx-auto bg-white p-8 sm:p-12 shadow-2xl rounded-sm border border-[#DDE3DD] print:shadow-none print:border-none print:p-0'
          : 'rounded-xl border border-[#DDE3DD] bg-white p-6 shadow-sm print:border-none print:p-0'
      }`}>

        {/* ----------------------------------------------------------------- */}
        {/* SECTION A: CORPORATE LETTERHEAD HEADER (REPORTS 1-5 ONLY) */}
        {/* Strictly OMITTED for Personal Accounts Report (Report 6) */}
        {/* ----------------------------------------------------------------- */}
        {selectedReport !== 'PERSONAL_FINANCIAL_STATEMENT' && (
          <div className="report-header mb-6 pb-4">
            {/* Top Row: Logos & Corporate Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
              {/* Official Brand Logos in Exact Serial Order: ArielMC -> Bizman -> Linda Resort */}
              <div className="flex items-center gap-3 shrink-0">
                {/* 1. ArielMC */}
                <div className="h-10 w-14 rounded overflow-hidden border border-[#DDE3DD] bg-white p-1 flex items-center justify-center shadow-xs" title="ArielMC">
                  <img src="/logos/arielmc-logo.png" alt="ArielMC" className="max-h-8 w-auto object-contain" />
                </div>
                {/* 2. Bizman Media */}
                <div className="h-10 w-10 rounded overflow-hidden border border-[#DDE3DD] bg-[#0D3B29] p-0.5 flex items-center justify-center shadow-xs" title="Bizman Media Limited">
                  <img src="/logos/bizman-logo.jpg" alt="Bizman Media" className="h-full w-full object-contain" />
                </div>
                {/* 3. Linda Resort */}
                <div className="h-10 px-2.5 rounded-lg overflow-hidden border border-[#DDE3DD] bg-black flex items-center justify-center shadow-xs shrink-0" title="Linda Resort Limited">
                  <img src="/logos/linda-logo.png" alt="Linda Resort Limited" className="h-7 w-auto object-contain" />
                </div>
              </div>

              {/* Corporate Identity & Portals */}
              <div className="sm:text-right text-xs">
                <div className="font-extrabold text-[#1F3A2E] text-sm tracking-wide">
                  ArielMC &bull; BIZMAN MEDIA LIMITED &bull; LINDA RESORT LIMITED
                </div>
                <div className="text-[11px] text-[#556055] font-medium mt-0.5">
                  Executive Corporate Management & Multi-Entity Consortium
                </div>
                <div className="text-[10px] text-[#6B7269] font-mono mt-0.5">
                  Dhaka Corporate HQ: Gulshan-2 / Dhanmondi, Bangladesh &bull; UK & EU Desk: London / Frankfurt
                </div>
                <div className="text-[10px] text-[#1E6B3A] font-mono font-bold mt-0.5">
                  www.arielmc.com &bull; www.bizmanbd.com &bull; www.lindaresort.com
                </div>
              </div>
            </div>

            {/* Official Dual-Tone Letterhead Rule (Forest Pine 3px + Imperial Gold 2px) */}
            <div className="space-y-0.5 mb-4">
              <div className="h-[3px] bg-[#1F3A2E] w-full rounded-full" />
              <div className="h-[2px] bg-[#C8A96A] w-full rounded-full" />
            </div>

            {/* Document Metadata Strip with Dynamic Customized Reporting Period */}
            <div className="bg-[#F4F6F4] border border-[#DDE3DD] rounded-lg p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#C8A96A]">
                  Official Document Reference
                </div>
                <div className="font-mono font-bold text-[#1F3A2E]">
                  {getReportRefId()}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#1E6B3A]">
                  Reporting Time Period
                </div>
                <div className="font-mono font-bold text-[#1F3A2E]">
                  {periodLabel}
                </div>
                <div className="text-[10px] text-[#556055] font-mono">
                  {formatDateDisplay(startDate)} – {formatDateDisplay(endDate)} ({daysCount}d)
                </div>
              </div>

              <div className="sm:text-center">
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#556055]">
                  Classification
                </div>
                <div className="text-[11px] font-bold text-rose-700 font-mono">
                  CONFIDENTIAL &bull; BOARD OF DIRECTORS
                </div>
              </div>

              <div className="sm:text-right">
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#556055]">
                  Date of Attestation
                </div>
                <div className="font-mono font-bold text-[#1F3A2E]">
                  29 October 2026 &bull; {codeSuffix}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SECTION B: PERSONAL STATEMENT HEADER (REPORT 6 ONLY - NO LETTERHEAD) */}
        {/* Explicitly WITHOUT company logos or corporate letterhead */}
        {/* ----------------------------------------------------------------- */}
        {selectedReport === 'PERSONAL_FINANCIAL_STATEMENT' && (
          <div className="report-header mb-6 pb-4 border-b border-[#DDE3DD]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl overflow-hidden border border-[#C8A96A] bg-[#0A1628] shadow-sm flex items-center justify-center shrink-0 p-0.5">
                  <img src="/logos/master-crm-icon.png" alt="Syed Akramul Hassan" className="h-full w-full object-contain" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#556055] font-extrabold">
                    Personal Accounts Suite &bull; Strictly Private Record
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#1F3A2E] mt-0.5 tracking-tight">
                    Confidential Personal Financial Statement (PFS)
                  </h2>
                  <p className="text-xs text-[#6B7269]">
                    Statement of Financial Condition, Liquid Bank Deposits & Certified Net Worth for <strong>Syed Akramul Hassan</strong>
                  </p>
                </div>
              </div>

              <div className="text-right text-xs font-mono text-[#556055]">
                <div className="rounded bg-slate-100 px-2 py-1 font-bold text-slate-800 border border-slate-200">
                  Individual Capacity (Non-Corporate)
                </div>
                <div className="mt-1 text-[11px]">As of {formatDateDisplay(endDate)} &bull; {periodLabel}</div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* REPORT 1 BODY: CONSOLIDATED GROUP EXECUTIVE BRIEF */}
        {/* ----------------------------------------------------------------- */}
        {selectedReport === 'CONSOLIDATED_EXECUTIVE' && (
          <div className="space-y-6">
            <div className="border-b border-[#DDE3DD] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-extrabold text-[#1F3A2E]">
                  Consolidated Multi-Entity Financial Matrix
                </h2>
                <p className="text-xs text-[#6B7269]">
                  Audited performance across global export merchandise, outdoor media infrastructure, and luxury eco-hospitality
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-[#1E6B3A] bg-[#E4F3E9] px-2.5 py-1 rounded border border-[#B6E2C5]">
                Period: {periodLabel} ({daysCount} Days)
              </div>
            </div>

            {/* Executive KPI Matrix */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#DDE3DD] rounded-lg overflow-hidden">
                <thead className="bg-[#F4F6F4] border-b border-[#DDE3DD] text-[#1F3A2E] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Financial KPI</th>
                    <th className="py-3 px-4">ArielMC Ltd (USD)</th>
                    <th className="py-3 px-4">Bizman Media Ltd (BDT)</th>
                    <th className="py-3 px-4">Linda Resort Ltd (BDT)</th>
                    <th className="py-3 px-4 text-right">Consolidated Group Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3DD] font-mono text-[#1A1A1A]">
                  <tr className="hover:bg-[#F9FAF9]">
                    <td className="py-3 px-4 font-sans font-semibold text-[#1F3A2E]">Recognized Operating Revenue</td>
                    <td className="py-3 px-4 text-[#1A1A1A] font-bold">${plAriel.totalRevenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-[#1A1A1A] font-bold">৳ {plBizman.totalRevenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-[#1A1A1A] font-bold">৳ {plLinda.totalRevenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-[#1E6B3A]">
                      ${plAriel.totalRevenue.toLocaleString()} + ৳ {(plBizman.totalRevenue + plLinda.totalRevenue).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F9FAF9]">
                    <td className="py-3 px-4 font-sans text-[#556055]">Direct Cost of Sales (COGS & Media Rentals)</td>
                    <td className="py-3 px-4 text-rose-600 font-bold">-${plAriel.cogsTotal.toLocaleString()}</td>
                    <td className="py-3 px-4 text-rose-600 font-bold">-৳ {plBizman.cogsTotal.toLocaleString()}</td>
                    <td className="py-3 px-4 text-rose-600 font-bold">-৳ {plLinda.cogsTotal.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-rose-600 font-bold">
                      -${plAriel.cogsTotal.toLocaleString()} - ৳ {(plBizman.cogsTotal + plLinda.cogsTotal).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-[#F4F6F4] font-bold">
                    <td className="py-3 px-4 font-sans text-[#1E6B3A]">Gross Operating Profit</td>
                    <td className="py-3 px-4 text-[#1E6B3A]">${plAriel.grossProfit.toLocaleString()} ({plAriel.grossMarginPercent.toFixed(1)}%)</td>
                    <td className="py-3 px-4 text-[#1E6B3A]">৳ {plBizman.grossProfit.toLocaleString()} ({plBizman.grossMarginPercent.toFixed(1)}%)</td>
                    <td className="py-3 px-4 text-[#1E6B3A]">৳ {plLinda.grossProfit.toLocaleString()} ({plLinda.grossMarginPercent.toFixed(1)}%)</td>
                    <td className="py-3 px-4 text-right text-[#1E6B3A]">
                      +${plAriel.grossProfit.toLocaleString()} + ৳ {(plBizman.grossProfit + plLinda.grossProfit).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F9FAF9]">
                    <td className="py-3 px-4 font-sans text-[#556055]">Total Operating Expenses (SG&A & Personnel)</td>
                    <td className="py-3 px-4 text-[#6B7269]">-${plAriel.operatingExpensesTotal.toLocaleString()}</td>
                    <td className="py-3 px-4 text-[#6B7269]">-৳ {plBizman.operatingExpensesTotal.toLocaleString()}</td>
                    <td className="py-3 px-4 text-[#6B7269]">-৳ {plLinda.operatingExpensesTotal.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-[#6B7269]">
                      -${plAriel.operatingExpensesTotal.toLocaleString()} - ৳ {(plBizman.operatingExpensesTotal + plLinda.operatingExpensesTotal).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-[#E4F3E9] border-t-2 border-[#1E6B3A] font-extrabold text-sm">
                    <td className="py-3 px-4 font-sans text-[#1F3A2E]">Net Operating Profit (EBITDA)</td>
                    <td className="py-3 px-4 text-[#1E6B3A]">${plAriel.netProfit.toLocaleString()} ({plAriel.netMarginPercent.toFixed(1)}%)</td>
                    <td className="py-3 px-4 text-[#1E6B3A]">৳ {plBizman.netProfit.toLocaleString()} ({plBizman.netMarginPercent.toFixed(1)}%)</td>
                    <td className="py-3 px-4 text-[#1E6B3A]">৳ {plLinda.netProfit.toLocaleString()} ({plLinda.netMarginPercent.toFixed(1)}%)</td>
                    <td className="py-3 px-4 text-right text-[#1E6B3A]">
                      +${plAriel.netProfit.toLocaleString()} + ৳ {(plBizman.netProfit + plLinda.netProfit).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-[#6B7269] italic bg-[#F4F6F4] p-2.5 rounded-lg border border-[#DDE3DD]">
              * Note: Operating figures are dynamically audited for the customized time period: <strong>{periodLabel}</strong> ({formatDateDisplay(startDate)} to {formatDateDisplay(endDate)}). Certified for Board of Directors review.
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* REPORT 2 BODY: CORPORATE ACCOUNTS & COMPREHENSIVE P&L STATEMENT */}
        {/* Dedicated Accounts Report requested by user with customized dates */}
        {/* ----------------------------------------------------------------- */}
        {selectedReport === 'CORPORATE_ACCOUNTS' && (
          <div className="space-y-6">
            <div className="border-b border-[#DDE3DD] pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-[#1F3A2E] flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-[#1E6B3A]" />
                  <span>Corporate Accounts & Comprehensive Income Statement</span>
                </h2>
                <p className="text-xs text-[#6B7269]">
                  Audited double-entry ledger account lines, revenue streams, direct cost heads, and net EBITDA
                </p>
              </div>

              {/* Entity Selector Pills inside Accounts Report */}
              <div className="flex items-center gap-1.5 bg-[#F4F6F4] p-1 rounded-lg border border-[#DDE3DD] text-xs print:hidden">
                <button
                  onClick={() => setAccountsEntity('ALL')}
                  className={`px-2.5 py-1 rounded font-bold transition-all ${
                    accountsEntity === 'ALL'
                      ? 'bg-[#1F3A2E] text-[#C8A96A] shadow-xs'
                      : 'text-[#556055] hover:text-[#1F3A2E]'
                  }`}
                >
                  All Entities
                </button>
                <button
                  onClick={() => setAccountsEntity('ARIELMC')}
                  className={`px-2.5 py-1 rounded font-bold transition-all ${
                    accountsEntity === 'ARIELMC'
                      ? 'bg-[#1F3A2E] text-[#C8A96A] shadow-xs'
                      : 'text-[#556055] hover:text-[#1F3A2E]'
                  }`}
                >
                  ArielMC
                </button>
                <button
                  onClick={() => setAccountsEntity('BIZMAN')}
                  className={`px-2.5 py-1 rounded font-bold transition-all ${
                    accountsEntity === 'BIZMAN'
                      ? 'bg-[#1F3A2E] text-[#C8A96A] shadow-xs'
                      : 'text-[#556055] hover:text-[#1F3A2E]'
                  }`}
                >
                  Bizman
                </button>
                <button
                  onClick={() => setAccountsEntity('LINDA')}
                  className={`px-2.5 py-1 rounded font-bold transition-all ${
                    accountsEntity === 'LINDA'
                      ? 'bg-[#1F3A2E] text-[#C8A96A] shadow-xs'
                      : 'text-[#556055] hover:text-[#1F3A2E]'
                  }`}
                >
                  Linda Resort
                </button>
              </div>
            </div>

            {/* Period Indicator Banner */}
            <div className="rounded-lg bg-[#F4F6F4] border border-[#DDE3DD] p-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#C8A96A]" />
                <span className="font-extrabold text-[#1F3A2E]">Accounts Period:</span>
                <span className="font-mono font-bold text-[#1E6B3A]">{periodLabel}</span>
                <span className="text-[#6B7269]">({formatDateDisplay(startDate)} &ndash; {formatDateDisplay(endDate)})</span>
              </div>
              <div className="font-mono text-[11px] text-[#556055]">
                Target Entity: <strong>{accountsEntity === 'ALL' ? 'Group Consortium' : accountsEntity}</strong>
              </div>
            </div>

            {/* Accounts KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-[#DDE3DD] bg-white p-4 shadow-xs">
                <div className="text-xs font-bold text-[#556055]">Recognized Operating Revenue</div>
                <div className="mt-1 text-2xl font-black text-[#1F3A2E] font-mono">
                  {accountsEntity === 'ARIELMC' 
                    ? `$${plAriel.totalRevenue.toLocaleString()}`
                    : accountsEntity === 'BIZMAN'
                    ? `৳ ${plBizman.totalRevenue.toLocaleString()}`
                    : accountsEntity === 'LINDA'
                    ? `৳ ${plLinda.totalRevenue.toLocaleString()}`
                    : `$${plAriel.totalRevenue.toLocaleString()} + ৳ ${(plBizman.totalRevenue + plLinda.totalRevenue).toLocaleString()}`}
                </div>
                <div className="mt-1 text-xs text-[#1E6B3A] font-bold">Top-line Gross Realization</div>
              </div>

              <div className="rounded-xl border border-[#DDE3DD] bg-white p-4 shadow-xs">
                <div className="text-xs font-bold text-[#556055]">Cost of Goods Sold (COGS)</div>
                <div className="mt-1 text-2xl font-black text-rose-600 font-mono">
                  {accountsEntity === 'ARIELMC' 
                    ? `-$${plAriel.cogsTotal.toLocaleString()}`
                    : accountsEntity === 'BIZMAN'
                    ? `-৳ ${plBizman.cogsTotal.toLocaleString()}`
                    : accountsEntity === 'LINDA'
                    ? `-৳ ${plLinda.cogsTotal.toLocaleString()}`
                    : `-$${plAriel.cogsTotal.toLocaleString()} - ৳ ${(plBizman.cogsTotal + plLinda.cogsTotal).toLocaleString()}`}
                </div>
                <div className="mt-1 text-xs text-[#6B7269] font-bold">
                  Gross Margin: {accountsEntity === 'ARIELMC' ? plAriel.grossMarginPercent.toFixed(1) : accountsEntity === 'LINDA' ? plLinda.grossMarginPercent.toFixed(1) : plBizman.grossMarginPercent.toFixed(1)}%
                </div>
              </div>

              <div className="rounded-xl border border-[#DDE3DD] bg-white p-4 shadow-xs">
                <div className="text-xs font-bold text-[#556055]">Net Operating Profit (EBITDA)</div>
                <div className="mt-1 text-2xl font-black text-[#1E6B3A] font-mono">
                  {accountsEntity === 'ARIELMC' 
                    ? `+$${plAriel.netProfit.toLocaleString()}`
                    : accountsEntity === 'BIZMAN'
                    ? `+৳ ${plBizman.netProfit.toLocaleString()}`
                    : accountsEntity === 'LINDA'
                    ? `+৳ ${plLinda.netProfit.toLocaleString()}`
                    : `+$${plAriel.netProfit.toLocaleString()} + ৳ ${(plBizman.netProfit + plLinda.netProfit).toLocaleString()}`}
                </div>
                <div className="mt-1 text-xs text-[#C8A96A] font-bold">
                  Net Margin: {accountsEntity === 'ARIELMC' ? plAriel.netMarginPercent.toFixed(1) : accountsEntity === 'LINDA' ? plLinda.netMarginPercent.toFixed(1) : plBizman.netMarginPercent.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Detailed Account Heads Table */}
            <div className="rounded-xl border border-[#DDE3DD] bg-white p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-extrabold text-[#1F3A2E] flex items-center justify-between border-b border-[#DDE3DD] pb-3">
                <span>Certified Account Head Breakdown &bull; {accountsEntity === 'ALL' ? 'Consolidated Ledger' : accountsEntity}</span>
                <span className="text-xs font-mono font-bold text-[#6B7269]">Audited for: {periodLabel}</span>
              </h3>

              {/* Operating Revenue Section */}
              <div className="space-y-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#1F3A2E]">
                  I. Operating Revenue Accounts
                </div>
                {activeAccountPL.revenueLines.map((line, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#DDE3DD]">
                    <span className="text-[#1F3A2E] font-bold font-mono text-xs">
                      {line.code} &bull; <strong className="text-[#1A1A1A] font-extrabold">{line.name}</strong>
                    </span>
                    <span className="font-mono text-[#1F3A2E] font-black text-xs">
                      {activeAccountPL.currency === 'USD' ? '$' : '৳'}{line.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-xs py-2 font-black text-[#1F3A2E] border-t-2 border-[#1F3A2E]">
                  <span>Total Operating Revenue</span>
                  <span className="font-mono">{activeAccountPL.currency === 'USD' ? '$' : '৳'}{activeAccountPL.totalRevenue.toLocaleString()}</span>
                </div>
              </div>

              {/* COGS Section */}
              <div className="space-y-2 pt-3">
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#1F3A2E]">
                  II. Direct Cost of Goods Sold (COGS)
                </div>
                {activeAccountPL.cogsLines.map((line, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#DDE3DD]">
                    <span className="text-[#1F3A2E] font-bold font-mono text-xs">
                      {line.code} &bull; <strong className="text-[#1A1A1A] font-extrabold">{line.name}</strong>
                    </span>
                    <span className="font-mono text-rose-600 font-black text-xs">
                      -{activeAccountPL.currency === 'USD' ? '$' : '৳'}{line.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-xs py-2 font-black text-[#1A1A1A] border-t border-[#DDE3DD]">
                  <span>Gross Operating Profit (Gross Margin: {activeAccountPL.grossMarginPercent.toFixed(1)}%)</span>
                  <span className="font-mono text-[#1E6B3A] font-black">
                    {activeAccountPL.currency === 'USD' ? '$' : '৳'}{activeAccountPL.grossProfit.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Operating Expenses Section */}
              <div className="space-y-2 pt-3">
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#1F3A2E]">
                  III. Operating & Administrative Expenses (SG&A)
                </div>
                {activeAccountPL.operatingExpenseLines.map((line, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#DDE3DD]">
                    <span className="text-[#1F3A2E] font-bold font-mono text-xs">
                      {line.code} &bull; <strong className="text-[#1A1A1A] font-extrabold">{line.name}</strong>
                    </span>
                    <span className="font-mono text-rose-600 font-black text-xs">
                      -{activeAccountPL.currency === 'USD' ? '$' : '৳'}{line.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-xs py-2 font-black text-[#1A1A1A] border-t border-[#DDE3DD]">
                  <span>Total Operating Expenses</span>
                  <span className="font-mono text-rose-600 font-black">
                    -{activeAccountPL.currency === 'USD' ? '$' : '৳'}{activeAccountPL.operatingExpensesTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Net Profit Summary */}
              <div className="rounded-xl bg-[#E4F3E9] border border-[#B6E2C5] p-4 flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-xs font-extrabold text-[#1F3A2E] uppercase tracking-wider">
                    Net Operating Profit Before Taxes (EBITDA)
                  </div>
                  <div className="text-[11px] text-[#1E6B3A] font-medium">
                    Calculated for {periodLabel} &bull; Net Margin: {activeAccountPL.netMarginPercent.toFixed(1)}%
                  </div>
                </div>
                <div className="text-xl font-black text-[#1E6B3A] font-mono">
                  +{activeAccountPL.currency === 'USD' ? '$' : '৳'}{activeAccountPL.netProfit.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* REPORT 3 BODY: DEAL PROFITABILITY & CLIENT MARGIN ANALYSIS */}
        {/* ----------------------------------------------------------------- */}
        {selectedReport === 'DEAL_PROFITABILITY' && (
          <div className="space-y-6">
            <div className="border-b border-[#DDE3DD] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-extrabold text-[#1F3A2E]">
                  Deal-Wise Micro-P&L & Client Margin Analysis
                </h2>
                <p className="text-xs text-[#6B7269]">
                  Tracks contract value vs direct vendor board rentals, production fabrication, and fulfillment expenses per campaign
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-[#1E6B3A] bg-[#E4F3E9] px-2.5 py-1 rounded border border-[#B6E2C5]">
                Period: {periodLabel}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#DDE3DD] rounded-lg overflow-hidden">
                <thead className="bg-[#F4F6F4] border-b border-[#DDE3DD] text-[#1F3A2E] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">Client Opportunity</th>
                    <th className="py-3 px-4">Contract Value</th>
                    <th className="py-3 px-4">Fulfillment Cost</th>
                    <th className="py-3 px-4">Net Contribution</th>
                    <th className="py-3 px-4 text-right">Net Margin %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3DD] font-mono text-[#1A1A1A]">
                  {INITIAL_LEADS.map((lead) => {
                    const directCost = lead.currency === 'USD' 
                      ? lead.estimatedValue * 0.55 
                      : lead.estimatedValue * 0.62;
                    const netMargin = lead.estimatedValue - directCost;
                    const marginPct = (netMargin / lead.estimatedValue) * 100;

                    return (
                      <tr key={lead.id} className="hover:bg-[#F9FAF9]">
                        <td className="py-3.5 px-4 font-sans font-bold">
                          <span className={`px-2 py-0.5 text-[10px] rounded ${
                            lead.companyCode === 'BIZMAN' ? 'bg-[#E8F0FA] text-[#1F5FA8] border border-[#BBD5F2]' :
                            lead.companyCode === 'LINDA' ? 'bg-[#FFF3D6] text-[#8A5A00] border border-[#FBE0A8]' :
                            'bg-[#E4F3E9] text-[#1E6B3A] border border-[#B6E2C5]'
                          }`}>
                            {lead.companyCode === 'ARIELMC' ? 'ArielMC' : lead.companyCode === 'LINDA' ? 'Linda Resort' : lead.companyCode}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-sans">
                          <div className="font-bold text-[#1F3A2E]">{lead.title}</div>
                          <div className="text-[11px] text-[#6B7269]">{lead.customerName} &bull; {lead.country}</div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#1A1A1A]">
                          {lead.currency === 'USD' ? '$' : '৳'}{lead.estimatedValue.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-rose-600 font-semibold">
                          -{lead.currency === 'USD' ? '$' : '৳'}{Math.round(directCost).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#1E6B3A]">
                          +{lead.currency === 'USD' ? '$' : '৳'}{Math.round(netMargin).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-[#1F5FA8]">
                          {marginPct.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* REPORT 4 BODY: DOOH OCCUPANCY & VENDOR LIABILITY REPORT */}
        {/* ----------------------------------------------------------------- */}
        {selectedReport === 'DOOH_OCCUPANCY' && (
          <div className="space-y-6">
            <div className="border-b border-[#DDE3DD] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-extrabold text-[#1F3A2E]">
                  DOOH Screen Network Utilization & Vendor Payout Audit
                </h2>
                <p className="text-xs text-[#6B7269]">
                  Bizman Media Limited &bull; 20 Own LED Boards + 50+ Countrywide Partner Vendor Screens
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-[#1E6B3A] bg-[#E4F3E9] px-2.5 py-1 rounded border border-[#B6E2C5]">
                Period: {periodLabel}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl bg-[#F4F6F4] p-4 border border-[#DDE3DD]">
                <div className="text-xs text-[#556055] font-semibold">Own LED Displays (High Margin Asset)</div>
                <div className="mt-1 text-2xl font-bold text-[#1F3A2E] font-mono">20 Screens</div>
                <div className="text-xs text-[#1E6B3A] mt-1 font-medium">Prime Dhaka Hubs (Dhanmondi, Gulshan, Motijheel)</div>
              </div>
              <div className="rounded-xl bg-[#F4F6F4] p-4 border border-[#DDE3DD]">
                <div className="text-xs text-[#556055] font-semibold">Partner Vendor Network</div>
                <div className="mt-1 text-2xl font-bold text-[#8A5A00] font-mono">50+ Screens</div>
                <div className="text-xs text-[#6B7269] mt-1 font-medium">Countrywide Divisional Clusters</div>
              </div>
              <div className="rounded-xl bg-[#F4F6F4] p-4 border border-[#DDE3DD]">
                <div className="text-xs text-[#556055] font-semibold">Overall Slot Utilization Rate</div>
                <div className="mt-1 text-2xl font-bold text-[#1F5FA8] font-mono">72.4%</div>
                <div className="text-xs text-[#556055] mt-1 font-medium">Audited for {periodLabel}</div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* REPORT 5 BODY: EXPORT CONSIGNMENT LEDGER */}
        {/* ----------------------------------------------------------------- */}
        {selectedReport === 'EXPORT_CONSIGNMENT' && (
          <div className="space-y-6">
            <div className="border-b border-[#DDE3DD] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-extrabold text-[#1F3A2E]">
                  ArielMC (Ariel Marketing & Communications Limited) — Export Consignments
                </h2>
                <p className="text-xs text-[#6B7269]">
                  Container shipments, Incoterms, customs status, and payment realizations for UK, EU, US, and Australia
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-[#1E6B3A] bg-[#E4F3E9] px-2.5 py-1 rounded border border-[#B6E2C5]">
                Period: {periodLabel}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#DDE3DD] rounded-lg overflow-hidden">
                <thead className="bg-[#F4F6F4] border-b border-[#DDE3DD] text-[#1F3A2E] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Shipment Ref</th>
                    <th className="py-3 px-4">Buyer & Destination</th>
                    <th className="py-3 px-4">Product Category</th>
                    <th className="py-3 px-4">Incoterm & Terms</th>
                    <th className="py-3 px-4">Invoice Value</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3DD] font-mono text-[#1A1A1A]">
                  <tr className="hover:bg-[#F9FAF9]">
                    <td className="py-3.5 px-4 font-bold text-[#1F5FA8]">EXP-AMC-2026-004</td>
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-semibold text-[#1F3A2E]">EcoLiving UK Ltd</div>
                      <div className="text-[11px] text-[#6B7269]">Felixstowe Port, United Kingdom</div>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-[#1A1A1A]">25,000 Pcs Jute Shopping Totes</td>
                    <td className="py-3.5 px-4 text-[#556055] font-sans">FOB Chittagong &bull; 30% Adv / 70% BL</td>
                    <td className="py-3.5 px-4 font-bold text-[#1E6B3A]">$78,000 USD</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="rounded bg-[#FFF3D6] border border-[#FBE0A8] text-[#8A5A00] px-2 py-0.5 text-[10px] font-bold">
                        Samples Approved / In Prod
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F9FAF9]">
                    <td className="py-3.5 px-4 font-bold text-[#1F5FA8]">EXP-AMC-2026-005</td>
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-semibold text-[#1F3A2E]">Munich Living GmbH</div>
                      <div className="text-[11px] text-[#6B7269]">Hamburg Port, Germany</div>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-[#1A1A1A]">Glazed Terracotta Dinnerware & Pottery</td>
                    <td className="py-3.5 px-4 text-[#556055] font-sans">CIF Hamburg &bull; 100% Irrevocable LC</td>
                    <td className="py-3.5 px-4 font-bold text-[#1E6B3A]">$46,500 USD</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="rounded bg-[#EEF2FF] border border-[#C7D2FE] text-[#4338CA] px-2 py-0.5 text-[10px] font-bold">
                        LC Draft Review
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* REPORT 6 BODY: DIRECTOR PERSONAL FINANCIAL STATEMENT (PFS) */}
        {/* WITHOUT LETTERHEAD - Clean Personal Document Format */}
        {/* ----------------------------------------------------------------- */}
        {selectedReport === 'PERSONAL_FINANCIAL_STATEMENT' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Assets Column */}
              <div className="space-y-3 rounded-xl border border-[#DDE3DD] bg-[#F4F6F4]/50 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E6B3A] border-b border-[#DDE3DD] pb-2 flex items-center justify-between">
                  <span>Personal Liquid & Term Assets</span>
                  <span className="text-[10px] font-mono text-[#6B7269]">Audited</span>
                </h3>
                <div className="space-y-2 font-mono">
                  <div className="flex justify-between py-1 border-b border-[#DDE3DD]/60">
                    <span className="font-sans text-[#556055]">EBL Priority Savings & City Bank Balances</span>
                    <span className="text-[#1A1A1A] font-bold">৳ 24,70,000</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#DDE3DD]/60">
                    <span className="font-sans text-[#556055]">IDLC Cumulative Fixed Deposit (FDR)</span>
                    <span className="text-[#1A1A1A] font-bold">৳ 35,00,000</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#DDE3DD]/60">
                    <span className="font-sans text-[#556055]">BRAC Bank Millionaire DPS Scheme</span>
                    <span className="text-[#1A1A1A] font-bold">৳ 12,50,000</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#DDE3DD]/60">
                    <span className="font-sans text-[#556055]">HSBC International USD Offshore Account</span>
                    <span className="text-[#1E6B3A] font-bold">$42,500 (৳ 51,00,000)</span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 border-[#1E6B3A] font-extrabold text-[#1E6B3A] text-sm pt-2">
                    <span className="font-sans">Total Personal Assets</span>
                    <span>৳ 1,23,20,000</span>
                  </div>
                </div>
              </div>

              {/* Liabilities Column */}
              <div className="space-y-3 rounded-xl border border-[#DDE3DD] bg-[#F4F6F4]/50 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 border-b border-[#DDE3DD] pb-2 flex items-center justify-between">
                  <span>Personal Liabilities & Obligations</span>
                  <span className="text-[10px] font-mono text-[#6B7269]">Audited</span>
                </h3>
                <div className="space-y-2 font-mono">
                  <div className="flex justify-between py-1 border-b border-[#DDE3DD]/60">
                    <span className="font-sans text-[#556055]">Standard Chartered Credit Card Due</span>
                    <span className="text-rose-600 font-bold">-৳ 1,42,000</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#DDE3DD]/60">
                    <span className="font-sans text-[#556055]">Personal Bank Loans / Mortgages</span>
                    <span className="text-[#6B7269]">৳ 0.00 (Debt Free)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#DDE3DD]/60">
                    <span className="font-sans text-[#556055]">Personal Guarantees / Contingencies</span>
                    <span className="text-[#6B7269]">৳ 0.00 (Nil)</span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 border-[#1E6B3A] font-black text-[#1E6B3A] text-sm pt-2 bg-[#E4F3E9] p-2 rounded">
                    <span className="font-sans text-[#1F3A2E]">Audited Net Worth</span>
                    <span>৳ 1,21,78,000 (~$101,480)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Attestation Block (Without Corporate Letterhead) */}
            <div className="pt-6 border-t border-[#DDE3DD] signature-block">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-xs">
                <div>
                  <div className="text-[11px] text-[#556055] italic">
                    "I hereby certify that this statement accurately represents my true personal financial condition as of {formatDateDisplay(endDate)}."
                  </div>
                  <div className="mt-4 border-b border-[#1A1A1A] w-56" />
                  <div className="font-extrabold text-[#1F3A2E] text-sm mt-1">Syed Akramul Hassan</div>
                  <div className="text-[11px] text-[#556055]">Individual / Managing Principal</div>
                </div>

                <div className="text-right text-[10px] text-[#6B7269] font-mono">
                  <div>Document ID: PFS-SAH-2026-CONF</div>
                  <div>Private & Confidential Audit Record &bull; {periodLabel}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SECTION C: OFFICIAL CORPORATE LETTERHEAD FOOTER (REPORTS 1-5 ONLY) */}
        {/* OMITTED for Personal Accounts Report (Report 6) */}
        {/* ----------------------------------------------------------------- */}
        {selectedReport !== 'PERSONAL_FINANCIAL_STATEMENT' && (
          <div className="report-footer mt-10 pt-6 border-t border-[#DDE3DD] signature-block space-y-4">
            {/* Dual Tone Divider */}
            <div className="space-y-0.5">
              <div className="h-[2px] bg-[#C8A96A] w-full rounded-full" />
              <div className="h-[1px] bg-[#1F3A2E] w-full rounded-full" />
            </div>

            {/* Tripartite Signature Blocks for All 3 Corporate Entities */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-xs">
              {/* Entity 1: ArielMC */}
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#1E6B3A] tracking-wider">ArielMC</div>
                <div className="h-10 border-b border-[#1A1A1A] flex items-end pb-1 font-serif italic text-slate-400">
                  Syed Akramul Hassan
                </div>
                <div className="font-extrabold text-[#1F3A2E] text-[11px]">Syed Akramul Hassan</div>
                <div className="text-[10px] text-[#556055]">Managing Director</div>
                <div className="text-[9px] text-[#6B7269] font-mono">ArielMC Limited (UK/EU/US Desk)</div>
              </div>

              {/* Entity 2: Bizman Media Limited */}
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#1F5FA8] tracking-wider">Bizman Media Limited</div>
                <div className="h-10 border-b border-[#1A1A1A] flex items-end pb-1 font-serif italic text-slate-400">
                  Syed Akramul Hassan
                </div>
                <div className="font-extrabold text-[#1F3A2E] text-[11px]">Syed Akramul Hassan</div>
                <div className="text-[10px] text-[#556055]">Director & CEO</div>
                <div className="text-[9px] text-[#6B7269] font-mono">Bizman Media Limited (DOOH Screens)</div>
              </div>

              {/* Entity 3: Linda Resort Limited */}
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#8A5A00] tracking-wider">Linda Resort Limited</div>
                <div className="h-10 border-b border-[#1A1A1A] flex items-end pb-1 font-serif italic text-slate-400">
                  Syed Akramul Hassan
                </div>
                <div className="font-extrabold text-[#1F3A2E] text-[11px]">Syed Akramul Hassan</div>
                <div className="text-[10px] text-[#556055]">Executive Director</div>
                <div className="text-[9px] text-[#6B7269] font-mono">Linda Resort Limited (Eco-Retreat)</div>
              </div>
            </div>

            {/* Formal Attestation Stamp & Confidentiality Notice */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[9px] text-[#6B7269] pt-4 border-t border-[#DDE3DD] font-mono">
              <div>
                Official Certified Executive Copy &bull; Board Attested &bull; Generated from Master CRM Engine
              </div>
              <div className="font-bold text-[#1F3A2E]">
                Page 1 of 1 &bull; System Stamp: SECURE-AUDIT-2026-OK
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* WHATSAPP MEMORANDUM SHARE MODAL (Hidden in Print) */}
      {/* =================================================================== */}
      {whatsAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs print:hidden">
          <div className="w-full max-w-lg rounded-2xl border border-[#DDE3DD] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1F3A2E]">Share Report via WhatsApp</h3>
                  <p className="text-xs text-[#6B7269]">
                    {selectedReport === 'PERSONAL_FINANCIAL_STATEMENT'
                      ? 'Confidential Personal Statement (Without Letterhead)'
                      : 'Executive Memorandum (With Official Letterhead Header)'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWhatsAppModalOpen(false)}
                className="rounded-lg p-1 text-[#6B7269] hover:bg-[#F4F6F4] hover:text-[#1A1A1A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Formatted Text Preview Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#556055]">
                <span>Formatted Message Preview</span>
                <span className="text-[10px] text-[#8FA899] font-mono">WhatsApp Markdown &bull; {periodLabel}</span>
              </div>
              <textarea
                readOnly
                rows={11}
                value={getWhatsAppShareText()}
                className="w-full font-mono text-xs rounded-xl border border-[#DDE3DD] bg-[#F4F6F4] p-3 text-[#1A1A1A] leading-relaxed resize-none focus:outline-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-[#DDE3DD]">
              <button
                onClick={handleCopyWhatsApp}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg border border-[#DDE3DD] bg-white px-4 py-2 text-xs font-bold text-[#1F3A2E] hover:bg-[#F4F6F4] transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-[#C8A96A]" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted Text'}</span>
              </button>

              <button
                onClick={handleLaunchWhatsApp}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-extrabold shadow-sm transition-all"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open in WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
