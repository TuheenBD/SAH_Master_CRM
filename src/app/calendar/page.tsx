'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  CalendarDays, 
  CheckSquare, 
  Square,
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Layers,
  Sparkles,
  PhoneCall,
  Edit2,
  Trash2,
  X,
  Check,
  Filter,
  Search,
  Building2,
  AlertTriangle,
  Calendar,
  Briefcase
} from 'lucide-react';
import { CompanyCode } from '@/lib/types';
import { INITIAL_LEADS } from '@/lib/mock-data';

export interface TaskItem {
  id: string;
  company: 'BIZMAN' | 'LINDA' | 'ARIELMC';
  title: string;
  dueDate: string;
  dueTime: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM';
  status: 'PENDING' | 'COMPLETED';
  relatedDeal?: string;
  actionType?: 'CALL' | 'INSPECTION' | 'EXPORT_DISPATCH' | 'REVIEW' | 'MEETING' | 'SETTLEMENT';
  notes?: string;
  createdAt?: string;
}

const DEFAULT_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    company: 'BIZMAN',
    title: 'Call Sajjad Hossain (Grameenphone) to finalize Ramadan screen bundle rate',
    dueDate: 'Today',
    dueTime: '3:30 PM',
    priority: 'URGENT',
    status: 'PENDING',
    relatedDeal: 'Grameenphone Ramadan DOOH Campaign',
    actionType: 'CALL',
    notes: 'Direct CEO discussion with GP Media Head to lock Q4 digital rates.',
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
    actionType: 'REVIEW',
    notes: 'Verify pipe slope and infinity pool filtration vendor warranty.',
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
    actionType: 'EXPORT_DISPATCH',
    notes: 'Confirm courier airway bill tracking with UK customs broker.',
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
    actionType: 'SETTLEMENT',
    notes: 'Fully reconciled vendor accounts payable for Chittagong highway sites.',
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
    actionType: 'MEETING',
    notes: 'Attach lab SGS lead & cadmium heavy metal extraction test certificates.',
  },
];

export default function CalendarPage() {
  const searchParams = useSearchParams();
  const urlCompany = (searchParams.get('company') as CompanyCode) || 'CONSOLIDATED';
  const [selectedEntity, setSelectedEntity] = useState<CompanyCode>(urlCompany);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Initial Tasks with Browser Storage Persistence
  const [tasks, setTasks] = useState<TaskItem[]>(DEFAULT_TASKS);
  const [isLoadedFromStorage, setIsLoadedFromStorage] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sah_master_crm_tasks');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not read tasks from localStorage', e);
    } finally {
      setIsLoadedFromStorage(true);
    }
  }, []);

  // Sync tasks to localStorage and notify Header
  useEffect(() => {
    if (!isLoadedFromStorage) return;
    try {
      localStorage.setItem('sah_master_crm_tasks', JSON.stringify(tasks));
      window.dispatchEvent(new Event('calendar-tasks-updated'));
    } catch (e) {
      console.error('Failed to sync tasks', e);
    }
  }, [tasks, isLoadedFromStorage]);

  // Selection State for Bulk Operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State for New / Edit Task
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  // Delete Confirmation State
  const [deleteConfirmTask, setDeleteConfirmTask] = useState<TaskItem | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    company: 'BIZMAN' | 'LINDA' | 'ARIELMC';
    title: string;
    dueDate: string;
    dueTime: string;
    priority: 'URGENT' | 'HIGH' | 'MEDIUM';
    relatedDeal: string;
    actionType: 'CALL' | 'INSPECTION' | 'EXPORT_DISPATCH' | 'REVIEW' | 'MEETING' | 'SETTLEMENT';
    notes: string;
  }>({
    company: 'BIZMAN',
    title: '',
    dueDate: 'Today',
    dueTime: '3:30 PM',
    priority: 'HIGH',
    relatedDeal: '',
    actionType: 'CALL',
    notes: '',
  });

  // Toggle Completion
  const toggleTaskStatus = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' } : t));
  };

  // Toggle Select Single
  const handleToggleSelect = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Select All / Deselect All
  const handleSelectAll = () => {
    if (selectedIds.length === filteredTasks.length && filteredTasks.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTasks.map(t => t.id));
    }
  };

  // Open New Task Modal
  const handleOpenNew = () => {
    setEditingTask(null);
    setFormData({
      company: selectedEntity === 'CONSOLIDATED' ? 'BIZMAN' : (selectedEntity as any),
      title: '',
      dueDate: 'Today',
      dueTime: '03:30 PM',
      priority: 'HIGH',
      relatedDeal: '',
      actionType: 'CALL',
      notes: '',
    });
    setIsModalOpen(true);
  };

  // Open Edit Task Modal
  const handleOpenEdit = (task: TaskItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingTask(task);
    setFormData({
      company: task.company,
      title: task.title,
      dueDate: task.dueDate,
      dueTime: task.dueTime,
      priority: task.priority,
      relatedDeal: task.relatedDeal || '',
      actionType: task.actionType || 'CALL',
      notes: task.notes || '',
    });
    setIsModalOpen(true);
  };

  // Submit New or Edited Task
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      // Edit
      setTasks(prev => prev.map(t => {
        if (t.id === editingTask.id) {
          return {
            ...t,
            company: formData.company,
            title: formData.title.trim(),
            dueDate: formData.dueDate.trim() || 'Today',
            dueTime: formData.dueTime.trim() || '12:00 PM',
            priority: formData.priority,
            relatedDeal: formData.relatedDeal.trim() || undefined,
            actionType: formData.actionType,
            notes: formData.notes.trim() || undefined,
          };
        }
        return t;
      }));
    } else {
      // Create
      const newTask: TaskItem = {
        id: `task-${Date.now()}`,
        company: formData.company,
        title: formData.title.trim(),
        dueDate: formData.dueDate.trim() || 'Today',
        dueTime: formData.dueTime.trim() || '12:00 PM',
        priority: formData.priority,
        status: 'PENDING',
        relatedDeal: formData.relatedDeal.trim() || undefined,
        actionType: formData.actionType,
        notes: formData.notes.trim() || undefined,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTasks([newTask, ...tasks]);
    }

    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Delete Single Task
  const handleConfirmDelete = () => {
    if (!deleteConfirmTask) return;
    setTasks(prev => prev.filter(t => t.id !== deleteConfirmTask.id));
    setSelectedIds(prev => prev.filter(id => id !== deleteConfirmTask.id));
    setDeleteConfirmTask(null);
  };

  // Bulk Delete Selected Tasks
  const handleConfirmBulkDelete = () => {
    setTasks(prev => prev.filter(t => !selectedIds.includes(t.id)));
    setSelectedIds([]);
    setBulkDeleteConfirmOpen(false);
  };

  // Bulk Mark Completed / Pending
  const handleBulkToggleStatus = (targetStatus: 'COMPLETED' | 'PENDING') => {
    setTasks(prev => prev.map(t => selectedIds.includes(t.id) ? { ...t, status: targetStatus } : t));
    setSelectedIds([]);
  };

  // Filter Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      // Entity Filter
      if (selectedEntity !== 'CONSOLIDATED' && t.company !== selectedEntity) {
        return false;
      }
      // Status Filter
      if (statusFilter !== 'ALL' && t.status !== statusFilter) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchDeal = t.relatedDeal?.toLowerCase().includes(q);
        const matchNotes = t.notes?.toLowerCase().includes(q);
        if (!matchTitle && !matchDeal && !matchNotes) return false;
      }
      return true;
    });
  }, [tasks, selectedEntity, statusFilter, searchQuery]);

  // High-Priority Today's Schedule
  const todaySchedule = useMemo(() => {
    return tasks.filter(t => t.dueDate === 'Today' || t.priority === 'URGENT').slice(0, 4);
  }, [tasks]);

  return (
    <div className="space-y-6">
      {/* =================================================================== */}
      {/* 1. HEADER & PRIMARY ACTION CONTROLS */}
      {/* =================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE3DD] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1F3A2E]">
            <CalendarDays className="h-4 w-4 text-[#C8A96A]" />
            <span>Time & Execution Command Center</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-[#1F3A2E] tracking-tight">
            Calendar & Action Items
          </h1>
          <p className="text-xs text-[#556055]">
            Keep track of client follow-up calls, screen maintenance inspections, and export shipping milestones
          </p>
        </div>

        {/* Action Button: New Action Item */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-white px-4 py-2.5 text-xs font-extrabold shadow-sm hover:shadow transition-all"
          >
            <Plus className="h-4 w-4 text-[#C8A96A]" />
            <span>+ New Action Item</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. ENTITY & STATUS FILTER TABS */}
      {/* =================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Entity Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedEntity('CONSOLIDATED')}
            className={`rounded-lg px-3.5 py-1.5 font-bold transition-all border ${
              selectedEntity === 'CONSOLIDATED'
                ? 'bg-[#1F3A2E] text-white border-[#1F3A2E] shadow-xs'
                : 'bg-white border-[#DDE3DD] text-[#556055] hover:bg-[#F4F6F4]'
            }`}
          >
            All Entities ({tasks.length})
          </button>
          <button
            onClick={() => setSelectedEntity('ARIELMC')}
            className={`rounded-lg px-3.5 py-1.5 font-bold transition-all border ${
              selectedEntity === 'ARIELMC'
                ? 'bg-[#1E6B3A] text-white border-[#1E6B3A] shadow-xs'
                : 'bg-white border-[#DDE3DD] text-[#556055] hover:text-[#1E6B3A] hover:bg-[#F4F6F4]'
            }`}
          >
            ArielMC ({tasks.filter(t => t.company === 'ARIELMC').length})
          </button>
          <button
            onClick={() => setSelectedEntity('BIZMAN')}
            className={`rounded-lg px-3.5 py-1.5 font-bold transition-all border ${
              selectedEntity === 'BIZMAN'
                ? 'bg-[#1F5FA8] text-white border-[#1F5FA8] shadow-xs'
                : 'bg-white border-[#DDE3DD] text-[#556055] hover:text-[#1F5FA8] hover:bg-[#F4F6F4]'
            }`}
          >
            Bizman Media ({tasks.filter(t => t.company === 'BIZMAN').length})
          </button>
          <button
            onClick={() => setSelectedEntity('LINDA')}
            className={`rounded-lg px-3.5 py-1.5 font-bold transition-all border ${
              selectedEntity === 'LINDA'
                ? 'bg-[#8A5A00] text-white border-[#8A5A00] shadow-xs'
                : 'bg-white border-[#DDE3DD] text-[#556055] hover:text-[#8A5A00] hover:bg-[#F4F6F4]'
            }`}
          >
            Linda Resort ({tasks.filter(t => t.company === 'LINDA').length})
          </button>
        </div>

        {/* Search & Status Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#8FA899]" />
            <input
              type="text"
              placeholder="Search actions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-[#DDE3DD] bg-white pl-8 pr-3 py-1.5 text-xs text-[#1A1A1A] placeholder:text-[#8FA899] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E] w-48 sm:w-56"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-lg border border-[#DDE3DD] bg-white px-3 py-1.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending Only</option>
            <option value="COMPLETED">Completed Only</option>
          </select>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. MULTI-SELECTION ACTION BAR */}
      {/* =================================================================== */}
      {selectedIds.length > 0 && (
        <div className="rounded-xl bg-[#1F3A2E] text-white px-4 py-3 shadow-md flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#C8A96A] animate-pulse" />
            <span className="font-extrabold text-xs">
              {selectedIds.length} {selectedIds.length === 1 ? 'Action Item' : 'Action Items'} Selected
            </span>
            <button
              onClick={() => setSelectedIds([])}
              className="text-[11px] text-[#C8A96A] hover:underline"
            >
              Clear Selection
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkToggleStatus('COMPLETED')}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold transition-all"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Mark Done</span>
            </button>
            <button
              onClick={() => handleBulkToggleStatus('PENDING')}
              className="flex items-center gap-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 text-xs font-bold transition-all"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Mark Pending</span>
            </button>
            <button
              onClick={() => setBulkDeleteConfirmOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 text-xs font-bold transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. MAIN TWO-COLUMN CONTENT GRID */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Action Item List */}
        <div className="lg:col-span-2 space-y-3">
          {/* Subheader with Select All & Counters */}
          <div className="flex items-center justify-between text-xs text-[#556055] font-bold px-1 border-b border-[#DDE3DD] pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-1.5 text-[#1F3A2E] hover:text-[#2C5240] transition-colors"
                title={selectedIds.length === filteredTasks.length ? 'Deselect All' : 'Select All'}
              >
                {selectedIds.length === filteredTasks.length && filteredTasks.length > 0 ? (
                  <CheckSquare className="h-4 w-4 text-[#1F3A2E]" />
                ) : (
                  <Square className="h-4 w-4 text-[#8FA899]" />
                )}
                <span>Select All ({filteredTasks.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#6B7269]">
                Pending: <strong className="text-[#1F3A2E]">{tasks.filter(t => t.status === 'PENDING').length}</strong>
              </span>
              <span className="text-[11px] text-[#6B7269]">
                Completed: <strong className="text-emerald-700">{tasks.filter(t => t.status === 'COMPLETED').length}</strong>
              </span>
            </div>
          </div>

          {/* Task Card Stack */}
          <div className="space-y-2.5">
            {filteredTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#DDE3DD] bg-white p-12 text-center space-y-3 shadow-xs">
                <div className="mx-auto w-12 h-12 rounded-xl bg-[#F4F6F4] flex items-center justify-center text-[#1F3A2E] border border-[#DDE3DD]">
                  <CheckCircle2 className="h-6 w-6 text-[#C8A96A]" />
                </div>
                <h3 className="text-base font-extrabold text-[#1F3A2E]">No Action Items Found</h3>
                <p className="text-xs text-[#6B7269] max-w-sm mx-auto">
                  All tasks are either finished or no items match your current filter. Click below to add a new action item.
                </p>
                <button
                  onClick={handleOpenNew}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white px-3.5 py-2 text-xs font-bold transition-all shadow-xs mx-auto"
                >
                  <Plus className="h-3.5 w-3.5 text-[#C8A96A]" />
                  <span>+ Create Action Item</span>
                </button>
              </div>
            ) : (
              filteredTasks.map((t) => {
                const isDone = t.status === 'COMPLETED';
                const isSelected = selectedIds.includes(t.id);

                return (
                  <div
                    key={t.id}
                    className={`rounded-xl border p-4 transition-all relative group bg-white shadow-xs ${
                      isSelected 
                        ? 'border-[#1F3A2E] ring-2 ring-[#1F3A2E]/10 bg-[#F4F6F4]/50'
                        : isDone
                        ? 'border-[#E2E8E2] bg-[#FAFCFA] opacity-75'
                        : 'border-[#DDE3DD] hover:border-[#1F3A2E]/60 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Selection Checkbox */}
                      <button
                        onClick={(e) => handleToggleSelect(t.id, e)}
                        className="mt-1 text-[#8FA899] hover:text-[#1F3A2E] transition-colors"
                        title={isSelected ? 'Deselect Task' : 'Select Task'}
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-[#1F3A2E]" />
                        ) : (
                          <Square className="h-4 w-4 text-[#8FA899]" />
                        )}
                      </button>

                      {/* Done / Complete Circular Checkbox */}
                      <button
                        onClick={(e) => toggleTaskStatus(t.id, e)}
                        className={`mt-1 h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${
                          isDone 
                            ? 'bg-emerald-600 border-emerald-600 text-white' 
                            : 'border-[#8FA899] hover:border-[#1F3A2E] text-transparent'
                        }`}
                        title={isDone ? 'Mark Pending' : 'Mark Done'}
                      >
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </button>

                      {/* Main Body */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        {/* Top Metadata Row: Entity, Priority, Due Time, and Action Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Entity Badge */}
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded shadow-xs ${
                              t.company === 'BIZMAN' ? 'bg-[#E8F0FA] text-[#1F5FA8] border border-[#BBD5F2]' :
                              t.company === 'LINDA' ? 'bg-[#FFF3D6] text-[#8A5A00] border border-[#FBE0A8]' :
                              'bg-[#E4F3E9] text-[#1E6B3A] border border-[#B6E2C5]'
                            }`}>
                              {t.company === 'ARIELMC' ? 'ArielMC' : t.company === 'LINDA' ? 'Linda Resort' : t.company}
                            </span>

                            {/* Priority Badge */}
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              t.priority === 'URGENT' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                              t.priority === 'HIGH' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                              'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {t.priority}
                            </span>

                            {/* Due Date & Time */}
                            <span className="text-[#6B7269] font-mono text-[11px] flex items-center gap-1 ml-1">
                              <Clock className="h-3 w-3 text-[#8FA899]" />
                              <span>{t.dueDate} &bull; {t.dueTime}</span>
                            </span>
                          </div>

                          {/* Action Buttons: Edit, Delete */}
                          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => handleOpenEdit(t, e)}
                              title="Edit Action Item"
                              className="p-1.5 rounded-md hover:bg-[#F4F6F4] text-[#556055] hover:text-[#1F3A2E] transition-colors"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmTask(t);
                              }}
                              title="Delete Action Item"
                              className="p-1.5 rounded-md hover:bg-rose-50 text-[#556055] hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <p className={`text-sm font-semibold transition-all ${
                          isDone ? 'line-through text-[#8FA899]' : 'text-[#1A1A1A]'
                        }`}>
                          {t.title}
                        </p>

                        {/* Sub-info: Related Deal & Notes */}
                        <div className="flex flex-wrap items-center gap-3 text-[11px]">
                          {t.relatedDeal && (
                            <span className="text-[#1F5FA8] font-mono font-medium flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              <span>Deal: {t.relatedDeal}</span>
                            </span>
                          )}
                          {t.notes && (
                            <span className="text-[#6B7269] italic truncate max-w-md">
                              {t.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Today's High Priority Schedule */}
        <div className="rounded-xl border border-[#DDE3DD] bg-white p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-2.5">
            <h2 className="text-sm font-extrabold text-[#1F3A2E]">
              Today&apos;s High Priority Schedule
            </h2>
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
              Live Agenda
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {todaySchedule.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#6B7269]">
                No urgent tasks scheduled for today.
              </div>
            ) : (
              todaySchedule.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border-l-4 border p-3 space-y-1 bg-[#FAFCFA] transition-all hover:bg-white shadow-xs ${
                    item.priority === 'URGENT' 
                      ? 'border-l-rose-600 border-[#E2E8E2]' 
                      : item.company === 'ARIELMC'
                      ? 'border-l-emerald-600 border-[#E2E8E2]'
                      : 'border-l-amber-500 border-[#E2E8E2]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1F3A2E]">
                      {item.dueTime} &bull; {item.actionType || 'SESSION'}
                    </span>
                    <span className="text-[10px] font-bold text-[#6B7269] font-mono">
                      {item.company}
                    </span>
                  </div>
                  <div className="font-bold text-[#1A1A1A] text-xs">
                    {item.title}
                  </div>
                  {item.notes && (
                    <div className="text-[#6B7269] text-[11px] truncate">
                      {item.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Quick Add Helper Box */}
          <div className="pt-2 border-t border-[#DDE3DD]">
            <button
              onClick={handleOpenNew}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#DDE3DD] bg-[#F4F6F4] hover:bg-[#E8EFE8] text-[#1F3A2E] py-2 text-xs font-bold transition-all"
            >
              <Plus className="h-3.5 w-3.5 text-[#C8A96A]" />
              <span>Schedule New Agenda Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 5. NEW / EDIT ACTION ITEM MODAL */}
      {/* =================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-[#DDE3DD] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#F4F6F4] text-[#1F3A2E] flex items-center justify-center font-bold">
                  {editingTask ? <Edit2 className="h-4 w-4 text-[#C8A96A]" /> : <Plus className="h-4 w-4 text-[#C8A96A]" />}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1F3A2E]">
                    {editingTask ? 'Edit Action Item' : 'Create New Action Item'}
                  </h3>
                  <p className="text-xs text-[#6B7269]">
                    Schedule client follow-ups, inspections, or delivery dispatches
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-[#6B7269] hover:bg-[#F4F6F4] hover:text-[#1A1A1A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div>
                <label className="text-[#556055] font-bold block mb-1">Action Description / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Call Sajjad Hossain to finalize Ramadan screen rate"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#556055] font-bold block mb-1">Operating Entity *</label>
                  <select
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value as any })}
                    className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                  >
                    <option value="ARIELMC">ArielMC (Global Export Trade)</option>
                    <option value="BIZMAN">Bizman Media Limited (DOOH Media)</option>
                    <option value="LINDA">Linda Resort Limited (Eco-Resort)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#556055] font-bold block mb-1">Priority Level *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none font-bold"
                  >
                    <option value="URGENT">🔴 URGENT (Critical Today)</option>
                    <option value="HIGH">🟡 HIGH (Important)</option>
                    <option value="MEDIUM">🟢 MEDIUM (Normal)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#556055] font-bold block mb-1">Due Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Today, Tomorrow, or Oct 31, 2026"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#556055] font-bold block mb-1">Due Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3:30 PM"
                    value={formData.dueTime}
                    onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#556055] font-bold block mb-1">Action Type</label>
                  <select
                    value={formData.actionType}
                    onChange={(e) => setFormData({ ...formData, actionType: e.target.value as any })}
                    className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                  >
                    <option value="CALL">Call Session</option>
                    <option value="INSPECTION">Site Inspection</option>
                    <option value="EXPORT_DISPATCH">Export Shipping Dispatch</option>
                    <option value="REVIEW">Contract / Blueprint Review</option>
                    <option value="MEETING">Executive Meeting</option>
                    <option value="SETTLEMENT">Financial Settlement</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#556055] font-bold block mb-1">Tagged Project / Deal</label>
                  <input
                    type="text"
                    placeholder="e.g. Grameenphone Ramadan DOOH Campaign"
                    value={formData.relatedDeal}
                    onChange={(e) => setFormData({ ...formData, relatedDeal: e.target.value })}
                    list="deal-options"
                    className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                  />
                  <datalist id="deal-options">
                    {INITIAL_LEADS.slice(0, 15).map(l => (
                      <option key={l.id} value={l.title} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="text-[#556055] font-bold block mb-1">Context Notes & Scope</label>
                <textarea
                  rows={2}
                  placeholder="Enter specific items to address during this call or inspection..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDE3DD]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-[#DDE3DD] bg-white px-4 py-2 text-xs font-bold text-[#556055] hover:bg-[#F4F6F4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white px-5 py-2 text-xs font-bold shadow-xs transition-all"
                >
                  {editingTask ? 'Save Changes' : 'Create Action Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 6. SINGLE DELETE CONFIRMATION DIALOG */}
      {/* =================================================================== */}
      {deleteConfirmTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#DDE3DD] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1F3A2E]">Delete Action Item?</h3>
                <p className="text-xs text-[#6B7269]">This action item will be permanently removed.</p>
              </div>
            </div>

            <div className="p-3 bg-[#F4F6F4] rounded-xl border border-[#DDE3DD] text-xs space-y-1">
              <div className="font-bold text-[#1F3A2E]">{deleteConfirmTask.title}</div>
              <div className="text-[11px] text-[#6B7269] font-mono">
                {deleteConfirmTask.company} &bull; {deleteConfirmTask.dueDate} &bull; {deleteConfirmTask.dueTime}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmTask(null)}
                className="rounded-lg border border-[#DDE3DD] bg-white px-4 py-2 text-xs font-bold text-[#556055] hover:bg-[#F4F6F4]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-xs font-bold shadow-xs transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 7. BULK DELETE CONFIRMATION DIALOG */}
      {/* =================================================================== */}
      {bulkDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#DDE3DD] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1F3A2E]">Delete {selectedIds.length} Selected Items?</h3>
                <p className="text-xs text-[#6B7269]">All selected action items will be permanently removed from your calendar.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setBulkDeleteConfirmOpen(false)}
                className="rounded-lg border border-[#DDE3DD] bg-white px-4 py-2 text-xs font-bold text-[#556055] hover:bg-[#F4F6F4]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBulkDelete}
                className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-xs font-bold shadow-xs transition-all"
              >
                Delete {selectedIds.length} Items
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


