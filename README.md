# Master CRM — Personal Multi-Company Business & Financial Operating System

A customized personal Master CRM engineered with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **PostgreSQL (Prisma ORM)**.

Built specifically to manage three business entities owned and directed by the user:

1. **Bizman Media Limited** *(Director & CEO)*
   - **Core Operations:** DOOH Countrywide (20 Own High-Res LED Displays, 50+ Partner Vendor Screens), LED Installation, Event Management, Static Billboards, Gift Items, and Activations.
   - **Base Currency:** BDT (৳)

2. **Adpro Communications Limited** *(General Manager)*
   - **Core Operations:** DOOH Countrywide (1 Own Flagship LED Unipole Display, 70+ Partner Vendor Screens), LED Installation, Static Billboards, Corporate Gift Items, and Brand Activations.
   - **Base Currency:** BDT (৳)

3. **Ariel Marketing & Communications Limited** *(Managing Director)*
   - **Core Operations:** Global B2B & B2C Export to **UK, EU, Australia & US**.
   - **Product Lines:** Jute-based goods, Full-grain Leather, Home textiles, Ceramics, and Terracotta Pottery.
   - **Base Currency:** USD ($) / Secondary BDT

---

## 🏛️ System Architecture

```
                       ┌──────────────────────────────────────────────┐
                       │    Personal Master CRM Unified Dashboard     │
                       │  [Consolidated View | BIZMAN | ADPRO | AMC]  │
                       └──────────────────────┬───────────────────────┘
                                              │
         ┌────────────────────────────────────┼────────────────────────────────────┐
         ▼                                    ▼                                    ▼
┌──────────────────┐                ┌──────────────────┐                 ┌──────────────────┐
│   Bizman Media   │                │   Adpro Comm     │                 │     ArielMC      │
│  (Director & CEO)│                │ (General Manager)│                 │(Managing Director│
│──────────────────│                │──────────────────│                 │──────────────────│
│• 20 Own LED      │                │• 1 Own LED       │                 │• UK, EU, AU, US  │
│• 50+ Vendor LED  │                │• 70+ Vendor LED  │                 │• Jute & Leather  │
│• Static & Events │                │• Static & Gifts  │                 │• Textile/Ceramics│
│• Currency: BDT   │                │• Currency: BDT   │                 │• Currency: USD   │
└────────┬─────────┘                └────────┬─────────┘                 └────────┬─────────┘
         │                                   │                                    │
         └───────────────────────────────────┼────────────────────────────────────┘
                                             ▼
            ┌─────────────────────────────────────────────────────────────────┐
            │                  Multi-Company PostgreSQL Engine                 │
            │ • Polymorphic CRM Leads (DOOH Slots vs Export Shipments)        │
            │ • Double-Entry Accounting (JournalLines: ΣDebits == ΣCredits)   │
            │ • Deal-Wise Expense Tagging (Gross/Net Profit Margin per Deal)  │
            │ • Automations: Email Drips, WhatsApp/Tel, Calendar, Markdown    │
            └─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Modules & Capabilities

### 1. Unified Master Dashboard & Consolidated View
- Switch instantly between **Consolidated Master View** (aggregating all three companies) or focus exclusively on **Bizman**, **Adpro**, or **ArielMC**.
- Executive metrics: YTD Revenue, Cost of Goods Sold (including 50+/70+ vendor screen payouts), Gross Margin %, Operating Overhead, and Net Operating Income.

### 2. Polymorphic Lead & Pipeline Control (`/leads`)
- Handles both B2B advertising slot bookings (Bizman/Adpro) and international physical product container shipments (ArielMC).
- **One-Click Native Calling:** Instant `tel:{phone}` cellular/desktop dialer.
- **WhatsApp Deep Links:** Pre-formatted `https://wa.me/{whatsapp}` chats with proposal context.
- **Embedded Markdown Notepad:** Live autosaving scratchpad attached directly to each client opportunity.

### 3. Deal-Wise Daily Expense Tracker (`/expenses`)
- Record daily operational costs and map them directly to a specific Lead/Order.
- Automatically computes **Deal Net Margin** so you know exact profitability per campaign.
- Auto-generates a balanced **General Ledger Journal Entry** with every expense (Debits 5000-series Expense, Credits 1000-series Bank/Cash).

### 4. Dual-Entry Accounting Engine (`/finance`)
- **Strict Double-Entry Bookkeeping:** Guaranteed mathematical constraint that `ΣDebits == ΣCredits`.
- **Real-Time Statements:**
  - **Profit & Loss (P&L):** Revenue, COGS, Gross Profit, Operating Expenses, Net Operating Profit.
  - **Balance Sheet:** Assets (Cash, Bank, AR, LED Equipment) = Liabilities (AP, Vendor Bills, Taxes) + Equity.
  - **General Ledger:** Complete audit trail of posted Journal Entries.
  - **Chart of Accounts (CoA):** Standardized numbering system (1000s Assets, 2000s Liabilities, 3000s Equity, 4000s Revenue, 5000s COGS, 6000s Operating Expenses).

### 5. Automated Email Sequences (`/automations`)
- Multi-step drip workflows triggered automatically when a Lead transitions pipeline stages (e.g., Quotation Sent -> Follow-up 1 -> Follow-up 2).

### 6. Calendar & Action Items (`/calendar`)
- Two-way synchronized agenda for client negotiation calls, screen brightness field checks, and export courier tracking.

### 7. Persistent Executive Scratchpad (`/scratchpad`)
- Standalone markdown scratchpad saved locally and syncable to the database for quick thoughts, meeting notes, and calculations.

---

## 🛠️ Getting Started (Local Setup)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update your `DATABASE_URL` with your PostgreSQL database credentials (from Railway, Neon, Supabase, or local PostgreSQL):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/master_crm?schema=public"
NEXTAUTH_SECRET="your-secure-secret"
```

### 3. Initialize Database Schema & Seed Data
```bash
# Push schema to PostgreSQL
npm run prisma:push

# Seed Bizman, Adpro, and ArielMC companies and Chart of Accounts
npm run prisma:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Instant Cloud Deployment

### Option A: Railway (Recommended for all-in-one Full Stack + PostgreSQL)
1. Log into [Railway.app](https://railway.app).
2. Click **New Project** -> **Provision PostgreSQL**.
3. Add a second service from this GitHub repository.
4. Set the environment variable `DATABASE_URL` linking to the provisioned PostgreSQL service.
5. Railway will automatically build and launch your live application with continuous deployment!

### Option B: Vercel + Supabase / Neon
1. Push this repository to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Connect a PostgreSQL database from **Supabase** or **Neon**.
4. Set `DATABASE_URL` in Vercel environment settings.
5. Deploy!

