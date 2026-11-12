export type CompanyCode = 'CONSOLIDATED' | 'ARIELMC' | 'BIZMAN' | 'LINDA' | 'ARIEL_ENERGY';

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
    industry: 'Global Export Trade, Media DOOH & Luxury Eco-Resort Hospitality',
    website: 'Executive OS',
    currency: 'USD/BDT',
    paletteDescription: 'Royal Green, Bottle Green, Imperial Gold & Ivory White',
    logoUrl: '/logos/master-crm-icon.png',
    stats: [
      { label: 'Operating Entities', value: '3 Companies' },
      { label: 'Active Pipeline Leads', value: '284 Leads' },
      { label: 'Consolidated YTD Revenue', value: '৳ 0 / $0' },
    ],
  },
  ARIELMC: {
    code: 'ARIELMC',
    name: 'ArielMC (Ariel Marketing & Communications Limited)',
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
  BIZMAN: {
    code: 'BIZMAN',
    name: 'Bizman Media Limited',
    role: 'Director & CEO',
    industry: 'DOOH Countrywide (18 Own LED + 38 Partner Fixed + 5 Mobile Vans), Static Billboards, Events & Activations',
    website: 'www.bizmanbd.com',
    currency: 'BDT',
    paletteDescription: 'Bottle Green (#1F3A2E), Imperial Gold (#C8A96A) & Ivory White',
    logoUrl: '/logos/bizman-logo.jpg',
    stats: [
      { label: 'Own Fixed LED Fleet', value: '18 Panels (17 Active)' },
      { label: 'Partner & Mobile Fleet', value: '38 Partner + 5 Vans' },
      { label: 'Total Display Units', value: '61 Reconciled Units' },
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
  ARIEL_ENERGY: {
    code: 'ARIEL_ENERGY',
    name: 'Ariel Renewable Energy Limited',
    role: 'Managing Director / EPC Lead',
    industry: 'Turnkey C&I Rooftop Solar EPC, SREDA Net-Metering, BESS, Factory Decarbonization & 4.5% Green Refinancing',
    website: 'energy.arielmc.com',
    currency: 'BDT / USD',
    paletteDescription: 'Emerald Green (#059669), Golden Sun (#F59E0B) & Pearl White',
    logoUrl: '/logos/ariel-energy-logo.png',
    stats: [
      { label: 'Pipeline Capacity', value: '32.4 MWp' },
      { label: 'SREDA Applications', value: '7 Active Filings' },
      { label: 'Refinancing Portfolio', value: '৳ 184 Cr CapEx' },
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

export type CustomerPaymentStatus = 'PENDING' | 'PARTIAL' | 'RECEIVED';
export type EntityPayoutStatus = 'AWAITING_CUSTOMER_PAYMENT' | 'READY_FOR_SETTLEMENT' | 'SETTLED';

export type ContactRoleType = 
  | 'PRIMARY_DECISION_MAKER' 
  | 'PROCUREMENT' 
  | 'MEDIA_BUYER' 
  | 'FINANCE_ACCOUNTS' 
  | 'OPERATIONS'
  | 'GENERAL';

export interface LeadContact {
  id: string;
  name: string;
  designation: string;
  department?: string;
  roleType?: ContactRoleType;
  phone: string;
  pabxPhone?: string;
  email: string;
  whatsapp?: string;
  isPrimary?: boolean;
  notes?: string;

  // Visual & Identification KYC Dossier
  photoUrl?: string;
  visitingCardFrontUrl?: string;
  visitingCardBackUrl?: string;
  nidNo?: string;
  nidDocUrl?: string;
  passportNo?: string;
  passportExpiry?: string;
  passportDocUrl?: string;
  personalTinNo?: string;
  personalTinDocUrl?: string;
}

export interface SupplementaryDoc {
  id: string;
  title: string;
  fileName: string;
  fileSize?: string;
  fileDataUrl: string;
  uploadDate: string;
  expiryDate?: string;
}

export interface CompanyComplianceDocs {
  // Trade License (with Expiration Alert)
  tradeLicenseNo?: string;
  tradeLicenseExpiry?: string;
  tradeLicenseDocUrl?: string;
  tradeLicenseFileName?: string;

  // e-TIN Certificate
  tinNo?: string;
  tinDocUrl?: string;
  tinFileName?: string;

  // BIN / VAT Registration Certificate
  binVatNo?: string;
  binVatDocUrl?: string;
  binVatFileName?: string;

  // Incorporation / RJSC Certificate
  incorporationNo?: string;
  incorporationDocUrl?: string;
  incorporationFileName?: string;

  // Bank Solvency Certificate
  bankSolvencyDocUrl?: string;
  bankSolvencyFileName?: string;

  // Company Profile / Product Catalog
  companyProfileDocUrl?: string;
  companyProfileFileName?: string;

  // Supplementary business / compliance documents
  supplementaryDocs?: SupplementaryDoc[];
}

export interface ParallelProject {
  id: string;
  projectCode: string;
  title: string;
  pipelineType: string;
  stage: PipelineStage;
  estimatedValue: number;
  currency: 'USD' | 'BDT';
  probability: number;
  expectedCloseDate: string;
  contactPersonId?: string;
  contactPersonName: string;
  contactPersonPhone?: string;
  
  // Syed Akramul Hassan's Personal Yield Engine
  commissionRate: number; // e.g. 10%
  commissionAmount: number; // estimatedValue * (commissionRate / 100)
  directCustomerFee?: number; // Extra fee contracted directly with customer
  directCustomerPaymentStatus?: 'PENDING' | 'RECEIVED';
  customerPaymentStatus: CustomerPaymentStatus;
  entityPayoutStatus: EntityPayoutStatus;
  payoutAmountReceived?: number;
  notepadMarkdown?: string;
  specifics?: Record<string, any>;
  solarSpecifics?: SolarProjectSpecifics;
  createdAt: string;
}

export type SolarCustomerCategory = 'FACTORY' | 'COMMERCIAL' | 'HOUSEHOLD';

export interface SolarProjectSpecifics {
  customerCategory: SolarCustomerCategory;
  sanctionedLoadKw: number;
  monthlyElectricityBillBdt: number;
  utilityProvider: 'DESCO' | 'DPDC' | 'BREB' | 'BPDB' | 'WZPDCL' | 'NESCO' | string;
  tariffCategory?: string; // e.g. 'Industrial (E-1/E-2)', 'Commercial Peak', 'Residential (LT-A)'
  roofAreaSqFt: number;
  roofType: 'PEB_CORRUGATED' | 'RCC_SLAB' | 'ROOFTOP_GARDEN' | 'SLOPED_TILE' | string;
  proposedDcCapacityKwp: number;
  proposedAcInverterKw: number;
  nem70PctCompliant: boolean; // proposedAcInverterKw <= sanctionedLoadKw * 0.70
  financingChannel: 'GOVT_1500CR_FUND' | 'BB_GTF_4.5_REFINANCE' | 'ZERO_CAPEX_PPA' | 'CONSUMER_GREEN_LOAN' | 'SELF_FINANCED' | string;
  gracePeriodMonths?: number;
  year1EstimatedBillSavingsBdt?: number;
  netMonthlyCashSurplusBdt?: number;
  weekendBuybackYieldAnnualBdt?: number;
  sredaSubcontractorHub?: string;
  bankSfdPartner?: string;
}

export interface CompanyLead {
  id: string;
  companyCode: 'BIZMAN' | 'LINDA' | 'ARIELMC' | 'ARIEL_ENERGY';
  companyName: string; // The Lead Company Account (e.g. Grameenphone Ltd., Robi Axiata, Unilever Bangladesh, EcoLiving UK)
  industry: string;
  clientType: 'Direct Brand' | 'Media Agency' | 'Government / Institutional' | 'International Buyer' | 'Corporate Client' | 'Vendor / Supplier' | 'Raw Material Supplier' | string;
  priorityTemp: 'HOT' | 'WARM' | 'COLD';
  country: string;
  city?: string;
  website?: string;
  address?: string;
  createdAt: string;

  // 1-to-Many: Contact Persons under this Lead Company
  contacts: LeadContact[];

  // 1-to-Many: Parallel Commercial Projects under this Lead Company
  projects: ParallelProject[];

  // Corporate Compliance & Statutory Documents Vault
  compliance?: CompanyComplianceDocs;
}

export interface LeadItem {
  id: string;
  companyCode: 'BIZMAN' | 'LINDA' | 'ARIELMC' | 'ARIEL_ENERGY';
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

  // Executive Personal Project & Commission Tracking
  commissionRate: number; // e.g. 10 for 10%
  commissionAmount: number; // estimatedValue * (commissionRate / 100)
  customerPaymentStatus: CustomerPaymentStatus;
  entityPayoutStatus: EntityPayoutStatus;
  payoutAmountReceived?: number;

  // Extra Direct Contractual Payment from Customer to Syed Akramul Hassan
  directCustomerFee?: number; // e.g. 50000 (direct contract fee/advisory from Customer)
  directCustomerPaymentStatus?: 'PENDING' | 'RECEIVED';
  projectName?: string; // Sub-project or specific campaign name under the parent client

  // Bizman CRM Model: Multiple Contacts & Parallel Projects under this Lead
  contacts?: LeadContact[];
  projects?: ParallelProject[];
}

export type ExpensePayer = 'MY_PERSONAL_FUNDS' | 'ENTITY_DIRECT';
export type ReimbursementStatus = 'NON_REIMBURSABLE' | 'PENDING_REIMBURSEMENT' | 'REIMBURSED';

export interface ExpenseItem {
  id: string;
  companyCode: 'BIZMAN' | 'LINDA' | 'ARIELMC' | 'ARIEL_ENERGY';
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

  // Executive Outlay & Entity Settlement Tracking
  paidBy: ExpensePayer; // Paid from My Pocket vs Entity Direct
  isReimbursable: boolean; // True if Entity should pay me back for this project expense
  reimbursementStatus: ReimbursementStatus;
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
  companyCode: 'BIZMAN' | 'LINDA' | 'ARIELMC' | 'ARIEL_ENERGY';
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
  companyAffiliation: 'BIZMAN' | 'LINDA' | 'ARIELMC' | 'ARIEL_ENERGY' | 'PERSONAL' | 'GROUP';
  relationshipNotes: string;
  isConvertibleToLead: boolean;
  convertedLeadId?: string;
  tags: string[];
  createdAt: string;

  // Visual & Identification KYC Dossier
  photoUrl?: string;
  visitingCardFrontUrl?: string;
  visitingCardBackUrl?: string;
  nidNo?: string;
  nidDocUrl?: string;
  passportNo?: string;
  passportExpiry?: string;
  passportDocUrl?: string;
  personalTinNo?: string;
  personalTinDocUrl?: string;
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
  currency: 'BDT' | 'USD' | 'GBP';
  currentBalance: number;
  accountNumberMasked: string;
  isLiability?: boolean;
  branch?: string;
  accountNumberFull?: string;
  routingNo?: string;
  swiftCode?: string;
  debitCardNumberMasked?: string;
  debitCardExp?: string;
  debitCardCvr?: string;
  iban?: string;
  sortCode?: string;
  bic?: string;
  notes?: string;
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
  currency: 'BDT' | 'USD' | 'GBP';
  category: PersonalTxCategory;
  description: string;
  accountId: string;
  accountName: string;
  notes?: string;
}

export type DocumentCategory = 
  | 'CONTRACT_AGREEMENT'
  | 'EXPORT_SHIPPING_LC'
  | 'GOVT_REGULATORY_TAX'
  | 'CORPORATE_GOVERNANCE'
  | 'BANKING_FINANCIAL'
  | 'MARKETING_CATALOG'
  | 'PERSONAL_VAULT'
  | 'SUPPLIER_VENDOR_KYB'
  | 'CONTACT_KYC_DOSSIER';

export type DocumentSecurityLevel = 'CONFIDENTIAL' | 'RESTRICTED' | 'INTERNAL' | 'PUBLIC';

export type DocumentFileType = 'PDF' | 'DOCX' | 'XLSX' | 'IMAGE' | 'ZIP';

export interface DocumentRecord {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  fileType: DocumentFileType;
  companyCode: 'ARIELMC' | 'BIZMAN' | 'LINDA' | 'ARIEL_ENERGY' | 'PERSONAL' | 'CONSOLIDATED';
  category: DocumentCategory;
  securityLevel: DocumentSecurityLevel;
  uploadDate: string;
  expiryDate?: string;
  tags: string[];
  notes?: string;
  uploadedBy: string;
  version: string;
  downloadCount?: number;
  fileDataUrl?: string;
}

/**
 * Calculates calendar days remaining until document expiration.
 * - Negative: Expired
 * - Positive (e.g. 15): 15 days until expiration
 * - null: No expiry date recorded
 */
export function getDaysUntilExpiration(expiryDate?: string): number | null {
  if (!expiryDate || !expiryDate.trim()) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDate);
  exp.setHours(0, 0, 0, 0);
  if (isNaN(exp.getTime())) return null;
  const diffTime = exp.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Checks if document renewal is due (within 30 days of expiration or already expired).
 */
export function isRenewalDue(expiryDate?: string, thresholdDays = 30): boolean {
  const days = getDaysUntilExpiration(expiryDate);
  if (days === null) return false;
  return days <= thresholdDays;
}
