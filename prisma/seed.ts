import { PrismaClient, CompanyCode, IndustryDomain, AccountType, AccountClassification, PipelineType, BillboardType, ProductCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Master CRM Database for Bizman, Adpro, and ArielMC...');

  // 1. Create Superadmin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'tuheenbd@gmail.com' },
    update: {},
    create: {
      email: 'tuheenbd@gmail.com',
      name: 'Syed Akramul Hassan',
      passwordHash: '$2b$10$YourHashedPasswordHere', // Replace with bcrypt in production
      role: 'OWNER_SUPERADMIN',
    },
  });

  console.log(`👤 Superadmin created: ${adminUser.email}`);

  // 2. Initialize the Three Companies
  const bizman = await prisma.company.upsert({
    where: { code: CompanyCode.BIZMAN },
    update: {},
    create: {
      code: CompanyCode.BIZMAN,
      name: 'Bizman Media Limited',
      legalName: 'Bizman Media Limited',
      roleTitle: 'Director & CEO',
      industry: IndustryDomain.DOOH_MEDIA_ADVERTISING,
      baseCurrency: 'BDT',
      settings: {
        invoicePrefix: 'INV-BIZ',
        orderPrefix: 'ORD-BIZ',
        expensePrefix: 'EXP-BIZ',
        ownBoardsCount: 20,
        vendorBoardsCount: 50,
      },
    },
  });

  const adpro = await prisma.company.upsert({
    where: { code: CompanyCode.ADPRO },
    update: {},
    create: {
      code: CompanyCode.ADPRO,
      name: 'Adpro Communications Limited',
      legalName: 'Adpro Communications Limited',
      roleTitle: 'General Manager',
      industry: IndustryDomain.DOOH_MEDIA_ADVERTISING,
      baseCurrency: 'BDT',
      settings: {
        invoicePrefix: 'INV-ADP',
        orderPrefix: 'ORD-ADP',
        expensePrefix: 'EXP-ADP',
        ownBoardsCount: 1,
        vendorBoardsCount: 70,
      },
    },
  });

  const arielmc = await prisma.company.upsert({
    where: { code: CompanyCode.ARIELMC },
    update: {},
    create: {
      code: CompanyCode.ARIELMC,
      name: 'Ariel Marketing & Communications Limited',
      legalName: 'Ariel Marketing & Communications Limited',
      roleTitle: 'Managing Director',
      industry: IndustryDomain.GLOBAL_TRADE_EXPORT,
      baseCurrency: 'USD',
      secondaryCurrency: 'BDT',
      settings: {
        invoicePrefix: 'INV-AMC',
        orderPrefix: 'ORD-AMC',
        expensePrefix: 'EXP-AMC',
        targetMarkets: ['UK', 'EU', 'US', 'Australia'],
        exportPorts: ['Chittagong Sea Port', 'Hazrat Shahjalal Air Cargo'],
      },
    },
  });

  // Link User to all 3 Companies
  const companies = [bizman, adpro, arielmc];
  for (const comp of companies) {
    await prisma.companyUser.upsert({
      where: {
        userId_companyId: {
          userId: adminUser.id,
          companyId: comp.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        companyId: comp.id,
        isDefault: comp.code === CompanyCode.BIZMAN,
      },
    });

    // 3. Populate Standard Chart of Accounts (Double-Entry Bookkeeping Foundation)
    const standardAccounts = [
      // ASSETS (1000 - 1999)
      { code: '1010', name: 'Petty Cash', type: AccountType.ASSET, classification: AccountClassification.CASH_AND_BANK },
      { code: '1020', name: 'Main Corporate Operating Bank A/C', type: AccountType.ASSET, classification: AccountClassification.CASH_AND_BANK },
      { code: '1200', name: 'Accounts Receivable (Clients)', type: AccountType.ASSET, classification: AccountClassification.ACCOUNTS_RECEIVABLE },
      { code: '1300', name: 'Prepaid Expenses & Advances', type: AccountType.ASSET, classification: AccountClassification.PREPAID_EXPENSES },
      { code: '1500', name: 'LED Hardware & Installation Assets', type: AccountType.ASSET, classification: AccountClassification.FIXED_ASSET_EQUIPMENT },

      // LIABILITIES (2000 - 2999)
      { code: '2010', name: 'Accounts Payable (Vendors & Subcontractors)', type: AccountType.LIABILITY, classification: AccountClassification.ACCOUNTS_PAYABLE },
      { code: '2100', name: 'Taxes & VAT Payable', type: AccountType.LIABILITY, classification: AccountClassification.TAXES_PAYABLE },
      { code: '2200', name: 'Accrued Operating Expenses', type: AccountType.LIABILITY, classification: AccountClassification.ACCRUED_EXPENSES },

      // EQUITY (3000 - 3999)
      { code: '3010', name: "Owner's Capital Contribution", type: AccountType.EQUITY, classification: AccountClassification.OWNER_CAPITAL },
      { code: '3020', name: 'Retained Earnings', type: AccountType.EQUITY, classification: AccountClassification.RETAINED_EARNINGS },

      // REVENUE (4000 - 4999)
      { code: '4010', name: comp.code === CompanyCode.ARIELMC ? 'Export Sales Revenue (UK/EU/US)' : 'DOOH Media Advertising Revenue', type: AccountType.REVENUE, classification: comp.code === CompanyCode.ARIELMC ? AccountClassification.EXPORT_SALES_REVENUE : AccountClassification.DOOH_MEDIA_REVENUE },
      { code: '4020', name: comp.code === CompanyCode.ARIELMC ? 'Sample & Courier Charges Reimbursed' : 'Event & Activation Management Revenue', type: AccountType.REVENUE, classification: AccountClassification.EVENT_ACTIVATION_REVENUE },

      // EXPENSES / DIRECT COSTS (5000 - 5999)
      { code: '5010', name: comp.code === CompanyCode.ARIELMC ? 'Cost of Raw Materials (Jute, Leather, Ceramics)' : 'Vendor Billboard Rental Cost (Wholesale)', type: AccountType.EXPENSE, classification: comp.code === CompanyCode.ARIELMC ? AccountClassification.COST_OF_GOODS_SOLD_MATERIALS : AccountClassification.COST_OF_GOODS_SOLD_VENDOR_BOARDS },
      { code: '5020', name: comp.code === CompanyCode.ARIELMC ? 'International Shipping & Freight' : 'Production, Fabrication & Flex Printing', type: AccountType.EXPENSE, classification: comp.code === CompanyCode.ARIELMC ? AccountClassification.COST_OF_GOODS_SOLD_FREIGHT : AccountClassification.COST_OF_GOODS_SOLD_VENDOR_BOARDS },

      // OPERATING EXPENSES (6000 - 6999)
      { code: '6010', name: 'Client Entertainment & Meeting Dinners', type: AccountType.EXPENSE, classification: AccountClassification.MARKETING_ENTERTAINMENT },
      { code: '6020', name: 'Conveyance, Fuel & Field Travel', type: AccountType.EXPENSE, classification: AccountClassification.MARKETING_ENTERTAINMENT },
      { code: '6030', name: 'Salaries & Staff Allowances', type: AccountType.EXPENSE, classification: AccountClassification.SALARIES_AND_WAGES },
      { code: '6040', name: 'Office Rent & Utility Bills', type: AccountType.EXPENSE, classification: AccountClassification.OFFICE_RENT_UTILITIES },
      { code: '6050', name: 'Bank Charges & Currency Conversion', type: AccountType.EXPENSE, classification: AccountClassification.BANK_AND_EXCHANGE_FEES },
    ];

    for (const acc of standardAccounts) {
      await prisma.account.upsert({
        where: {
          companyId_accountCode: {
            companyId: comp.id,
            accountCode: acc.code,
          },
        },
        update: {},
        create: {
          companyId: comp.id,
          accountCode: acc.code,
          name: acc.name,
          type: acc.type,
          classification: acc.classification,
          currency: comp.baseCurrency,
        },
      });
    }
  }

  // 4. Seed Bizman Sample Inventory (20 Own LED Boards + 50+ Vendor coverage stub)
  await prisma.billboardAsset.upsert({
    where: {
      companyId_boardCode: {
        companyId: bizman.id,
        boardCode: 'BIZ-LED-DHA-01',
      },
    },
    update: {},
    create: {
      companyId: bizman.id,
      boardCode: 'BIZ-LED-DHA-01',
      name: 'Dhanmondi 27 Crossing Digital Display',
      type: BillboardType.OWN_LED_BOARD,
      location: 'Mirpur Road x Dhanmondi 27 Crossing',
      district: 'Dhaka',
      division: 'Dhaka',
      dimensions: '40ft x 20ft',
      pixelResolution: 'P6 Outdoor High Brightness',
      dailyTrafficCount: 185000,
      totalSlotsPerLoop: 10,
      availableSlots: 4,
      monthlyRatePerSlot: 150000.00,
      dailyRatePerSlot: 6500.00,
    },
  });

  // 5. Seed ArielMC Product Catalog (Jute, Leather, Ceramics)
  await prisma.productItem.upsert({
    where: {
      companyId_sku: {
        companyId: arielmc.id,
        sku: 'AMC-JUT-BAG-01',
      },
    },
    update: {},
    create: {
      companyId: arielmc.id,
      sku: 'AMC-JUT-BAG-01',
      name: 'Export Quality Laminated Jute Beach Tote Bag',
      category: ProductCategory.JUTE_BASED,
      description: '100% natural biodegradable golden jute fiber with reinforced cotton webbed handles.',
      hsCode: '4202.92.00',
      unitOfMeasure: 'PCS',
      costPriceBdt: 180.00,
      exportPriceUsd: 3.25,
      exportPriceGbp: 2.60,
      exportPriceEur: 3.05,
      minimumOrderQty: 1000,
      productionDays: 20,
    },
  });

  console.log('✅ Master CRM initialization complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

