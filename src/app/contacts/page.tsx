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
  Users,
  LayoutGrid,
  Table as TableIcon,
  Edit2,
  Trash2,
  CheckSquare,
  Square,
  MoreVertical,
  X,
  Mail,
  Copy,
  AlertCircle
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
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  // Multi-Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<MasterContact | null>(null);
  const [convertingContact, setConvertingContact] = useState<MasterContact | null>(null);

  // Form State (Used for both Create and Edit)
  const [formData, setFormData] = useState({
    fullName: '',
    organization: '',
    designation: '',
    category: 'BUYER_CLIENT' as ContactCategory,
    primaryPhone: '',
    whatsappNumber: '',
    email: '',
    city: 'Dhaka',
    country: 'Bangladesh',
    companyAffiliation: 'BIZMAN' as 'BIZMAN' | 'LINDA' | 'ARIELMC' | 'PERSONAL' | 'GROUP',
    relationshipNotes: '',
    tags: 'Media, Corporate',
    isConvertibleToLead: true,
  });

  // Lead Conversion State
  const [targetCompany, setTargetCompany] = useState<'BIZMAN' | 'LINDA' | 'ARIELMC'>('BIZMAN');
  const [dealTitle, setDealTitle] = useState<string>('');
  const [dealValue, setDealValue] = useState<string>('');
  const [pipelineType, setPipelineType] = useState<string>('DOOH_MEDIA_SLOT');
  const [conversionSuccess, setConversionSuccess] = useState<boolean>(false);

  // Filter contacts
  const filteredContacts = contacts.filter((c) => {
    const matchesCompany = activeCompany === 'CONSOLIDATED' 
      ? true 
      : c.companyAffiliation === activeCompany || c.companyAffiliation === 'GROUP' || c.companyAffiliation === 'PERSONAL';

    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;

    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      c.fullName.toLowerCase().includes(q) ||
      c.organization.toLowerCase().includes(q) ||
      c.primaryPhone.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      c.tags.some(t => t.toLowerCase().includes(q));

    return matchesCompany && matchesCategory && matchesSearch;
  });

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredContacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredContacts.map(c => c.id));
    }
  };

  // Delete Handler
  const handleDeleteSingle = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from your Master Contact database?`)) {
      setContacts(prev => prev.filter(c => c.id !== id));
      setSelectedIds(prev => prev.filter(x => x !== id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected contacts?`)) {
      setContacts(prev => prev.filter(c => !selectedIds.includes(c.id)));
      setSelectedIds([]);
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({
      fullName: '',
      organization: '',
      designation: '',
      category: 'BUYER_CLIENT',
      primaryPhone: '',
      whatsappNumber: '',
      email: '',
      city: 'Dhaka',
      country: 'Bangladesh',
      companyAffiliation: activeCompany === 'CONSOLIDATED' ? 'BIZMAN' : activeCompany,
      relationshipNotes: '',
      tags: 'Client, Priority',
      isConvertibleToLead: true,
    });
    setIsNewModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (contact: MasterContact) => {
    setEditingContact(contact);
    setFormData({
      fullName: contact.fullName,
      organization: contact.organization,
      designation: contact.designation || '',
      category: contact.category,
      primaryPhone: contact.primaryPhone,
      whatsappNumber: contact.whatsappNumber || '',
      email: contact.email || '',
      city: contact.city || 'Dhaka',
      country: contact.country || 'Bangladesh',
      companyAffiliation: contact.companyAffiliation as any,
      relationshipNotes: contact.relationshipNotes || '',
      tags: contact.tags.join(', '),
      isConvertibleToLead: contact.isConvertibleToLead,
    });
  };

  // Submit Create or Edit Form
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingContact) {
      // Update existing
      setContacts(prev => prev.map(c => {
        if (c.id === editingContact.id) {
          return {
            ...c,
            ...formData,
            tags: tagArray,
          };
        }
        return c;
      }));
      setEditingContact(null);
    } else {
      // Create New
      const newContact: MasterContact = {
        id: `cnt-${Date.now()}`,
        ...formData,
        tags: tagArray,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setContacts([newContact, ...contacts]);
      setIsNewModalOpen(false);
    }
  };

  // Convert to Lead Handlers
  const handleOpenConvert = (contact: MasterContact) => {
    setConvertingContact(contact);
    setDealTitle(`${contact.organization} - New Commercial Project`);
    setTargetCompany(contact.companyAffiliation === 'ARIELMC' ? 'ARIELMC' : contact.companyAffiliation === 'LINDA' ? 'LINDA' : 'BIZMAN');
    setDealValue(contact.companyAffiliation === 'LINDA' ? '2500000' : '600000');
    setPipelineType(contact.companyAffiliation === 'ARIELMC' ? 'EXPORT_JUTE' : contact.companyAffiliation === 'LINDA' ? 'RESORT_BANQUET_RETREAT' : 'DOOH_MEDIA_SLOT');
    setConversionSuccess(false);
  };

  const handleExecuteConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingContact) return;

    setContacts(prev => prev.map(c => c.id === convertingContact.id ? { ...c, convertedLeadId: `lead-${Date.now()}` } : c));
    setConversionSuccess(true);
    setTimeout(() => {
      setConvertingContact(null);
      router.push(`/leads?company=${targetCompany}`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & New Contact Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE3DD] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8A96A]">
            <Contact className="h-4 w-4 text-[#C8A96A]" />
            <span>Master Rolodex & Directory</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-[#1F3A2E] tracking-tight">
            Master Contact Database
          </h1>
          <p className="text-xs text-[#6B7269] font-medium">
            Clients, foreign buyers, raw material suppliers, 50+/70+ billboard vendors, team members, and personal contacts
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid vs Table View Switcher */}
          <div className="flex items-center rounded-xl bg-white border border-[#DDE3DD] p-1 text-xs shadow-xs">
            <button
              onClick={() => setViewMode('GRID')}
              title="Grid Card View"
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-bold text-xs ${
                viewMode === 'GRID' 
                  ? 'bg-[#1F3A2E] text-[#C8A96A] border border-[#1F3A2E] shadow-sm' 
                  : 'text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              title="Table View"
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-bold text-xs ${
                viewMode === 'TABLE' 
                  ? 'bg-[#1F3A2E] text-[#C8A96A] border border-[#1F3A2E] shadow-sm' 
                  : 'text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]'
              }`}
            >
              <TableIcon className="h-4 w-4" />
              <span>Table</span>
            </button>
          </div>

          {/* New Contact Action */}
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] px-4 py-2 text-xs font-bold border border-[#1F3A2E] shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {/* Filter, Search & Bulk Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedCategory(tab.key)}
              className={`rounded-lg px-3 py-1.5 font-bold whitespace-nowrap transition-all ${
                selectedCategory === tab.key
                  ? 'bg-[#1F3A2E] text-[#C8A96A] font-extrabold shadow-sm border border-[#1F3A2E]'
                  : 'bg-white border border-[#DDE3DD] text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#6B7269]" />
          <input
            type="text"
            placeholder="Search by name, organization, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#DDE3DD] bg-white pl-9 pr-3 py-2 text-xs text-[#1A1A1A] placeholder:text-[#6B7269] focus:border-[#1F3A2E] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
          />
        </div>
      </div>

      {/* Bulk Selection Bar (Shows when 1+ contacts selected) */}
      {selectedIds.length > 0 && (
        <div className="rounded-xl border border-indigo-500/40 bg-indigo-950/40 p-3 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4 text-indigo-400" />
              <span>{selectedIds.length} contact(s) selected</span>
            </span>
            <button
              onClick={handleSelectAll}
              className="text-slate-400 hover:text-white underline text-[11px]"
            >
              {selectedIds.length === filteredContacts.length ? 'Deselect All' : 'Select All Filtered'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 text-xs font-semibold shadow transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Selected</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 1. GRID VIEW MODE (CARDS) */}
      {/* =================================================================== */}
      {viewMode === 'GRID' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => {
            const isChecked = selectedIds.includes(contact.id);
            return (
              <div
                key={contact.id}
                className={`rounded-xl border p-4 space-y-3 transition-all relative ${
                  isChecked
                    ? 'border-[#1F3A2E] bg-white shadow-md'
                    : 'border-[#DDE3DD] bg-white hover:border-[#1F3A2E] hover:shadow-sm'
                }`}
              >
                {/* Card Top Row: Checkbox, Affiliation Badge, Category Badge & Actions */}
                <div className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleToggleSelect(contact.id)}
                      className="text-[#6B7269] hover:text-[#1F3A2E] transition-colors"
                      title="Select Contact"
                    >
                      {isChecked ? (
                        <CheckSquare className="h-4 w-4 text-[#1F3A2E]" />
                      ) : (
                        <Square className="h-4 w-4 text-[#6B7269]" />
                      )}
                    </button>

                    {/* Affiliation Badge */}
                    {contact.companyAffiliation === 'ARIELMC' && (
                      <span className="bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] px-1.5 py-0.5 rounded text-[10px] font-bold shadow-xs">
                        ArielMC
                      </span>
                    )}
                    {contact.companyAffiliation === 'BIZMAN' && (
                      <span className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] px-1.5 py-0.5 rounded text-[10px] font-bold shadow-xs">
                        Bizman
                      </span>
                    )}
                    {contact.companyAffiliation === 'LINDA' && (
                      <span className="bg-black text-white px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-wider shadow-xs">
                        Linda Resort
                      </span>
                    )}
                    {contact.companyAffiliation === 'GROUP' && (
                      <span className="bg-[#EEF2FF] border border-[#C7D2FE] text-[#4338CA] px-1.5 py-0.5 rounded text-[10px] font-bold shadow-xs">
                        Group
                      </span>
                    )}
                    {contact.companyAffiliation === 'PERSONAL' && (
                      <span className="bg-[#FDF2F8] border border-[#FBCFE8] text-[#9D174D] px-1.5 py-0.5 rounded text-[10px] font-bold shadow-xs">
                        Personal
                      </span>
                    )}

                    {/* Category Badge */}
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded shadow-xs ${
                      contact.category === 'BUYER_CLIENT' ? 'bg-[#E8F0FA] text-[#1F5FA8] border border-[#BBD5F2]' :
                      contact.category === 'SUPPLIER_RAW_MATERIAL' ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]' :
                      contact.category === 'VENDOR_BILLBOARD' ? 'bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] font-extrabold' :
                      contact.category === 'CO_WORKER' ? 'bg-[#F3E8FF] text-[#6B21A8] border border-[#E9D5FF]' :
                      'bg-[#E4F3E9] text-[#1E6B3A] border border-[#B6E2C5]'
                    }`}>
                      {contact.category.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Edit & Delete Mini-Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(contact)}
                      title="Edit Contact"
                      className="p-1 rounded text-[#6B7269] hover:text-[#1F3A2E] hover:bg-[#F4F6F4] transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSingle(contact.id, contact.fullName)}
                      title="Delete Contact"
                      className="p-1 rounded text-[#6B7269] hover:text-rose-600 hover:bg-[#FEE8E8] transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Name, Designation & Organization */}
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-[#1F3A2E] flex items-center justify-between">
                    <span>{contact.fullName}</span>
                    {contact.convertedLeadId && (
                      <span className="text-[10px] rounded bg-[#E4F3E9] border border-[#B6E2C5] text-[#1E6B3A] px-1.5 py-0.5 font-bold">
                        ✓ Active Lead
                      </span>
                    )}
                  </h3>
                  <div className="text-xs text-[#1A1A1A] font-bold">{contact.designation}</div>
                  
                  {/* COMPANY - High Visibility */}
                  <div className="text-xs flex items-center gap-1.5 pt-0.5">
                    <Building2 className="h-3.5 w-3.5 text-[#1F3A2E] shrink-0" />
                    <span className="font-black text-[#1F3A2E] text-xs tracking-tight">{contact.organization}</span>
                  </div>

                  {/* LOCATION - High Visibility */}
                  <div className="text-xs flex items-center gap-1.5 text-[#2C4A3B] font-bold">
                    <MapPin className="h-3.5 w-3.5 text-[#C8A96A] shrink-0" />
                    <span>{contact.city}, {contact.country}</span>
                  </div>
                </div>

                {/* Relationship Notes */}
                <p className="text-[11px] text-[#444] line-clamp-2 bg-[#F8F9F8] p-2.5 rounded-lg border border-[#DDE3DD]">
                  {contact.relationshipNotes}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 text-[10px]">
                  {contact.tags.map((tag, idx) => (
                    <span key={idx} className="rounded bg-[#F4F6F4] text-[#1F3A2E] border border-[#DDE3DD] px-1.5 py-0.5 font-semibold">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Bottom Action Bar: Calling, WhatsApp & Lead Conversion */}
                <div className="flex items-center justify-between border-t border-[#DDE3DD] pt-2.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${contact.primaryPhone}`}
                      title={`Call ${contact.fullName}`}
                      className="rounded p-1.5 bg-[#E0F2FE] text-[#0369A1] hover:bg-[#0284C7] hover:text-white border border-[#BAE6FD] hover:border-[#0284C7] transition-all shadow-xs group"
                    >
                      <PhoneCall className="h-3.5 w-3.5 text-[#0369A1] group-hover:text-white transition-colors" />
                    </a>

                    <a
                      href={`https://wa.me/${contact.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="WhatsApp Chat"
                      className="rounded p-1.5 bg-[#25D366] hover:bg-[#20BA5A] text-white border border-[#1EBE5D] transition-colors shadow-xs"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </a>

                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        title={`Email ${contact.fullName}`}
                        className="rounded p-1.5 bg-[#F4F6F4] hover:bg-[#E8F0FA] text-[#1F5FA8] border border-[#DDE3DD] transition-colors"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  {contact.isConvertibleToLead && !contact.convertedLeadId && (
                    <button
                      onClick={() => handleOpenConvert(contact)}
                      className="flex items-center gap-1 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] px-2.5 py-1 text-[11px] font-bold transition-colors shadow-xs border border-[#1F3A2E]"
                    >
                      <Sparkles className="h-3 w-3 text-[#C8A96A]" />
                      <span>Turn to Lead</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. TABLE VIEW MODE (DATA TABLE WITH ACTIONS) */}
      {/* =================================================================== */}
      {viewMode === 'TABLE' && (
        <div className="rounded-xl border border-[#DDE3DD] bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9F8] border-b border-[#DDE3DD] text-[#556055] font-extrabold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">
                    <button onClick={handleSelectAll} title="Select All">
                      {selectedIds.length === filteredContacts.length && filteredContacts.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-[#1F3A2E]" />
                      ) : (
                        <Square className="h-4 w-4 text-[#6B7269]" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Contact & Company</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Affiliation</th>
                  <th className="py-3 px-4">Phone & WhatsApp</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3DD]">
                {filteredContacts.map((contact) => {
                  const isChecked = selectedIds.includes(contact.id);
                  return (
                    <tr
                      key={contact.id}
                      className={`hover:bg-[#F4F6F4] transition-colors ${isChecked ? 'bg-[#E4F3E9]/30' : ''}`}
                    >
                      {/* Select Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <button onClick={() => handleToggleSelect(contact.id)}>
                          {isChecked ? (
                            <CheckSquare className="h-4 w-4 text-[#1F3A2E]" />
                          ) : (
                            <Square className="h-4 w-4 text-[#6B7269] hover:text-[#1F3A2E]" />
                          )}
                        </button>
                      </td>

                      {/* Contact & Organization */}
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-[#1F3A2E] text-xs flex items-center gap-1.5">
                          <span>{contact.fullName}</span>
                          {contact.convertedLeadId && (
                            <span className="text-[9px] rounded-md bg-[#E4F3E9] border border-[#B6E2C5] text-[#1E6B3A] px-1.5 py-0.5 font-bold">
                              ✓ Lead
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#1A1A1A] font-semibold mt-0.5">
                          <span className="text-[#556055]">{contact.designation} &bull; </span>
                          <strong className="text-[#1F3A2E] font-black">{contact.organization}</strong>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md shadow-xs ${
                          contact.category === 'BUYER_CLIENT' ? 'bg-[#E8F0FA] text-[#1F5FA8] border border-[#BBD5F2]' :
                          contact.category === 'SUPPLIER_RAW_MATERIAL' ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]' :
                          contact.category === 'VENDOR_BILLBOARD' ? 'bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] font-extrabold' :
                          contact.category === 'CO_WORKER' ? 'bg-[#F3E8FF] text-[#6B21A8] border border-[#E9D5FF]' :
                          'bg-[#E4F3E9] text-[#1E6B3A] border border-[#B6E2C5]'
                        }`}>
                          {contact.category.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Affiliation */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-xs">
                        {contact.companyAffiliation === 'ARIELMC' && (
                          <span className="rounded-md bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] px-2 py-0.5 font-bold shadow-xs">
                            ArielMC
                          </span>
                        )}
                        {contact.companyAffiliation === 'BIZMAN' && (
                          <span className="rounded-md bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] font-bold px-2 py-0.5 shadow-xs">
                            Bizman
                          </span>
                        )}
                        {contact.companyAffiliation === 'LINDA' && (
                          <span className="rounded-md bg-black text-white px-2 py-0.5 font-extrabold tracking-wider text-[10px] shadow-xs">
                            Linda Resort
                          </span>
                        )}
                        {contact.companyAffiliation === 'GROUP' && (
                          <span className="rounded-md bg-[#EEF2FF] border border-[#C7D2FE] text-[#4338CA] font-bold px-2 py-0.5 shadow-xs">
                            Group / All
                          </span>
                        )}
                        {contact.companyAffiliation === 'PERSONAL' && (
                          <span className="rounded-md bg-[#FDF2F8] border border-[#FBCFE8] text-[#9D174D] font-bold px-2 py-0.5 shadow-xs">
                            Personal
                          </span>
                        )}
                      </td>

                      {/* Phone & WhatsApp Quick Communication */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${contact.primaryPhone}`}
                            className="flex items-center gap-1.5 text-[#1A1A1A] hover:text-[#1F3A2E] font-mono text-xs font-semibold"
                          >
                            <PhoneCall className="h-3.5 w-3.5 text-[#1E6B3A]" />
                            <span>{contact.primaryPhone}</span>
                          </a>

                          <a
                            href={`https://wa.me/${contact.whatsappNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1 bg-[#25D366] hover:bg-[#20BA5A] text-white border border-[#1EBE5D] shadow-xs"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 text-[#1A1A1A] font-semibold whitespace-nowrap text-xs">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#C8A96A] shrink-0" />
                          <span>{contact.city}, {contact.country}</span>
                        </div>
                      </td>

                      {/* Table Row Actions: Convert, Edit, Delete */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {contact.isConvertibleToLead && !contact.convertedLeadId && (
                            <button
                              onClick={() => handleOpenConvert(contact)}
                              className="rounded-md bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] border border-[#1F3A2E] px-2 py-1 text-[10px] font-bold shadow-xs"
                              title="Turn into Active Lead"
                            >
                              + Lead
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenEdit(contact)}
                            className="p-1.5 rounded-md text-[#6B7269] hover:text-[#1F3A2E] hover:bg-[#F4F6F4] transition-colors"
                            title="Edit Contact"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteSingle(contact.id, contact.fullName)}
                            className="p-1.5 rounded-md text-[#6B7269] hover:text-rose-600 hover:bg-[#FEE8E8] transition-colors"
                            title="Delete Contact"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. NEW ENTRY / EDIT CONTACT MODAL */}
      {/* =================================================================== */}
      {(isNewModalOpen || editingContact) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#DDE3DD] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
              <div className="flex items-center gap-2">
                <Contact className="h-5 w-5 text-[#1F3A2E]" />
                <h2 className="text-base font-extrabold text-[#1F3A2E]">
                  {editingContact ? `Edit Contact: ${editingContact.fullName}` : 'Add New Master Contact'}
                </h2>
              </div>
              <button
                onClick={() => { setIsNewModalOpen(false); setEditingContact(null); }}
                className="text-[#6B7269] hover:text-[#1F3A2E] text-xs font-bold p-1 rounded hover:bg-[#F4F6F4]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1F3A2E] font-bold block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sajjad Hossain"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-[#F8F9F8] p-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="text-[#1F3A2E] font-bold block mb-1">Organization / Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grameenphone / EcoLiving UK"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-[#F8F9F8] p-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1F3A2E] font-bold block mb-1">Designation / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Head of Media / Merchandiser"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-[#F8F9F8] p-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="text-[#1F3A2E] font-bold block mb-1">Contact Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-[#F8F9F8] p-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] focus:bg-white transition-all font-medium"
                  >
                    <option value="BUYER_CLIENT">Buyer / Corporate Client</option>
                    <option value="SUPPLIER_RAW_MATERIAL">Supplier (Jute/Leather/Ceramics)</option>
                    <option value="VENDOR_BILLBOARD">Billboard Vendor (50+/70+ Partner)</option>
                    <option value="CO_WORKER">Co-Worker / Team Member</option>
                    <option value="FRIEND_FAMILY">Friend / Family / High-Trust</option>
                    <option value="LEAD_PROSPECT">Direct Lead / Prospect</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1F3A2E] font-bold block mb-1">Primary Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+88017..."
                    value={formData.primaryPhone}
                    onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-[#F8F9F8] p-2 text-[#1A1A1A] font-mono focus:outline-none focus:border-[#1F3A2E] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-[#1F3A2E] font-bold block mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    placeholder="88017... (without +)"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-[#F8F9F8] p-2 text-[#1A1A1A] font-mono focus:outline-none focus:border-[#1F3A2E] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#1F3A2E] font-bold block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-[#F8F9F8] p-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-[#1F3A2E] font-bold block mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Dhaka / London"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-[#F8F9F8] p-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="text-[#1F3A2E] font-bold block mb-1">Country</label>
                  <input
                    type="text"
                    placeholder="Bangladesh / UK"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-[#F8F9F8] p-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1F3A2E] font-bold block mb-1">Company Affiliation</label>
                  <select
                    value={formData.companyAffiliation}
                    onChange={(e) => setFormData({ ...formData, companyAffiliation: e.target.value as any })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-[#F8F9F8] p-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] focus:bg-white transition-all font-medium"
                  >
                    <option value="ARIELMC">ArielMC (Ariel Marketing & Communications)</option>
                    <option value="BIZMAN">Bizman Media Limited</option>
                    <option value="LINDA">Linda Resort Limited</option>
                    <option value="PERSONAL">Personal / Family</option>
                    <option value="GROUP">Group / All Companies</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#1F3A2E] font-bold block mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. High-Value, DOOH, Jute, Buyer"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-[#F8F9F8] p-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#1F3A2E] font-bold block mb-1">Relationship Notes & Commercial Context</label>
                <textarea
                  rows={3}
                  placeholder="Key background, past campaigns, supplier terms, personal interests..."
                  value={formData.relationshipNotes}
                  onChange={(e) => setFormData({ ...formData, relationshipNotes: e.target.value })}
                  className="w-full rounded-lg border border-[#DDE3DD] bg-[#F8F9F8] p-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] focus:bg-white transition-all font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDE3DD]">
                <button
                  type="button"
                  onClick={() => { setIsNewModalOpen(false); setEditingContact(null); }}
                  className="rounded-lg border border-[#DDE3DD] px-3.5 py-1.5 text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4] font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] px-4 py-1.5 font-bold text-[#C8A96A] border border-[#1F3A2E] shadow-sm transition-all"
                >
                  {editingContact ? 'Save Changes' : 'Create Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. TURN CONTACT TO ACTIVE LEAD MODAL */}
      {/* =================================================================== */}
      {convertingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#DDE3DD] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#C8A96A]" />
                <h2 className="text-base font-extrabold text-[#1F3A2E]">Convert Contact Into Active Lead</h2>
              </div>
              <button
                onClick={() => setConvertingContact(null)}
                className="text-[#6B7269] hover:text-[#1F3A2E] text-xs font-bold p-1 rounded hover:bg-[#F4F6F4]"
              >
                ✕
              </button>
            </div>

            {conversionSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="h-10 w-10 mx-auto rounded-full bg-[#E4F3E9] border border-[#B6E2C5] flex items-center justify-center text-[#1E6B3A]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-extrabold text-[#1F3A2E]">Lead Successfully Created!</h3>
                <p className="text-xs text-[#556055]">Routing directly to {targetCompany} pipeline...</p>
              </div>
            ) : (
              <form onSubmit={handleExecuteConvert} className="space-y-4 text-xs">
                <div className="rounded-xl bg-[#F8F9F8] p-3 border border-[#DDE3DD] space-y-1">
                  <div className="text-[#6B7269] text-[11px] font-semibold">Contact Person:</div>
                  <div className="font-extrabold text-[#1F3A2E] text-xs">{convertingContact.fullName} ({convertingContact.organization})</div>
                  <div className="text-[11px] text-[#556055] font-mono">{convertingContact.primaryPhone} &bull; {convertingContact.email}</div>
                </div>

                <div>
                  <label className="text-[#1F3A2E] font-bold block mb-1">Target Business Entity</label>
                  <select
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value as any)}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-[#F8F9F8] p-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] focus:bg-white transition-all font-medium"
                  >
                    <option value="ARIELMC">ArielMC (Ariel Marketing & Communications - Global Export)</option>
                    <option value="BIZMAN">Bizman Media Limited (DOOH / Static / Events)</option>
                    <option value="LINDA">Linda Resort Limited (Luxury Eco-Resort / Villas)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#1F3A2E] font-bold block mb-1">Deal Title</label>
                  <input
                    type="text"
                    required
                    value={dealTitle}
                    onChange={(e) => setDealTitle(e.target.value)}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-[#F8F9F8] p-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#1F3A2E] font-bold block mb-1">Pipeline Domain</label>
                    <select
                      value={pipelineType}
                      onChange={(e) => setPipelineType(e.target.value)}
                      className="w-full rounded-lg border border-[#DDE3DD] bg-[#F8F9F8] p-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] focus:bg-white transition-all font-medium"
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
                    <label className="text-[#1F3A2E] font-bold block mb-1">Estimated Value</label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        value={dealValue}
                        onChange={(e) => setDealValue(e.target.value)}
                        className="w-full rounded-lg border border-[#DDE3DD] bg-[#F8F9F8] p-2 pr-12 text-[#1A1A1A] font-mono font-bold focus:outline-none focus:border-[#1F3A2E] focus:bg-white transition-all"
                      />
                      <span className="absolute right-2 top-2 text-[#1F3A2E] font-mono font-bold">
                        {targetCompany === 'ARIELMC' ? 'USD' : 'BDT'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDE3DD]">
                  <button
                    type="button"
                    onClick={() => setConvertingContact(null)}
                    className="rounded-lg border border-[#DDE3DD] px-3.5 py-1.5 text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4] font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] px-4 py-1.5 font-bold text-[#C8A96A] border border-[#1F3A2E] shadow-sm transition-all"
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
