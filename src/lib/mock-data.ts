import { 
  LeadItem, 
  CompanyLead,
  ExpenseItem, 
  JournalEntryItem, 
  AccountBalance,
  MasterContact,
  PersonalAccount,
  PersonalTransaction,
  DocumentRecord
} from './types';

// ==============================================================================
// MASTER CRM — CLEAN REPOSITORY (READY FOR REAL OPERATIONAL DATA)
// Backup of previous demo data is preserved at: src/lib/mock-data.demo-backup.ts
// ==============================================================================

// 1. ACTIVE DEALS & PIPELINES (CLEANED)
export const INITIAL_LEADS: LeadItem[] = [];

// 2. CORPORATE ACCOUNT ROSTER (CLEANED)
export const INITIAL_COMPANY_LEADS: CompanyLead[] = [];

// 3. PROJECT & DEAL EXPENSES (CLEANED)
export const INITIAL_EXPENSES: ExpenseItem[] = [];

// 4. GENERAL LEDGER JOURNAL ENTRIES (CLEANED)
export const INITIAL_JOURNAL_ENTRIES: JournalEntryItem[] = [];

// 5. OFFICIAL CHART OF ACCOUNTS (RESET TO ZERO STARTING BALANCES)
export const FINANCIAL_BALANCES: Record<'BIZMAN' | 'LINDA' | 'ARIELMC', AccountBalance[]> = {
  BIZMAN: [
    // Assets
    { code: '1010', name: 'Petty Cash in Office Safe', type: 'ASSET', classification: 'CASH_AND_BANK', currency: 'BDT', balance: 0 },
    { code: '1020', name: 'Dutch-Bangla Bank Corporate A/C', type: 'ASSET', classification: 'CASH_AND_BANK', currency: 'BDT', balance: 0 },
    { code: '1200', name: 'Accounts Receivable (Clients)', type: 'ASSET', classification: 'ACCOUNTS_RECEIVABLE', currency: 'BDT', balance: 0 },
    { code: '1500', name: '20 Own High-Res LED Displays & Unipoles', type: 'ASSET', classification: 'FIXED_ASSET_EQUIPMENT', currency: 'BDT', balance: 0 },
    // Liabilities
    { code: '2010', name: 'Accounts Payable (50+ Vendor Boards)', type: 'LIABILITY', classification: 'ACCOUNTS_PAYABLE', currency: 'BDT', balance: 0 },
    { code: '2100', name: 'VAT & AIT Withholding Payable', type: 'LIABILITY', classification: 'TAXES_PAYABLE', currency: 'BDT', balance: 0 },
    // Equity
    { code: '3010', name: "Owner's Paid-up Capital", type: 'EQUITY', classification: 'OWNER_CAPITAL', currency: 'BDT', balance: 0 },
    { code: '3020', name: 'Accumulated Retained Earnings', type: 'EQUITY', classification: 'RETAINED_EARNINGS', currency: 'BDT', balance: 0 },
    // Revenue
    { code: '4010', name: 'DOOH Media Advertising Revenue', type: 'REVENUE', classification: 'DOOH_MEDIA_REVENUE', currency: 'BDT', balance: 0 },
    { code: '4020', name: 'Event Management & Activations Revenue', type: 'REVENUE', classification: 'EVENT_ACTIVATION_REVENUE', currency: 'BDT', balance: 0 },
    // Expenses
    { code: '5010', name: 'Vendor Billboard Rental Wholesale Cost', type: 'EXPENSE', classification: 'COST_OF_GOODS_SOLD_VENDOR_BOARDS', currency: 'BDT', balance: 0 },
    { code: '5020', name: 'Production, Mounting & Flex Printing', type: 'EXPENSE', classification: 'COST_OF_GOODS_SOLD_MATERIALS', currency: 'BDT', balance: 0 },
    { code: '6010', name: 'Client Entertainment & Meeting Dinners', type: 'EXPENSE', classification: 'MARKETING_ENTERTAINMENT', currency: 'BDT', balance: 0 },
    { code: '6020', name: 'Conveyance, Fuel & Field Inspections', type: 'EXPENSE', classification: 'MARKETING_ENTERTAINMENT', currency: 'BDT', balance: 0 },
    { code: '6030', name: 'Staff Salaries & Field Engineers', type: 'EXPENSE', classification: 'SALARIES_AND_WAGES', currency: 'BDT', balance: 0 },
    { code: '6040', name: 'Office Rent & High-Speed Optical Fiber', type: 'EXPENSE', classification: 'OFFICE_RENT_UTILITIES', currency: 'BDT', balance: 0 },
  ],
  LINDA: [
    // Assets
    { code: '1010', name: 'Front Desk Cash & Petty Vault', type: 'ASSET', classification: 'CASH_AND_BANK', currency: 'BDT', balance: 0 },
    { code: '1020', name: 'Brac Bank Corporate Resort Operations A/C', type: 'ASSET', classification: 'CASH_AND_BANK', currency: 'BDT', balance: 0 },
    { code: '1200', name: 'Accounts Receivable (Corporate Retreats & Banquets)', type: 'ASSET', classification: 'ACCOUNTS_RECEIVABLE', currency: 'BDT', balance: 0 },
    { code: '1500', name: 'Resort Land, Private Pool Villas & Eco-Cottages', type: 'ASSET', classification: 'FIXED_ASSET_EQUIPMENT', currency: 'BDT', balance: 0 },
    // Liabilities
    { code: '2010', name: 'Accounts Payable (Architects, Landscape & F&B Vendors)', type: 'LIABILITY', classification: 'ACCOUNTS_PAYABLE', currency: 'BDT', balance: 0 },
    { code: '2100', name: 'Government VAT & Tourism Tax Payable', type: 'LIABILITY', classification: 'TAXES_PAYABLE', currency: 'BDT', balance: 0 },
    // Equity
    { code: '3010', name: "Sponsor Directors & Investor Timeshare Equity", type: 'EQUITY', classification: 'OWNER_CAPITAL', currency: 'BDT', balance: 0 },
    { code: '3020', name: 'Accumulated Retained Operating Surplus', type: 'EQUITY', classification: 'RETAINED_EARNINGS', currency: 'BDT', balance: 0 },
    // Revenue
    { code: '4010', name: 'Private Pool Villa & Cottage Accommodation Revenue', type: 'REVENUE', classification: 'DOOH_MEDIA_REVENUE', currency: 'BDT', balance: 0 },
    { code: '4020', name: 'Corporate Retreats, Banquets & Organic Dining', type: 'REVENUE', classification: 'EVENT_ACTIVATION_REVENUE', currency: 'BDT', balance: 0 },
    // Expenses
    { code: '5010', name: 'Resort Operations, Housekeeping & Pool Maintenance', type: 'EXPENSE', classification: 'COST_OF_GOODS_SOLD_VENDOR_BOARDS', currency: 'BDT', balance: 0 },
    { code: '5020', name: 'F&B Direct Supplies, Organic Sourcing & Kitchen Provisions', type: 'EXPENSE', classification: 'COST_OF_GOODS_SOLD_MATERIALS', currency: 'BDT', balance: 0 },
    { code: '6010', name: 'Digital Guest Acquisition & Timeshare Marketing', type: 'EXPENSE', classification: 'MARKETING_ENTERTAINMENT', currency: 'BDT', balance: 0 },
    { code: '6030', name: 'Resort Staff, Chefs, Life-Guards & Hospitality Team', type: 'EXPENSE', classification: 'SALARIES_AND_WAGES', currency: 'BDT', balance: 0 },
    { code: '6040', name: 'Property Landscaping, Solar Utilities & Optical Fiber', type: 'EXPENSE', classification: 'OFFICE_RENT_UTILITIES', currency: 'BDT', balance: 0 },
  ],
  ARIELMC: [
    // Assets (Denominated in USD)
    { code: '1010', name: 'Petty Cash BDT (Converted Equiv)', type: 'ASSET', classification: 'CASH_AND_BANK', currency: 'USD', balance: 0 },
    { code: '1020', name: 'HSBC Corporate International USD A/C', type: 'ASSET', classification: 'CASH_AND_BANK', currency: 'USD', balance: 0 },
    { code: '1200', name: 'Accounts Receivable (UK, EU, US Importers)', type: 'ASSET', classification: 'ACCOUNTS_RECEIVABLE', currency: 'USD', balance: 0 },
    { code: '1300', name: 'Warehousing & Export Inventory (Jute, Leather, Ceramics)', type: 'ASSET', classification: 'INVENTORY_ASSET', currency: 'USD', balance: 0 },
    // Liabilities
    { code: '2010', name: 'Accounts Payable (Artisans & Ceramic Factories)', type: 'LIABILITY', classification: 'ACCOUNTS_PAYABLE', currency: 'USD', balance: 0 },
    { code: '2200', name: 'Freight Forwarding & Shipping Line Due', type: 'LIABILITY', classification: 'ACCRUED_EXPENSES', currency: 'USD', balance: 0 },
    // Equity
    { code: '3010', name: "Founder's Trade Capital", type: 'EQUITY', classification: 'OWNER_CAPITAL', currency: 'USD', balance: 0 },
    { code: '3020', name: 'Export Retained Surplus', type: 'EQUITY', classification: 'RETAINED_EARNINGS', currency: 'USD', balance: 0 },
    // Revenue
    { code: '4010', name: 'Export Sales: UK, EU, US, Australia', type: 'REVENUE', classification: 'EXPORT_SALES_REVENUE', currency: 'USD', balance: 0 },
    // Expenses
    { code: '5010', name: 'Raw Material Procurement (Jute, Leather, Clay)', type: 'EXPENSE', classification: 'COST_OF_GOODS_SOLD_MATERIALS', currency: 'USD', balance: 0 },
    { code: '5020', name: 'International Sea Freight & Port Handling', type: 'EXPENSE', classification: 'COST_OF_GOODS_SOLD_FREIGHT', currency: 'USD', balance: 0 },
    { code: '6010', name: 'International Trade Exhibitions & Samples', type: 'EXPENSE', classification: 'MARKETING_ENTERTAINMENT', currency: 'USD', balance: 0 },
    { code: '6030', name: 'QA Inspectors & Sourcing Team', type: 'EXPENSE', classification: 'SALARIES_AND_WAGES', currency: 'USD', balance: 0 },
    { code: '6040', name: 'Certifications (SEDEX, REACH, EU Food Contact)', type: 'EXPENSE', classification: 'OFFICE_RENT_UTILITIES', currency: 'USD', balance: 0 },
  ],
};

// 6. MASTER ROLODEX CONTACTS (CLEANED)
export const INITIAL_CONTACTS: MasterContact[] = [];

// 7. PERSONAL BANKING & WALLET ACCOUNTS (BALANCES AT 0.00)
export const INITIAL_PERSONAL_ACCOUNTS: PersonalAccount[] = [
  {
    id: 'pacc-1',
    accountName: 'EBL Priority Banking Savings A/C',
    institution: 'Eastern Bank Limited',
    accountType: 'BANK_SAVINGS',
    currency: 'BDT',
    currentBalance: 0,
    accountNumberMasked: '108-***-***452',
  },
  {
    id: 'pacc-2',
    accountName: 'City Bank Personal Operating A/C',
    institution: 'City Bank PLC',
    accountType: 'BANK_CURRENT',
    currency: 'BDT',
    currentBalance: 0,
    accountNumberMasked: '110-***-***981',
  },
  {
    id: 'pacc-3',
    accountName: 'HSBC Premier International USD Account',
    institution: 'HSBC International',
    accountType: 'BANK_SAVINGS',
    currency: 'USD',
    currentBalance: 0,
    accountNumberMasked: '840-***-***104',
  },
  {
    id: 'pacc-4',
    accountName: 'Personal bKash Wallet',
    institution: 'bKash / BRAC Bank',
    accountType: 'MFS_BKASH_NAGAD',
    currency: 'BDT',
    currentBalance: 0,
    accountNumberMasked: '+8801711***233',
  },
];

// 8. PERSONAL INFLOW / OUTFLOW TRANSACTIONS (CLEANED)
export const INITIAL_PERSONAL_TRANSACTIONS: PersonalTransaction[] = [];

// 9. DOCUMENT CENTER VAULT (CLEANED)
export const INITIAL_DOCUMENTS: DocumentRecord[] = [];
