'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  FileEdit, 
  Save, 
  CheckCircle2, 
  Copy, 
  Download, 
  Sparkles,
  Layers,
  BookOpen
} from 'lucide-react';
import { CompanyCode } from '@/lib/types';

const DEFAULT_SCRATCHPAD = `# Executive Master Scratchpad
**Active Entities:** Ariel Marketing & Communications | Bizman Media Limited | Linda Resort Limited

---

## 1. ArielMC Export Pipeline (Managing Director)
- [ ] EcoLiving UK: 25,000 Pcs Jute Tote Bags order pending T/T advance.
- [ ] Munich Living Germany: Terracotta Pottery & Ceramic dinnerware safety tests (EU 84/500/EEC).
- [ ] Melbourne Artisan Goods: Vegetable-tanned leather duffel samples approval.

## 2. Bizman Media Action Notes (Director & CEO)
- [ ] Review revenue share on 50+ partner vendor screens in Chittagong & Sylhet.
- [ ] Dhanmondi 27 LED screen P6 outdoor power supply module replaced.
- [ ] Finalize Grameenphone Ramadan bundle pricing (negotiate 10% wholesale vendor discount).

## 3. Linda Resort Limited Checklist (Executive Director)
- [ ] Fast-Track 9-Month Execution Plan: Review Couple Private Pool Villa foundation milestones.
- [ ] Finalize Grand Banquet Hall audiovisual specs for SCB Corporate Leadership Retreat.
- [ ] High-Net-Worth Investor Timeshare pitch: Send shareholder agreement deed to Dr. Tariqul Islam.
- [ ] German pool filtration pump and underwater LED lighting inspection with AquaPure team.
`;

export default function ScratchpadPage() {
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';

  const [content, setContent] = useState<string>(DEFAULT_SCRATCHPAD);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [copied, setCopied] = useState<boolean>(false);

  // Load from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem('master_crm_scratchpad');
    if (saved) {
      setContent(saved);
    }
  }, []);

  const handleSave = () => {
    setSaveStatus('saving');
    localStorage.setItem('master_crm_scratchpad', content);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 300);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <FileEdit className="h-4 w-4" />
            <span>Personal Productivity & Markdown Scratchpad</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-white">
            Executive Notepad
          </h1>
          <p className="text-xs text-slate-400">
            Persistent Markdown scratchpad for quick deal calculations, quotation drafts, and strategic agendas
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 mr-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Saved Locally</span>
            </span>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition-colors"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{saveStatus === 'saving' ? 'Saving...' : 'Save Notepad'}</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 shadow-xl">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={22}
          className="w-full rounded-lg border border-slate-800 bg-slate-950 p-4 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
          placeholder="Type your notes in markdown..."
        />
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>Supports standard Markdown: headers (`#`), tasks (`- [ ]`), bullet points (`-`), and bold (`**`).</span>
          <span>Auto-persisted in local storage and syncable to database backend.</span>
        </div>
      </div>
    </div>
  );
}

