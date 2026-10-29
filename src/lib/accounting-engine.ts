import { CompanyCode, AccountBalance } from './types';
import { FINANCIAL_BALANCES } from './mock-data';

export interface PLStatement {
  company: CompanyCode;
  currency: string;
  totalRevenue: number;
  revenueLines: { code: string; name: string; amount: number }[];
  cogsTotal: number;
  cogsLines: { code: string; name: string; amount: number }[];
  grossProfit: number;
  grossMarginPercent: number;
  operatingExpensesTotal: number;
  operatingExpenseLines: { code: string; name: string; amount: number }[];
  netProfit: number;
  netMarginPercent: number;
}

export interface BalanceSheetStatement {
  company: CompanyCode;
  currency: string;
  totalAssets: number;
  assetLines: { code: string; name: string; amount: number; classification: string }[];
  totalLiabilities: number;
  liabilityLines: { code: string; name: string; amount: number; classification: string }[];
  totalEquity: number;
  equityLines: { code: string; name: string; amount: number; classification: string }[];
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
}

export function generatePLStatement(company: 'BIZMAN' | 'ADPRO' | 'ARIELMC'): PLStatement {
  const accounts = FINANCIAL_BALANCES[company] || [];

  const revenueAccounts = accounts.filter(a => a.type === 'REVENUE');
  const totalRevenue = revenueAccounts.reduce((acc, curr) => acc + curr.balance, 0);

  const cogsAccounts = accounts.filter(a => 
    a.type === 'EXPENSE' && (
      a.classification.startsWith('COST_OF_GOODS_SOLD')
    )
  );
  const cogsTotal = cogsAccounts.reduce((acc, curr) => acc + curr.balance, 0);

  const grossProfit = totalRevenue - cogsTotal;
  const grossMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  const operatingAccounts = accounts.filter(a => 
    a.type === 'EXPENSE' && !a.classification.startsWith('COST_OF_GOODS_SOLD')
  );
  const operatingExpensesTotal = operatingAccounts.reduce((acc, curr) => acc + curr.balance, 0);

  const netProfit = grossProfit - operatingExpensesTotal;
  const netMarginPercent = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  return {
    company,
    currency: accounts[0]?.currency || 'BDT',
    totalRevenue,
    revenueLines: revenueAccounts.map(a => ({ code: a.code, name: a.name, amount: a.balance })),
    cogsTotal,
    cogsLines: cogsAccounts.map(a => ({ code: a.code, name: a.name, amount: a.balance })),
    grossProfit,
    grossMarginPercent,
    operatingExpensesTotal,
    operatingExpenseLines: operatingAccounts.map(a => ({ code: a.code, name: a.name, amount: a.balance })),
    netProfit,
    netMarginPercent,
  };
}

export function generateBalanceSheet(company: 'BIZMAN' | 'ADPRO' | 'ARIELMC'): BalanceSheetStatement {
  const accounts = FINANCIAL_BALANCES[company] || [];

  const assetAccounts = accounts.filter(a => a.type === 'ASSET');
  const totalAssets = assetAccounts.reduce((acc, curr) => acc + curr.balance, 0);

  const liabilityAccounts = accounts.filter(a => a.type === 'LIABILITY');
  const totalLiabilities = liabilityAccounts.reduce((acc, curr) => acc + curr.balance, 0);

  const equityAccounts = accounts.filter(a => a.type === 'EQUITY');
  const totalEquity = equityAccounts.reduce((acc, curr) => acc + curr.balance, 0);

  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
  const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 1;

  return {
    company,
    currency: accounts[0]?.currency || 'BDT',
    totalAssets,
    assetLines: assetAccounts.map(a => ({ code: a.code, name: a.name, amount: a.balance, classification: a.classification })),
    totalLiabilities,
    liabilityLines: liabilityAccounts.map(a => ({ code: a.code, name: a.name, amount: a.balance, classification: a.classification })),
    totalEquity,
    equityLines: equityAccounts.map(a => ({ code: a.code, name: a.name, amount: a.balance, classification: a.classification })),
    totalLiabilitiesAndEquity,
    isBalanced,
  };
}

export function validateJournalEntry(lines: { debit: number; credit: number }[]): { isValid: boolean; totalDebit: number; totalCredit: number; diff: number } {
  const totalDebit = lines.reduce((acc, l) => acc + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((acc, l) => acc + (Number(l.credit) || 0), 0);
  const diff = Math.abs(totalDebit - totalCredit);
  return {
    isValid: diff < 0.01,
    totalDebit,
    totalCredit,
    diff,
  };
}

