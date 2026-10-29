export type CompanyCode = 'CONSOLIDATED' | 'BIZMAN' | 'LINDA' | 'ARIELMC';

export interface CompanyMeta {
  code: CompanyCode;
  name: string;
  role: string;
  industry: string;
  website: string;
  currency: string;
  paletteDescription: string;
  logoUrl?: string;
  stats: {
    label: string;
    value: string;
  }[];
}

export const COMPANIES: Record<CompanyCode, CompanyMeta> = {
  CONSOLIDATED: {
    code: 'CONSOLIDATED',
    name: 'Consolidated Executive Master View',
    role: 'Group Executive Overview',
    industry: 'Media DOOH, Luxury Eco-Resort Hospitality & Global Export Trade',
    website: 'Executive OS',
    currency: 'USD/BDT',
    paletteDescription: 'Royal Green, Bottle Green, Imperial Gold & Ivory White',
    logoUrl: '/logos/arielmc-logo.png',
    stats: [
      { label: 'Operating Entities', value: '3 Companies' },
      { label: 'Consolidated Active Deals', value: '42 Deals' },
      { label: 'Consolidated YTD Revenue', value: '৳ 5.40 Cr / $198K' },
    ],
  },
  BIZMAN: {
    code: 'BIZMAN',
    name: 'Bizman Media Limited',
    role: 'Director & CEO',
    industry: 'DOOH Countrywide (20 Own LED, 50+ Vendor), Static Billboards, Events & Activations',
    website: 'www.bizmanbd.com',
    currency: 'BDT',
    paletteDescription: 'Bottle Green (#1F3A2E), Imperial Gold (#C8A96A) & Ivory White',
    logoUrl: '/logos/bizman-logo.jpg',
    stats: [
      { label: 'Own LED Displays', value: '20 Premium Boards' },
      { label: 'Partner Vendor Boards', value: '50+ Nationwide' },
      { label: 'Active Campaigns', value: '16 Brands' },
    ],
  },
  LINDA: {
    code: 'LINDA',
    name: 'Linda Resort Limited',
    role: 'Executive Director',
    industry: 'Luxury Eco-Resort: Private Pool Villas, Family Cottages, Banquet Retreats & Investor Shares',
    website: 'www.lindaresort.com',
    currency: 'BDT',
    paletteDescription: 'Bottle Green (#1F3A2E), Imperial Gold (#C8A96A) & Ivory White',
    logoUrl: '/logos/linda-logo.png',
    stats: [
      { label: 'Private Pool Villas', value: 'Couple & Family Villas' },
      { label: 'Corporate Retreats', value: 'Banquet & Day-Out Hub' },
      { label: 'Investor Timeshare', value: 'Active Share Sales' },
    ],
  },
  ARIELMC: {
    code: 'ARIELMC',
    name: 'Ariel Marketing & Communications Limited',
    role: 'Managing Director',
    industry: 'Global B2B/B2C Export (UK, EU, AU, US): Jute, Leather, Ceramics, Pottery & Home Textiles',
    website: 'www.arielmc.com',
    currency: 'USD',
    paletteDescription: 'Royal Green (#1F3A2E), Imperial Gold (#C8A96A) & Ivory White',
    logoUrl: '/logos/arielmc-logo.png',
    stats: [
      { label: 'Export Markets', value: 'UK, EU, US, Australia' },
      { label: 'Active Shipments', value: '7 In Transit' },
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
  companyCode: 'BIZMAN' | 'LINDA' | 'ARIELMC';
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
  companyCode: 'BIZMAN' | 'LINDA' | 'ARIELMC';
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
  companyCode: 'BIZMAN' | 'LINDA' | 'ARIELMC';
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
  companyAffiliation: 'BIZMAN' | 'LINDA' | 'ARIELMC' | 'PERSONAL' | 'GROUP';
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
  isLiability?: boolean;
}

export type PersonalTxCategory = 
  | 'SALARY_BIZMAN'
  | 'SALARY_LINDA_RESORT'
  | 'DIRECTOR_DIVIDEND_ARIELMC'
  | 'CONSULTING_FEE'
  | 'INVESTMENT_INTEREST'
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
