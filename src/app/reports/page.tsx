'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  TrendingUp, 
  Building2, 
  Tv2, 
  Globe2, 
  Layers, 
  ShieldCheck, 
  Scale, 
  CheckCircle2, 
  FileText,
  DollarSign
} from 'lucide-react';
import { CompanyCode } from '@/lib/types';
import { INITIAL_LEADS, INITIAL_EXPENSES, FINANCIAL_BALANCES } from '@/lib/mock-data';
import { generatePLStatement, generateBalanceSheet } from '@/lib/accounting-engine';

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

  const plBizman = generatePLStatement('BIZMAN');
  const plLinda = generatePLStatement('LINDA');
  const plAriel = generatePLStatement('ARIELMC');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Executive Reporting Suite</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-white">
            Standard Management & Financial Reports
          </h1>
          <p className="text-xs text-slate-400">
            Comprehensive audit-ready reports for Group Operations, Deal Margins, Screen Utilization, and Personal Financial Standing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors shadow"
          >
            <Printer className="h-4 w-4 text-slate-400" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs (Hidden when printing) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs print:hidden">
        <button
          onClick={() => setSelectedReport('CONSOLIDATED_EXECUTIVE')}
          className={`rounded-lg px-3 py-2 font-medium whitespace-nowrap transition-all ${
            selectedReport === 'CONSOLIDATED_EXECUTIVE' ? 'bg-indigo-600 text-white font-semibold shadow' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          1. Consolidated Group Executive Brief
        </button>
        <button
          onClick={() => setSelectedReport('DEAL_PROFITABILITY')}
          className={`rounded-lg px-3 py-2 font-medium whitespace-nowrap transition-all ${
            selectedReport === 'DEAL_PROFITABILITY' ? 'bg-indigo-600 text-white font-semibold shadow' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          2. Deal Margin & Client Profitability
        </button>
        <button
          onClick={() => setSelectedReport('DOOH_OCCUPANCY')}
          className={`rounded-lg px-3 py-2 font-medium whitespace-nowrap transition-all ${
            selectedReport === 'DOOH_OCCUPANCY' ? 'bg-indigo-600 text-white font-semibold shadow' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          3. DOOH Screen Occupancy & Vendor Risk
        </button>
        <button
          onClick={() => setSelectedReport('EXPORT_CONSIGNMENT')}
          className={`rounded-lg px-3 py-2 font-medium whitespace-nowrap transition-all ${
            selectedReport === 'EXPORT_CONSIGNMENT' ? 'bg-indigo-600 text-white font-semibold shadow' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          4. ArielMC Export Consignment Ledger
        </button>
        <button
          onClick={() => setSelectedReport('PERSONAL_FINANCIAL_STATEMENT')}
          className={`rounded-lg px-3 py-2 font-medium whitespace-nowrap transition-all ${
            selectedReport === 'PERSONAL_FINANCIAL_STATEMENT' ? 'bg-indigo-600 text-white font-semibold shadow' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          5. Director Personal Financial Statement (PFS)
        </button>
      </div>

      {/* =================================================================== */}
      {/* REPORT 1: CONSOLIDATED GROUP EXECUTIVE BRIEF */}
      {/* =================================================================== */}
      {selectedReport === 'CONSOLIDATED_EXECUTIVE' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 shadow-xl print:border-none print:bg-white print:text-black">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="h-7 w-10 rounded overflow-hidden border border-slate-700 bg-white p-0.5 shrink-0 shadow-sm flex items-center justify-center" title="Ariel Marketing & Communications">
                  <img src="/logos/arielmc-logo.png" alt="ArielMC" className="max-h-6 w-auto object-contain" />
                </div>
                <div className="h-7 w-7 rounded overflow-hidden border border-slate-700 bg-[#0D3B29] p-0.5 shrink-0 shadow-sm" title="Bizman Media Limited">
                  <img src="/logos/bizman-logo.jpg" alt="Bizman Media" className="h-full w-full object-contain" />
                </div>
                <div className="h-7 w-16 rounded overflow-hidden border border-slate-700 bg-black px-1 shrink-0 shadow-sm flex items-center justify-center" title="Linda Resort Limited">
                  <img src="/logos/linda-logo.png" alt="Linda Resort Limited" className="max-h-5 w-auto object-contain" />
                </div>
              </div>
              <div className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Standard Management Framework &bull; Report 01</div>
              <h2 className="text-xl font-extrabold text-white mt-1 print:text-black">Consolidated Group Financial & Operating Brief</h2>
              <p className="text-xs text-slate-400">ArielMC &bull; Bizman Media Limited &bull; Linda Resort Limited</p>
            </div>
            <div className="text-right text-xs font-mono text-slate-400">
              <div>Period: YTD 2026</div>
              <div>Generated: {new Date().toLocaleDateString()}</div>
            </div>
          </div>

          {/* Consolidated Executive Summary Matrix */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider print:bg-slate-100 print:text-black">
                <tr>
                  <th className="py-3 px-4">Financial KPI</th>
                  <th className="py-3 px-4">ArielMC Ltd (USD)</th>
                  <th className="py-3 px-4">Bizman Media Ltd (BDT)</th>
                  <th className="py-3 px-4">Linda Resort Ltd (BDT)</th>
                  <th className="py-3 px-4 text-right">Consolidated Group Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-sans font-semibold text-slate-200 print:text-black">Recognized Operating Revenue</td>
                  <td className="py-3 px-4 text-slate-100">${plAriel.totalRevenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-100">৳ {plBizman.totalRevenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-100">৳ {plLinda.totalRevenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-bold text-indigo-400">$198K + ৳ 2.75 Cr</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-sans text-slate-300">Cost of Goods Sold (Vendor Screens, Resort Ops & Materials)</td>
                  <td className="py-3 px-4 text-rose-400">-${plAriel.cogsTotal.toLocaleString()}</td>
                  <td className="py-3 px-4 text-rose-400">-৳ {plBizman.cogsTotal.toLocaleString()}</td>
                  <td className="py-3 px-4 text-rose-400">-৳ {plLinda.cogsTotal.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-rose-400 font-bold">-$125K - ৳ 1.14 Cr</td>
                </tr>
                <tr className="bg-slate-950/40 font-bold">
                  <td className="py-3 px-4 font-sans text-emerald-400">Gross Operating Profit</td>
                  <td className="py-3 px-4 text-emerald-400">${plAriel.grossProfit.toLocaleString()} ({plAriel.grossMarginPercent.toFixed(1)}%)</td>
                  <td className="py-3 px-4 text-emerald-400">৳ {plBizman.grossProfit.toLocaleString()} ({plBizman.grossMarginPercent.toFixed(1)}%)</td>
                  <td className="py-3 px-4 text-emerald-400">৳ {plLinda.grossProfit.toLocaleString()} ({plLinda.grossMarginPercent.toFixed(1)}%)</td>
                  <td className="py-3 px-4 text-right text-emerald-400">+$72.8K + ৳ 1.61 Cr</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-sans text-slate-300">Total Operating Expenses (SG&A, Personnel & Utilities)</td>
                  <td className="py-3 px-4 text-slate-400">-${plAriel.operatingExpensesTotal.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-400">-৳ {plBizman.operatingExpensesTotal.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-400">-৳ {plLinda.operatingExpensesTotal.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-slate-400">-$40.7K - ৳ 70.9L</td>
                </tr>
                <tr className="bg-indigo-950/40 border-t-2 border-indigo-500 font-extrabold text-sm">
                  <td className="py-3 px-4 font-sans text-white print:text-black">Net Operating Profit (EBITDA)</td>
                  <td className="py-3 px-4 text-emerald-400">${plAriel.netProfit.toLocaleString()} ({plAriel.netMarginPercent.toFixed(1)}%)</td>
                  <td className="py-3 px-4 text-emerald-400">৳ {plBizman.netProfit.toLocaleString()} ({plBizman.netMarginPercent.toFixed(1)}%)</td>
                  <td className="py-3 px-4 text-emerald-400">৳ {plLinda.netProfit.toLocaleString()} ({plLinda.netMarginPercent.toFixed(1)}%)</td>
                  <td className="py-3 px-4 text-right text-emerald-400">+$32.1K + ৳ 90.35 Lakhs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* REPORT 2: DEAL PROFITABILITY & CLIENT MARGIN ANALYSIS */}
      {/* =================================================================== */}
      {selectedReport === 'DEAL_PROFITABILITY' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 shadow-xl print:border-none print:bg-white print:text-black">
          <div className="border-b border-slate-800 pb-4">
            <div className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Standard Management Framework &bull; Report 02</div>
            <h2 className="text-xl font-extrabold text-white mt-1">Deal-Wise Micro-P&L & Client Margin Analysis</h2>
            <p className="text-xs text-slate-400">Tracks revenue vs direct vendor board rentals, production fabrication, and fulfillment expenses per campaign</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Client Opportunity</th>
                  <th className="py-3 px-4">Contract Value</th>
                  <th className="py-3 px-4">Direct Fulfillment Cost</th>
                  <th className="py-3 px-4">Net Contribution Margin</th>
                  <th className="py-3 px-4 text-right">Net Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {INITIAL_LEADS.map((lead) => {
                  // Direct cost estimation: 60% for vendor heavy DOOH, 55% for export
                  const directCost = lead.currency === 'USD' 
                    ? lead.estimatedValue * 0.55 
                    : lead.estimatedValue * 0.62;
                  const netMargin = lead.estimatedValue - directCost;
                  const marginPct = (netMargin / lead.estimatedValue) * 100;

                  return (
                    <tr key={lead.id} className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-sans font-bold">
                        <span className={`px-2 py-0.5 text-[10px] rounded ${
                          lead.companyCode === 'BIZMAN' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                          lead.companyCode === 'LINDA' ? 'bg-[#FFF3D6] text-[#8A5A00] border border-[#FBE0A8]' :
                          'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}>
                          {lead.companyCode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <div className="font-bold text-slate-100">{lead.title}</div>
                        <div className="text-[11px] text-slate-400">{lead.customerName} &bull; {lead.country}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-100">
                        {lead.currency === 'USD' ? '$' : '৳'}{lead.estimatedValue.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-rose-400">
                        -{lead.currency === 'USD' ? '$' : '৳'}{Math.round(directCost).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">
                        +{lead.currency === 'USD' ? '$' : '৳'}{Math.round(netMargin).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-indigo-400">
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

      {/* =================================================================== */}
      {/* REPORT 3: DOOH OCCUPANCY & VENDOR LIABILITY REPORT */}
      {/* =================================================================== */}
      {selectedReport === 'DOOH_OCCUPANCY' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 shadow-xl print:border-none print:bg-white print:text-black">
          <div className="border-b border-slate-800 pb-4">
            <div className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Standard Management Framework &bull; Report 03</div>
            <h2 className="text-xl font-extrabold text-white mt-1">DOOH Screen Network Utilization & Vendor Payout Audit</h2>
            <p className="text-xs text-slate-400">Bizman Media Limited (20 Own LED Boards + 50+ Countrywide Partner Vendor Screens)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg bg-slate-950 p-4 border border-slate-800">
              <div className="text-xs text-slate-400">Own LED Displays (High Margin Asset)</div>
              <div className="mt-1 text-2xl font-bold text-white font-mono">20 Screens</div>
              <div className="text-xs text-emerald-400 mt-1">Prime Dhaka Hubs (Dhanmondi, Gulshan, Motijheel)</div>
            </div>
            <div className="rounded-lg bg-slate-950 p-4 border border-slate-800">
              <div className="text-xs text-slate-400">Partner Vendor Network</div>
              <div className="mt-1 text-2xl font-bold text-orange-400 font-mono">50+ Screens</div>
              <div className="text-xs text-slate-400 mt-1">Countrywide Divisional Clusters</div>
            </div>
            <div className="rounded-lg bg-slate-950 p-4 border border-slate-800">
              <div className="text-xs text-slate-400">Overall Slot Utilization Rate</div>
              <div className="mt-1 text-2xl font-bold text-indigo-400 font-mono">72.4%</div>
              <div className="text-xs text-slate-400 mt-1">Prime Dhaka slots 88% booked for Q4</div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* REPORT 4: EXPORT CONSIGNMENT LEDGER */}
      {/* =================================================================== */}
      {selectedReport === 'EXPORT_CONSIGNMENT' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 shadow-xl print:border-none print:bg-white print:text-black">
          <div className="border-b border-slate-800 pb-4">
            <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Standard Management Framework &bull; Report 04</div>
            <h2 className="text-xl font-extrabold text-white mt-1">ArielMC (Ariel Marketing & Communications Limited) — Export Consignments</h2>
            <p className="text-xs text-slate-400">Container shipments, Incoterms, customs status, and payment realizations for UK, EU, US, and Australia</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Shipment Ref</th>
                  <th className="py-3 px-4">Buyer & Destination</th>
                  <th className="py-3 px-4">Product Category</th>
                  <th className="py-3 px-4">Incoterm & Terms</th>
                  <th className="py-3 px-4">Invoice Value</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold text-indigo-400">EXP-AMC-2026-004</td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-semibold text-white">EcoLiving UK Ltd</div>
                    <div className="text-[11px] text-slate-400">Felixstowe Port, United Kingdom</div>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-300">25,000 Pcs Jute Shopping Totes</td>
                  <td className="py-3.5 px-4 text-slate-300 font-sans">FOB Chittagong &bull; 30% Adv / 70% BL</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">$78,000 USD</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="rounded bg-amber-950 border border-amber-800 text-amber-400 px-2 py-0.5 text-[10px] font-bold">
                      Samples Approved / In Prod
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold text-indigo-400">EXP-AMC-2026-005</td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-semibold text-white">Munich Living GmbH</div>
                    <div className="text-[11px] text-slate-400">Hamburg Port, Germany</div>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-300">Glazed Terracotta Dinnerware & Pottery</td>
                  <td className="py-3.5 px-4 text-slate-300 font-sans">CIF Hamburg &bull; 100% Irrevocable LC</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">$46,500 USD</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="rounded bg-indigo-950 border border-indigo-800 text-indigo-400 px-2 py-0.5 text-[10px] font-bold">
                      LC Draft Review
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* REPORT 5: DIRECTOR PERSONAL FINANCIAL STATEMENT (PFS) */}
      {/* =================================================================== */}
      {selectedReport === 'PERSONAL_FINANCIAL_STATEMENT' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 shadow-xl print:border-none print:bg-white print:text-black">
          <div className="border-b border-slate-800 pb-4">
            <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Standard Management Framework &bull; Report 05</div>
            <h2 className="text-xl font-extrabold text-white mt-1">Personal Financial Statement (PFS) & Net Worth Audit</h2>
            <p className="text-xs text-slate-400">Confidential personal liquidity, multi-company salary inflows, term investments, and monthly savings capacity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1.5">
                Personal Assets (What You Own)
              </h3>
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="font-sans text-slate-300">EBL Priority Savings & City Bank Balances</span>
                  <span className="text-slate-100 font-bold">৳ 24,70,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="font-sans text-slate-300">IDLC Cumulative Fixed Deposit (FDR)</span>
                  <span className="text-slate-100 font-bold">৳ 35,00,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="font-sans text-slate-300">BRAC Bank Millionaire DPS Scheme</span>
                  <span className="text-slate-100 font-bold">৳ 12,50,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="font-sans text-slate-300">HSBC International USD Offshore Account</span>
                  <span className="text-emerald-400 font-bold">$42,500 (৳ 51,00,000)</span>
                </div>
                <div className="flex justify-between py-2 border-t border-slate-700 font-bold text-indigo-400 text-sm">
                  <span className="font-sans">Total Personal Assets</span>
                  <span>৳ 1,23,20,000</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 border-b border-slate-800 pb-1.5">
                Personal Liabilities & Net Worth
              </h3>
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="font-sans text-slate-300">Standard Chartered Credit Card Due</span>
                  <span className="text-rose-400 font-bold">-৳ 1,42,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="font-sans text-slate-300">Personal Bank Loans / Mortgages</span>
                  <span className="text-slate-400">৳ 0.00 (Debt Free)</span>
                </div>
                <div className="flex justify-between py-2 border-t border-slate-700 font-extrabold text-emerald-400 text-sm">
                  <span className="font-sans text-white">Audited Personal Net Worth</span>
                  <span>৳ 1,21,78,000 (~$101,480)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

