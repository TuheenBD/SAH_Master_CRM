import { LeadItem, ExpenseItem, JournalEntryItem, AccountBalance } from './types';

export const INITIAL_LEADS: LeadItem[] = [
  // BIZMAN MEDIA LEADS
  {
    id: 'lead-biz-1',
    companyCode: 'BIZMAN',
    title: 'Grameenphone Ramadan DOOH Nationwide Campaign',
    customerName: 'Grameenphone Bangladesh Ltd',
    contactPerson: 'Sajjad Hossain (Head of Media Planning)',
    phone: '+8801711002233',
    whatsapp: '8801711002233',
    email: 'sajjad.media@grameenphone.com',
    country: 'Bangladesh',
    pipelineType: 'DOOH_MEDIA_SLOT',
    stage: 'NEGOTIATION',
    estimatedValue: 4850000,
    currency: 'BDT',
    probability: 85,
    expectedCloseDate: '2026-11-15',
    notepadMarkdown: `### Grameenphone Campaign Brief
- **Target Screens:** 15 Own LED screens in Dhaka (Dhanmondi, Gulshan, Banani, Uttara) + 25 Vendor screens in Chittagong & Sylhet.
- **Duration:** 30 Days (Ramadan Festive Rush).
- **Slot Requirements:** 10-sec spots every 2 minutes (720 impressions/day per screen).
- **Meeting Note:** Sajjad requested 8% bundle discount if we include Gulshan-2 mega screen. Agreed tentatively pending vendor cost verification.`,
    specifics: {
      ownBoards: 15,
      vendorBoards: 25,
      slotsPerDay: 720,
      campaignDays: 30,
    },
    createdAt: '2026-10-18',
  },
  {
    id: 'lead-biz-2',
    companyCode: 'BIZMAN',
    title: 'Apex Footwear Eid Festival Activation & Gifting',
    customerName: 'Apex Footwear Limited',
    contactPerson: 'Farhana Rashid (Brand Lead)',
    phone: '+8801819556677',
    whatsapp: '8801819556677',
    email: 'farhana.rashid@apexfootwear.com',
    country: 'Bangladesh',
    pipelineType: 'EVENT_ACTIVATION',
    stage: 'PROPOSAL_SENT',
    estimatedValue: 2200000,
    currency: 'BDT',
    probability: 65,
    expectedCloseDate: '2026-11-20',
    notepadMarkdown: `### Apex Footwear Event Activation
- 3-day on-ground youth activation at Jamuna Future Park & Shimanto Square.
- Custom fabricated booths, interactive selfie LED backdrop, branded leather gift packaging for VIP loyalty cardholders.`,
    specifics: {
      locationCount: 2,
      giftItemsPcs: 1500,
      fabricationType: 'Custom Modern Acrylic + LED',
    },
    createdAt: '2026-10-22',
  },

  // ADPRO COMMUNICATIONS LEADS
  {
    id: 'lead-adp-1',
    companyCode: 'ADPRO',
    title: 'bKash Merchant Q4 Regional DOOH Blitz',
    customerName: 'bKash Limited',
    contactPerson: 'Tanvir Ahmed (Senior Manager Commercial)',
    phone: '+8801730445566',
    whatsapp: '8801730445566',
    email: 'tanvir.ahmed@bkash.com',
    country: 'Bangladesh',
    pipelineType: 'DOOH_MEDIA_SLOT',
    stage: 'WON',
    estimatedValue: 3600000,
    currency: 'BDT',
    probability: 100,
    expectedCloseDate: '2026-10-25',
    notepadMarkdown: `### bKash Campaign Execution
- Booking our Flagship 1 Own LED Board in Motijheel Commercial Area.
- Sourced 42 Partner Vendor Screens covering divisional hubs: Khulna, Rajshahi, Rangpur, Bogura.
- Production approved. Invoiced with 50% advance received into Bank A/C.`,
    specifics: {
      ownBoards: 1,
      vendorBoards: 42,
      runPeriod: '45 Days',
    },
    createdAt: '2026-10-10',
  },
  {
    id: 'lead-adp-2',
    companyCode: 'ADPRO',
    title: 'Walton Hi-Tech Static Unipole & Billboard Setup',
    customerName: 'Walton Hi-Tech Industries PLC',
    contactPerson: 'Engr. Masud Alam (DGM Procurement)',
    phone: '+8801912334455',
    whatsapp: '8801912334455',
    email: 'masud.alam@waltonbd.com',
    country: 'Bangladesh',
    pipelineType: 'STATIC_BILLBOARD',
    stage: 'MEETING_SCHEDULED',
    estimatedValue: 1800000,
    currency: 'BDT',
    probability: 50,
    expectedCloseDate: '2026-12-05',
    notepadMarkdown: `### Walton Outdoor Hoardings
- Site survey completed at Dhaka-Mawa Expressway interchange.
- Structural stability certificate requested for 60ft x 30ft unipole structure.`,
    specifics: {
      siteLocation: 'Dhaka-Mawa Expressway',
      boardDimension: '60ft x 30ft',
    },
    createdAt: '2026-10-26',
  },

  // ARIEL MARKETING & COMMUNICATIONS (EXPORT) LEADS
  {
    id: 'lead-amc-1',
    companyCode: 'ARIELMC',
    title: 'EcoLiving UK - 25,000 Pcs Organic Jute Tote Bags',
    customerName: 'EcoLiving Retail Goods UK Ltd',
    contactPerson: 'Oliver Smith (Head of Ethical Sourcing)',
    phone: '+442079460192',
    whatsapp: '442079460192',
    email: 'o.smith@ecoliving-uk.co.uk',
    country: 'United Kingdom',
    pipelineType: 'EXPORT_JUTE',
    stage: 'NEGOTIATION',
    estimatedValue: 78000, // $78,000 USD
    currency: 'USD',
    probability: 80,
    expectedCloseDate: '2026-11-10',
    notepadMarkdown: `### EcoLiving UK Order Details
- **Product:** 100% Biodegradable Laminated Jute Beach Bags with cotton rope handles.
- **Quantity:** 25,000 Units.
- **Target FOB Price:** $3.12 / pc Chittagong Port.
- **Payment Terms:** 30% advance T/T, 70% against Bill of Lading (BL) copy.
- **Audit Requirement:** SEDEX Smeta 4-pillar audit report shared and approved.
- **Samples:** Express DHL courier dispatched on Oct 20. Delivered & approved.`,
    specifics: {
      incoterm: 'FOB Chittagong',
      portOfDischarge: 'Felixstowe Port, UK',
      containerVolume: '1 x 40ft High Cube Container',
      material: '14x15 Yarn Natural Jute',
    },
    createdAt: '2026-10-12',
  },
  {
    id: 'lead-amc-2',
    companyCode: 'ARIELMC',
    title: 'Munich Ceramic Living - Handcrafted Terracotta Pottery & Dinnerware',
    customerName: 'Munich Living GmbH',
    contactPerson: 'Greta Becker (Procurement Director)',
    phone: '+498912345678',
    whatsapp: '498912345678',
    email: 'g.becker@munichliving.de',
    country: 'Germany',
    pipelineType: 'EXPORT_CERAMICS',
    stage: 'PROPOSAL_SENT',
    estimatedValue: 46500, // $46,500 USD
    currency: 'USD',
    probability: 70,
    expectedCloseDate: '2026-11-30',
    notepadMarkdown: `### Munich Living Ceramics Inquiry
- Glazed pottery, stoneware decorative vases and traditional Bangladeshi terracotta tea sets.
- Packaging must withstand drop tests (ISTA 3A certified packaging).
- Lab testing for lead & cadmium migration compliance according to EU 84/500/EEC.`,
    specifics: {
      incoterm: 'CIF Hamburg',
      targetDelivery: 'Jan 2027',
      categories: ['Ceramics', 'Terracotta Pottery'],
    },
    createdAt: '2026-10-21',
  },
  {
    id: 'lead-amc-3',
    companyCode: 'ARIELMC',
    title: 'Melbourne Artisan Co - Full Grain Leather Wallets & Bags',
    customerName: 'Melbourne Artisan Goods Pty',
    contactPerson: 'Liam Wright',
    phone: '+61390001122',
    whatsapp: '61390001122',
    email: 'liam@melbourneartisan.com.au',
    country: 'Australia',
    pipelineType: 'EXPORT_LEATHER',
    stage: 'CONTACTED',
    estimatedValue: 32000,
    currency: 'USD',
    probability: 45,
    expectedCloseDate: '2026-12-15',
    notepadMarkdown: `### Australian Buyer Requirement
- Vegetable-tanned cowhide wallets, travel duffels, and passport sleeves.
- REACH compliance certificate requested.`,
    specifics: {
      incoterm: 'FOB Chittagong',
      leadTime: '35 Days',
    },
    createdAt: '2026-10-25',
  },
];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    companyCode: 'BIZMAN',
    expenseNumber: 'EXP-BIZ-2026-0081',
    date: '2026-10-28',
    amount: 320000,
    currency: 'BDT',
    category: 'VENDOR_BOARD_RENTAL',
    description: 'Chittagong GEC & Agrabad 4x Vendor LED Screens monthly advance rental',
    vendorRecipient: 'Chittagong Media Vision Ltd',
    leadId: 'lead-biz-1',
    leadTitle: 'Grameenphone Ramadan DOOH Nationwide Campaign',
    paidFromAccount: '1020 - Operating Bank A/C',
    expenseAccount: '5010 - Vendor Billboard Rental Cost',
    isVerified: true,
  },
  {
    id: 'exp-2',
    companyCode: 'BIZMAN',
    expenseNumber: 'EXP-BIZ-2026-0082',
    date: '2026-10-27',
    amount: 14500,
    currency: 'BDT',
    category: 'CLIENT_ENTERTAINMENT_DINNER',
    description: 'Dinner meeting with GP Media Planning Director at Westin Dhaka',
    vendorRecipient: 'The Westin Dhaka',
    leadId: 'lead-biz-1',
    leadTitle: 'Grameenphone Ramadan DOOH Nationwide Campaign',
    paidFromAccount: '1010 - Petty Cash A/C',
    expenseAccount: '6010 - Client Entertainment & Dinners',
    isVerified: true,
  },
  {
    id: 'exp-3',
    companyCode: 'ADPRO',
    expenseNumber: 'EXP-ADP-2026-0044',
    date: '2026-10-26',
    amount: 450000,
    currency: 'BDT',
    category: 'VENDOR_BOARD_RENTAL',
    description: 'Wholesale settlement for 18 Vendor screens in North Bengal regional clusters',
    vendorRecipient: 'Rajshahi Outdoor Network',
    leadId: 'lead-adp-1',
    leadTitle: 'bKash Merchant Q4 Regional DOOH Blitz',
    paidFromAccount: '1020 - Corporate Bank A/C',
    expenseAccount: '5010 - Vendor Billboard Rental Cost',
    isVerified: true,
  },
  {
    id: 'exp-4',
    companyCode: 'ARIELMC',
    expenseNumber: 'EXP-AMC-2026-0029',
    date: '2026-10-24',
    amount: 420, // $420 USD
    currency: 'USD',
    category: 'PRODUCT_SAMPLE_DEV',
    description: 'Express DHL courier for 8 approved Jute tote prototypes to London buyer',
    vendorRecipient: 'DHL Express Bangladesh',
    leadId: 'lead-amc-1',
    leadTitle: 'EcoLiving UK - 25,000 Pcs Organic Jute Tote Bags',
    paidFromAccount: '1020 - HSBC Corporate USD Bank A/C',
    expenseAccount: '5020 - Shipping & Express Courier Expense',
    isVerified: true,
  },
  {
    id: 'exp-5',
    companyCode: 'BIZMAN',
    expenseNumber: 'EXP-BIZ-2026-0083',
    date: '2026-10-25',
    amount: 48000,
    currency: 'BDT',
    category: 'EQUIPMENT_REPAIR_LED',
    description: 'P6 Outdoor LED module power supply replacement for Dhanmondi-01 display',
    vendorRecipient: 'Shenzhen Power Supply Importers',
    paidFromAccount: '1010 - Petty Cash A/C',
    expenseAccount: '6050 - Hardware Maintenance & Repairs',
    isVerified: true,
  },
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntryItem[] = [
  {
    id: 'je-biz-1',
    companyCode: 'BIZMAN',
    entryNumber: 'JE-BIZ-2026-0104',
    date: '2026-10-28',
    description: 'Chittagong GEC & Agrabad Vendor LED rental advance for GP campaign',
    reference: 'EXP-BIZ-2026-0081',
    isPosted: true,
    lines: [
      {
        id: 'jl-1',
        accountCode: '5010',
        accountName: 'Vendor Billboard Rental Cost (COGS)',
        debit: 320000,
        credit: 0,
        description: 'Debit Direct Expense for Chittagong partner screens',
      },
      {
        id: 'jl-2',
        accountCode: '1020',
        accountName: 'Main Corporate Operating Bank A/C',
        debit: 0,
        credit: 320000,
        description: 'Credit Bank Account for RTGS wire payment',
      },
    ],
  },
  {
    id: 'je-adp-1',
    companyCode: 'ADPRO',
    entryNumber: 'JE-ADP-2026-0062',
    date: '2026-10-25',
    description: 'bKash Merchant Q4 Campaign 50% Contract Advance Received',
    reference: 'INV-ADP-2026-0041',
    isPosted: true,
    lines: [
      {
        id: 'jl-3',
        accountCode: '1020',
        accountName: 'Main Corporate Operating Bank A/C',
        debit: 1800000,
        credit: 0,
        description: 'Debit Cash at Bank for 50% Campaign Advance',
      },
      {
        id: 'jl-4',
        accountCode: '4010',
        accountName: 'DOOH Media Advertising Revenue',
        debit: 0,
        credit: 1800000,
        description: 'Credit Revenue Account for booked broadcast run',
      },
    ],
  },
  {
    id: 'je-amc-1',
    companyCode: 'ARIELMC',
    entryNumber: 'JE-AMC-2026-0033',
    date: '2026-10-24',
    description: 'EcoLiving UK Jute Bag Sample Development & Courier charges',
    reference: 'EXP-AMC-2026-0029',
    isPosted: true,
    lines: [
      {
        id: 'jl-5',
        accountCode: '5020',
        accountName: 'Sample Development & Export Courier',
        debit: 420,
        credit: 0,
        description: 'Debit Export Sample Freight Expense',
      },
      {
        id: 'jl-6',
        accountCode: '1020',
        accountName: 'HSBC Corporate USD Bank A/C',
        debit: 0,
        credit: 420,
        description: 'Credit Corporate USD Account for DHL Freight',
      },
    ],
  },
];

export const FINANCIAL_BALANCES: Record<'BIZMAN' | 'ADPRO' | 'ARIELMC', AccountBalance[]> = {
  BIZMAN: [
    // Assets
    { code: '1010', name: 'Petty Cash in Office Safe', type: 'ASSET', classification: 'CASH_AND_BANK', currency: 'BDT', balance: 185000 },
    { code: '1020', name: 'Dutch-Bangla Bank Corporate A/C', type: 'ASSET', classification: 'CASH_AND_BANK', currency: 'BDT', balance: 6420000 },
    { code: '1200', name: 'Accounts Receivable (Clients)', type: 'ASSET', classification: 'ACCOUNTS_RECEIVABLE', currency: 'BDT', balance: 4150000 },
    { code: '1500', name: '20 Own High-Res LED Displays & Unipoles', type: 'ASSET', classification: 'FIXED_ASSET_EQUIPMENT', currency: 'BDT', balance: 18500000 },
    // Liabilities
    { code: '2010', name: 'Accounts Payable (50+ Vendor Boards)', type: 'LIABILITY', classification: 'ACCOUNTS_PAYABLE', currency: 'BDT', balance: 1980000 },
    { code: '2100', name: 'VAT & AIT Withholding Payable', type: 'LIABILITY', classification: 'TAXES_PAYABLE', currency: 'BDT', balance: 420000 },
    // Equity
    { code: '3010', name: "Owner's Paid-up Capital", type: 'EQUITY', classification: 'OWNER_CAPITAL', currency: 'BDT', balance: 15000000 },
    { code: '3020', name: 'Accumulated Retained Earnings', type: 'EQUITY', classification: 'RETAINED_EARNINGS', currency: 'BDT', balance: 6855000 },
    // Revenue
    { code: '4010', name: 'DOOH Media Advertising Revenue', type: 'REVENUE', classification: 'DOOH_MEDIA_REVENUE', currency: 'BDT', balance: 12450000 },
    { code: '4020', name: 'Event Management & Activations Revenue', type: 'REVENUE', classification: 'EVENT_ACTIVATION_REVENUE', currency: 'BDT', balance: 3800000 },
    // Expenses
    { code: '5010', name: 'Vendor Billboard Rental Wholesale Cost', type: 'EXPENSE', classification: 'COST_OF_GOODS_SOLD_VENDOR_BOARDS', currency: 'BDT', balance: 6200000 },
    { code: '5020', name: 'Production, Mounting & Flex Printing', type: 'EXPENSE', classification: 'COST_OF_GOODS_SOLD_MATERIALS', currency: 'BDT', balance: 1150000 },
    { code: '6010', name: 'Client Entertainment & Meeting Dinners', type: 'EXPENSE', classification: 'MARKETING_ENTERTAINMENT', currency: 'BDT', balance: 285000 },
    { code: '6020', name: 'Conveyance, Fuel & Field Inspections', type: 'EXPENSE', classification: 'MARKETING_ENTERTAINMENT', currency: 'BDT', balance: 340000 },
    { code: '6030', name: 'Staff Salaries & Field Engineers', type: 'EXPENSE', classification: 'SALARIES_AND_WAGES', currency: 'BDT', balance: 2400000 },
    { code: '6040', name: 'Office Rent & High-Speed Optical Fiber', type: 'EXPENSE', classification: 'OFFICE_RENT_UTILITIES', currency: 'BDT', balance: 1120000 },
  ],
  ADPRO: [
    // Assets
    { code: '1010', name: 'Cash on Hand', type: 'ASSET', classification: 'CASH_AND_BANK', currency: 'BDT', balance: 95000 },
    { code: '1020', name: 'City Bank Corporate A/C', type: 'ASSET', classification: 'CASH_AND_BANK', currency: 'BDT', balance: 3120000 },
    { code: '1200', name: 'Accounts Receivable (Corporate Brands)', type: 'ASSET', classification: 'ACCOUNTS_RECEIVABLE', currency: 'BDT', balance: 2800000 },
    { code: '1500', name: '1 Own LED Flagship Display & Structures', type: 'ASSET', classification: 'FIXED_ASSET_EQUIPMENT', currency: 'BDT', balance: 3200000 },
    // Liabilities
    { code: '2010', name: 'Accounts Payable (70+ Vendor Network)', type: 'LIABILITY', classification: 'ACCOUNTS_PAYABLE', currency: 'BDT', balance: 2100000 },
    { code: '2100', name: 'Government Taxes Payable', type: 'LIABILITY', classification: 'TAXES_PAYABLE', currency: 'BDT', balance: 230000 },
    // Equity
    { code: '3010', name: "Owner's Equity Capital", type: 'EQUITY', classification: 'OWNER_CAPITAL', currency: 'BDT', balance: 4000000 },
    { code: '3020', name: 'Retained Earnings', type: 'EQUITY', classification: 'RETAINED_EARNINGS', currency: 'BDT', balance: 2885000 },
    // Revenue
    { code: '4010', name: 'Countrywide DOOH Network Sales', type: 'REVENUE', classification: 'DOOH_MEDIA_REVENUE', currency: 'BDT', balance: 8900000 },
    { code: '4020', name: 'Promotional Gifts & Brand Merchandising', type: 'REVENUE', classification: 'EVENT_ACTIVATION_REVENUE', currency: 'BDT', balance: 2150000 },
    // Expenses
    { code: '5010', name: '70+ Partner Billboard Rental Payouts', type: 'EXPENSE', classification: 'COST_OF_GOODS_SOLD_VENDOR_BOARDS', currency: 'BDT', balance: 5400000 },
    { code: '5020', name: 'Gift Fabrication & Direct Materials', type: 'EXPENSE', classification: 'COST_OF_GOODS_SOLD_MATERIALS', currency: 'BDT', balance: 980000 },
    { code: '6010', name: 'Marketing & Business Development', type: 'EXPENSE', classification: 'MARKETING_ENTERTAINMENT', currency: 'BDT', balance: 210000 },
    { code: '6030', name: 'Personnel & Field Technicians', type: 'EXPENSE', classification: 'SALARIES_AND_WAGES', currency: 'BDT', balance: 1650000 },
    { code: '6040', name: 'Administrative & Utilities', type: 'EXPENSE', classification: 'OFFICE_RENT_UTILITIES', currency: 'BDT', balance: 870000 },
  ],
  ARIELMC: [
    // Assets (Denominated in USD)
    { code: '1010', name: 'Petty Cash BDT (Converted Equiv)', type: 'ASSET', classification: 'CASH_AND_BANK', currency: 'USD', balance: 2100 },
    { code: '1020', name: 'HSBC Corporate International USD A/C', type: 'ASSET', classification: 'CASH_AND_BANK', currency: 'USD', balance: 84500 },
    { code: '1200', name: 'Accounts Receivable (UK, EU, US Importers)', type: 'ASSET', classification: 'ACCOUNTS_RECEIVABLE', currency: 'USD', balance: 48200 },
    { code: '1300', name: 'Warehousing & Export Inventory (Jute, Leather, Ceramics)', type: 'ASSET', classification: 'INVENTORY_ASSET', currency: 'USD', balance: 35000 },
    // Liabilities
    { code: '2010', name: 'Accounts Payable (Artisans & Ceramic Factories)', type: 'LIABILITY', classification: 'ACCOUNTS_PAYABLE', currency: 'USD', balance: 29400 },
    { code: '2200', name: 'Freight Forwarding & Shipping Line Due', type: 'LIABILITY', classification: 'ACCRUED_EXPENSES', currency: 'USD', balance: 8600 },
    // Equity
    { code: '3010', name: "Founder's Trade Capital", type: 'EQUITY', classification: 'OWNER_CAPITAL', currency: 'USD', balance: 75000 },
    { code: '3020', name: 'Export Retained Surplus', type: 'EQUITY', classification: 'RETAINED_EARNINGS', currency: 'USD', balance: 56800 },
    // Revenue
    { code: '4010', name: 'Export Sales: UK, EU, US, Australia', type: 'REVENUE', classification: 'EXPORT_SALES_REVENUE', currency: 'USD', balance: 198000 },
    // Expenses
    { code: '5010', name: 'Raw Material Procurement (Jute, Leather, Clay)', type: 'EXPENSE', classification: 'COST_OF_GOODS_SOLD_MATERIALS', currency: 'USD', balance: 94000 },
    { code: '5020', name: 'International Sea Freight & Port Handling', type: 'EXPENSE', classification: 'COST_OF_GOODS_SOLD_FREIGHT', currency: 'USD', balance: 31200 },
    { code: '6010', name: 'International Trade Exhibitions & Samples', type: 'EXPENSE', classification: 'MARKETING_ENTERTAINMENT', currency: 'USD', balance: 9500 },
    { code: '6030', name: 'QA Inspectors & Sourcing Team', type: 'EXPENSE', classification: 'SALARIES_AND_WAGES', currency: 'USD', balance: 24000 },
    { code: '6040', name: 'Certifications (SEDEX, REACH, EU Food Contact)', type: 'EXPENSE', classification: 'OFFICE_RENT_UTILITIES', currency: 'USD', balance: 7200 },
  ],
};
