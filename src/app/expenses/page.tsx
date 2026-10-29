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
  AlertCircle
} from 'lucide-react';
import { CompanyCode, ExpenseItem } from '@/lib/types';
import { INITIAL_EXPENSES, INITIAL_LEADS } from '@/lib/mock-data';

export default function ExpensesPage() {
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';

  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [targetCompany, setTargetCompany] = useState<'BIZMAN' | 'ADPRO' | 'ARIELMC'>(
    activeCompany === 'CONSOLIDATED' ? 'BIZMAN' : activeCompany
  );
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('BDT');
  const [category, setCategory] = useState<string>('VENDOR_BOARD_RENTAL');
  const [description, setDescription] = useState<string>('');
  const [vendorRecipient, setVendorRecipient] = useState<string>('');
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [paidFromAccount, setPaidFromAccount] = useState<string>('1020 - Corporate Bank A/C');
  const [expenseAccount, setExpenseAccount] = useState<string>('5010 - Vendor Billboard Rental Cost');

  // Filter based on company
  const filteredExpenses = activeCompany === 'CONSOLIDATED'
    ? expenses
    : expenses.filter(e => e.companyCode === activeCompany);

  const totalExpenseBDT = filteredExpenses
    .filter(e => e.currency === 'BDT')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenseUSD = filteredExpenses
    .filter(e => e.currency === 'USD')
    .reduce((sum, e) => sum + e.amount, 0);

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
      paidFromAccount,
      expenseAccount,
      isVerified: true,
    };

    setExpenses([newExpense, ...expenses]);
    setShowModal(false);
    // Reset
    setAmount('');
    setDescription('');
    setVendorRecipient('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400">
            <Receipt className="h-4 w-4" />
            <span>Operational & Deal-Wise Expense Ledger</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-white">
            Daily Expenses & Deal Margins
          </h1>
          <p className="text-xs text-slate-400">
            Every transaction is mapped to a Company, tagged to a Lead/Order, and posted to the General Ledger
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-semibold shadow-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Record Daily Expense</span>
        </button>
      </div>

      {/* Aggregate Expense Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Filtered BDT Expenses</div>
          <div className="mt-1 text-xl font-bold text-white font-mono">৳ {totalExpenseBDT.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Vendor board payouts, client hospitality & operations</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Filtered USD Expenses</div>
          <div className="mt-1 text-xl font-bold text-white font-mono">${totalExpenseUSD.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Export samples, international couriers & freight</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Dual-Entry Compliance</div>
          <div className="mt-1 flex items-center gap-1.5 text-sm font-bold text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>100% Balanced with Chart of Accounts</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Debit Expense Account = Credit Cash/Bank Asset</div>
        </div>
      </div>

      {/* Expense Records Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Ref #</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Tagged Deal / Order</th>
                <th className="py-3 px-4">Debit / Credit Accounts</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                    {exp.expenseNumber}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      exp.companyCode === 'BIZMAN' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                      exp.companyCode === 'ADPRO' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                      'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {exp.companyCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                    {exp.date}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-200">
                    <div>{exp.description}</div>
                    <div className="text-[10px] text-slate-500 font-normal">Paid to: {exp.vendorRecipient}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {exp.leadTitle ? (
                      <span className="inline-block max-w-xs truncate rounded bg-indigo-950/60 border border-indigo-900/60 px-2 py-0.5 text-[11px] text-indigo-300">
                        {exp.leadTitle}
                      </span>
                    ) : (
                      <span className="text-slate-600 italic">General Overhead</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-slate-400 font-mono">
                    <div>Dr: {exp.expenseAccount}</div>
                    <div className="text-slate-500">Cr: {exp.paidFromAccount}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-400 whitespace-nowrap">
                    -{exp.currency === 'USD' ? '$' : '৳'}{exp.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Receipt className="h-5 w-5 text-indigo-400" />
                <span>Record Daily Expense</span>
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Company Entity</label>
                  <select
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="BIZMAN">Bizman Media Limited</option>
                    <option value="ADPRO">Adpro Communications Limited</option>
                    <option value="ARIELMC">Ariel Marketing & Communications</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 pr-12 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                    />
                    <span className="absolute right-2 top-2 text-slate-500 font-mono">
                      {targetCompany === 'ARIELMC' ? 'USD' : 'BDT'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="VENDOR_BOARD_RENTAL">Vendor Board Rental (50+/70+ DOOH network)</option>
                  <option value="PRINTING_AND_STATIC_FLEX">Printing, Mounting & Flex Fabrication</option>
                  <option value="CLIENT_ENTERTAINMENT_DINNER">Client Entertainment & Meeting Dinner</option>
                  <option value="TRAVEL_AND_CONVEYANCE">Conveyance, Fuel & Field Travel</option>
                  <option value="EXPORT_FREIGHT_LOGISTICS">Export Freight & Port Handling</option>
                  <option value="PRODUCT_SAMPLE_DEV">Product Sample Development & Courier</option>
                  <option value="EQUIPMENT_REPAIR_LED">LED Screen Module Repair & Electricity</option>
                  <option value="OFFICE_AND_ADMIN">Office Administration & Overhead</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Expense Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paid Chittagong vendor for 4x LED screens Ramadan slots"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Recipient / Vendor Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Chittagong Media Vision"
                    value={vendorRecipient}
                    onChange={(e) => setVendorRecipient(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Tag Active Lead / Order</label>
                  <select
                    value={selectedLeadId}
                    onChange={(e) => setSelectedLeadId(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">General Overhead (No Tag)</option>
                    {INITIAL_LEADS.map((l) => (
                      <option key={l.id} value={l.id}>
                        [{l.companyCode}] {l.customerName} - {l.title.slice(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dual Entry Auto-Posting Preview Box */}
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-[11px] space-y-1">
                <div className="text-indigo-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Dual-Entry Ledger Posting Preview:</span>
                </div>
                <div className="text-slate-300 font-mono">
                  Dr: 5000-series (Expense Account) &bull; Cr: 1020 (Bank/Cash Account)
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 shadow-md transition-colors"
                >
                  Save & Post to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
