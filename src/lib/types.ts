export type CompanyCode = 'CONSOLIDATED' | 'BIZMAN' | 'ADPRO' | 'ARIELMC';

export interface CompanyMeta {
  code: CompanyCode;
  name: string;
  role: string;
  industry: string;
  currency: string;
  accentColor: string;
  stats: {
    label: string;
    value: string;
  }[];
}

export const COMPANIES: Record<CompanyCode, CompanyMeta> = {
  CONSOLIDATED: {
    code: 'CONSOLIDATED',
    name: 'Consolidated Master View',
    role: 'Group Executive Overview',
    industry: 'Media, Communications & Global Trade',
    currency: 'USD/BDT',
    accentColor: 'indigo',
    stats: [
      { label: 'Active Companies', value: '3 Entities' },
      { label: 'Consolidated Deals', value: '38 Active' },
      { label: 'Consolidated YTD Revenue', value: '৳ 4.82 Cr / $128K' },
    ],
  },
  BIZMAN: {
    code: 'BIZMAN',
    name: 'Bizman Media Limited',
    role: 'Director & CEO',
    industry: 'DOOH, LED Installation, Static Billboards, Events, Gifts & Activations',
    currency: 'BDT',
    accentColor: 'blue',
    stats: [
      { label: 'Own LED Boards', value: '20 Displays' },
      { label: 'Partner Vendor Boards', value: '50+ Countrywide' },
      { label: 'Active Campaigns', value: '14 Brands' },
    ],
  },
  ADPRO: {
    code: 'ADPRO',
    name: 'Adpro Communications Limited',
    role: 'General Manager',
    industry: 'DOOH Countrywide, LED Installation, Static Billboards, Gifts & Activations',
    currency: 'BDT',
    accentColor: 'orange',
    stats: [
      { label: 'Own LED Boards', value: '1 Premium Screen' },
      { label: 'Partner Vendor Boards', value: '70+ Nationwide' },
      { label: 'Active Activations', value: '9 Projects' },
    ],
  },
  ARIELMC: {
    code: 'ARIELMC',
    name: 'Ariel Marketing & Communications Limited',
    role: 'Managing Director',
    industry: 'Global B2B/B2C Export: UK, EU, Australia & US (Jute, Leather, Textiles, Ceramics)',
    currency: 'USD',
    accentColor: 'emerald',
    stats: [
      { label: 'Key Export Markets', value: 'UK, EU, AU, US' },
      { label: 'Active Export Shipments', value: '7 In Transit' },
      { label: 'Core Categories', value: 'Jute, Leather, Ceramics' },
    ],
  },
};

export type PipelineStage = 
  | 'NEW_INQUIRY'
  | 'CONTACTED'
  | 'MEETING_SCHEDULED'
  | 'PROPOSAL_SENT'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST';

export interface LeadItem {
  id: string;
  companyCode: 'BIZMAN' | 'ADPRO' | 'ARIELMC';
  title: string;
  customerName: string;
  contactPerson: string;
  phone: string;
  whatsapp: string;
  email: string;
  country: string;
  pipelineType: string;
  stage: PipelineStage;
  estimatedValue: number;
  currency: string;
  probability: number;
  expectedCloseDate: string;
  notepadMarkdown: string;
  specifics: Record<string, any>;
  createdAt: string;
}

export interface ExpenseItem {
  id: string;
  companyCode: 'BIZMAN' | 'ADPRO' | 'ARIELMC';
  expenseNumber: string;
  date: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  vendorRecipient: string;
  leadId?: string;
  leadTitle?: string;
  orderId?: string;
  paidFromAccount: string;
  expenseAccount: string;
  receiptUrl?: string;
  isVerified: boolean;
}

export interface JournalLineItem {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface JournalEntryItem {
  id: string;
  companyCode: 'BIZMAN' | 'ADPRO' | 'ARIELMC';
  entryNumber: string;
  date: string;
  description: string;
  reference: string;
  isPosted: boolean;
  lines: JournalLineItem[];
}

export interface AccountBalance {
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  classification: string;
  currency: string;
  balance: number;
}

// ------------------------------------------------------------------------------
// MASTER CONTACT DATABASE TYPES
// ------------------------------------------------------------------------------

export type ContactCategory = 
  | 'LEAD_PROSPECT'
  | 'BUYER_CLIENT'
  | 'SUPPLIER_RAW_MATERIAL'
  | 'VENDOR_BILLBOARD'
  | 'CO_WORKER'
  | 'FRIEND_FAMILY'
  | 'GOVERNMENT_REGULATOR';

export interface MasterContact {
  id: string;
  fullName: string;
  organization: string;
  designation: string;
  category: ContactCategory;
  primaryPhone: string;
  whatsappNumber: string;
  email: string;
  city: string;
  country: string;
  companyAffiliation: 'BIZMAN' | 'ADPRO' | 'ARIELMC' | 'PERSONAL' | 'GROUP';
  relationshipNotes: string;
  isConvertibleToLead: boolean;
  convertedLeadId?: string;
  tags: string[];
  createdAt: string;
}

// ------------------------------------------------------------------------------
// PERSONAL FINANCE TYPES
// ------------------------------------------------------------------------------

export type PersonalAccountType = 'BANK_SAVINGS' | 'BANK_CURRENT' | 'CREDIT_CARD' | 'MFS_BKASH_NAGAD' | 'DPS_SAVINGS_SCHEME' | 'FDR_TERM_DEPOSIT' | 'CASH_WALLET';

export interface PersonalAccount {
  id: string;
  accountName: string;
  institution: string;
  accountType: PersonalAccountType;
  currency: 'BDT' | 'USD';
  currentBalance: number;
  accountNumberMasked: string;
  isLiability?: boolean; // e.g. Credit Card balance due
}

export type PersonalTxCategory = 
  // Inflow (Income)
  | 'SALARY_BIZMAN'
  | 'SALARY_ADPRO'
  | 'DIRECTOR_DIVIDEND_ARIELMC'
  | 'CONSULTING_FEE'
  | 'INVESTMENT_INTEREST'
  // Outflow (Expenses)
  | 'HOUSING_RENT'
  | 'FAMILY_LIVING'
  | 'GROCERIES_FOOD'
  | 'CHILDREN_EDUCATION'
  | 'VEHICLE_FUEL_MAINTENANCE'
  | 'HEALTHCARE_MEDICAL'
  | 'ENTERTAINMENT_DINING'
  | 'PERSONAL_SAVINGS_DPS'
  | 'UTILITIES_BILLS';

export interface PersonalTransaction {
  id: string;
  date: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  currency: 'BDT' | 'USD';
  category: PersonalTxCategory;
  description: string;
  accountId: string;
  accountName: string;
  notes?: string;
}


