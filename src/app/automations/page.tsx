'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Send, 
  Sparkles, 
  Play, 
  Pause, 
  Clock, 
  MailCheck, 
  ArrowRight, 
  Plus, 
  Building2,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { CompanyCode } from '@/lib/types';

export default function AutomationsPage() {
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';

  const sequences = [
    {
      id: 'seq-1',
      company: 'BIZMAN',
      name: 'DOOH Proposal 3-Step Follow-Up Sequence',
      triggerStage: 'PROPOSAL_QUOTATION_SENT',
      activeEnrolled: 8,
      status: 'ACTIVE',
      steps: [
        {
          step: 1,
          delay: 'Immediate upon stage trigger',
          subject: 'Bizman Media: Comprehensive DOOH Slot Proposal & Availability Matrix',
          preview: 'Dear {{contactPerson}}, thank you for discussing the upcoming DOOH campaign...',
        },
        {
          step: 2,
          delay: '3 Days after Step 1',
          subject: 'Regarding Your Screen Reservation at Dhanmondi & Gulshan Hubs',
          preview: 'Hi {{contactPerson}}, following up on our proposal sent earlier this week...',
        },
        {
          step: 3,
          delay: '5 Days after Step 2',
          subject: 'Special Rate Lock for Q4 Festive Broadcast Schedule',
          preview: 'Hello {{contactPerson}}, we are finalizing screen allocation for next month...',
        },
      ],
    },
    {
      id: 'seq-2',
      company: 'LINDA',
      name: 'Corporate Retreat & Investor Timeshare Onboarding Drip',
      triggerStage: 'MEETING_DEMO_SCHEDULED',
      activeEnrolled: 6,
      status: 'ACTIVE',
      steps: [
        {
          step: 1,
          delay: 'Immediate',
          subject: 'Linda Resort Limited: Executive Retreat Proposal & Villa Deck',
          preview: 'Thank you for your interest in Linda Resort. Attached is our Fast-Track Execution Plan & Villa Portfolio...',
        },
        {
          step: 2,
          delay: '2 Days after Step 1',
          subject: 'Linda Resort: High-Net-Worth Investor Timeshare Model & Projected 18% Yield',
          preview: 'Exploring the passive hospitality equity returns on our 1-Unit Couple Private Pool Villas...',
        },
      ],
    },
    {
      id: 'seq-3',
      company: 'ARIELMC',
      name: 'European & UK Importers Jute & Leather Sourcing Drip',
      triggerStage: 'CONTACTED',
      activeEnrolled: 12,
      status: 'ACTIVE',
      steps: [
        {
          step: 1,
          delay: 'Immediate',
          subject: 'Ariel Marketing & Communications: Ethical Sourcing Portfolio (UK & EU Compliance)',
          preview: 'Dear {{contactPerson}}, pleased to introduce our biodegradable jute goods and SEDEX certified facilities...',
        },
        {
          step: 2,
          delay: '4 Days after Step 1',
          subject: 'Complimentary Prototype Samples Dispatched via DHL Express',
          preview: 'We would love to courier product swatches and finished production samples to your office...',
        },
      ],
    },
  ];

  const filteredSequences = activeCompany === 'CONSOLIDATED'
    ? sequences
    : sequences.filter(s => s.company === activeCompany);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Send className="h-4 w-4" />
            <span>Workflow Automation Engine</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-white">
            Automated Email Sequences & Drips
          </h1>
          <p className="text-xs text-slate-400">
            Trigger automated multi-stage email follow-ups automatically whenever a Lead enters a new pipeline stage
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {filteredSequences.map((seq) => (
          <div key={seq.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  seq.company === 'BIZMAN' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                  seq.company === 'LINDA' ? 'bg-[#FFF3D6] text-[#8A5A00] border border-[#FBE0A8]' :
                  'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {seq.company === 'ARIELMC' ? 'ArielMC' : seq.company === 'LINDA' ? 'Linda Resort' : seq.company}
                </span>
                <h3 className="text-sm font-bold text-white">{seq.name}</h3>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400">
                  Trigger: <strong className="text-indigo-400 font-mono">{seq.triggerStage}</strong>
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>{seq.activeEnrolled} Leads Active</span>
                </span>
              </div>
            </div>

            {/* Sequence Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {seq.steps.map((st) => (
                <div key={st.step} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold text-indigo-400">Step {st.step}</span>
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <Clock className="h-3 w-3" />
                      {st.delay}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-200 line-clamp-1">{st.subject}</div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{st.preview}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

