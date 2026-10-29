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

  // DOOH Assets for Bizman Media Limited (20 Own + 50+ Partner Network)
  const billboards = [
    {
      id: 'bb-1',
      company: 'BIZMAN',
      code: 'BIZ-LED-DHA-01',
      name: 'Dhanmondi 27 Crossing Digital Display',
      type: 'OWN_LED_BOARD (20 Fleet)',
      location: 'Mirpur Road x Dhanmondi 27 Crossing, Dhaka',
      dimensions: '40ft x 20ft',
      dailyImpressions: 185000,
      totalSlots: 10,
      availableSlots: 4,
      monthlyRate: 150000,
      status: 'PARTIALLY_BOOKED',
    },
    {
      id: 'bb-2',
      company: 'BIZMAN',
      code: 'BIZ-LED-GUL-02',
      name: 'Gulshan 2 Circle North Facing Screen',
      type: 'OWN_LED_BOARD (20 Fleet)',
      location: 'Gulshan 2 Roundabout, Dhaka',
      dimensions: '45ft x 25ft High Brightness P6',
      dailyImpressions: 220000,
      totalSlots: 10,
      availableSlots: 2,
      monthlyRate: 220000,
      status: 'PARTIALLY_BOOKED',
    },
    {
      id: 'bb-3',
      company: 'BIZMAN',
      code: 'BIZ-VND-CTG-14',
      name: 'Chittagong GEC Circle Partner Screen',
      type: 'VENDOR_LED_BOARD (50+ Network)',
      location: 'GEC Circle, Chittagong',
      dimensions: '30ft x 15ft',
      dailyImpressions: 140000,
      totalSlots: 10,
      availableSlots: 6,
      monthlyRate: 110000,
      status: 'AVAILABLE',
      vendor: 'Chittagong Media Vision Ltd',
    },
    {
      id: 'bb-4',
      company: 'BIZMAN',
      code: 'BIZ-LED-MOT-03',
      name: 'Motijheel Commercial Hub Flagship LED',
      type: 'OWN_LED_BOARD (20 Fleet)',
      location: 'Shapla Chattar, Motijheel, Dhaka',
      dimensions: '50ft x 25ft Unipole LED',
      dailyImpressions: 260000,
      totalSlots: 12,
      availableSlots: 3,
      monthlyRate: 250000,
      status: 'PARTIALLY_BOOKED',
    },
    {
      id: 'bb-5',
      company: 'BIZMAN',
      code: 'BIZ-VND-RAJ-08',
      name: 'Rajshahi Shaheb Bazar Partner Display',
      type: 'VENDOR_LED_BOARD (50+ Network)',
      location: 'Shaheb Bazar Zero Point, Rajshahi',
      dimensions: '25ft x 15ft',
      dailyImpressions: 95000,
      totalSlots: 10,
      availableSlots: 7,
      monthlyRate: 75000,
      status: 'AVAILABLE',
      vendor: 'North Bengal Outdoor Hub',
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
            ArielMC Global Export lines, Bizman Media DOOH fleet (20 Own + 50+ Vendor), and Linda Resort Eco-Hospitality (Pool Villas & Banquets)
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
              Own Screens & Partner Vendor Network (20 Own Displays / 50+ Nationwide)
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
              <div className="h-10 px-2.5 rounded-lg overflow-hidden border border-[#DDE3DD] bg-black shadow flex items-center justify-center shrink-0">
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

