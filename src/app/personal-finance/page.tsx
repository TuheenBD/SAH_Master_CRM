'use client';

import React, { useState } from 'react';
import { 
  Wallet, 
  CreditCard, 
  Landmark, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  PieChart, 
  DollarSign,
  Calendar,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { PersonalAccount, PersonalTransaction } from '@/lib/types';
import { INITIAL_PERSONAL_ACCOUNTS, INITIAL_PERSONAL_TRANSACTIONS } from '@/lib/mock-data';

export default function PersonalFinancePage() {
  const [accounts, setAccounts] = useState<PersonalAccount[]>(INITIAL_PERSONAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<PersonalTransaction[]>(INITIAL_PERSONAL_TRANSACTIONS);
  const [showModal, setShowModal] = useState<boolean>(false);

  // New Transaction Form State
  const [txType, setTxType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('GROCERIES_FOOD');
  const [description, setDescription] = useState<string>('');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(INITIAL_PERSONAL_ACCOUNTS[0]?.id || '');

  // Calculate Net Worth:
  // Liquid Assets (Savings, Current, MFS, USD)
  const liquidBDT = accounts
    .filter(a => !a.isLiability && a.currency === 'BDT' && a.accountType !== 'FDR_TERM_DEPOSIT' && a.accountType !== 'DPS_SAVINGS_SCHEME')
    .reduce((sum, a) => sum + a.currentBalance, 0);

  const termDepositsBDT = accounts
    .filter(a => !a.isLiability && (a.accountType === 'FDR_TERM_DEPOSIT' || a.accountType === 'DPS_SAVINGS_SCHEME'))
    .reduce((sum, a) => sum + a.currentBalance, 0);

  const foreignUSD = accounts
    .filter(a => !a.isLiability && a.currency === 'USD')
    .reduce((sum, a) => sum + a.currentBalance, 0);

  const liabilitiesBDT = accounts
    .filter(a => a.isLiability)
    .reduce((sum, a) => sum + a.currentBalance, 0);

  // Exchange rate assumption for Net Worth: 1 USD = 120 BDT
  const totalNetWorthBDT = (liquidBDT + termDepositsBDT + (foreignUSD * 120)) - liabilitiesBDT;

  // Monthly Cash Flow
  const monthlyInflowBDT = transactions
    .filter(t => t.type === 'INCOME' && t.currency === 'BDT')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyInflowUSD = transactions
    .filter(t => t.type === 'INCOME' && t.currency === 'USD')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyOutflowBDT = transactions
    .filter(t => t.type === 'EXPENSE' && t.currency === 'BDT')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const matchedAccount = accounts.find(a => a.id === selectedAccountId);

    const newTx: PersonalTransaction = {
      id: `ptx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: txType,
      amount: parseFloat(amount),
      currency: matchedAccount?.currency || 'BDT',
      category: category as any,
      description,
      accountId: selectedAccountId,
      accountName: matchedAccount?.accountName || 'Personal Account',
    };

    setTransactions([newTx, ...transactions]);

    // Update account balance
    setAccounts(prev => prev.map(a => {
      if (a.id === selectedAccountId) {
        const delta = txType === 'INCOME' ? parseFloat(amount) : -parseFloat(amount);
        return { ...a, currentBalance: a.currentBalance + delta };
      }
      return a;
    }));

    setShowModal(false);
    setAmount('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <Lock className="h-4 w-4" />
            <span>Personal & Private Financial Vault</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-white">
            Personal Bank & Finance Management
          </h1>
          <p className="text-xs text-slate-400">
            Completely separated from corporate books: Track your personal bank accounts, salaries, DPS/FDR investments, and household living expenses
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Log Personal Transaction</span>
        </button>
      </div>

      {/* Net Worth & Cash Flow Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Net Worth - Royal Executive Green & Gold */}
        <div className="rounded-xl border border-[#2C5240] bg-[#1F3A2E] p-5 shadow-md relative overflow-hidden text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#C8A96A] uppercase tracking-wider">Total Personal Net Worth</span>
            <div className="rounded-lg bg-black/20 p-2 text-[#C8A96A] border border-[#C8A96A]/30">
              <Landmark className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-white font-mono">
            ৳ {totalNetWorthBDT.toLocaleString()}
          </div>
          <div className="mt-1.5 text-xs text-white/80">
            Includes <strong className="text-[#C8A96A]">${foreignUSD.toLocaleString()} USD</strong> offshore savings
          </div>
        </div>

        {/* Liquid Savings & Cash */}
        <div className="rounded-xl border border-[#DDE3DD] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#556055] uppercase tracking-wider">Liquid Cash & Bank Balances</span>
            <div className="rounded-lg bg-[#E8F0FA] p-2 text-[#1F5FA8]">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xl font-black text-[#1F3A2E] font-mono">
            ৳ {liquidBDT.toLocaleString()}
          </div>
          <div className="mt-1.5 text-xs text-[#1E6B3A] font-bold">
            Ready emergency liquidity (EBL, City, bKash)
          </div>
        </div>

        {/* Term Deposits / DPS / FDR */}
        <div className="rounded-xl border border-[#DDE3DD] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#556055] uppercase tracking-wider">FDR & Millionaire DPS</span>
            <div className="rounded-lg bg-[#FFF3D6] p-2 text-[#8A5A00]">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xl font-black text-[#1F3A2E] font-mono">
            ৳ {termDepositsBDT.toLocaleString()}
          </div>
          <div className="mt-1.5 text-xs text-[#8A5A00] font-semibold">
            IDLC FDR (৳3.5M) + BRAC Bank DPS (৳1.25M)
          </div>
        </div>

        {/* Monthly Net Savings Ratio */}
        <div className="rounded-xl border border-[#DDE3DD] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#556055] uppercase tracking-wider">Monthly Personal Surplus</span>
            <div className="rounded-lg bg-[#E4F3E9] p-2 text-[#1E6B3A]">
              <PieChart className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xl font-black text-[#1E6B3A] font-mono">
            +৳ {(monthlyInflowBDT - monthlyOutflowBDT).toLocaleString()}
          </div>
          <div className="mt-1.5 text-xs text-[#6B7269] font-medium">
            Plus <strong className="text-[#1F3A2E]">+${monthlyInflowUSD.toLocaleString()} USD</strong> ArielMC dividends
          </div>
        </div>
      </div>

      {/* Main Grid: Personal Bank Accounts & Recent Cash Inflow/Outflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Bank Accounts, DPS, FDR & Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-sm font-extrabold text-[#1F3A2E] flex items-center justify-between px-1">
            <span>Your Personal Accounts & Cards</span>
            <span className="text-xs text-[#556055] font-mono font-bold">{accounts.length} Accounts</span>
          </h2>

          <div className="space-y-2.5">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="rounded-xl border border-[#DDE3DD] bg-white p-4 space-y-2.5 hover:border-[#1F3A2E] transition-all shadow-xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#1F3A2E] flex items-center gap-1.5">
                    {acc.isLiability ? (
                      <CreditCard className="h-4 w-4 text-rose-600" />
                    ) : (
                      <Landmark className="h-4 w-4 text-[#1F3A2E]" />
                    )}
                    <span>{acc.institution}</span>
                  </span>
                  <span className="text-[10px] text-[#6B7269] font-mono font-semibold">{acc.accountNumberMasked}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-[#1A1A1A] font-semibold">{acc.accountName}</div>
                  <div className={`font-mono font-black text-sm ${acc.isLiability ? 'text-rose-600' : 'text-[#1E6B3A]'}`}>
                    {acc.isLiability && '-'}
                    {acc.currency === 'USD' ? '$' : '৳'}{acc.currentBalance.toLocaleString()}
                  </div>
                </div>

                <div className="text-[11px] text-[#556055] flex items-center justify-between pt-2 border-t border-[#DDE3DD]">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold font-mono shadow-xs ${
                    acc.accountType === 'BANK_SAVINGS' || acc.accountType === 'BANK_CURRENT' 
                      ? 'bg-[#E8F0FA] text-[#1F5FA8] border border-[#BBD5F2]' :
                    acc.accountType === 'FDR_TERM_DEPOSIT' || acc.accountType === 'DPS_SAVINGS_SCHEME'
                      ? 'bg-[#FFF3D6] text-[#8A5A00] border border-[#FBE0A8]' :
                    acc.accountType === 'CREDIT_CARD'
                      ? 'bg-[#FEE8E8] text-[#C5221F] border border-[#F8B4B4]' :
                      'bg-[#F4F6F4] text-[#1F3A2E] border border-[#DDE3DD]'
                  }`}>
                    {acc.accountType.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[#6B7269] font-semibold">
                    {acc.isLiability ? 'Current Due' : 'Available Balance'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Personal Transactions Feed (7 Cols) */}
        <div className="lg:col-span-7 rounded-xl border border-[#DDE3DD] bg-white p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-[#1F3A2E]">Recent Personal Cash Flow Ledger</h2>
              <div className="text-xs text-[#556055]">Income (Salaries, Dividends) & Household Living Expenses</div>
            </div>
            <span className="text-xs text-[#6B7269] font-mono font-bold">October 2026</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="rounded-xl border border-[#DDE3DD] bg-[#F8F9F8] p-3 text-xs flex items-center justify-between gap-3 hover:bg-[#F4F6F4] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === 'INCOME' ? 'bg-[#E4F3E9] text-[#1E6B3A] border border-[#B6E2C5]' : 'bg-[#FEE8E8] text-[#C5221F] border border-[#F8B4B4]'
                  }`}>
                    {tx.type === 'INCOME' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  </div>

                  <div>
                    <div className="font-extrabold text-[#1A1A1A]">{tx.description}</div>
                    <div className="text-[11px] text-[#556055] mt-0.5 font-medium">
                      {tx.accountName} &bull; <span className="font-mono font-bold">{tx.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`font-mono font-black text-sm ${tx.type === 'INCOME' ? 'text-[#1E6B3A]' : 'text-rose-600'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}
                    {tx.currency === 'USD' ? '$' : '৳'}{tx.amount.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-[#556055] font-mono font-bold">{tx.category.replace(/_/g, ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Record Personal Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-400" />
                <span>Log Personal Inflow / Outflow</span>
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTx} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setTxType('EXPENSE')}
                  className={`py-1.5 rounded-md font-semibold text-xs transition-colors ${
                    txType === 'EXPENSE' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Personal Expense
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('INCOME')}
                  className={`py-1.5 rounded-md font-semibold text-xs transition-colors ${
                    txType === 'INCOME' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Personal Income
                </button>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target Personal Account</label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.institution} - {a.accountName} ({a.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Amount</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {txType === 'INCOME' ? (
                    <>
                      <option value="SALARY_BIZMAN">Bizman Media Executive Salary</option>
                      <option value="SALARY_LINDA_RESORT">Linda Resort Executive Director Compensation</option>
                      <option value="DIRECTOR_DIVIDEND_ARIELMC">ArielMC Export Dividend</option>
                      <option value="CONSULTING_FEE">Media / Sourcing Advisory Fee</option>
                      <option value="INVESTMENT_INTEREST">DPS / FDR Interest Accrued</option>
                    </>
                  ) : (
                    <>
                      <option value="HOUSING_RENT">Apartment Rent & Maintenance</option>
                      <option value="GROCERIES_FOOD">Groceries & Household Essentials</option>
                      <option value="FAMILY_LIVING">Family Allowance & Living Costs</option>
                      <option value="VEHICLE_FUEL_MAINTENANCE">Prado Fuel & Driver Salary</option>
                      <option value="CHILDREN_EDUCATION">Children Schooling / Tuition</option>
                      <option value="PERSONAL_SAVINGS_DPS">Monthly DPS Scheme Deposit</option>
                      <option value="HEALTHCARE_MEDICAL">Personal Healthcare & Pharmacy</option>
                      <option value="ENTERTAINMENT_DINING">Dining Out & Entertainment</option>
                      <option value="UTILITIES_BILLS">Electricity, Internet & Utilities</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly grocery purchase at Unimart"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 font-semibold text-white hover:bg-emerald-500 shadow"
                >
                  Record Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

