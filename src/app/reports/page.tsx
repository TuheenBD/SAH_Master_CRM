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
  X
} from 'lucide-react';
import { CompanyCode } from '@/lib/types';
import { INITIAL_LEADS } from '@/lib/mock-data';
import { generatePLStatement } from '@/lib/accounting-engine';

type ReportType = 
  | 'CONSOLIDATED_EXECUTIVE'
  | 'DEAL_PROFITABILITY'
  | 'DOOH_OCCUPANCY'
  | 'EXPORT_CONSIGNMENT'
  | 'PERSONAL_FINANCIAL_STATEMENT';

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';
  const [selectedReport, setSelectedReport] = useState<ReportType>('CONSOLIDATED_EXECUTIVE');
  const [viewMode, setViewMode] = useState<'STANDARD' | 'LETTERHEAD'>('STANDARD');
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const plBizman = generatePLStatement('BIZMAN');
  const plLinda = generatePLStatement('LINDA');
  const plAriel = generatePLStatement('ARIELMC');

  // Trigger Print View (Letterhead)
  const handlePrint = () => {
    window.print();
  };

  // Trigger Download PDF (Print Format)
  const handleDownloadPDF = () => {
    window.print();
  };

  // Generate WhatsApp Share Text based on active report
  const getWhatsAppShareText = () => {
    const today = '29 October 2026';
    
    if (selectedReport === 'PERSONAL_FINANCIAL_STATEMENT') {
      // Personal Accounts Report (WITHOUT Letterhead)
      return `💼 *CONFIDENTIAL PERSONAL FINANCIAL STATEMENT (PFS)*
*Syed Akramul Hassan — Private Financial Record*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* ${today}
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

    // Corporate Reports (WITH Letterhead Header & Attestation)
    let specificContent = '';
    let reportTitle = '';
    let refId = '';

    if (selectedReport === 'CONSOLIDATED_EXECUTIVE') {
      reportTitle = 'Consolidated Group Financial & Operating Brief';
      refId = 'REF: AMC-GRP/2026/Q4-01';
      specificContent = `📊 *Consolidated Financial Performance:*
• Operating Revenue: $198,000 USD + ৳ 2,75,00,000 BDT
• Cost of Sales (COGS): -$125,200 USD - ৳ 1,14,00,000 BDT
• Gross Operating Profit: +$72,800 USD + ৳ 1,61,00,000 BDT
• Net Operating Profit (EBITDA): +$32,100 USD + ৳ 90,35,000 BDT
• Entity Margins: ArielMC 16.2% | Bizman 32.8% | Linda 45.2%`;
    } else if (selectedReport === 'DEAL_PROFITABILITY') {
      reportTitle = 'Deal Margin & Client Profitability Micro-P&L';
      refId = 'REF: AMC-GRP/2026/Q4-02';
      specificContent = `🎯 *Deal-Wise Margin Highlights:*
• Grameenphone DOOH Mega: ৳ 12,500,000 | Net Margin: 38.0% (+৳ 4.75M)
• Unilever Bangladesh DOOH: ৳ 6,000,000 | Net Margin: 38.0% (+৳ 2.28M)
• EcoLiving UK Jute Export: $78,000 USD | Net Margin: 45.0% (+$35.1K)
• Munich Living Terracotta: $46,500 USD | Net Margin: 45.0% (+$20.9K)
• Standard Chartered Banquet: ৳ 2,500,000 | Net Margin: 45.0% (+৳ 1.12M)`;
    } else if (selectedReport === 'DOOH_OCCUPANCY') {
      reportTitle = 'DOOH Screen Network Utilization & Vendor Audit';
      refId = 'REF: BIZ-DOOH/2026/Q4-03';
      specificContent = `📺 *Screen Network Utilization:*
• Own LED Displays (Prime Dhaka Hubs): 20 Screens (High Margin)
• Partner Vendor Displays: 50+ Countrywide Displays
• Overall Prime Slot Occupancy: 72.4% (Q4 Dhaka slots 88% booked)
• Vendor Risk Status: Reconciled & Fully Collateralized`;
    } else if (selectedReport === 'EXPORT_CONSIGNMENT') {
      reportTitle = 'ArielMC Export Consignment & Realization Ledger';
      refId = 'REF: AMC-EXP/2026/Q4-04';
      specificContent = `🚢 *Global Export Consignments:*
• EXP-AMC-2026-004: EcoLiving UK Ltd (Felixstowe Port, UK)
  25,000 Pcs Jute Totes | Value: $78,000 USD | Status: In Production
• EXP-AMC-2026-005: Munich Living GmbH (Hamburg Port, Germany)
  Glazed Terracotta Dinnerware | Value: $46,500 USD | Status: LC Draft Review
• Realization Timeline: 100% on schedule across UK & EU channels`;
    }

    return `🏛️ *OFFICIAL EXECUTIVE REPORT & MEMORANDUM*
*ArielMC • Bizman Media Limited • Linda Resort Limited*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *Report:* ${reportTitle}
🔖 *Reference:* ${refId}
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
            Certified reports for Board of Directors, Client Margins, Screen Audits, and Confidential Personal Assets
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
      {/* REPORT SELECTION TABS (Hidden in Print) */}
      {/* =================================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs print:hidden">
        <button
          onClick={() => setSelectedReport('CONSOLIDATED_EXECUTIVE')}
          className={`rounded-lg px-3.5 py-2 font-bold whitespace-nowrap transition-all border ${
            selectedReport === 'CONSOLIDATED_EXECUTIVE'
              ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow'
              : 'bg-white border-[#DDE3DD] text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]'
          }`}
        >
          1. Consolidated Group Executive Brief
        </button>
        <button
          onClick={() => setSelectedReport('DEAL_PROFITABILITY')}
          className={`rounded-lg px-3.5 py-2 font-bold whitespace-nowrap transition-all border ${
            selectedReport === 'DEAL_PROFITABILITY'
              ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow'
              : 'bg-white border-[#DDE3DD] text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]'
          }`}
        >
          2. Deal Margin & Client Profitability
        </button>
        <button
          onClick={() => setSelectedReport('DOOH_OCCUPANCY')}
          className={`rounded-lg px-3.5 py-2 font-bold whitespace-nowrap transition-all border ${
            selectedReport === 'DOOH_OCCUPANCY'
              ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow'
              : 'bg-white border-[#DDE3DD] text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]'
          }`}
        >
          3. DOOH Screen Occupancy & Vendor Risk
        </button>
        <button
          onClick={() => setSelectedReport('EXPORT_CONSIGNMENT')}
          className={`rounded-lg px-3.5 py-2 font-bold whitespace-nowrap transition-all border ${
            selectedReport === 'EXPORT_CONSIGNMENT'
              ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow'
              : 'bg-white border-[#DDE3DD] text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]'
          }`}
        >
          4. ArielMC Export Consignment Ledger
        </button>
        <button
          onClick={() => setSelectedReport('PERSONAL_FINANCIAL_STATEMENT')}
          className={`rounded-lg px-3.5 py-2 font-bold whitespace-nowrap transition-all border ${
            selectedReport === 'PERSONAL_FINANCIAL_STATEMENT'
              ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow'
              : 'bg-white border-[#DDE3DD] text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]'
          }`}
        >
          5. Personal Accounts Report (Without Letterhead)
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
        {/* SECTION A: CORPORATE LETTERHEAD HEADER (REPORTS 1-4 ONLY) */}
        {/* Strictly OMITTED for Personal Accounts Report (Report 5) */}
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
                <div className="h-11 w-28 rounded-lg overflow-hidden border border-[#DDE3DD] bg-black px-2 flex items-center justify-center shadow-xs" title="Linda Resort Limited">
                  <img src="/logos/linda-logo.png" alt="Linda Resort Limited" className="max-h-8.5 w-auto object-contain" />
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

            {/* Document Metadata Strip */}
            <div className="bg-[#F4F6F4] border border-[#DDE3DD] rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#C8A96A]">
                  Official Document Reference
                </div>
                <div className="font-mono font-bold text-[#1F3A2E]">
                  {selectedReport === 'CONSOLIDATED_EXECUTIVE' && 'REF: AMC-GRP/2026/Q4-01'}
                  {selectedReport === 'DEAL_PROFITABILITY' && 'REF: AMC-GRP/2026/Q4-02'}
                  {selectedReport === 'DOOH_OCCUPANCY' && 'REF: BIZ-DOOH/2026/Q4-03'}
                  {selectedReport === 'EXPORT_CONSIGNMENT' && 'REF: AMC-EXP/2026/Q4-04'}
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
                  29 October 2026 &bull; YTD Q4
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SECTION B: PERSONAL STATEMENT HEADER (REPORT 5 ONLY - NO LETTERHEAD) */}
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
                    Personal Accounts Suite &bull; Strictly Private
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
                <div className="mt-1 text-[11px]">As of 29 October 2026</div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* REPORT 1 BODY: CONSOLIDATED GROUP EXECUTIVE BRIEF */}
        {/* ----------------------------------------------------------------- */}
        {selectedReport === 'CONSOLIDATED_EXECUTIVE' && (
          <div className="space-y-6">
            <div className="border-b border-[#DDE3DD] pb-3">
              <h2 className="text-lg font-extrabold text-[#1F3A2E]">
                Consolidated Multi-Entity Financial Matrix
              </h2>
              <p className="text-xs text-[#6B7269]">
                Aggregated profit & loss comparison across global export merchandise, outdoor media infrastructure, and luxury eco-hospitality
              </p>
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
                    <td className="py-3 px-4 text-right font-extrabold text-[#1E6B3A]">$198K + ৳ 2.75 Cr</td>
                  </tr>
                  <tr className="hover:bg-[#F9FAF9]">
                    <td className="py-3 px-4 font-sans text-[#556055]">Direct Cost of Sales (COGS & Media Rentals)</td>
                    <td className="py-3 px-4 text-rose-600 font-bold">-${plAriel.cogsTotal.toLocaleString()}</td>
                    <td className="py-3 px-4 text-rose-600 font-bold">-৳ {plBizman.cogsTotal.toLocaleString()}</td>
                    <td className="py-3 px-4 text-rose-600 font-bold">-৳ {plLinda.cogsTotal.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-rose-600 font-bold">-$125K - ৳ 1.14 Cr</td>
                  </tr>
                  <tr className="bg-[#F4F6F4] font-bold">
                    <td className="py-3 px-4 font-sans text-[#1E6B3A]">Gross Operating Profit</td>
                    <td className="py-3 px-4 text-[#1E6B3A]">${plAriel.grossProfit.toLocaleString()} ({plAriel.grossMarginPercent.toFixed(1)}%)</td>
                    <td className="py-3 px-4 text-[#1E6B3A]">৳ {plBizman.grossProfit.toLocaleString()} ({plBizman.grossMarginPercent.toFixed(1)}%)</td>
                    <td className="py-3 px-4 text-[#1E6B3A]">৳ {plLinda.grossProfit.toLocaleString()} ({plLinda.grossMarginPercent.toFixed(1)}%)</td>
                    <td className="py-3 px-4 text-right text-[#1E6B3A]">+$72.8K + ৳ 1.61 Cr</td>
                  </tr>
                  <tr className="hover:bg-[#F9FAF9]">
                    <td className="py-3 px-4 font-sans text-[#556055]">Total Operating Expenses (SG&A & Personnel)</td>
                    <td className="py-3 px-4 text-[#6B7269]">-${plAriel.operatingExpensesTotal.toLocaleString()}</td>
                    <td className="py-3 px-4 text-[#6B7269]">-৳ {plBizman.operatingExpensesTotal.toLocaleString()}</td>
                    <td className="py-3 px-4 text-[#6B7269]">-৳ {plLinda.operatingExpensesTotal.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-[#6B7269]">-$40.7K - ৳ 70.9L</td>
                  </tr>
                  <tr className="bg-[#E4F3E9] border-t-2 border-[#1E6B3A] font-extrabold text-sm">
                    <td className="py-3 px-4 font-sans text-[#1F3A2E]">Net Operating Profit (EBITDA)</td>
                    <td className="py-3 px-4 text-[#1E6B3A]">${plAriel.netProfit.toLocaleString()} ({plAriel.netMarginPercent.toFixed(1)}%)</td>
                    <td className="py-3 px-4 text-[#1E6B3A]">৳ {plBizman.netProfit.toLocaleString()} ({plBizman.netMarginPercent.toFixed(1)}%)</td>
                    <td className="py-3 px-4 text-[#1E6B3A]">৳ {plLinda.netProfit.toLocaleString()} ({plLinda.netMarginPercent.toFixed(1)}%)</td>
                    <td className="py-3 px-4 text-right text-[#1E6B3A]">+$32.1K + ৳ 90.35 Lakhs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* REPORT 2 BODY: DEAL PROFITABILITY & CLIENT MARGIN ANALYSIS */}
        {/* ----------------------------------------------------------------- */}
        {selectedReport === 'DEAL_PROFITABILITY' && (
          <div className="space-y-6">
            <div className="border-b border-[#DDE3DD] pb-3">
              <h2 className="text-lg font-extrabold text-[#1F3A2E]">
                Deal-Wise Micro-P&L & Client Margin Analysis
              </h2>
              <p className="text-xs text-[#6B7269]">
                Tracks contract value vs direct vendor board rentals, production fabrication, and fulfillment expenses per campaign
              </p>
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
        {/* REPORT 3 BODY: DOOH OCCUPANCY & VENDOR LIABILITY REPORT */}
        {/* ----------------------------------------------------------------- */}
        {selectedReport === 'DOOH_OCCUPANCY' && (
          <div className="space-y-6">
            <div className="border-b border-[#DDE3DD] pb-3">
              <h2 className="text-lg font-extrabold text-[#1F3A2E]">
                DOOH Screen Network Utilization & Vendor Payout Audit
              </h2>
              <p className="text-xs text-[#6B7269]">
                Bizman Media Limited &bull; 20 Own LED Boards + 50+ Countrywide Partner Vendor Screens
              </p>
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
                <div className="text-xs text-[#556055] mt-1 font-medium">Prime Dhaka slots 88% booked for Q4</div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* REPORT 4 BODY: EXPORT CONSIGNMENT LEDGER */}
        {/* ----------------------------------------------------------------- */}
        {selectedReport === 'EXPORT_CONSIGNMENT' && (
          <div className="space-y-6">
            <div className="border-b border-[#DDE3DD] pb-3">
              <h2 className="text-lg font-extrabold text-[#1F3A2E]">
                ArielMC (Ariel Marketing & Communications Limited) — Export Consignments
              </h2>
              <p className="text-xs text-[#6B7269]">
                Container shipments, Incoterms, customs status, and payment realizations for UK, EU, US, and Australia
              </p>
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
        {/* REPORT 5 BODY: DIRECTOR PERSONAL FINANCIAL STATEMENT (PFS) */}
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
                    "I hereby certify that this statement accurately represents my true personal financial condition as of 29 October 2026."
                  </div>
                  <div className="mt-4 border-b border-[#1A1A1A] w-56" />
                  <div className="font-extrabold text-[#1F3A2E] text-sm mt-1">Syed Akramul Hassan</div>
                  <div className="text-[11px] text-[#556055]">Individual / Managing Principal</div>
                </div>

                <div className="text-right text-[10px] text-[#6B7269] font-mono">
                  <div>Document ID: PFS-SAH-2026-CONF</div>
                  <div>Private & Confidential Audit Record</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SECTION C: OFFICIAL CORPORATE LETTERHEAD FOOTER (REPORTS 1-4 ONLY) */}
        {/* OMITTED for Personal Accounts Report (Report 5) */}
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
                <span className="text-[10px] text-[#8FA899] font-mono">WhatsApp Markdown</span>
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
