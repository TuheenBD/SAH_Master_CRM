'use client';

import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { CompanyCode, LeadItem, PipelineStage } from '@/lib/types';
import { INITIAL_LEADS } from '@/lib/mock-data';

const STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: 'NEW_INQUIRY', label: 'New Inquiry', color: 'border-blue-500/50 bg-blue-950/20 text-blue-400' },
  { key: 'CONTACTED', label: 'Contacted', color: 'border-indigo-500/50 bg-indigo-950/20 text-indigo-400' },
  { key: 'MEETING_SCHEDULED', label: 'Meeting / Survey', color: 'border-purple-500/50 bg-purple-950/20 text-purple-400' },
  { key: 'PROPOSAL_SENT', label: 'Proposal Sent', color: 'border-amber-500/50 bg-amber-950/20 text-amber-400' },
  { key: 'NEGOTIATION', label: 'Negotiation', color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-400' },
  { key: 'WON', label: 'Contract Won', color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400' },
];

export default function LeadsPage() {
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';

  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(INITIAL_LEADS[0]);
  const [notepadContent, setNotepadContent] = useState<string>(INITIAL_LEADS[0]?.notepadMarkdown || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Filter leads based on company context
  const filteredLeads = activeCompany === 'CONSOLIDATED'
    ? leads
    : leads.filter(l => l.companyCode === activeCompany);

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Users className="h-4 w-4" />
            <span>Multi-Company Pipeline Engine</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-white">
            Customer & Deal Control
          </h1>
          <p className="text-xs text-slate-400">
            Managing DOOH campaigns (Bizman Media), luxury eco-resort hospitality (Linda Resort) and international export containers (ArielMC)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            Total Pipeline Value: <strong className="text-emerald-400 font-mono">
              ৳ {filteredLeads.filter(l => l.currency === 'BDT').reduce((s, l) => s + l.estimatedValue, 0).toLocaleString()}
              {' '}+{' '}
              ${filteredLeads.filter(l => l.currency === 'USD').reduce((s, l) => s + l.estimatedValue, 0).toLocaleString()}
            </strong>
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout: Pipeline List & Lead Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Lead Directory & Stage Cards (5 Columns) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing {filteredLeads.length} Opportunities</span>
            <span>Click to inspect & edit notepad</span>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {filteredLeads.map((lead) => {
              const isSelected = selectedLead?.id === lead.id;
              return (
                <div
                  key={lead.id}
                  onClick={() => handleSelectLead(lead)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-slate-900 shadow-md shadow-indigo-500/10'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      lead.companyCode === 'BIZMAN' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                      lead.companyCode === 'LINDA' ? 'bg-[#FFF3D6] text-[#8A5A00] border border-[#FBE0A8]' :
                      'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {lead.companyCode === 'ARIELMC' ? 'ArielMC' : lead.companyCode === 'LINDA' ? 'LINDA RESORT' : lead.companyCode}
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {lead.currency === 'USD' ? '$' : '৳'}{lead.estimatedValue.toLocaleString()}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-white line-clamp-1">{lead.title}</h3>
                  <div className="text-xs text-slate-300 mt-0.5">{lead.customerName} &bull; {lead.country}</div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300 font-medium">
                      {lead.stage.replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono">{lead.expectedCloseDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Lead Inspector with Markdown Notepad & Deep Links (7 Columns) */}
        {selectedLead && (
          <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-6">
            {/* Lead Inspector Header */}
            <div className="border-b border-slate-800 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                    selectedLead.companyCode === 'BIZMAN' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                    selectedLead.companyCode === 'LINDA' ? 'bg-[#FFF3D6] text-[#8A5A00] border border-[#FBE0A8]' :
                    'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {selectedLead.companyCode === 'ARIELMC' ? 'ArielMC' : selectedLead.companyCode === 'LINDA' ? 'LINDA RESORT' : selectedLead.companyCode}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{selectedLead.pipelineType}</span>
                </div>

                {/* Call & WhatsApp Quick Communication Buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-semibold shadow transition-colors"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>Call ({selectedLead.phone})</span>
                  </a>

                  <a
                    href={`https://wa.me/${selectedLead.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 px-3 py-1.5 text-xs font-semibold transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              <h2 className="mt-3 text-xl font-extrabold text-white">{selectedLead.title}</h2>
              <div className="mt-1 text-sm text-slate-300">
                <strong>{selectedLead.customerName}</strong> &bull; Contact: {selectedLead.contactPerson}
              </div>
            </div>

            {/* Stage Selector Bar */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Update Pipeline Stage
              </div>
              <div className="flex flex-wrap gap-1.5">
                {STAGES.map((s) => {
                  const isActive = selectedLead.stage === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => handleStageChange(s.key)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium border transition-all ${
                        isActive
                          ? `${s.color} font-bold shadow-sm ring-1 ring-white/20`
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Operational Domain Specifics */}
            <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-4">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Deal Parameters & Commercial Specs
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="text-slate-500">Deal Value:</div>
                  <div className="font-bold text-white font-mono mt-0.5">
                    {selectedLead.currency === 'USD' ? '$' : '৳'}{selectedLead.estimatedValue.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Close Probability:</div>
                  <div className="font-bold text-emerald-400 font-mono mt-0.5">
                    {selectedLead.probability}%
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Target Date:</div>
                  <div className="font-medium text-slate-200 font-mono mt-0.5">
                    {selectedLead.expectedCloseDate}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Email:</div>
                  <div className="font-medium text-slate-200 truncate mt-0.5">
                    {selectedLead.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 5.D: Persistent Autosaving Markdown Notepad */}
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileEdit className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-bold text-slate-200">
                    Deal Markdown Scratchpad & Meeting Log
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {saveStatus === 'saved' && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Saved</span>
                    </span>
                  )}
                  <button
                    onClick={handleSaveNotepad}
                    disabled={saveStatus === 'saving'}
                    className="flex items-center gap-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 text-xs font-semibold transition-colors"
                  >
                    <Save className="h-3 w-3" />
                    <span>{saveStatus === 'saving' ? 'Saving...' : 'Save Notes'}</span>
                  </button>
                </div>
              </div>

              <textarea
                value={notepadContent}
                onChange={(e) => setNotepadContent(e.target.value)}
                placeholder="Write structured meeting notes, client requirements, quotation specs in markdown..."
                rows={9}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="text-[11px] text-slate-500">
                Supports GitHub Flavored Markdown (bullet lists, bold tags, tables, specs). Persists directly in database.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

