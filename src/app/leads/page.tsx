'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Users, 
  PhoneCall, 
  MessageSquare, 
  FileEdit, 
  Sparkles, 
  Plus, 
  Calendar, 
  DollarSign, 
  Check, 
  Clock, 
  Tag, 
  ChevronRight,
  Filter,
  Layers,
  Save,
  CheckCircle2,
  LayoutGrid,
  Table as TableIcon,
  Kanban as KanbanIcon,
  ArrowRight,
  X,
  Building2,
  MapPin,
  ExternalLink,
  Search,
  CheckSquare
} from 'lucide-react';
import { CompanyCode, LeadItem, PipelineStage } from '@/lib/types';
import { INITIAL_LEADS } from '@/lib/mock-data';

const STAGE_CONFIG: Record<PipelineStage, {
  label: string;
  badge: string;
  headerBg: string;
  dotColor: string;
}> = {
  NEW_INQUIRY: {
    label: 'New Inquiry',
    badge: 'bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] font-extrabold',
    headerBg: 'bg-[#E0F2FE] text-[#0369A1]',
    dotColor: 'bg-[#0284C7]',
  },
  CONTACTED: {
    label: 'Contacted',
    badge: 'bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE] font-extrabold',
    headerBg: 'bg-[#EEF2FF] text-[#4338CA]',
    dotColor: 'bg-[#4F46E5]',
  },
  MEETING_SCHEDULED: {
    label: 'Meeting / Survey',
    badge: 'bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF] font-extrabold',
    headerBg: 'bg-[#F3E8FF] text-[#7E22CE]',
    dotColor: 'bg-[#9333EA]',
  },
  PROPOSAL_SENT: {
    label: 'Proposal Sent',
    badge: 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] font-extrabold',
    headerBg: 'bg-[#FEF3C7] text-[#B45309]',
    dotColor: 'bg-[#D97706]',
  },
  NEGOTIATION: {
    label: 'Negotiation',
    badge: 'bg-[#FDF2F8] text-[#BE185D] border border-[#FBCFE8] font-extrabold',
    headerBg: 'bg-[#FDF2F8] text-[#BE185D]',
    dotColor: 'bg-[#DB2777]',
  },
  WON: {
    label: 'Contract Won',
    badge: 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] font-black',
    headerBg: 'bg-[#DCFCE7] text-[#15803D]',
    dotColor: 'bg-[#16A34A]',
  },
  LOST: {
    label: 'Lost / Closed',
    badge: 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5] font-extrabold',
    headerBg: 'bg-[#FEE2E2] text-[#B91C1C]',
    dotColor: 'bg-[#DC2626]',
  },
};

const KANBAN_STAGES: PipelineStage[] = [
  'NEW_INQUIRY',
  'CONTACTED',
  'MEETING_SCHEDULED',
  'PROPOSAL_SENT',
  'NEGOTIATION',
  'WON',
];

export default function LeadsPage() {
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';
  const actionParam = searchParams.get('action');

  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(INITIAL_LEADS[0]);
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE' | 'KANBAN'>('GRID');
  const [searchQuery, setSearchQuery] = useState('');
  const [notepadContent, setNotepadContent] = useState<string>(INITIAL_LEADS[0]?.notepadMarkdown || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyCode: (activeCompany === 'CONSOLIDATED' ? 'BIZMAN' : activeCompany) as 'ARIELMC' | 'BIZMAN' | 'LINDA',
    title: '',
    customerName: '',
    contactPerson: '',
    phone: '',
    whatsapp: '',
    email: '',
    country: 'Bangladesh',
    estimatedValue: 500000,
    currency: 'BDT' as 'USD' | 'BDT',
    stage: 'NEW_INQUIRY' as PipelineStage,
    probability: 40,
    expectedCloseDate: '2026-11-30',
    pipelineType: 'DOOH Screen Advertising',
    notepadMarkdown: '',
  });

  // Automatically open modal when navigated from Quick Action (?action=new)
  useEffect(() => {
    if (actionParam === 'new') {
      setIsCreateModalOpen(true);
    }
  }, [actionParam]);

  // Filter leads based on company context and search query
  const filteredLeads = leads
    .filter(l => activeCompany === 'CONSOLIDATED' || l.companyCode === activeCompany)
    .filter(l => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        l.title.toLowerCase().includes(q) ||
        l.customerName.toLowerCase().includes(q) ||
        l.contactPerson.toLowerCase().includes(q) ||
        l.country.toLowerCase().includes(q)
      );
    });

  const handleSelectLead = (lead: LeadItem) => {
    setSelectedLead(lead);
    setNotepadContent(lead.notepadMarkdown || '');
    setSaveStatus('idle');
  };

  const handleSaveNotepad = () => {
    if (!selectedLead) return;
    setSaveStatus('saving');
    setTimeout(() => {
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, notepadMarkdown: notepadContent } : l));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 400);
  };

  const handleStageChange = (newStage: PipelineStage) => {
    if (!selectedLead) return;
    const updated = { ...selectedLead, stage: newStage };
    setSelectedLead(updated);
    setLeads(prev => prev.map(l => l.id === selectedLead.id ? updated : l));
  };

  const handleAdvanceStage = (leadId: string, currentStage: PipelineStage) => {
    const currentIndex = KANBAN_STAGES.indexOf(currentStage);
    if (currentIndex >= 0 && currentIndex < KANBAN_STAGES.length - 1) {
      const nextStage = KANBAN_STAGES[currentIndex + 1];
      setLeads(prev => prev.map(l => {
        if (l.id === leadId) {
          const updated = { ...l, stage: nextStage };
          if (selectedLead?.id === leadId) setSelectedLead(updated);
          return updated;
        }
        return l;
      }));
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.customerName) {
      alert('Please enter Opportunity Title and Customer Name.');
      return;
    }

    const newLead: LeadItem = {
      id: `lead-user-${Date.now()}`,
      companyCode: formData.companyCode,
      title: formData.title,
      customerName: formData.customerName,
      contactPerson: formData.contactPerson || formData.customerName,
      phone: formData.phone || '+880 1711 000000',
      whatsapp: formData.whatsapp || formData.phone || '+880 1711 000000',
      email: formData.email || 'lead@client.com',
      country: formData.country || 'Bangladesh',
      estimatedValue: Number(formData.estimatedValue) || 100000,
      currency: formData.currency,
      stage: formData.stage,
      probability: Number(formData.probability) || 50,
      expectedCloseDate: formData.expectedCloseDate || '2026-11-30',
      pipelineType: formData.pipelineType || 'General Commercial Lead',
      notepadMarkdown: formData.notepadMarkdown || `### Deal Brief: ${formData.title}\n- Client: ${formData.customerName}\n- Created via Master CRM Quick Action`,
      specifics: {
        createdVia: 'Master CRM Quick Action',
        assignedOwner: 'Syed Akramul Hassan',
      },
      createdAt: new Date().toISOString().split('T')[0],
    };

    setLeads(prev => [newLead, ...prev]);
    setSelectedLead(newLead);
    setNotepadContent(newLead.notepadMarkdown);
    setIsCreateModalOpen(false);

    // Reset form
    setFormData({
      companyCode: (activeCompany === 'CONSOLIDATED' ? 'BIZMAN' : activeCompany) as 'ARIELMC' | 'BIZMAN' | 'LINDA',
      title: '',
      customerName: '',
      contactPerson: '',
      phone: '',
      whatsapp: '',
      email: '',
      country: 'Bangladesh',
      estimatedValue: 500000,
      currency: 'BDT',
      stage: 'NEW_INQUIRY',
      probability: 40,
      expectedCloseDate: '2026-11-30',
      pipelineType: 'DOOH Screen Advertising',
      notepadMarkdown: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* =================================================================== */}
      {/* PAGE HEADER */}
      {/* =================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDE3DD] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8A96A]">
            <Users className="h-4 w-4" />
            <span>Multi-Company Pipeline Engine</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-[#1F3A2E] tracking-tight">
            Customer & Deal Control
          </h1>
          <p className="text-xs text-[#6B7269]">
            Active sales pipelines across DOOH campaigns (Bizman), luxury eco-resort bookings (Linda Resort), and export shipments (ArielMC)
          </p>
        </div>

        {/* Top Actions: 3-Way View Switcher & + Create New Lead Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Switcher: Grid vs Table vs Kanban */}
          <div className="flex items-center rounded-xl bg-white border border-[#DDE3DD] p-1 text-xs shadow-xs">
            <button
              onClick={() => setViewMode('GRID')}
              title="Split Card & Inspector View"
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-bold text-xs ${
                viewMode === 'GRID' 
                  ? 'bg-[#1F3A2E] text-[#C8A96A] border border-[#1F3A2E] shadow-sm' 
                  : 'text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              title="Compact Tabular Ledger View"
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-bold text-xs ${
                viewMode === 'TABLE' 
                  ? 'bg-[#1F3A2E] text-[#C8A96A] border border-[#1F3A2E] shadow-sm' 
                  : 'text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]'
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('KANBAN')}
              title="Stage Progression Board View"
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-bold text-xs ${
                viewMode === 'KANBAN' 
                  ? 'bg-[#1F3A2E] text-[#C8A96A] border border-[#1F3A2E] shadow-sm' 
                  : 'text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]'
              }`}
            >
              <KanbanIcon className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          {/* Quick Action: Create New Lead Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] px-4 py-2 text-xs font-bold border border-[#1F3A2E] shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Lead</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* FILTER & PIPELINE SUMMARY STRIP */}
      {/* =================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#DDE3DD] shadow-xs text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="h-3.5 w-3.5 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by deal name, client company, contact person..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#DDE3DD] bg-[#F4F6F4] pl-9 pr-3 py-1.5 text-xs text-[#1A1A1A] placeholder:text-[#888] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#6B7269]">Total Pipeline Value:</span>
          <span className="font-extrabold text-[#1E6B3A] bg-[#E4F3E9] px-2.5 py-1 rounded border border-[#B6E2C5]">
            ৳ {filteredLeads.filter(l => l.currency === 'BDT').reduce((s, l) => s + l.estimatedValue, 0).toLocaleString()}
            {' '}+{' '}
            ${filteredLeads.filter(l => l.currency === 'USD').reduce((s, l) => s + l.estimatedValue, 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* VIEW 1: GRID VIEW (Two-Column Cards & Inspector) */}
      {/* =================================================================== */}
      {viewMode === 'GRID' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Opportunity List Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#6B7269] px-1 font-semibold">
              <span>Showing {filteredLeads.length} Opportunities</span>
              <span>Click to inspect & edit notepad</span>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
              {filteredLeads.map((lead) => {
                const isSelected = selectedLead?.id === lead.id;
                const stageCfg = STAGE_CONFIG[lead.stage] || STAGE_CONFIG.NEW_INQUIRY;

                return (
                  <div
                    key={lead.id}
                    onClick={() => handleSelectLead(lead)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all relative ${
                      isSelected
                        ? 'border-[#1F3A2E] bg-white shadow-md ring-1 ring-[#1F3A2E]/20'
                        : 'border-[#DDE3DD] bg-white hover:border-[#1F3A2E] hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      {/* Entity Badge */}
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded shadow-xs ${
                        lead.companyCode === 'BIZMAN' ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' :
                        lead.companyCode === 'LINDA' ? 'bg-black text-white px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider' :
                        'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                      }`}>
                        {lead.companyCode === 'ARIELMC' ? 'ArielMC' : lead.companyCode === 'LINDA' ? 'Linda Resort' : lead.companyCode}
                      </span>

                      {/* Deal Value */}
                      <span className="font-mono text-[#1E6B3A] font-black text-sm">
                        {lead.currency === 'USD' ? '$' : '৳'}{lead.estimatedValue.toLocaleString()}
                      </span>
                    </div>

                    <h3 className="mt-2 text-sm font-extrabold text-[#1F3A2E] line-clamp-1">{lead.title}</h3>
                    <div className="text-xs text-[#556055] font-medium mt-0.5">
                      <strong className="text-[#1A1A1A]">{lead.customerName}</strong> &bull; {lead.country}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#DDE3DD] pt-2 text-[11px]">
                      {/* Distinct Stage Badge */}
                      <span className={`rounded px-2 py-0.5 text-[10px] ${stageCfg.badge}`}>
                        {stageCfg.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${lead.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded-md bg-[#E0F2FE] text-[#0369A1] hover:bg-[#0284C7] hover:text-white border border-[#BAE6FD] hover:border-[#0284C7] transition-all shadow-xs group"
                          title={`Call ${lead.contactPerson} (${lead.phone})`}
                        >
                          <PhoneCall className="h-3 w-3 text-[#0369A1] group-hover:text-white transition-colors" />
                        </a>
                        <span className="font-mono text-[#6B7269] text-xs font-semibold">
                          Target: {lead.expectedCloseDate}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Lead Inspector with Markdown Notepad (7 Cols) */}
          {selectedLead && (
            <div className="lg:col-span-7 rounded-xl border border-[#DDE3DD] bg-white p-6 space-y-6 shadow-sm">
              {/* Header Info */}
              <div className="border-b border-[#DDE3DD] pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded shadow-xs ${
                      selectedLead.companyCode === 'BIZMAN' ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' :
                      selectedLead.companyCode === 'LINDA' ? 'bg-black text-white px-2 py-0.5 text-[10px] font-extrabold tracking-wider' :
                      'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                    }`}>
                      {selectedLead.companyCode === 'ARIELMC' ? 'ArielMC' : selectedLead.companyCode === 'LINDA' ? 'Linda Resort Limited' : selectedLead.companyCode}
                    </span>
                    <span className="text-xs font-mono font-semibold text-[#6B7269] bg-[#F4F6F4] px-2 py-0.5 rounded border border-[#DDE3DD]">
                      {selectedLead.pipelineType}
                    </span>
                  </div>

                  {/* Call & WhatsApp Quick Buttons */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="flex items-center gap-1.5 rounded-lg bg-[#E0F2FE] hover:bg-[#0284C7] text-[#0369A1] hover:text-white border border-[#BAE6FD] hover:border-[#0284C7] px-3 py-1.5 text-xs font-bold transition-all shadow-xs group"
                    >
                      <PhoneCall className="h-3.5 w-3.5 text-[#0369A1] group-hover:text-white transition-colors" />
                      <span>Call ({selectedLead.phone})</span>
                    </a>

                    <a
                      href={`https://wa.me/${selectedLead.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg bg-[#25D366] hover:bg-[#20BA5A] text-white border border-[#1EBE5D] px-3 py-1.5 text-xs font-extrabold transition-colors shadow-xs"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                <h2 className="mt-3 text-xl font-extrabold text-[#1F3A2E]">{selectedLead.title}</h2>
                <div className="mt-1 text-xs text-[#556055]">
                  Client Organization: <strong className="text-[#1A1A1A] font-extrabold">{selectedLead.customerName}</strong> &bull; Point of Contact: <strong className="text-[#1F3A2E]">{selectedLead.contactPerson}</strong>
                </div>
              </div>

              {/* Stage Selector Bar with Distinct Stage Color Highlights */}
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#556055] mb-2">
                  Update Pipeline Stage
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {KANBAN_STAGES.map((stgKey) => {
                    const cfg = STAGE_CONFIG[stgKey];
                    const isActive = selectedLead.stage === stgKey;
                    return (
                      <button
                        key={stgKey}
                        onClick={() => handleStageChange(stgKey)}
                        className={`rounded-lg px-3 py-1 text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isActive
                            ? `${cfg.badge} shadow-xs ring-2 ring-[#1F3A2E]`
                            : 'bg-[#F4F6F4] border border-[#DDE3DD] text-[#556055] hover:bg-white hover:text-[#1F3A2E]'
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${cfg.dotColor}`} />
                        <span>{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Commercial Specs Cards */}
              <div className="rounded-xl border border-[#DDE3DD] bg-[#F8F9F8] p-4">
                <div className="text-xs font-bold text-[#556055] uppercase tracking-wider mb-2">
                  Deal Parameters & Financial Projections
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <div className="text-[#6B7269] font-medium">Deal Value:</div>
                    <div className="font-extrabold text-[#1F3A2E] font-mono text-sm mt-0.5">
                      {selectedLead.currency === 'USD' ? '$' : '৳'}{selectedLead.estimatedValue.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#6B7269] font-medium">Close Probability:</div>
                    <div className="font-extrabold text-[#1E6B3A] font-mono text-sm mt-0.5">
                      {selectedLead.probability}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[#6B7269] font-medium">Expected Close:</div>
                    <div className="font-bold text-[#1A1A1A] font-mono mt-0.5">
                      {selectedLead.expectedCloseDate}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#6B7269] font-medium">Email:</div>
                    <div className="font-semibold text-[#1F5FA8] truncate mt-0.5">
                      {selectedLead.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Markdown Scratchpad & Meeting Log */}
              <div className="space-y-2 border-t border-[#DDE3DD] pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileEdit className="h-4 w-4 text-[#C8A96A]" />
                    <span className="text-xs font-extrabold text-[#1F3A2E]">
                      Deal Scratchpad & Meeting Log (Markdown)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {saveStatus === 'saved' && (
                      <span className="flex items-center gap-1 text-xs text-[#1E6B3A] font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Saved</span>
                      </span>
                    )}
                    <button
                      onClick={handleSaveNotepad}
                      disabled={saveStatus === 'saving'}
                      className="flex items-center gap-1 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] px-3 py-1 text-xs font-bold transition-all shadow-xs"
                    >
                      <Save className="h-3 w-3" />
                      <span>{saveStatus === 'saving' ? 'Saving...' : 'Save Notes'}</span>
                    </button>
                  </div>
                </div>

                <textarea
                  value={notepadContent}
                  onChange={(e) => setNotepadContent(e.target.value)}
                  placeholder="Record client requirements, agreed board locations, quotation specs, and meeting notes..."
                  rows={8}
                  className="w-full rounded-xl border border-[#DDE3DD] bg-[#F4F6F4] p-3 text-xs font-mono text-[#1A1A1A] placeholder:text-[#888] focus:bg-white focus:border-[#1F3A2E] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW 2: TABLE VIEW (Tabular Data Ledger) */}
      {/* =================================================================== */}
      {viewMode === 'TABLE' && (
        <div className="rounded-xl border border-[#DDE3DD] bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F6F4] border-b border-[#DDE3DD] text-[#1F3A2E] font-extrabold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Opportunity & Customer</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Estimated Value</th>
                  <th className="py-3 px-4 text-center">Prob %</th>
                  <th className="py-3 px-4">Close Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3DD] font-mono text-[#1A1A1A]">
                {filteredLeads.map((lead) => {
                  const stageCfg = STAGE_CONFIG[lead.stage] || STAGE_CONFIG.NEW_INQUIRY;

                  return (
                    <tr key={lead.id} className="hover:bg-[#F9FAF9] transition-colors">
                      {/* Entity */}
                      <td className="py-3.5 px-4 font-sans">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded shadow-xs ${
                          lead.companyCode === 'BIZMAN' ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' :
                          lead.companyCode === 'LINDA' ? 'bg-black text-white px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider' :
                          'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                        }`}>
                          {lead.companyCode === 'ARIELMC' ? 'ArielMC' : lead.companyCode === 'LINDA' ? 'Linda Resort' : lead.companyCode}
                        </span>
                      </td>

                      {/* Title & Customer */}
                      <td className="py-3.5 px-4 font-sans">
                        <div className="font-extrabold text-[#1F3A2E] text-xs line-clamp-1">{lead.title}</div>
                        <div className="text-[11px] text-[#556055] font-medium">
                          {lead.customerName} &bull; {lead.contactPerson} ({lead.country})
                        </div>
                      </td>

                      {/* Stage Badge with Color Variation */}
                      <td className="py-3.5 px-4 font-sans">
                        <span className={`rounded px-2.5 py-1 text-[10px] inline-flex items-center gap-1 ${stageCfg.badge}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${stageCfg.dotColor}`} />
                          <span>{stageCfg.label}</span>
                        </span>
                      </td>

                      {/* Value */}
                      <td className="py-3.5 px-4 font-black text-[#1E6B3A] text-xs">
                        {lead.currency === 'USD' ? '$' : '৳'}{lead.estimatedValue.toLocaleString()}
                      </td>

                      {/* Probability */}
                      <td className="py-3.5 px-4 text-center font-bold text-[#1F3A2E]">
                        {lead.probability}%
                      </td>

                      {/* Close Date */}
                      <td className="py-3.5 px-4 text-[#556055] text-xs font-semibold">
                        {lead.expectedCloseDate}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right font-sans">
                        <div className="flex items-center justify-end gap-2">
                          {/* Call Button (Telephony Blue with Crisp White onMouseOver) */}
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1.5 rounded-lg bg-[#E0F2FE] text-[#0369A1] hover:bg-[#0284C7] hover:text-white border border-[#BAE6FD] hover:border-[#0284C7] transition-all shadow-xs group"
                            title={`Call ${lead.contactPerson} (${lead.phone})`}
                          >
                            <PhoneCall className="h-3.5 w-3.5 text-[#0369A1] group-hover:text-white transition-colors" />
                          </a>

                          {/* WhatsApp Chat Button */}
                          <a
                            href={`https://wa.me/${lead.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#25D366] hover:bg-[#20BA5A] text-white transition-all shadow-xs border border-[#1EBE5D]"
                            title="WhatsApp Chat"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </a>

                          {/* Primary Inspect & Manage Deal Button */}
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setViewMode('GRID');
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] border border-[#1F3A2E] text-xs font-bold transition-all shadow-sm"
                            title="Inspect Deal, Stages & Notepad"
                          >
                            <FileEdit className="h-3.5 w-3.5 text-[#C8A96A]" />
                            <span>Inspect</span>
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
      {/* VIEW 3: KANBAN VIEW (6 Stage Columns with Drag/Advance Capability) */}
      {/* =================================================================== */}
      {viewMode === 'KANBAN' && (
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 min-w-[1100px]">
            {KANBAN_STAGES.map((stgKey) => {
              const cfg = STAGE_CONFIG[stgKey];
              const stageLeads = filteredLeads.filter(l => l.stage === stgKey);
              const stageValueBDT = stageLeads.filter(l => l.currency === 'BDT').reduce((acc, l) => acc + l.estimatedValue, 0);
              const stageValueUSD = stageLeads.filter(l => l.currency === 'USD').reduce((acc, l) => acc + l.estimatedValue, 0);

              return (
                <div key={stgKey} className="rounded-xl border border-[#DDE3DD] bg-[#F8F9F8] p-3 space-y-3 flex flex-col justify-between min-h-[500px]">
                  {/* Column Header */}
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#DDE3DD]">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 rounded-full ${cfg.dotColor}`} />
                        <span className="font-extrabold text-xs text-[#1F3A2E]">{cfg.label}</span>
                      </div>
                      <span className="rounded-full bg-white border border-[#DDE3DD] px-2 py-0.5 text-[10px] font-bold text-[#1F3A2E]">
                        {stageLeads.length}
                      </span>
                    </div>

                    {/* Column Total Value */}
                    <div className="text-[10px] font-mono text-[#556055] pt-1.5 font-bold">
                      {stageValueBDT > 0 && `৳ ${(stageValueBDT / 100000).toFixed(1)}L`}
                      {stageValueBDT > 0 && stageValueUSD > 0 && ' + '}
                      {stageValueUSD > 0 && `$${(stageValueUSD / 1000).toFixed(1)}k`}
                      {stageValueBDT === 0 && stageValueUSD === 0 && '৳ 0.00'}
                    </div>

                    {/* Stage Card Stack */}
                    <div className="space-y-2.5 mt-3 max-h-[550px] overflow-y-auto pr-0.5">
                      {stageLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className="rounded-xl border border-[#DDE3DD] bg-white p-3 shadow-xs hover:border-[#1F3A2E] transition-all space-y-2"
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className={`px-1.5 py-0.5 font-bold rounded shadow-xs ${
                              lead.companyCode === 'BIZMAN' ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' :
                              lead.companyCode === 'LINDA' ? 'bg-black text-white px-1 py-0.5 text-[8px] font-extrabold tracking-wider' :
                              'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                            }`}>
                              {lead.companyCode === 'ARIELMC' ? 'ArielMC' : lead.companyCode === 'LINDA' ? 'Linda' : lead.companyCode}
                            </span>
                            <span className="font-mono text-[#1E6B3A] font-black">
                              {lead.currency === 'USD' ? '$' : '৳'}{lead.estimatedValue.toLocaleString()}
                            </span>
                          </div>

                          <h4 
                            onClick={() => { setSelectedLead(lead); setViewMode('GRID'); }}
                            className="text-xs font-bold text-[#1F3A2E] hover:underline cursor-pointer line-clamp-2"
                          >
                            {lead.title}
                          </h4>

                          <div className="text-[11px] text-[#556055] font-medium truncate">
                            {lead.customerName}
                          </div>

                          <div className="flex items-center justify-between border-t border-[#DDE3DD] pt-2 text-[10px]">
                            <span className="text-[#888] font-mono">{lead.expectedCloseDate}</span>
                            
                            <div className="flex items-center gap-1.5">
                              {/* Quick Call */}
                              <a
                                href={`tel:${lead.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 rounded bg-[#E0F2FE] text-[#0369A1] hover:bg-[#0284C7] hover:text-white border border-[#BAE6FD] hover:border-[#0284C7] transition-all shadow-xs group"
                                title={`Call ${lead.contactPerson} (${lead.phone})`}
                              >
                                <PhoneCall className="h-3 w-3 text-[#0369A1] group-hover:text-white transition-colors" />
                              </a>

                              {/* Advance Stage Shortcut */}
                              {stgKey !== 'WON' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAdvanceStage(lead.id, lead.stage);
                                  }}
                                  className="flex items-center gap-1 rounded-lg bg-[#E8F5E9] text-[#166534] hover:bg-[#166534] hover:text-white border border-[#A7F3D0] hover:border-[#166534] px-2 py-0.5 font-bold text-[10px] transition-all shadow-xs group cursor-pointer"
                                  title="Advance to next pipeline stage"
                                >
                                  <span>Advance</span>
                                  <ArrowRight className="h-3 w-3 text-[#166534] group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {stageLeads.length === 0 && (
                        <div className="p-4 text-center text-xs text-[#888] italic border border-dashed border-[#DDE3DD] rounded-lg">
                          No deals in this stage
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add Lead in this stage */}
                  <button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, stage: stgKey }));
                      setIsCreateModalOpen(true);
                    }}
                    className="w-full py-1.5 rounded-lg border border-dashed border-[#DDE3DD] hover:border-[#1F3A2E] text-[#556055] hover:text-[#1F3A2E] text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add to {cfg.label}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* CREATE NEW LEAD MODAL DIALOG */}
      {/* Triggered by Quick Action (?action=new) or header + button */}
      {/* =================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-[#DDE3DD] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#1F3A2E] text-[#C8A96A] flex items-center justify-center font-bold shadow-xs">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1F3A2E]">Create New Pipeline Lead</h3>
                  <p className="text-xs text-[#6B7269]">
                    Register a new business opportunity for ArielMC, Bizman Media, or Linda Resort
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-lg p-1 text-[#6B7269] hover:bg-[#F4F6F4] hover:text-[#1A1A1A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              {/* Entity Selection */}
              <div>
                <label className="block font-extrabold text-[#1F3A2E] mb-1">Company Entity:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, companyCode: 'ARIELMC', currency: 'USD' })}
                    className={`py-2 px-3 rounded-lg font-bold border transition-all text-center ${
                      formData.companyCode === 'ARIELMC'
                        ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow-sm'
                        : 'bg-white border-[#DDE3DD] text-[#556055] hover:bg-[#F4F6F4]'
                    }`}
                  >
                    ArielMC (Export)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, companyCode: 'BIZMAN', currency: 'BDT' })}
                    className={`py-2 px-3 rounded-lg font-bold border transition-all text-center ${
                      formData.companyCode === 'BIZMAN'
                        ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow-sm'
                        : 'bg-white border-[#DDE3DD] text-[#556055] hover:bg-[#F4F6F4]'
                    }`}
                  >
                    Bizman Media (DOOH)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, companyCode: 'LINDA', currency: 'BDT' })}
                    className={`py-2 px-3 rounded-lg font-bold border transition-all text-center ${
                      formData.companyCode === 'LINDA'
                        ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow-sm'
                        : 'bg-white border-[#DDE3DD] text-[#556055] hover:bg-[#F4F6F4]'
                    }`}
                  >
                    Linda Resort Limited
                  </button>
                </div>
              </div>

              {/* Opportunity Title */}
              <div>
                <label className="block font-extrabold text-[#1F3A2E] mb-1">Opportunity / Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grameenphone Q1 Dhanmondi & Gulshan Mega LED Campaign"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                />
              </div>

              {/* Customer & Point of Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Client Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unilever Bangladesh Limited"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Contact Person Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sajjad Hossain (Head of Media)"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
              </div>

              {/* Communication Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Primary Phone</label>
                  <input
                    type="tel"
                    placeholder="+880 1711 000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="8801711000000"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Official Email</label>
                  <input
                    type="email"
                    placeholder="sajjad@client.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
              </div>

              {/* Financial Valuation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Contract Valuation</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.estimatedValue}
                    onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2.5 text-xs text-[#1A1A1A] font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value as 'USD' | 'BDT' })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2.5 text-xs text-[#1A1A1A] font-bold focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  >
                    <option value="BDT">BDT (৳) — Bangladesh Taka</option>
                    <option value="USD">USD ($) — US Dollars</option>
                  </select>
                </div>
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Close Probability (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2.5 text-xs text-[#1A1A1A] font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
              </div>

              {/* Stage & Target Close Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Initial Pipeline Stage</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value as PipelineStage })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2.5 text-xs text-[#1A1A1A] font-bold focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  >
                    {KANBAN_STAGES.map((s) => (
                      <option key={s} value={s}>{STAGE_CONFIG[s].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Expected Close Date</label>
                  <input
                    type="date"
                    value={formData.expectedCloseDate}
                    onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2.5 text-xs text-[#1A1A1A] font-mono focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
              </div>

              {/* Initial Notes */}
              <div>
                <label className="block font-extrabold text-[#1F3A2E] mb-1">Initial Commercial / Meeting Notes</label>
                <textarea
                  rows={3}
                  placeholder="Enter initial client requirements, requested screen locations, or sample dispatch info..."
                  value={formData.notepadMarkdown}
                  onChange={(e) => setFormData({ ...formData, notepadMarkdown: e.target.value })}
                  className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DDE3DD]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg border border-[#DDE3DD] bg-white px-4 py-2 text-xs font-bold text-[#556055] hover:bg-[#F4F6F4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] px-5 py-2 text-xs font-bold border border-[#1F3A2E] shadow-sm transition-all"
                >
                  <Check className="h-4 w-4" />
                  <span>Create Opportunity</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
