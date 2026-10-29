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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Contact className="h-4 w-4" />
            <span>Master Rolodex & Directory</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-white">
            Master Contact Database
          </h1>
          <p className="text-xs text-slate-400">
            Clients, foreign buyers, raw material suppliers, 50+/70+ billboard vendors, team members, and personal contacts
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid vs Table View Switcher */}
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-1 text-xs">
            <button
              onClick={() => setViewMode('GRID')}
              title="Grid Card View"
              className={`p-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'GRID' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden md:inline font-semibold text-[11px]">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              title="Table View"
              className={`p-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'TABLE' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="h-4 w-4" />
              <span className="hidden md:inline font-semibold text-[11px]">Table</span>
            </button>
          </div>

          {/* New Contact Action */}
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
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
            placeholder="Search by name, organization, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/90 pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                    ? 'border-indigo-500 bg-slate-900 shadow-md shadow-indigo-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                {/* Card Top Row: Checkbox, Category Badge & Edit/Delete Actions */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleSelect(contact.id)}
                      className="text-slate-400 hover:text-white transition-colors"
                      title="Select Contact"
                    >
                      {isChecked ? (
                        <CheckSquare className="h-4 w-4 text-indigo-400" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-600 hover:text-slate-400" />
                      )}
                    </button>

                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      contact.category === 'BUYER_CLIENT' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800' :
                      contact.category === 'SUPPLIER_RAW_MATERIAL' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      contact.category === 'VENDOR_BILLBOARD' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                      contact.category === 'CO_WORKER' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                      'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {contact.category.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Edit & Delete Mini-Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(contact)}
                      title="Edit Contact"
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-slate-400 hover:text-indigo-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteSingle(contact.id, contact.fullName)}
                      title="Delete Contact"
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Name, Designation & Organization */}
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
                    <Building2 className="h-3 w-3 text-slate-500 shrink-0" />
                    <span className="truncate">{contact.organization} &bull; {contact.city}, {contact.country}</span>
                  </div>
                </div>

                {/* Relationship Notes */}
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

                {/* Bottom Action Bar: Calling, WhatsApp & Lead Conversion */}
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${contact.primaryPhone}`}
                      title={`Call ${contact.fullName}`}
                      className="rounded p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                    >
                      <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
                    </a>

                    <a
                      href={`https://wa.me/${contact.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="WhatsApp Chat"
                      className="rounded p-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition-colors"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </a>

                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        title={`Email ${contact.fullName}`}
                        className="rounded p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                      >
                        <Mail className="h-3.5 w-3.5 text-indigo-400" />
                      </a>
                    )}
                  </div>

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
            );
          })}
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. TABLE VIEW MODE (DATA TABLE WITH ACTIONS) */}
      {/* =================================================================== */}
      {viewMode === 'TABLE' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">
                    <button onClick={handleSelectAll} title="Select All">
                      {selectedIds.length === filteredContacts.length && filteredContacts.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-indigo-400" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-600" />
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
              <tbody className="divide-y divide-slate-800/60">
                {filteredContacts.map((contact) => {
                  const isChecked = selectedIds.includes(contact.id);
                  return (
                    <tr
                      key={contact.id}
                      className={`hover:bg-slate-800/40 transition-colors ${isChecked ? 'bg-indigo-950/20' : ''}`}
                    >
                      {/* Select Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <button onClick={() => handleToggleSelect(contact.id)}>
                          {isChecked ? (
                            <CheckSquare className="h-4 w-4 text-indigo-400" />
                          ) : (
                            <Square className="h-4 w-4 text-slate-600 hover:text-slate-400" />
                          )}
                        </button>
                      </td>

                      {/* Contact & Organization */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{contact.fullName}</span>
                          {contact.convertedLeadId && (
                            <span className="text-[9px] rounded bg-emerald-950 border border-emerald-800 text-emerald-400 px-1 py-0.2 font-semibold">
                              ✓ Lead
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{contact.designation} &bull; <strong className="text-slate-300">{contact.organization}</strong></div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          contact.category === 'BUYER_CLIENT' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800' :
                          contact.category === 'SUPPLIER_RAW_MATERIAL' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          contact.category === 'VENDOR_BILLBOARD' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                          contact.category === 'CO_WORKER' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                          'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}>
                          {contact.category.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Affiliation */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-300">
                        {contact.companyAffiliation === 'ARIELMC' ? 'ArielMC' : contact.companyAffiliation === 'LINDA' ? 'Linda Resort' : contact.companyAffiliation === 'BIZMAN' ? 'Bizman' : contact.companyAffiliation}
                      </td>

                      {/* Phone & WhatsApp Quick Communication */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${contact.primaryPhone}`}
                            className="flex items-center gap-1 text-slate-200 hover:text-indigo-400 font-mono text-[11px]"
                          >
                            <PhoneCall className="h-3 w-3 text-emerald-400" />
                            <span>{contact.primaryPhone}</span>
                          </a>

                          <a
                            href={`https://wa.me/${contact.whatsappNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="h-3 w-3" />
                          </a>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {contact.city}, {contact.country}
                      </td>

                      {/* Table Row Actions: Convert, Edit, Delete */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {contact.isConvertibleToLead && !contact.convertedLeadId && (
                            <button
                              onClick={() => handleOpenConvert(contact)}
                              className="rounded bg-indigo-600/90 hover:bg-indigo-600 text-white px-2 py-1 text-[10px] font-semibold"
                              title="Turn into Active Lead"
                            >
                              + Lead
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenEdit(contact)}
                            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Edit Contact"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteSingle(contact.id, contact.fullName)}
                            className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Contact className="h-5 w-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">
                  {editingContact ? `Edit Contact: ${editingContact.fullName}` : 'Add New Master Contact'}
                </h2>
              </div>
              <button
                onClick={() => { setIsNewModalOpen(false); setEditingContact(null); }}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sajjad Hossain"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Organization / Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grameenphone / EcoLiving UK"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Designation / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Head of Media / Merchandiser"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Contact Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
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
                  <label className="text-slate-400 block mb-1">Primary Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+88017..."
                    value={formData.primaryPhone}
                    onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    placeholder="88017... (without +)"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Dhaka / London"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Country</label>
                  <input
                    type="text"
                    placeholder="Bangladesh / UK"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Company Affiliation</label>
                  <select
                    value={formData.companyAffiliation}
                    onChange={(e) => setFormData({ ...formData, companyAffiliation: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ARIELMC">ArielMC (Ariel Marketing & Communications)</option>
                    <option value="BIZMAN">Bizman Media Limited</option>
                    <option value="LINDA">Linda Resort Limited</option>
                    <option value="PERSONAL">Personal / Family</option>
                    <option value="GROUP">Group / All Companies</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. High-Value, DOOH, Jute, Buyer"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Relationship Notes & Commercial Context</label>
                <textarea
                  rows={3}
                  placeholder="Key background, past campaigns, supplier terms, personal interests..."
                  value={formData.relationshipNotes}
                  onChange={(e) => setFormData({ ...formData, relationshipNotes: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsNewModalOpen(false); setEditingContact(null); }}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-1.5 font-semibold text-white hover:bg-indigo-500 shadow"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">Convert Contact Into Active Lead</h2>
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
                <p className="text-xs text-slate-400">Routing directly to {targetCompany} pipeline...</p>
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
                    <option value="ARIELMC">ArielMC (Ariel Marketing & Communications - Global Export)</option>
                    <option value="BIZMAN">Bizman Media Limited (DOOH / Static / Events)</option>
                    <option value="LINDA">Linda Resort Limited (Luxury Eco-Resort / Villas)</option>
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
