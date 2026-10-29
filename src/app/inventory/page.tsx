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
  Sparkles
} from 'lucide-react';
import { CompanyCode } from '@/lib/types';

export default function InventoryPage() {
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';

  // Sample DOOH Assets for Bizman Media and Adpro
  const billboards = [
    {
      id: 'bb-1',
      company: 'BIZMAN',
      code: 'BIZ-LED-DHA-01',
      name: 'Dhanmondi 27 Crossing Digital Display',
      type: 'OWN_LED_BOARD',
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
      type: 'OWN_LED_BOARD',
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
      company: 'ADPRO',
      code: 'ADP-LED-MOT-01',
      name: 'Motijheel Commercial Area Flagship LED',
      type: 'OWN_LED_BOARD (Premium)',
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
      company: 'ADPRO',
      code: 'ADP-VND-RAJ-08',
      name: 'Rajshahi Shaheb Bazar Partner Display',
      type: 'VENDOR_LED_BOARD (70+ Network)',
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

  const showBillboards = activeCompany === 'CONSOLIDATED' || activeCompany === 'BIZMAN' || activeCompany === 'ADPRO';
  const showProducts = activeCompany === 'CONSOLIDATED' || activeCompany === 'ARIELMC';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Layers className="h-4 w-4" />
            <span>Asset Fleet & Product Catalogs</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-white">
            DOOH Inventory & Export Catalog
          </h1>
          <p className="text-xs text-slate-400">
            Tracking Bizman (20 Own + 50+ Vendor), Adpro (1 Own + 70+ Vendor), and ArielMC Export lines
          </p>
        </div>
      </div>

      {/* Outdoor Media Section (Bizman / Adpro) */}
      {showBillboards && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Tv2 className="h-5 w-5 text-blue-400" />
              <span>DOOH LED Screens & Static Billboards</span>
            </h2>
            <span className="text-xs text-slate-400">
              Own Screens & Partner Vendor Network (50+ Bizman / 70+ Adpro)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {billboards
              .filter(b => activeCompany === 'CONSOLIDATED' || b.company === activeCompany)
              .map((b) => (
                <div key={b.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      b.company === 'BIZMAN' ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-orange-950 text-orange-400 border border-orange-800'
                    }`}>
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

      {/* Export Product Catalog (ArielMC) */}
      {showProducts && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-emerald-400" />
              <span>Ariel Marketing & Communications - Export Product Catalog</span>
            </h2>
            <span className="text-xs text-slate-400">
              International B2B/B2C Portfolios: UK, EU, Australia & US
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {exportProducts.map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    ARIELMC
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
    </div>
  );
}

