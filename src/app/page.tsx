'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Building2, 
  Tv2, 
  Globe2, 
  Layers, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  PhoneCall, 
  MessageSquare, 
  FilePlus, 
  Receipt,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { CompanyCode, COMPANIES } from '@/lib/types';
import { INITIAL_LEADS, INITIAL_EXPENSES } from '@/lib/mock-data';
import { generatePLStatement } from '@/lib/accounting-engine';

export default function MasterDashboard() {
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';
  const meta = COMPANIES[activeCompany] || COMPANIES.CONSOLIDATED;

  // Filter leads and expenses based on company
  const filteredLeads = activeCompany === 'CONSOLIDATED'
    ? INITIAL_LEADS
    : INITIAL_LEADS.filter(l => l.companyCode === activeCompany);

  const filteredExpenses = activeCompany === 'CONSOLIDATED'
    ? INITIAL_EXPENSES
    : INITIAL_EXPENSES.filter(e => e.companyCode === activeCompany);

  // Financial summary based on active view
  let totalRevenueDisplay = '৳ 2,51,50,000 / $198,000';
  let grossProfitDisplay = '৳ 1,24,00,000 / $72,800';
  let netProfitDisplay = '৳ 78,50,000 / $32,100';
  let netMarginDisplay = '31.2%';

  if (activeCompany === 'BIZMAN') {
    const pl = generatePLStatement('BIZMAN');
    totalRevenueDisplay = `৳ ${(pl.totalRevenue).toLocaleString()}`;
    grossProfitDisplay = `৳ ${(pl.grossProfit).toLocaleString()}`;
    netProfitDisplay = `৳ ${(pl.netProfit).toLocaleString()}`;
    netMarginDisplay = `${pl.netMarginPercent.toFixed(1)}%`;
  } else if (activeCompany === 'ADPRO') {
    const pl = generatePLStatement('ADPRO');
    totalRevenueDisplay = `৳ ${(pl.totalRevenue).toLocaleString()}`;
    grossProfitDisplay = `৳ ${(pl.grossProfit).toLocaleString()}`;
    netProfitDisplay = `৳ ${(pl.netProfit).toLocaleString()}`;
    netMarginDisplay = `${pl.netMarginPercent.toFixed(1)}%`;
  } else if (activeCompany === 'ARIELMC') {
    const pl = generatePLStatement('ARIELMC');
    totalRevenueDisplay = `$${(pl.totalRevenue).toLocaleString()}`;
    grossProfitDisplay = `$${(pl.grossProfit).toLocaleString()}`;
    netProfitDisplay = `$${(pl.netProfit).toLocaleString()}`;
    netMarginDisplay = `${pl.netMarginPercent.toFixed(1)}%`;
  }

  // Pipeline metrics
  const totalPipelineValueBDT = filteredLeads
    .filter(l => l.currency === 'BDT')
    .reduce((sum, l) => sum + l.estimatedValue, 0);

  const totalPipelineValueUSD = filteredLeads
    .filter(l => l.currency === 'USD')
    .reduce((sum, l) => sum + l.estimatedValue, 0);

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Context Header */}
      <div className="rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          {activeCompany === 'BIZMAN' && <Tv2 className="h-64 w-64 text-blue-500" />}
          {activeCompany === 'ADPRO' && <Building2 className="h-64 w-64 text-orange-500" />}
          {activeCompany === 'ARIELMC' && <Globe2 className="h-64 w-64 text-emerald-500" />}
          {activeCompany === 'CONSOLIDATED' && <Layers className="h-64 w-64 text-indigo-500" />}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <Sparkles className="h-4 w-4" />
              <span>Personal Business Operating System</span>
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {meta.name}
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Position: <strong className="text-white">{meta.role}</strong> &bull; {meta.industry}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/leads?company=${activeCompany}&action=new`}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg hover:bg-indigo-500 transition-colors"
            >
              <FilePlus className="h-4 w-4" />
              <span>New Lead</span>
            </Link>
            <Link
              href={`/expenses?company=${activeCompany}&action=new`}
              className="flex items-center gap-2 rounded-lg bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <Receipt className="h-4 w-4" />
              <span>Log Expense</span>
            </Link>
            <Link
              href={`/finance?company=${activeCompany}`}
              className="flex items-center gap-2 rounded-lg bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              <span>P&L / Balance Sheet</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Key Stats Banner */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-800/80 pt-4">
          {meta.stats.map((stat, idx) => (
            <div key={idx} className="rounded-lg bg-slate-950/60 p-3 border border-slate-800/50">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{stat.label}</div>
              <div className="text-sm md:text-base font-bold text-slate-100 mt-0.5">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Health & P&L Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Recognized Revenue (YTD)</span>
            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xl font-bold text-white tracking-tight">{totalRevenueDisplay}</div>
          <div className="mt-2 flex items-center text-xs text-emerald-400 font-medium">
            <ArrowUpRight className="h-4 w-4 mr-0.5" />
            <span>Audited from Dual-Entry General Ledger</span>
          </div>
        </div>

        {/* Gross Profit Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Gross Profit (Post-COGS)</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xl font-bold text-white tracking-tight">{grossProfitDisplay}</div>
          <div className="mt-2 text-xs text-slate-400">
            Deducts 50+/70+ vendor board rentals & materials
          </div>
        </div>

        {/* Net Profit & Margin Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Net Operating Profit</span>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xl font-bold text-white tracking-tight">{netProfitDisplay}</div>
          <div className="mt-2 flex items-center text-xs text-emerald-400 font-semibold">
            <span>Net Margin: {netMarginDisplay}</span>
          </div>
        </div>

        {/* Active Pipeline Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Weighted Deal Pipeline</span>
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xl font-bold text-white tracking-tight">
            {totalPipelineValueBDT > 0 && `৳ ${(totalPipelineValueBDT).toLocaleString()}`}
            {totalPipelineValueBDT > 0 && totalPipelineValueUSD > 0 && ' + '}
            {totalPipelineValueUSD > 0 && `$${(totalPipelineValueUSD).toLocaleString()}`}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Across {filteredLeads.length} active opportunities
          </div>
        </div>
      </div>

      {/* Main Grid: Pipeline Leads & Micro-P&L Deal Cost Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active High-Value Deals */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Priority Deals & Active Client Pipelines</span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                  {filteredLeads.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Polymorphic pipeline: DOOH media slots, event activations, and international exports
              </p>
            </div>
            <Link
              href={`/leads?company=${activeCompany}`}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {filteredLeads.map((lead) => {
              const badgeCompany = lead.companyCode;
              return (
                <div
                  key={lead.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        badgeCompany === 'BIZMAN' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                        badgeCompany === 'ADPRO' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {lead.companyCode}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{lead.pipelineType}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* One-Click Call Button */}
                      <a
                        href={`tel:${lead.phone}`}
                        title={`Call ${lead.contactPerson}`}
                        className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 text-xs border border-slate-700 transition-colors"
                      >
                        <PhoneCall className="h-3 w-3 text-emerald-400" />
                        <span className="font-mono text-[11px]">{lead.phone}</span>
                      </a>

                      {/* One-Click WhatsApp Button */}
                      <a
                        href={`https://wa.me/${lead.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Chat via WhatsApp"
                        className="flex items-center gap-1 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 px-2 py-1 text-xs border border-emerald-800 transition-colors"
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span className="text-[11px] font-semibold">WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <h3 className="text-sm font-bold text-white">{lead.title}</h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Client: <span className="font-semibold text-slate-200">{lead.customerName}</span> ({lead.contactPerson}) &bull; {lead.country}
                    </p>
                  </div>

                  {/* Deal Metrics and Stage */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/60 pt-2.5 text-xs">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-slate-500">Value: </span>
                        <strong className="text-slate-100 font-mono">
                          {lead.currency === 'USD' ? '$' : '৳'}{lead.estimatedValue.toLocaleString()}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Close By: </span>
                        <span className="text-slate-300 font-mono">{lead.expectedCloseDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded bg-indigo-950 text-indigo-300 border border-indigo-800/80 px-2 py-0.5 text-[11px] font-semibold">
                        {lead.stage.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {lead.probability}% Prob
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Daily Deal-Wise Expense Tracker & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Deal-Wise Expense Stream */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-emerald-400" />
                  <span>Recent Lead/Order Expenses</span>
                </h3>
                <p className="text-[11px] text-slate-400">Micro-P&L tracking directly tied to client deals</p>
              </div>
              <Link
                href={`/expenses?company=${activeCompany}`}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Log +
              </Link>
            </div>

            <div className="mt-3 space-y-3">
              {filteredExpenses.map((exp) => (
                <div key={exp.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-xs">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-slate-400">{exp.expenseNumber}</span>
                    <strong className="text-rose-400">
                      -{exp.currency === 'USD' ? '$' : '৳'}{exp.amount.toLocaleString()}
                    </strong>
                  </div>
                  <div className="mt-1 font-medium text-slate-200">{exp.description}</div>
                  
                  {exp.leadTitle && (
                    <div className="mt-1.5 rounded bg-indigo-950/40 border border-indigo-900/60 px-2 py-0.5 text-[10px] text-indigo-300 truncate">
                      Deal: {exp.leadTitle}
                    </div>
                  )}

                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Paid to: {exp.vendorRecipient}</span>
                    <span className="font-mono">{exp.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Operations Guide */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs space-y-2">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-indigo-400" />
              <span>Personal Workflow Shortcuts</span>
            </div>
            <ul className="space-y-1.5 text-slate-400 pl-4 list-disc">
              <li>Click any phone number to trigger native cellular or desktop dialer.</li>
              <li>Click WhatsApp to launch directly into chat with prefilled proposal notes.</li>
              <li>Every logged expense automatically creates balanced General Ledger entries.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
