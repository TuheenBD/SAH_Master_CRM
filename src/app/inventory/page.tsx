'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Tv2, 
  Globe2, 
  Building2, 
  CheckCircle2, 
  MapPin, 
  Layers, 
  Package, 
  Plus,
  Radio,
  Clock,
  Sparkles,
  Palmtree,
  Hotel,
  Users
} from 'lucide-react';
import { CompanyCode } from '@/lib/types';

export default function InventoryPage() {
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';

  // Reconciled DOOH & OOH Assets for Bizman Media Limited (18 Own Fixed Panels + 38 Partner Fixed + 5 Mobile Vans = 61 Total Units)
  const billboards = [
    {
      id: 'bb-1',
      company: 'BIZMAN',
      code: 'BZM-OWN-DHK-09',
      name: 'SKS Tower Flyover View Mega LED',
      type: 'OWN_LED_BOARD (18 Fixed / 17 Active)',
      location: 'SKS Tower, Mohakhali Flyover View, Dhaka',
      dimensions: '50ft x 30ft (2560x1408 P10)',
      dailyImpressions: 225000,
      totalSlots: 8,
      availableSlots: 8,
      monthlyRate: 360000,
      status: 'ONLINE',
    },
    {
      id: 'bb-2',
      company: 'BIZMAN',
      code: 'BZM-OWN-DHK-01',
      name: 'Police Plaza Concord (Hatirjheel / South)',
      type: 'OWN_LED_BOARD (18 Fixed / 17 Active)',
      location: 'Police Plaza Concord, Hatirjheel South Facing, Dhaka',
      dimensions: '20ft x 30ft (1152x1536 P10)',
      dailyImpressions: 212500,
      totalSlots: 8,
      availableSlots: 8,
      monthlyRate: 306000,
      status: 'ONLINE',
    },
    {
      id: 'bb-3',
      company: 'BIZMAN',
      code: 'BZM-OWN-DHK-02',
      name: 'Police Plaza Concord (Gulshan-1 Facing)',
      type: 'OWN_LED_BOARD (18 Fixed Fleet)',
      location: 'Police Plaza Concord, Gulshan-1 Facing, Dhaka',
      dimensions: '20ft x 30ft (1152x1728 P10)',
      dailyImpressions: 212500,
      totalSlots: 8,
      availableSlots: 0,
      monthlyRate: 306000,
      status: 'SOLD_OUT',
    },
    {
      id: 'bb-4',
      company: 'BIZMAN',
      code: 'BZM-OWN-DHK-06',
      name: 'Science Lab Circle Prime LED',
      type: 'OWN_LED_BOARD (18 Fixed / 17 Active)',
      location: 'Science Lab Circle (Dhanmondi & City College), Dhaka',
      dimensions: '20ft x 12ft (1024x640 P5)',
      dailyImpressions: 227500,
      totalSlots: 8,
      availableSlots: 8,
      monthlyRate: 270000,
      status: 'ONLINE',
    },
    {
      id: 'bb-5',
      company: 'BIZMAN',
      code: 'BZM-OWN-DHK-10',
      name: 'Kamlapur Railway Station (Entry Gate)',
      type: 'OWN_LED_BOARD (18 Fixed / 17 Active)',
      location: 'Kamlapur Railway Station Entry Gate, Dhaka',
      dimensions: '18ft x 12ft (1080x640 P4)',
      dailyImpressions: 212500,
      totalSlots: 8,
      availableSlots: 8,
      monthlyRate: 270000,
      status: 'ONLINE',
    },
    {
      id: 'bb-6',
      company: 'BIZMAN',
      code: 'BZM-OWN-COX-15',
      name: 'Dolphin Moor, Cox’s Bazar LED',
      type: 'OWN_LED_BOARD (18 Fixed / 17 Active)',
      location: 'Dolphin Moor Circle, Cox’s Bazar (+ Shugondha x2)',
      dimensions: '20ft x 13ft (1152x768 P5)',
      dailyImpressions: 225000,
      totalSlots: 8,
      availableSlots: 8,
      monthlyRate: 270000,
      status: 'ONLINE',
    },
    {
      id: 'bb-7',
      company: 'BIZMAN',
      code: 'BZM-PTN-DHK-21',
      name: 'Gulshan Circle-2, Rob Super Market LED',
      type: 'PARTNER_LED_BOARD (38 Fixed Network)',
      location: 'Gulshan Circle-2 (Gulshan 1 & Banani Facing), Dhaka',
      dimensions: '40ft x 20ft (1920x1080 P6)',
      dailyImpressions: 177500,
      totalSlots: 8,
      availableSlots: 8,
      monthlyRate: 324000,
      status: 'ONLINE',
    },
    {
      id: 'bb-8',
      company: 'BIZMAN',
      code: 'BZM-PTN-CTG-32',
      name: 'Golpahar Moor, Chattogram Partner LED',
      type: 'PARTNER_LED_BOARD (38 Fixed Network)',
      location: 'Golpahar Moor (Probortok Circle & CTG Medical), Chattogram',
      dimensions: '25ft x 15ft (1920x1080 P6)',
      dailyImpressions: 327500,
      totalSlots: 8,
      availableSlots: 8,
      monthlyRate: 180000,
      status: 'ONLINE',
    },
    {
      id: 'bb-9',
      company: 'BIZMAN',
      code: 'BZM-PTN-RAJ-40',
      name: 'Shaheb Bazar, Rajshahi (2 Screens)',
      type: 'PARTNER_LED_BOARD (38 Fixed Network)',
      location: 'Shaheb Bazar (Alu Potty & Rajshahi College), Rajshahi',
      dimensions: '16ft x 10ft x2 (1920x1080 P6)',
      dailyImpressions: 225000,
      totalSlots: 8,
      availableSlots: 8,
      monthlyRate: 252000,
      status: 'ONLINE',
    },
    {
      id: 'bb-10',
      company: 'BIZMAN',
      code: 'MOB-VAN-01',
      name: 'Mobile LED Activation Fleet (Units 01–05)',
      type: 'OWN_MOBILE_FLEET (5 Trucks)',
      location: 'Nationwide Touring Hydraulic LED Roadshow Fleet',
      dimensions: '12ft x 7ft x5 (1024x576 P5)',
      dailyImpressions: 65000,
      totalSlots: 5,
      availableSlots: 5,
      monthlyRate: 280000,
      status: 'ONLINE',
    },
    {
      id: 'bb-11',
      company: 'BIZMAN',
      code: 'BIZ-STB-DHK-05',
      name: 'Mohakhali Inter-District Bus Terminal Mega-Fascia (Main Canopy)',
      type: 'STATIC_MEGA_FASCIA (400ft Continuous)',
      location: 'Mohakhali Inter-District Bus Terminal, Dhaka',
      dimensions: '400ft x 8ft (3,200 sq.ft)',
      dailyImpressions: 90000,
      totalSlots: 1,
      availableSlots: 1,
      monthlyRate: 541667,
      status: 'PROPOSAL_HOLD',
    },
    {
      id: 'bb-12',
      company: 'BIZMAN',
      code: 'BIZ-STB-DHK-06',
      name: 'Mohakhali Terminal Front Dual Mid-Islands (Left & Right Series)',
      type: 'MEDIAN_SERIES (2 Islands - Robi Vacating)',
      location: 'Shaheed Tajuddin Ahmed Sarani Forecourt, Mohakhali',
      dimensions: 'Left & Right Landscaped Medians (4ft-10ft Eye-Level)',
      dailyImpressions: 90000,
      totalSlots: 2,
      availableSlots: 2,
      monthlyRate: 0,
      status: 'RELEASING_SOON',
    },
  ];

  // Linda Resort Limited Assets (Luxury Eco-Resort, Villas, Banquets & Timeshare Equity)
  const resortAssets = [
    {
      id: 'res-1',
      company: 'LINDA',
      code: 'LND-VIL-CPL-01',
      name: 'Couple Private Pool Villa (Unit 1 to 5)',
      type: 'PRIVATE_POOL_VILLA',
      description: 'Luxury 1-bedroom villa with private temperature-controlled plunge pool, open-sky sundeck & king master suite',
      capacity: '2 Adults + 1 Child',
      unitsTotal: 5,
      unitsAvailable: 2,
      rackRateBDT: 18500,
      investorSharePriceBDT: 2500000,
      annualYield: '18% Projected Yield',
      status: 'AVAILABLE',
    },
    {
      id: 'res-2',
      company: 'LINDA',
      code: 'LND-VIL-FAM-02',
      name: 'Family Executive Villa with Private Pool (5 Units)',
      type: 'FAMILY_VILLA',
      description: '2-Bedroom interconnected villa with 24ft private lap pool, living pavilion & dedicated butler service',
      capacity: '4-6 Guests',
      unitsTotal: 5,
      unitsAvailable: 1,
      rackRateBDT: 28500,
      investorSharePriceBDT: 4200000,
      annualYield: '19.5% Projected Yield',
      status: 'PARTIALLY_BOOKED',
    },
    {
      id: 'res-3',
      company: 'LINDA',
      code: 'LND-COT-ECO-03',
      name: 'Luxury Eco-Cottages (Garden & Forest View)',
      type: 'ECO_COTTAGES',
      description: 'Earthy luxury cottages built with terracotta, high wooden ceilings, bamboo verandas & organic garden view',
      capacity: '2-3 Guests',
      unitsTotal: 10,
      unitsAvailable: 4,
      rackRateBDT: 12500,
      investorSharePriceBDT: 1800000,
      annualYield: '17% Projected Yield',
      status: 'AVAILABLE',
    },
    {
      id: 'res-4',
      company: 'LINDA',
      code: 'LND-BNQ-HALL-01',
      name: 'Grand Evergreen Banquet & Corporate Retreat Hall',
      type: 'BANQUET_AND_EVENTS',
      description: 'Acoustic banquet pavilion with 500-guest seating capacity, high-tech audiovisual system & breakout lawn',
      capacity: '500 Persons',
      unitsTotal: 1,
      unitsAvailable: 1,
      rackRateBDT: 150000,
      investorSharePriceBDT: 0,
      annualYield: 'High Event Frequency',
      status: 'AVAILABLE',
    },
  ];

  // Sample ArielMC Export Products
  const exportProducts = [
    {
      id: 'prod-1',
      sku: 'AMC-JUT-BAG-01',
      name: 'Handcrafted Organic Laminated Jute Beach Tote',
      category: 'JUTE_BASED',
      hsCode: '4202.92.00',
      costBDT: 180,
      fobUSD: 3.25,
      fobGBP: 2.60,
      moq: '1,000 Pcs',
      leadDays: 20,
      markets: 'UK, Germany, France',
    },
    {
      id: 'prod-2',
      sku: 'AMC-LEA-WLT-04',
      name: 'Full-Grain Vegetable Tanned Leather RFID Wallet',
      category: 'LEATHER_GOODS',
      hsCode: '4202.31.00',
      costBDT: 450,
      fobUSD: 9.80,
      fobGBP: 7.90,
      moq: '500 Pcs',
      leadDays: 30,
      markets: 'Australia, US, UK',
    },
    {
      id: 'prod-3',
      sku: 'AMC-CER-SET-02',
      name: 'Handcrafted Glazed Terracotta Tea & Dinnerware Set',
      category: 'CERAMICS_&_POTTERY',
      hsCode: '6912.00.00',
      costBDT: 650,
      fobUSD: 16.50,
      fobGBP: 13.20,
      moq: '300 Sets',
      leadDays: 25,
      markets: 'Germany, Netherlands, US',
    },
    {
      id: 'prod-4',
      sku: 'AMC-TEX-THR-09',
      name: 'Hand-woven Cotton & Jute Home Throw Blanket',
      category: 'HOME_TEXTILE',
      hsCode: '6301.30.00',
      costBDT: 520,
      fobUSD: 12.00,
      fobGBP: 9.50,
      moq: '500 Pcs',
      leadDays: 25,
      markets: 'UK, Sweden, Australia',
    },
  ];

  const showProducts = activeCompany === 'CONSOLIDATED' || activeCompany === 'ARIELMC';
  const showBillboards = activeCompany === 'CONSOLIDATED' || activeCompany === 'BIZMAN';
  const showResort = activeCompany === 'CONSOLIDATED' || activeCompany === 'LINDA';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Layers className="h-4 w-4" />
            <span>Asset Fleet, Resort Capacity & Export Catalogs</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-white">
            Asset Inventory & Catalogs
          </h1>
          <p className="text-xs text-slate-400">
            ArielMC Global Export lines, Bizman Media DOOH fleet (18 Own Fixed Panels + 38 Partner Fixed + 5 Mobile Vans = 61 Reconciled Units), and Linda Resort Eco-Hospitality
          </p>
        </div>
      </div>

      {/* 1. Export Product Catalog (ArielMC) */}
      {showProducts && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-10 rounded overflow-hidden border border-slate-700 bg-white p-0.5 shadow flex items-center justify-center shrink-0">
                <img src="/logos/arielmc-logo.png" alt="ArielMC" className="max-h-5 w-auto object-contain" />
              </div>
              <h2 className="text-base font-bold text-white">
                ArielMC - Export Product Catalog
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              International B2B/B2C Portfolios: UK, EU, Australia & US
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {exportProducts.map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    ArielMC
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">{p.sku}</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-2">{p.name}</h3>
                  <div className="text-xs text-indigo-400 mt-1 font-semibold">{p.category}</div>
                </div>

                <div className="rounded-lg bg-slate-950/70 p-2.5 text-xs space-y-1.5 border border-slate-800/60 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Procurement Cost:</span>
                    <span className="text-slate-200">৳ {p.costBDT}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Export FOB (USD):</span>
                    <span className="text-emerald-400">${p.fobUSD.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Export FOB (GBP):</span>
                    <span className="text-slate-300">£{p.fobGBP.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">MOQ / Lead:</span>
                    <span className="text-slate-300">{p.moq} / {p.leadDays}d</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Target Markets: <strong className="text-slate-200">{p.markets}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Outdoor Media Section (Bizman Media) */}
      {showBillboards && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded overflow-hidden border border-slate-700 bg-[#0D3B29] p-0.5 shadow flex items-center justify-center shrink-0">
                <img src="/logos/bizman-logo.jpg" alt="Bizman Media" className="h-full w-full object-contain" />
              </div>
              <h2 className="text-base font-bold text-white">
                Bizman Media DOOH LED Screens & Static Billboards
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              18 Own Fixed Panels (17 Active) + 38 Partner Fixed + 5 Mobile Vans (61 Total Units)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {billboards
              .filter(b => activeCompany === 'CONSOLIDATED' || b.company === activeCompany)
              .map((b) => (
                <div key={b.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-950 text-blue-400 border border-blue-800">
                      {b.company}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">{b.code}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{b.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{b.location}</span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-950/70 p-2.5 text-xs grid grid-cols-2 gap-2 border border-slate-800/60">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Dimensions:</span>
                      <span className="text-slate-200 font-medium">{b.dimensions}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Daily Traffic:</span>
                      <span className="text-slate-200 font-medium font-mono">{b.dailyImpressions.toLocaleString()} views</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Slot Availability:</span>
                      <span className="text-emerald-400 font-bold">{b.availableSlots} of {b.totalSlots} Slots Free</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Rate / Month:</span>
                      <span className="text-indigo-400 font-bold font-mono">৳ {b.monthlyRate.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300 font-mono text-[10px]">
                      {b.type}
                    </span>
                    <span className="text-emerald-400 font-semibold">{b.status}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 3. Linda Resort Hospitality Section */}
      {showResort && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 px-2.5 rounded-lg overflow-hidden border border-[#DDE3DD] bg-[#112717] shadow flex items-center justify-center shrink-0">
                <img src="/logos/linda-logo.png" alt="Linda Resort" className="h-7 w-auto object-contain" />
              </div>
              <h2 className="text-base font-bold text-white">
                Linda Resort Limited: Luxury Villas, Cottages & Banquets
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Executive Director Portfolio &bull; www.lindaresort.com
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {resortAssets.map((r) => (
              <div key={r.id} className="rounded-xl border border-[#C8A96A]/30 bg-slate-900/60 p-5 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#FFF3D6] text-[#8A5A00] border border-[#FBE0A8]">
                    LINDA RESORT
                  </span>
                  <span className="font-mono text-[#C8A96A] text-xs font-bold">{r.code}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Hotel className="h-4 w-4 text-[#C8A96A]" />
                    <span>{r.name}</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{r.description}</p>
                </div>

                <div className="rounded-lg bg-slate-950/70 p-3 text-xs grid grid-cols-2 sm:grid-cols-3 gap-2.5 border border-slate-800">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Capacity:</span>
                    <span className="text-slate-200 font-semibold">{r.capacity}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Inventory Fleet:</span>
                    <span className="text-emerald-400 font-bold">{r.unitsAvailable} Available of {r.unitsTotal} Units</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Rack Rate / Night:</span>
                    <span className="text-[#C8A96A] font-bold font-mono">৳ {r.rackRateBDT.toLocaleString()}</span>
                  </div>
                  {r.investorSharePriceBDT > 0 && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-500 text-[10px] block">Timeshare Share Equity:</span>
                      <span className="text-sky-400 font-mono font-bold">৳ {r.investorSharePriceBDT.toLocaleString()}</span>
                      <span className="text-slate-400 text-[10px] ml-1.5 font-medium">({r.annualYield})</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[#C8A96A] font-mono text-[10px]">
                    {r.type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Active In Fleet</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

