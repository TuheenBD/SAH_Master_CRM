'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  CalendarDays, 
  CheckSquare, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Layers,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { CompanyCode } from '@/lib/types';

interface TaskItem {
  id: string;
  company: 'BIZMAN' | 'LINDA' | 'ARIELMC';
  title: string;
  dueDate: string;
  dueTime: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM';
  status: 'PENDING' | 'COMPLETED';
  relatedDeal?: string;
}

export default function CalendarPage() {
  const searchParams = useSearchParams();
  const activeCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';

  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'task-1',
      company: 'BIZMAN',
      title: 'Call Sajjad Hossain (Grameenphone) to finalize Ramadan screen bundle rate',
      dueDate: 'Today',
      dueTime: '3:30 PM',
      priority: 'URGENT',
      status: 'PENDING',
      relatedDeal: 'Grameenphone Ramadan DOOH Campaign',
    },
    {
      id: 'task-2',
      company: 'LINDA',
      title: 'Review architectural blueprints & pool plumbing for Couple Private Pool Villas',
      dueDate: 'Today',
      dueTime: '5:00 PM',
      priority: 'HIGH',
      status: 'PENDING',
      relatedDeal: 'Linda Resort Fast-Track 9-Month Execution Plan',
    },
    {
      id: 'task-3',
      company: 'ARIELMC',
      title: 'Track DHL express package delivery for EcoLiving UK Jute prototypes',
      dueDate: 'Tomorrow',
      dueTime: '11:00 AM',
      priority: 'HIGH',
      status: 'PENDING',
      relatedDeal: 'EcoLiving UK Order',
    },
    {
      id: 'task-4',
      company: 'BIZMAN',
      title: 'Sign vendor settlement agreement for 4x Chittagong LED screens',
      dueDate: 'Oct 31, 2026',
      dueTime: '2:00 PM',
      priority: 'MEDIUM',
      status: 'COMPLETED',
      relatedDeal: 'Vendor Network Settlement',
    },
    {
      id: 'task-5',
      company: 'ARIELMC',
      title: 'Email REACH chemical test report to Munich Ceramics buyer',
      dueDate: 'Nov 02, 2026',
      dueTime: '4:00 PM',
      priority: 'MEDIUM',
      status: 'PENDING',
      relatedDeal: 'Munich Living Ceramics',
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' } : t));
  };

  const filteredTasks = activeCompany === 'CONSOLIDATED'
    ? tasks
    : tasks.filter(t => t.company === activeCompany);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <CalendarDays className="h-4 w-4" />
            <span>Time & Execution Command Center</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-white">
            Calendar & Action Items
          </h1>
          <p className="text-xs text-slate-400">
            Keep track of client follow-up calls, screen maintenance inspections, and export shipping milestones
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Action Item List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Pending To-dos ({filteredTasks.filter(t => t.status === 'PENDING').length})</span>
            <span>Click checkbox to mark done</span>
          </div>

          <div className="space-y-2.5">
            {filteredTasks.map((t) => {
              const isDone = t.status === 'COMPLETED';
              return (
                <div
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className={`cursor-pointer rounded-xl border p-4 flex items-start gap-3.5 transition-all ${
                    isDone
                      ? 'border-slate-800/50 bg-slate-950/40 opacity-60'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => {}}
                    className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer"
                  />

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        t.company === 'BIZMAN' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                        t.company === 'LINDA' ? 'bg-[#FFF3D6] text-[#8A5A00] border border-[#FBE0A8]' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {t.company}
                      </span>

                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.priority === 'URGENT' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                          t.priority === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {t.priority}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {t.dueDate} &bull; {t.dueTime}
                        </span>
                      </div>
                    </div>

                    <p className={`text-sm font-medium ${isDone ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                      {t.title}
                    </p>

                    {t.relatedDeal && (
                      <div className="text-[11px] text-indigo-400 font-mono">
                        Deal: {t.relatedDeal}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Today's Executive Agenda */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            Today&apos;s High Priority Schedule
          </h2>

          <div className="space-y-3 text-xs">
            <div className="rounded-lg bg-slate-950 border-l-4 border-l-rose-500 border border-slate-800 p-3 space-y-1">
              <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">3:30 PM &bull; Call Session</div>
              <div className="font-semibold text-slate-200">GP Ramadan Campaign Rate Finalization</div>
              <div className="text-slate-400 text-[11px]">Direct CEO discussion with GP Media Head</div>
            </div>

            <div className="rounded-lg bg-slate-950 border-l-4 border-l-orange-500 border border-slate-800 p-3 space-y-1">
              <div className="text-[10px] font-mono text-orange-400 font-bold uppercase">5:00 PM &bull; Site Inspection</div>
              <div className="font-semibold text-slate-200">Motijheel Flagship LED Unipole Check</div>
              <div className="text-slate-400 text-[11px]">Verify brightness before nighttime evening peak</div>
            </div>

            <div className="rounded-lg bg-slate-950 border-l-4 border-l-emerald-500 border border-slate-800 p-3 space-y-1">
              <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">6:30 PM &bull; Export Dispatch</div>
              <div className="font-semibold text-slate-200">ArielMC London Buyer Follow-up</div>
              <div className="text-slate-400 text-[11px]">Confirm courier tracking with UK clearing agent</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

