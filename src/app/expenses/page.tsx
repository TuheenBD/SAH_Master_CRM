'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Receipt, 
  Plus, 
  DollarSign, 
  FileText, 
  Tag, 
  CheckCircle2, 
  Building2, 
  ArrowRight, 
  TrendingDown, 
  Layers, 
  Filter, 
  AlertCircle, 
  Check, 
  Wallet, 
  CreditCard,
  Clock
} from 'lucide-react';
import { CompanyCode, ExpenseItem, ExpensePayer, ReimbursementStatus } from '@/lib/types';
import { INITIAL_EXPENSES, INITIAL_LEADS } from '@/lib/mock-data';

export default function ExpensesPage() {
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';

  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [showModal, setShowModal] = useState(false);
  const [filterTab, setFilterTab] = useState<'ALL' | 'DUE_FROM_ENTITY' | 'SETTLED' | 'PERSONAL'>('ALL');

  // Form State
  const [targetCompany, setTargetCompany] = useState<'BIZMAN' | 'LINDA' | 'ARIELMC'>(
    activeCompany === 'CONSOLIDATED' ? 'BIZMAN' : activeCompany
  );
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('BDT');
  const [category, setCategory] = useState<string>('VENDOR_BOARD_RENTAL');
  const [description, setDescription] = useState<string>('');
  const [vendorRecipient, setVendorRecipient] = useState<string>('');
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [paidBy, setPaidBy] = useState<ExpensePayer>('MY_PERSONAL_FUNDS');
  const [isReimbursable, setIsReimbursable] = useState<boolean>(true);
  const [paidFromAccount, setPaidFromAccount] = useState<string>('1010 - Personal Bank / Cash Outlay');
  const [expenseAccount, setExpenseAccount] = useState<string>('5010 - Vendor Billboard Rental Cost');

  // Filter based on company
  const companyFiltered = activeCompany === 'CONSOLIDATED'
    ? expenses
    : expenses.filter(e => e.companyCode === activeCompany);

  // Filter based on tab
  const filteredExpenses = companyFiltered.filter(e => {
    if (filterTab === 'DUE_FROM_ENTITY') {
      return e.isReimbursable && e.reimbursementStatus === 'PENDING_REIMBURSEMENT';
    }
    if (filterTab === 'SETTLED') {
      return e.reimbursementStatus === 'REIMBURSED';
    }
    if (filterTab === 'PERSONAL') {
      return !e.isReimbursable || e.paidBy === 'MY_PERSONAL_FUNDS';
    }
    return true;
  });

  // Totals
  const totalExpenseBDT = companyFiltered
    .filter(e => e.currency === 'BDT')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenseUSD = companyFiltered
    .filter(e => e.currency === 'USD')
    .reduce((sum, e) => sum + e.amount, 0);

  // Reimbursables owed to me by entities
  const owedToMeBDT = companyFiltered
    .filter(e => e.currency === 'BDT' && e.isReimbursable && e.reimbursementStatus === 'PENDING_REIMBURSEMENT')
    .reduce((sum, e) => sum + e.amount, 0);

  const owedToMeUSD = companyFiltered
    .filter(e => e.currency === 'USD' && e.isReimbursable && e.reimbursementStatus === 'PENDING_REIMBURSEMENT')
    .reduce((sum, e) => sum + e.amount, 0);

  // Settled reimbursements
  const settledReimbursedBDT = companyFiltered
    .filter(e => e.currency === 'BDT' && e.reimbursementStatus === 'REIMBURSED')
    .reduce((sum, e) => sum + e.amount, 0);

  const settledReimbursedUSD = companyFiltered
    .filter(e => e.currency === 'USD' && e.reimbursementStatus === 'REIMBURSED')
    .reduce((sum, e) => sum + e.amount, 0);

  const handleMarkReimbursed = (expId: string) => {
    setExpenses(prev => prev.map(e => e.id === expId ? { ...e, reimbursementStatus: 'REIMBURSED' } : e));
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const matchedLead = INITIAL_LEADS.find(l => l.id === selectedLeadId);

    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      companyCode: targetCompany,
      expenseNumber: `EXP-${targetCompany.slice(0, 3)}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(amount),
      currency: targetCompany === 'ARIELMC' ? 'USD' : currency,
      category,
      description,
      vendorRecipient: vendorRecipient || 'Vendor',
      leadId: selectedLeadId || undefined,
      leadTitle: matchedLead?.title,
      paidFromAccount: paidBy === 'MY_PERSONAL_FUNDS' ? '1010 - Personal Funds Advanced' : '1020 - Corporate Entity Bank',
      expenseAccount,
      isVerified: true,
      paidBy,
      isReimbursable: paidBy === 'MY_PERSONAL_FUNDS' ? isReimbursable : false,
      reimbursementStatus: (paidBy === 'MY_PERSONAL_FUNDS' && isReimbursable) ? 'PENDING_REIMBURSEMENT' : 'NON_REIMBURSABLE',
    };

    setExpenses([newExpense, ...expenses]);
    setShowModal(false);
    // Reset
    setAmount('');
    setDescription('');
    setVendorRecipient('');
    setSelectedLeadId('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE3DD] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8A96A]">
            <Receipt className="h-4 w-4" />
            <span>Personal Project Outlays & Entity Settlements</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-[#1F3A2E] tracking-tight">
            My Project Expenses & Reimbursables
          </h1>
          <p className="text-xs text-[#6B7269]">
            Track out-of-pocket project expenses advanced by Syed Akramul Hassan. Entities reimburse approved outlays upon customer project settlement.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] px-4 py-2 text-xs font-bold border border-[#1F3A2E] shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Record Project Outlay</span>
        </button>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Project Outlays */}
        <div className="rounded-xl border border-[#DDE3DD] bg-white p-4 shadow-xs">
          <div className="text-xs font-bold text-[#6B7269] uppercase tracking-wider">
            Total Project Outlays
          </div>
          <div className="mt-1 text-xl font-black text-[#1F3A2E] font-mono">
            ৳ {totalExpenseBDT.toLocaleString()}
            {totalExpenseUSD > 0 && (
              <span className="text-sm font-bold text-[#6B7269]"> + ${totalExpenseUSD.toLocaleString()}</span>
            )}
          </div>
          <div className="text-[11px] text-[#6B7269] mt-1 font-medium">
            Personal advancements & project execution costs
          </div>
        </div>

        {/* Reimbursable Owed by Entities to Me */}
        <div className="rounded-xl border-2 border-[#D8B4FE] bg-[#FAF5FF] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#7E22CE] uppercase tracking-wider">
              Reimbursable Owed to Me
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#7E22CE] text-white text-[9.5px] font-extrabold animate-pulse">
              Entity Due
            </span>
          </div>
          <div className="mt-1 text-xl font-black text-[#7E22CE] font-mono">
            ৳ {owedToMeBDT.toLocaleString()}
            {owedToMeUSD > 0 && (
              <span className="text-sm font-bold text-[#7E22CE]/80"> + ${owedToMeUSD.toLocaleString()}</span>
            )}
          </div>
          <div className="text-[11px] text-[#7E22CE] mt-1 font-semibold">
            Entities owe Syed Akramul Hassan upon client payout
          </div>
        </div>

        {/* Settled / Reimbursed by Entities */}
        <div className="rounded-xl border border-[#A7F3D0] bg-[#F0FDF4] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#166534] uppercase tracking-wider">
              Settled & Reimbursed to Me
            </span>
            <CheckCircle2 className="h-4 w-4 text-[#166534]" />
          </div>
          <div className="mt-1 text-xl font-black text-[#15803D] font-mono">
            ৳ {settledReimbursedBDT.toLocaleString()}
            {settledReimbursedUSD > 0 && (
              <span className="text-sm font-bold text-[#166534]"> + ${settledReimbursedUSD.toLocaleString()}</span>
            )}
          </div>
          <div className="text-[11px] text-[#166534] mt-1 font-semibold">
            100% Repaid by Entities to Personal Accounts
          </div>
        </div>
      </div>

      {/* Filter Tabs Strip */}
      <div className="flex items-center gap-2 border-b border-[#DDE3DD] pb-2 text-xs">
        <button
          onClick={() => setFilterTab('ALL')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterTab === 'ALL'
              ? 'bg-[#1F3A2E] text-[#C8A96A] shadow-xs'
              : 'text-[#6B7269] hover:bg-[#F4F6F4] hover:text-[#1F3A2E]'
          }`}
        >
          All Expenses ({companyFiltered.length})
        </button>
        <button
          onClick={() => setFilterTab('DUE_FROM_ENTITY')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
            filterTab === 'DUE_FROM_ENTITY'
              ? 'bg-[#7E22CE] text-white shadow-xs'
              : 'text-[#7E22CE] hover:bg-[#FAF5FF]'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-[#7E22CE]" />
          <span>Reimbursables Due from Entities ({companyFiltered.filter(e => e.isReimbursable && e.reimbursementStatus === 'PENDING_REIMBURSEMENT').length})</span>
        </button>
        <button
          onClick={() => setFilterTab('SETTLED')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
            filterTab === 'SETTLED'
              ? 'bg-[#15803D] text-white shadow-xs'
              : 'text-[#15803D] hover:bg-[#F0FDF4]'
          }`}
        >
          <span>Settled / Reimbursed ({companyFiltered.filter(e => e.reimbursementStatus === 'REIMBURSED').length})</span>
        </button>
        <button
          onClick={() => setFilterTab('PERSONAL')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterTab === 'PERSONAL'
              ? 'bg-[#556055] text-white shadow-xs'
              : 'text-[#6B7269] hover:bg-[#F4F6F4]'
          }`}
        >
          Personal Outlays
        </button>
      </div>

      {/* Expense Records Table */}
      <div className="rounded-xl border border-[#DDE3DD] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9F8] border-b border-[#DDE3DD] text-[#1F3A2E] font-extrabold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Ref #</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Tagged Project / Lead</th>
                <th className="py-3 px-4">Description & Vendor</th>
                <th className="py-3 px-4">Paid By</th>
                <th className="py-3 px-4">Reimbursable Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE3DD]">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-[#F4F6F4] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1F3A2E] text-xs whitespace-nowrap">
                    {exp.expenseNumber}
                    <div className="text-[10px] text-[#888] font-mono">{exp.date}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded shadow-xs ${
                      exp.companyCode === 'BIZMAN' ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' :
                      exp.companyCode === 'LINDA' ? 'bg-black text-white px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider' :
                      'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                    }`}>
                      {exp.companyCode === 'ARIELMC' ? 'ArielMC' : exp.companyCode === 'LINDA' ? 'Linda Resort' : exp.companyCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {exp.leadTitle ? (
                      <span className="inline-block max-w-xs truncate rounded-md bg-[#EEF2FF] border border-[#C7D2FE] px-2.5 py-1 text-xs font-bold text-[#4338CA] shadow-xs">
                        {exp.leadTitle}
                      </span>
                    ) : (
                      <span className="text-[#888] italic text-xs">General Project Overhead</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#1F3A2E]">
                    <div className="font-bold">{exp.description}</div>
                    <div className="text-[10px] text-[#6B7269] font-normal">
                      Vendor: <strong className="text-[#1A1A1A]">{exp.vendorRecipient}</strong>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                      exp.paidBy === 'MY_PERSONAL_FUNDS'
                        ? 'bg-[#FBF9F4] text-[#8C6D2D] border-[#C8A96A]/50'
                        : 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]'
                    }`}>
                      <Wallet className="h-3 w-3" />
                      <span>{exp.paidBy === 'MY_PERSONAL_FUNDS' ? 'Personal Pocket' : 'Entity Account'}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {exp.isReimbursable ? (
                      exp.reimbursementStatus === 'REIMBURSED' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] inline-flex items-center gap-1">
                          <Check className="h-3 w-3" /> Reimbursed to Me
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#FAF5FF] text-[#7E22CE] border border-[#D8B4FE] inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Entity Owed to Me
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] text-[#6B7269] font-medium">Non-Reimbursable</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-black text-rose-700 whitespace-nowrap text-sm">
                    -{exp.currency === 'USD' ? '$' : '৳'}{exp.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {exp.isReimbursable && exp.reimbursementStatus === 'PENDING_REIMBURSEMENT' ? (
                      <button
                        onClick={() => handleMarkReimbursed(exp.id)}
                        className="rounded-lg bg-[#DCFCE7] hover:bg-[#15803D] text-[#15803D] hover:text-white px-2.5 py-1 text-[10.5px] font-bold border border-[#86EFAC] transition-all shadow-xs"
                        title="Mark that the entity has reimbursed this expense to your personal funds"
                      >
                        Mark Reimbursed
                      </button>
                    ) : (
                      <span className="text-[10px] text-[#888]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#DDE3DD] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
              <h2 className="text-lg font-extrabold text-[#1F3A2E] flex items-center gap-2">
                <Receipt className="h-5 w-5 text-[#C8A96A]" />
                <span>Record Project Expense Outlay</span>
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#6B7269] hover:text-[#1A1A1A] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1F3A2E] font-extrabold block mb-1">Company Entity</label>
                  <select
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value as any)}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-[#1A1A1A] font-bold focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  >
                    <option value="ARIELMC">ArielMC (Export)</option>
                    <option value="BIZMAN">Bizman Media Limited (DOOH)</option>
                    <option value="LINDA">Linda Resort Limited (Eco-Resort)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#1F3A2E] font-extrabold block mb-1">Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 pr-12 text-[#1A1A1A] font-mono font-black focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                    />
                    <span className="absolute right-2 top-2 text-[#6B7269] font-mono font-bold">
                      {targetCompany === 'ARIELMC' ? 'USD' : 'BDT'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tag Project / Lead */}
              <div>
                <label className="text-[#1F3A2E] font-extrabold block mb-1">Tag Project / Lead *</label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-[#1A1A1A] font-bold focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                >
                  <option value="">General Project Overhead (Untagged)</option>
                  {INITIAL_LEADS.map((l) => (
                    <option key={l.id} value={l.id}>
                      [{l.companyCode}] {l.customerName} - {l.title.slice(0, 35)}...
                    </option>
                  ))}
                </select>
              </div>

              {/* Who Paid & Reimbursable Toggle */}
              <div className="rounded-xl border border-[#C8A96A] bg-[#FBF9F4] p-3 space-y-2.5">
                <div>
                  <label className="text-[#1F3A2E] font-black uppercase text-[10.5px] block mb-1">
                    Who Paid for this Expense?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => { setPaidBy('MY_PERSONAL_FUNDS'); setIsReimbursable(true); }}
                      className={`p-2 rounded-lg font-bold text-center border transition-all ${
                        paidBy === 'MY_PERSONAL_FUNDS'
                          ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow-xs'
                          : 'bg-white border-[#DDE3DD] text-[#6B7269]'
                      }`}
                    >
                      My Personal Funds (Out of Pocket)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPaidBy('ENTITY_DIRECT'); setIsReimbursable(false); }}
                      className={`p-2 rounded-lg font-bold text-center border transition-all ${
                        paidBy === 'ENTITY_DIRECT'
                          ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow-xs'
                          : 'bg-white border-[#DDE3DD] text-[#6B7269]'
                      }`}
                    >
                      Entity Direct Account
                    </button>
                  </div>
                </div>

                {paidBy === 'MY_PERSONAL_FUNDS' && (
                  <div className="flex items-center justify-between pt-1 border-t border-[#C8A96A]/30">
                    <div>
                      <div className="font-bold text-[#1F3A2E]">Should Entity Reimburse You?</div>
                      <div className="text-[10px] text-[#6B7269]">Entity pays back Syed Akramul Hassan upon settlement</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isReimbursable}
                        onChange={(e) => setIsReimbursable(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#15803D]"></div>
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[#1F3A2E] font-extrabold block mb-1">Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                >
                  <option value="VENDOR_BOARD_RENTAL">Vendor Board Rental (DOOH Screen Slots)</option>
                  <option value="CLIENT_ENTERTAINMENT_DINNER">Client Entertainment & Meeting Dinner</option>
                  <option value="TRAVEL_AND_CONVEYANCE">Conveyance, Fuel & Field Travel</option>
                  <option value="PRINTING_AND_STATIC_FLEX">Printing, Mounting & Fabrication</option>
                  <option value="PRODUCT_SAMPLE_DEV">Export Product Samples & DHL Courier</option>
                  <option value="EXPORT_FREIGHT_LOGISTICS">Freight, Port Handling & Forwarding</option>
                  <option value="OFFICE_AND_ADMIN">Project Office / Operational Overhead</option>
                </select>
              </div>

              <div>
                <label className="text-[#1F3A2E] font-extrabold block mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advance paid for client Ramadan dinner meeting at Westin"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                />
              </div>

              <div>
                <label className="text-[#1F3A2E] font-extrabold block mb-1">Recipient / Vendor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Westin Dhaka / Chittagong Media Vision"
                  value={vendorRecipient}
                  onChange={(e) => setVendorRecipient(e.target.value)}
                  className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DDE3DD]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-[#DDE3DD] px-4 py-2 text-[#6B7269] hover:bg-[#F4F6F4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] px-4 py-2 font-bold text-[#C8A96A] shadow-sm transition-all"
                >
                  Save Project Outlay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
