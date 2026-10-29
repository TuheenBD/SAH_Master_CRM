'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Contact, 
  Search, 
  Plus, 
  PhoneCall, 
  MessageSquare, 
  Building2, 
  MapPin, 
  Tag, 
  Layers, 
  Sparkles, 
  UserCheck, 
  ArrowRight,
  Filter,
  CheckCircle2,
  Users
} from 'lucide-react';
import { CompanyCode, MasterContact, ContactCategory } from '@/lib/types';
import { INITIAL_CONTACTS } from '@/lib/mock-data';

const CATEGORY_TABS: { key: string; label: string }[] = [
  { key: 'ALL', label: 'All Contacts' },
  { key: 'BUYER_CLIENT', label: 'Buyers & Clients' },
  { key: 'SUPPLIER_RAW_MATERIAL', label: 'Suppliers (Jute/Leather)' },
  { key: 'VENDOR_BILLBOARD', label: 'Billboard Vendors (50+/70+)' },
  { key: 'CO_WORKER', label: 'Co-Workers & Team' },
  { key: 'FRIEND_FAMILY', label: 'Friends & Family' },
];

export default function ContactsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';

  const [contacts, setContacts] = useState<MasterContact[]>(INITIAL_CONTACTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Conversion Modal State
  const [convertingContact, setConvertingContact] = useState<MasterContact | null>(null);
  const [targetCompany, setTargetCompany] = useState<'BIZMAN' | 'ADPRO' | 'ARIELMC'>('BIZMAN');
  const [dealTitle, setDealTitle] = useState<string>('');
  const [dealValue, setDealValue] = useState<string>('');
  const [pipelineType, setPipelineType] = useState<string>('DOOH_MEDIA_SLOT');
  const [conversionSuccess, setConversionSuccess] = useState<boolean>(false);

  // Filter contacts
  const filteredContacts = contacts.filter((c) => {
    // Company match if not consolidated
    const matchesCompany = activeCompany === 'CONSOLIDATED' 
      ? true 
      : c.companyAffiliation === activeCompany || c.companyAffiliation === 'GROUP' || c.companyAffiliation === 'PERSONAL';

    // Category match
    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;

    // Search query match
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      c.fullName.toLowerCase().includes(q) ||
      c.organization.toLowerCase().includes(q) ||
      c.primaryPhone.includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q));

    return matchesCompany && matchesCategory && matchesSearch;
  });

  const handleOpenConvert = (contact: MasterContact) => {
    setConvertingContact(contact);
    setDealTitle(`${contact.organization} - New Commercial Opportunity`);
    setTargetCompany(contact.companyAffiliation === 'ARIELMC' ? 'ARIELMC' : contact.companyAffiliation === 'ADPRO' ? 'ADPRO' : 'BIZMAN');
    setDealValue('500000');
    setPipelineType(contact.companyAffiliation === 'ARIELMC' ? 'EXPORT_JUTE' : 'DOOH_MEDIA_SLOT');
    setConversionSuccess(false);
  };

  const handleExecuteConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingContact) return;

    // Mark contact as converted
    setContacts(prev => prev.map(c => c.id === convertingContact.id ? { ...c, convertedLeadId: `lead-${Date.now()}` } : c));
    setConversionSuccess(true);
    setTimeout(() => {
      setConvertingContact(null);
      router.push(`/leads?company=${targetCompany}`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Contact className="h-4 w-4" />
            <span>Unified Master Rolodex</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-white">
            Master Contact Database
          </h1>
          <p className="text-xs text-slate-400">
            All your contacts in one place: Clients, Buyers, Suppliers, Billboard Vendors, Team, and Family & Friends
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400">
            Total Contacts: <strong className="text-white font-mono">{filteredContacts.length}</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedCategory(tab.key)}
              className={`rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition-all ${
                selectedCategory === tab.key
                  ? 'bg-indigo-600 text-white font-semibold shadow'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, company, phone, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/90 pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 hover:border-slate-700 transition-all shadow-sm"
          >
            {/* Header / Category Badge */}
            <div className="flex items-center justify-between text-xs">
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                contact.category === 'BUYER_CLIENT' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800' :
                contact.category === 'SUPPLIER_RAW_MATERIAL' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                contact.category === 'VENDOR_BILLBOARD' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                contact.category === 'CO_WORKER' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                {contact.category.replace(/_/g, ' ')}
              </span>

              <span className="text-[10px] text-slate-400 font-mono">
                {contact.companyAffiliation}
              </span>
            </div>

            {/* Name & Title */}
            <div>
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>{contact.fullName}</span>
                {contact.convertedLeadId && (
                  <span className="text-[10px] rounded bg-emerald-950 border border-emerald-800 text-emerald-400 px-1.5 py-0.5 font-semibold">
                    ✓ Active Lead
                  </span>
                )}
              </h3>
              <div className="text-xs text-slate-300 font-medium">{contact.designation}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <Building2 className="h-3 w-3 text-slate-500" />
                <span>{contact.organization} &bull; {contact.city}, {contact.country}</span>
              </div>
            </div>

            {/* Relationship / Brief Notes */}
            <p className="text-[11px] text-slate-400 line-clamp-2 bg-slate-950/60 p-2 rounded border border-slate-800/60">
              {contact.relationshipNotes}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 text-[10px]">
              {contact.tags.map((tag, idx) => (
                <span key={idx} className="rounded bg-slate-800/70 text-slate-400 px-1.5 py-0.5">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Action Bar: Call, WhatsApp, Convert to Lead */}
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-xs">
              <div className="flex items-center gap-1.5">
                {/* One-Click Call */}
                <a
                  href={`tel:${contact.primaryPhone}`}
                  title={`Call ${contact.fullName}`}
                  className="rounded p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                >
                  <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${contact.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="WhatsApp Chat"
                  className="rounded p-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Convert to Lead Button */}
              {contact.isConvertibleToLead && !contact.convertedLeadId && (
                <button
                  onClick={() => handleOpenConvert(contact)}
                  className="flex items-center gap-1 rounded bg-indigo-600/90 hover:bg-indigo-600 text-white px-2.5 py-1 text-[11px] font-semibold transition-colors shadow-sm"
                >
                  <Sparkles className="h-3 w-3 text-amber-300" />
                  <span>Turn to Lead</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Convert Contact to Lead Modal */}
      {convertingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">Turn Contact Into Active Lead</h2>
              </div>
              <button
                onClick={() => setConvertingContact(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {conversionSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="h-10 w-10 mx-auto rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-white">Lead Successfully Created!</h3>
                <p className="text-xs text-slate-400">Redirecting to {targetCompany} Pipeline...</p>
              </div>
            ) : (
              <form onSubmit={handleExecuteConvert} className="space-y-4 text-xs">
                <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Contact Person:</div>
                  <div className="font-bold text-white">{convertingContact.fullName} ({convertingContact.organization})</div>
                  <div className="text-[11px] text-slate-500">{convertingContact.primaryPhone} &bull; {convertingContact.email}</div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Target Business Entity</label>
                  <select
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="BIZMAN">Bizman Media Limited (DOOH / Static / Events)</option>
                    <option value="ADPRO">Adpro Communications Limited (DOOH / Activations)</option>
                    <option value="ARIELMC">Ariel Marketing & Communications (Global Export)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Deal Title</label>
                  <input
                    type="text"
                    required
                    value={dealTitle}
                    onChange={(e) => setDealTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Pipeline Domain</label>
                    <select
                      value={pipelineType}
                      onChange={(e) => setPipelineType(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="DOOH_MEDIA_SLOT">DOOH Screen Slot Booking</option>
                      <option value="EVENT_ACTIVATION">Event / Roadshow Activation</option>
                      <option value="STATIC_BILLBOARD">Static Mega Billboard</option>
                      <option value="EXPORT_JUTE">Export: Jute Products</option>
                      <option value="EXPORT_LEATHER">Export: Leather Goods</option>
                      <option value="EXPORT_CERAMICS">Export: Ceramics & Pottery</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Estimated Value</label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        value={dealValue}
                        onChange={(e) => setDealValue(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 pr-12 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                      />
                      <span className="absolute right-2 top-2 text-slate-500 font-mono">
                        {targetCompany === 'ARIELMC' ? 'USD' : 'BDT'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setConvertingContact(null)}
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-1.5 font-semibold text-white hover:bg-indigo-500 shadow"
                  >
                    Create Lead & Open Pipeline
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

