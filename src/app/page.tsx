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
  AlertTriangle,
  BarChart3
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
  } else if (activeCompany === 'LINDA') {
    const pl = generatePLStatement('LINDA');
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
      {/* Executive Welcome Card */}
      <div className="rounded-xl border border-[#DDE3DD] bg-white p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            {activeCompany === 'BIZMAN' && (
              <div className="h-14 w-14 rounded-xl overflow-hidden border border-[#DDE3DD] bg-[#0D3B29] p-1 shadow-sm flex items-center justify-center shrink-0">
                <img src="/logos/bizman-logo.jpg" alt="Bizman Media" className="h-full w-full object-contain" />
              </div>
            )}
            {activeCompany === 'LINDA' && (
              <div className="h-16 w-36 rounded-xl overflow-hidden border border-[#DDE3DD] bg-black px-2.5 py-1 shadow-sm flex items-center justify-center shrink-0">
                <img src="/logos/linda-logo.png" alt="Linda Resort" className="w-full h-auto object-contain scale-110" />
              </div>
            )}
            {activeCompany === 'ARIELMC' && (
              <div className="h-16 w-24 rounded-xl overflow-hidden border border-[#DDE3DD] bg-white p-1.5 shadow-sm flex items-center justify-center shrink-0">
                <img src="/logos/arielmc-logo.png" alt="ArielMC" className="h-full w-auto object-contain" />
              </div>
            )}
            {activeCompany === 'CONSOLIDATED' && (
              <div className="flex items-center gap-3 shrink-0 pt-1">
                <div className="h-16 w-16 rounded-2xl overflow-hidden border border-[#C8A96A] bg-[#0A1628] p-1 shadow-md flex items-center justify-center shrink-0">
                  <img src="/logos/master-crm-icon.png" alt="Master CRM" className="h-full w-full object-contain" />
                </div>
                <div className="flex items-center -space-x-1.5 shrink-0">
                  <div className="h-12 w-14 rounded-xl overflow-hidden border border-[#DDE3DD] bg-white p-1 shadow-sm flex items-center justify-center">
                    <img src="/logos/arielmc-logo.png" alt="ArielMC" className="max-h-10 w-auto object-contain" />
                  </div>
                  <div className="h-12 w-12 rounded-xl overflow-hidden border border-[#DDE3DD] bg-[#0D3B29] p-1 shadow-sm flex items-center justify-center">
                    <img src="/logos/bizman-logo.jpg" alt="Bizman" className="h-full w-full object-contain" />
                  </div>
                  <div className="h-12 w-18 rounded-xl overflow-hidden border border-[#DDE3DD] bg-black px-1.5 py-1 shadow-sm flex items-center justify-center">
                    <img src="/logos/linda-logo.png" alt="Linda" className="w-full h-auto object-contain scale-110" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8A96A]">
                <Sparkles className="h-4 w-4 text-[#C8A96A]" />
                <span>Personal Executive Operating System</span>
              </div>
              <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-[#1F3A2E] tracking-tight">
                {meta.name}
              </h1>
              <p className="mt-1 text-xs text-[#6B7269]">
                Active Role: <strong className="text-[#1A1A1A]">{meta.role}</strong> &bull; {meta.industry}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/leads?company=${activeCompany}&action=new`}
              className="flex items-center gap-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] px-3.5 py-2 text-xs font-semibold text-white shadow transition-colors"
            >
              <FilePlus className="h-4 w-4" />
              <span>New Lead</span>
            </Link>
            <Link
              href={`/expenses?company=${activeCompany}&action=new`}
              className="flex items-center gap-1.5 rounded-lg bg-white border border-[#DDE3DD] px-3.5 py-2 text-xs font-semibold text-[#1F3A2E] hover:bg-[#F4F6F4] transition-colors"
            >
              <Receipt className="h-4 w-4 text-[#C8A96A]" />
              <span>Log Expense</span>
            </Link>
            <Link
              href={`/finance?company=${activeCompany}`}
              className="flex items-center gap-1.5 rounded-lg bg-white border border-[#DDE3DD] px-3.5 py-2 text-xs font-semibold text-[#1F3A2E] hover:bg-[#F4F6F4] transition-colors"
            >
              <TrendingUp className="h-4 w-4 text-[#1E6B3A]" />
              <span>P&L / Balance Sheet</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Key Stats Banner */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#DDE3DD] pt-4">
          {meta.stats.map((stat, idx) => (
            <div key={idx} className="rounded-lg bg-[#F4F6F4] p-3 border border-[#DDE3DD]">
              <div className="text-[11px] font-bold text-[#6B7269] uppercase tracking-wider">{stat.label}</div>
              <div className="text-sm md:text-base font-extrabold text-[#1F3A2E] mt-0.5">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Health & P&L Metric Cards (ArielMC ERP KPI Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="rounded-xl border border-[#DDE3DD] bg-white p-5 shadow-sm hover:border-[#C8A96A] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7269] uppercase tracking-wider">Recognized Revenue (YTD)</span>
            <div className="rounded-lg bg-[#E8F0FA] p-2 text-[#1F5FA8]">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-[#1F3A2E] font-mono tracking-tight">{totalRevenueDisplay}</div>
          <div className="mt-2 flex items-center text-xs text-[#1E6B3A] font-semibold">
            <ArrowUpRight className="h-4 w-4 mr-0.5" />
            <span>Audited General Ledger</span>
          </div>
        </div>

        {/* Gross Profit Card */}
        <div className="rounded-xl border border-[#DDE3DD] bg-white p-5 shadow-sm hover:border-[#C8A96A] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7269] uppercase tracking-wider">Gross Profit (Post-COGS)</span>
            <div className="rounded-lg bg-[#E4F3E9] p-2 text-[#1E6B3A]">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-[#1F3A2E] font-mono tracking-tight">{grossProfitDisplay}</div>
          <div className="mt-2 text-xs text-[#6B7269]">
            Deducts 50+/70+ vendor screen payouts & materials
          </div>
        </div>

        {/* Net Profit & Margin Card */}
        <div className="rounded-xl border border-[#DDE3DD] bg-white p-5 shadow-sm hover:border-[#C8A96A] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7269] uppercase tracking-wider">Net Operating Profit</span>
            <div className="rounded-lg bg-[#FFF3D6] p-2 text-[#8A5A00]">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-[#1F3A2E] font-mono tracking-tight">{netProfitDisplay}</div>
          <div className="mt-2 flex items-center text-xs text-[#1E6B3A] font-bold">
            <span>Net Margin: {netMarginDisplay}</span>
          </div>
        </div>

        {/* Active Pipeline Card */}
        <div className="rounded-xl border border-[#DDE3DD] bg-white p-5 shadow-sm hover:border-[#C8A96A] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7269] uppercase tracking-wider">Weighted Deal Pipeline</span>
            <div className="rounded-lg bg-[#F4F6F4] p-2 text-[#1F3A2E]">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xl font-extrabold text-[#1F3A2E] font-mono tracking-tight">
            {totalPipelineValueBDT > 0 && `৳ ${(totalPipelineValueBDT).toLocaleString()}`}
            {totalPipelineValueBDT > 0 && totalPipelineValueUSD > 0 && ' + '}
            {totalPipelineValueUSD > 0 && `$${(totalPipelineValueUSD).toLocaleString()}`}
          </div>
          <div className="mt-2 text-xs text-[#6B7269]">
            Across {filteredLeads.length} active opportunities
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Deals & Daily Deal-Wise Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active High-Value Deals */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
            <div>
              <h2 className="text-base font-extrabold text-[#1F3A2E] flex items-center gap-2">
                <span>Priority Deals & Active Client Pipelines</span>
                <span className="rounded-full bg-[#E4F3E9] text-[#1E6B3A] px-2 py-0.5 text-xs font-bold">
                  {filteredLeads.length}
                </span>
              </h2>
              <p className="text-xs text-[#6B7269] mt-0.5">
                Polymorphic pipeline: DOOH media slots, event activations, and international exports
              </p>
            </div>
            <Link
              href={`/leads?company=${activeCompany}`}
              className="text-xs font-bold text-[#1F3A2E] hover:text-[#C8A96A] flex items-center gap-1"
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
                  className="rounded-xl border border-[#DDE3DD] bg-white p-4 hover:border-[#C8A96A] transition-all shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        badgeCompany === 'BIZMAN' ? 'bg-[#E8F0FA] text-[#1F5FA8] border border-[#BBD5F2]' :
                        badgeCompany === 'LINDA' ? 'bg-[#FFF3D6] text-[#8A5A00] border border-[#FBE0A8]' :
                        'bg-[#E4F3E9] text-[#1E6B3A] border border-[#B6E2C5]'
                      }`}>
                        {lead.companyCode === 'ARIELMC' ? 'ArielMC' : lead.companyCode === 'LINDA' ? 'Linda Resort' : lead.companyCode}
                      </span>
                      <span className="text-xs text-[#6B7269] font-mono">{lead.pipelineType}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${lead.phone}`}
                        title={`Call ${lead.contactPerson}`}
                        className="flex items-center gap-1 rounded bg-[#F4F6F4] hover:bg-[#E4F3E9] text-[#1A1A1A] hover:text-[#1E6B3A] px-2.5 py-1 text-xs border border-[#DDE3DD] transition-colors"
                      >
                        <PhoneCall className="h-3 w-3 text-[#1E6B3A]" />
                        <span className="font-mono text-[11px] font-semibold">{lead.phone}</span>
                      </a>

                      <a
                        href={`https://wa.me/${lead.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Chat via WhatsApp"
                        className="flex items-center gap-1.5 rounded-lg bg-[#25D366] hover:bg-[#20BA5A] text-white px-2.5 py-1 text-xs border border-[#1EBE5D] transition-colors font-bold shadow-xs"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span className="text-[11px]">WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <h3 className="text-sm font-extrabold text-[#1F3A2E]">{lead.title}</h3>
                    <p className="text-xs text-[#6B7269] mt-0.5">
                      Client: <span className="font-bold text-[#1A1A1A]">{lead.customerName}</span> ({lead.contactPerson}) &bull; {lead.country}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#DDE3DD] pt-2.5 text-xs">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[#6B7269]">Value: </span>
                        <strong className="text-[#1F3A2E] font-mono font-bold">
                          {lead.currency === 'USD' ? '$' : '৳'}{lead.estimatedValue.toLocaleString()}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#6B7269]">Target: </span>
                        <span className="text-[#1A1A1A] font-mono">{lead.expectedCloseDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#F4F6F4] text-[#1F3A2E] border border-[#DDE3DD] px-2 py-0.5 text-[11px] font-bold">
                        {lead.stage.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-[#6B7269] font-mono font-semibold">
                        {lead.probability}% Prob
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recent Deal Expenses */}
        <div className="space-y-6">
          <div className="rounded-xl border border-[#DDE3DD] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-[#1F3A2E] flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-[#C8A96A]" />
                  <span>Recent Deal Expenses</span>
                </h3>
                <p className="text-[11px] text-[#6B7269]">Direct costs linked to client campaigns</p>
              </div>
              <Link
                href={`/expenses?company=${activeCompany}`}
                className="text-xs font-bold text-[#1F3A2E] hover:text-[#C8A96A]"
              >
                Log +
              </Link>
            </div>

            <div className="mt-3 space-y-3">
              {filteredExpenses.map((exp) => (
                <div key={exp.id} className="rounded-lg border border-[#DDE3DD] bg-[#F9FAF9] p-3 text-xs">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-[#6B7269]">{exp.expenseNumber}</span>
                    <strong className="text-[#B3261E]">
                      -{exp.currency === 'USD' ? '$' : '৳'}{exp.amount.toLocaleString()}
                    </strong>
                  </div>
                  <div className="mt-1 font-bold text-[#1A1A1A]">{exp.description}</div>
                  
                  {exp.leadTitle && (
                    <div className="mt-1.5 rounded bg-[#EDF1ED] border border-[#DDE3DD] px-2 py-0.5 text-[10px] text-[#1F3A2E] font-medium truncate">
                      Deal: {exp.leadTitle}
                    </div>
                  )}

                  <div className="mt-1 flex items-center justify-between text-[10px] text-[#6B7269] pt-1">
                    <span>Paid to: {exp.vendorRecipient}</span>
                    <span className="font-mono">{exp.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Operations Guide */}
          <div className="rounded-xl border border-[#DDE3DD] bg-white p-4 text-xs space-y-2 shadow-sm">
            <div className="font-bold text-[#1F3A2E] flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#C8A96A]" />
              <span>ArielMC Operating Rules</span>
            </div>
            <ul className="space-y-1.5 text-[#6B7269] pl-4 list-disc">
              <li>Wholesale vendor screen payouts post directly to 5010 COGS accounts.</li>
              <li>Click any phone number to trigger native cellular dialer.</li>
              <li>WhatsApp opens instantly with prefilled commercial terms.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
