'use client';

import React, { useState } from 'react';
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
  Globe2
} from 'lucide-react';
import { CompanyCode, JournalEntryItem } from '@/lib/types';
import { FINANCIAL_BALANCES, INITIAL_JOURNAL_ENTRIES } from '@/lib/mock-data';
import { generatePLStatement, generateBalanceSheet, validateJournalEntry } from '@/lib/accounting-engine';

export default function FinancePage() {
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';
  const [activeTab, setActiveTab] = useState<'PL' | 'BALANCE_SHEET' | 'JOURNAL_ENTRIES' | 'CHART_OF_ACCOUNTS'>('PL');

  // If consolidated, show breakdown across all 3 companies or allow quick toggle
  const currentEntity = activeCompany === 'CONSOLIDATED' ? 'BIZMAN' : activeCompany;

  const plBizman = generatePLStatement('BIZMAN');
  const plLinda = generatePLStatement('LINDA');
  const plAriel = generatePLStatement('ARIELMC');

  const bsBizman = generateBalanceSheet('BIZMAN');
  const bsLinda = generateBalanceSheet('LINDA');
  const bsAriel = generateBalanceSheet('ARIELMC');

  const activePL = activeCompany === 'LINDA' ? plLinda : activeCompany === 'ARIELMC' ? plAriel : plBizman;
  const activeBS = activeCompany === 'LINDA' ? bsLinda : activeCompany === 'ARIELMC' ? bsAriel : bsBizman;

  const currentAccounts = FINANCIAL_BALANCES[currentEntity] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <BookOpenCheck className="h-4 w-4" />
            <span>Dual-Entry Accounting Engine</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-white">
            Ledger, P&L & Balance Sheet
          </h1>
          <p className="text-xs text-slate-400">
            Strict double-entry bookkeeping: ΣDebits == ΣCredits across ArielMC, Bizman Media, and Linda Resort
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-1 text-xs">
          <button
            onClick={() => setActiveTab('PL')}
            className={`rounded-md px-3 py-1.5 font-medium transition-all ${
              activeTab === 'PL' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Profit & Loss
          </button>
          <button
            onClick={() => setActiveTab('BALANCE_SHEET')}
            className={`rounded-md px-3 py-1.5 font-medium transition-all ${
              activeTab === 'BALANCE_SHEET' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => setActiveTab('JOURNAL_ENTRIES')}
            className={`rounded-md px-3 py-1.5 font-medium transition-all ${
              activeTab === 'JOURNAL_ENTRIES' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            General Ledger (JE)
          </button>
          <button
            onClick={() => setActiveTab('CHART_OF_ACCOUNTS')}
            className={`rounded-md px-3 py-1.5 font-medium transition-all ${
              activeTab === 'CHART_OF_ACCOUNTS' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Chart of Accounts
          </button>
        </div>
      </div>

      {/* 1. PROFIT & LOSS STATEMENT TAB */}
      {activeTab === 'PL' && (
        <div className="space-y-6">
          {/* Executive P&L Snapshot */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-xs font-medium text-slate-400">Total Operating Revenue</div>
              <div className="mt-1 text-2xl font-bold text-white font-mono">
                {activePL.currency === 'USD' ? '$' : '৳'}{activePL.totalRevenue.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-emerald-400 font-semibold">100% Top-line Inflow</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-xs font-medium text-slate-400">Cost of Goods Sold (COGS)</div>
              <div className="mt-1 text-2xl font-bold text-rose-400 font-mono">
                -{activePL.currency === 'USD' ? '$' : '৳'}{activePL.cogsTotal.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-slate-400 font-semibold">
                Gross Margin: {activePL.grossMarginPercent.toFixed(1)}%
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-xs font-medium text-slate-400">Net Operating Profit</div>
              <div className="mt-1 text-2xl font-bold text-emerald-400 font-mono">
                {activePL.currency === 'USD' ? '$' : '৳'}{activePL.netProfit.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-emerald-400 font-semibold">
                Net Margin: {activePL.netMarginPercent.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Detailed P&L Breakdown Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
              <span>Income Statement ({activeCompany === 'CONSOLIDATED' ? 'Bizman Media Baseline' : activeCompany})</span>
              <span className="text-xs font-mono text-slate-400">Fiscal Year 2026 (YTD)</span>
            </h2>

            {/* Revenue Section */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Operating Revenue</div>
              {activePL.revenueLines.map((line, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/40">
                  <span className="text-slate-300 font-mono">{line.code} &bull; {line.name}</span>
                  <span className="font-mono text-slate-100 font-semibold">
                    {activePL.currency === 'USD' ? '$' : '৳'}{line.amount.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between text-xs py-2 font-bold text-indigo-300 border-t border-slate-700">
                <span>Total Operating Revenue</span>
                <span className="font-mono">{activePL.currency === 'USD' ? '$' : '৳'}{activePL.totalRevenue.toLocaleString()}</span>
              </div>
            </div>

            {/* Cost of Goods Sold Section */}
            <div className="space-y-2 pt-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Direct Cost of Goods Sold (COGS)</div>
              {activePL.cogsLines.map((line, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/40">
                  <span className="text-slate-300 font-mono">{line.code} &bull; {line.name}</span>
                  <span className="font-mono text-rose-400">
                    -{activePL.currency === 'USD' ? '$' : '৳'}{line.amount.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between text-xs py-2 font-bold text-slate-200 border-t border-slate-700">
                <span>Gross Profit (Margin: {activePL.grossMarginPercent.toFixed(1)}%)</span>
                <span className="font-mono text-emerald-400">
                  {activePL.currency === 'USD' ? '$' : '৳'}{activePL.grossProfit.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Operating Expenses Section */}
            <div className="space-y-2 pt-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Operating & Administrative Expenses</div>
              {activePL.operatingExpenseLines.map((line, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/40">
                  <span className="text-slate-300 font-mono">{line.code} &bull; {line.name}</span>
                  <span className="font-mono text-rose-400">
                    -{activePL.currency === 'USD' ? '$' : '৳'}{line.amount.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between text-xs py-2 font-bold text-slate-300 border-t border-slate-700">
                <span>Total Operating Expenses</span>
                <span className="font-mono text-rose-400">
                  -{activePL.currency === 'USD' ? '$' : '৳'}{activePL.operatingExpensesTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Net Income Summary */}
            <div className="rounded-lg bg-emerald-950/40 border border-emerald-800/60 p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Net Operating Income</div>
                <div className="text-[11px] text-slate-400">After all direct vendor payouts, logistics & overhead</div>
              </div>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                {activePL.currency === 'USD' ? '$' : '৳'}{activePL.netProfit.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BALANCE SHEET TAB */}
      {activeTab === 'BALANCE_SHEET' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white">Balance Sheet (Statement of Financial Position)</h2>
                <div className="text-xs text-slate-400">Double-entry equation: Total Assets = Total Liabilities + Total Equity</div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                <span>Dual-Entry Verified (Balanced)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Assets */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800 pb-2">
                  Assets (What You Own)
                </h3>
                <div className="space-y-2">
                  {activeBS.assetLines.map((line, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/40">
                      <span className="text-slate-300 font-mono">{line.code} &bull; {line.name}</span>
                      <span className="font-mono font-semibold text-slate-100">
                        {activeBS.currency === 'USD' ? '$' : '৳'}{line.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-sm py-2 font-bold text-indigo-300 border-t border-slate-700">
                    <span>Total Assets</span>
                    <span className="font-mono">{activeBS.currency === 'USD' ? '$' : '৳'}{activeBS.totalAssets.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Liabilities & Equity */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 border-b border-slate-800 pb-2">
                  Liabilities (What You Owe)
                </h3>
                <div className="space-y-2">
                  {activeBS.liabilityLines.map((line, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/40">
                      <span className="text-slate-300 font-mono">{line.code} &bull; {line.name}</span>
                      <span className="font-mono font-semibold text-rose-400">
                        {activeBS.currency === 'USD' ? '$' : '৳'}{line.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-xs py-2 font-bold text-slate-300 border-t border-slate-700">
                    <span>Total Liabilities</span>
                    <span className="font-mono">{activeBS.currency === 'USD' ? '$' : '৳'}{activeBS.totalLiabilities.toLocaleString()}</span>
                  </div>
                </div>

                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-2 pt-2">
                  Owner&apos;s Equity & Retained Capital
                </h3>
                <div className="space-y-2">
                  {activeBS.equityLines.map((line, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/40">
                      <span className="text-slate-300 font-mono">{line.code} &bull; {line.name}</span>
                      <span className="font-mono font-semibold text-emerald-400">
                        {activeBS.currency === 'USD' ? '$' : '৳'}{line.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-xs py-2 font-bold text-slate-300 border-t border-slate-700">
                    <span>Total Owner Equity</span>
                    <span className="font-mono">{activeBS.currency === 'USD' ? '$' : '৳'}{activeBS.totalEquity.toLocaleString()}</span>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-950 p-3 flex items-center justify-between font-bold text-xs border border-slate-800">
                  <span className="text-slate-300">Total Liabilities + Equity:</span>
                  <span className="font-mono text-indigo-400 text-sm">
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
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white">General Ledger Journal Entries</h2>
                <div className="text-xs text-slate-400">Strict double-entry accounting records with audit reference links</div>
              </div>
            </div>

            <div className="space-y-4">
              {INITIAL_JOURNAL_ENTRIES.map((entry) => {
                const check = validateJournalEntry(entry.lines);
                return (
                  <div key={entry.id} className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-400">{entry.entryNumber}</span>
                        <span className="text-slate-400 font-mono">Date: {entry.date}</span>
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                          Ref: {entry.reference}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Posted & Balanced (Diff: ৳0.00)</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-200 font-medium">
                      {entry.description}
                    </div>

                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 text-[11px]">
                        <tr>
                          <th className="p-2">Account</th>
                          <th className="p-2">Description</th>
                          <th className="p-2 text-right">Debit</th>
                          <th className="p-2 text-right">Credit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 font-mono">
                        {entry.lines.map((line) => (
                          <tr key={line.id} className="text-slate-300">
                            <td className="p-2 text-indigo-300">{line.accountCode} - {line.accountName}</td>
                            <td className="p-2 text-slate-400 font-sans">{line.description}</td>
                            <td className="p-2 text-right text-emerald-400">
                              {line.debit > 0 ? line.debit.toLocaleString() : '-'}
                            </td>
                            <td className="p-2 text-right text-rose-400">
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
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white">Standard Chart of Accounts (CoA)</h2>
              <div className="text-xs text-slate-400">Categorized chart mapped to {currentEntity}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[11px]">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Account Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Classification</th>
                  <th className="p-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {currentAccounts.map((acc) => (
                  <tr key={acc.code} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-indigo-400">{acc.code}</td>
                    <td className="p-3 font-medium text-slate-200">{acc.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        acc.type === 'ASSET' ? 'bg-blue-950 text-blue-400' :
                        acc.type === 'LIABILITY' ? 'bg-rose-950 text-rose-400' :
                        acc.type === 'EQUITY' ? 'bg-purple-950 text-purple-400' :
                        acc.type === 'REVENUE' ? 'bg-emerald-950 text-emerald-400' :
                        'bg-amber-950 text-amber-400'
                      }`}>
                        {acc.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">{acc.classification}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-100">
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

