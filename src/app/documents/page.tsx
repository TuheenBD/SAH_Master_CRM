'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  FolderKanban, 
  Upload, 
  Search, 
  Filter, 
  LayoutGrid, 
  Table as TableIcon, 
  Plus, 
  Trash2, 
  Edit2, 
  Share2, 
  Download, 
  Eye, 
  CheckSquare, 
  Square, 
  FileText, 
  FileSpreadsheet, 
  File, 
  Image as ImageIcon, 
  Archive, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Calendar, 
  ShieldAlert, 
  Lock, 
  Sparkles, 
  Building2, 
  Tv2, 
  Globe2, 
  Layers, 
  UserCheck, 
  AlertTriangle,
  MessageSquare,
  FileCheck2
} from 'lucide-react';
import { 
  DocumentRecord, 
  DocumentCategory, 
  DocumentFileType, 
  DocumentSecurityLevel, 
  CompanyCode, 
  COMPANIES 
} from '@/lib/types';
import { INITIAL_DOCUMENTS } from '@/lib/mock-data';

export default function DocumentCenterPage() {
  const searchParams = useSearchParams();
  const queryCompany = searchParams.get('company') as CompanyCode | null;
  const initialAction = searchParams.get('action');

  // Core State
  const [documents, setDocuments] = useState<DocumentRecord[]>(INITIAL_DOCUMENTS);
  const [selectedEntity, setSelectedEntity] = useState<string>(queryCompany || 'CONSOLIDATED');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(initialAction === 'upload');
  const [editingDoc, setEditingDoc] = useState<DocumentRecord | null>(null);
  const [sharingDoc, setSharingDoc] = useState<DocumentRecord | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<DocumentRecord | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Upload/Edit Form State
  const [formData, setFormData] = useState<{
    title: string;
    fileName: string;
    fileSize: string;
    fileType: DocumentFileType;
    companyCode: 'ARIELMC' | 'BIZMAN' | 'LINDA' | 'PERSONAL' | 'CONSOLIDATED';
    category: DocumentCategory;
    securityLevel: DocumentSecurityLevel;
    expiryDate: string;
    tags: string;
    notes: string;
    version: string;
  }>({
    title: '',
    fileName: '',
    fileSize: '1.5 MB',
    fileType: 'PDF',
    companyCode: 'ARIELMC',
    category: 'CONTRACT_AGREEMENT',
    securityLevel: 'CONFIDENTIAL',
    expiryDate: '',
    tags: '',
    notes: '',
    version: 'v1.0',
  });

  // Filtered Documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Entity Filter
      if (selectedEntity !== 'CONSOLIDATED' && doc.companyCode !== selectedEntity) {
        return false;
      }

      // Category Filter
      if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) {
        return false;
      }

      // Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(q);
        const matchesFile = doc.fileName.toLowerCase().includes(q);
        const matchesNotes = doc.notes?.toLowerCase().includes(q);
        const matchesTags = doc.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesFile && !matchesNotes && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [documents, selectedEntity, selectedCategory, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: documents.length,
      ariel: documents.filter(d => d.companyCode === 'ARIELMC').length,
      bizman: documents.filter(d => d.companyCode === 'BIZMAN').length,
      linda: documents.filter(d => d.companyCode === 'LINDA').length,
      personal: documents.filter(d => d.companyCode === 'PERSONAL').length,
      confidential: documents.filter(d => d.securityLevel === 'CONFIDENTIAL').length,
    };
  }, [documents]);

  // Selection Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredDocuments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDocuments.map(d => d.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // Upload Handlers
  const handleOpenUpload = () => {
    setFormData({
      title: '',
      fileName: '',
      fileSize: '2.1 MB',
      fileType: 'PDF',
      companyCode: selectedEntity === 'CONSOLIDATED' ? 'ARIELMC' : (selectedEntity as any),
      category: 'CONTRACT_AGREEMENT',
      securityLevel: 'CONFIDENTIAL',
      expiryDate: '',
      tags: '',
      notes: '',
      version: 'v1.0',
    });
    setIsUploadModalOpen(true);
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newDoc: DocumentRecord = {
      id: `doc-${Date.now()}`,
      title: formData.title.trim(),
      fileName: formData.fileName.trim() || `${formData.title.toLowerCase().replace(/\s+/g, '-')}.${formData.fileType.toLowerCase()}`,
      fileSize: formData.fileSize || '1.8 MB',
      fileType: formData.fileType,
      companyCode: formData.companyCode,
      category: formData.category,
      securityLevel: formData.securityLevel,
      uploadDate: new Date().toISOString().split('T')[0],
      expiryDate: formData.expiryDate || undefined,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      notes: formData.notes.trim() || undefined,
      uploadedBy: 'Syed Akramul Hassan',
      version: formData.version || 'v1.0',
      downloadCount: 0,
    };

    setDocuments([newDoc, ...documents]);
    setIsUploadModalOpen(false);
  };

  // Edit Handlers
  const handleOpenEdit = (doc: DocumentRecord) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      fileType: doc.fileType,
      companyCode: doc.companyCode,
      category: doc.category,
      securityLevel: doc.securityLevel,
      expiryDate: doc.expiryDate || '',
      tags: doc.tags.join(', '),
      notes: doc.notes || '',
      version: doc.version,
    });
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;

    setDocuments(prev => prev.map(d => {
      if (d.id === editingDoc.id) {
        return {
          ...d,
          title: formData.title.trim(),
          fileName: formData.fileName.trim() || d.fileName,
          fileType: formData.fileType,
          companyCode: formData.companyCode,
          category: formData.category,
          securityLevel: formData.securityLevel,
          expiryDate: formData.expiryDate || undefined,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          notes: formData.notes.trim() || undefined,
          version: formData.version || d.version,
        };
      }
      return d;
    }));

    setEditingDoc(null);
  };

  // Delete Handlers
  const handleConfirmDelete = () => {
    if (!deleteConfirmDoc) return;
    setDocuments(prev => prev.filter(d => d.id !== deleteConfirmDoc.id));
    setSelectedIds(prev => prev.filter(id => id !== deleteConfirmDoc.id));
    setDeleteConfirmDoc(null);
  };

  const handleConfirmBulkDelete = () => {
    setDocuments(prev => prev.filter(d => !selectedIds.includes(d.id)));
    setSelectedIds([]);
    setBulkDeleteConfirmOpen(false);
  };

  // WhatsApp & Share Message Generator
  const generateWhatsAppText = (doc: DocumentRecord) => {
    const entityLabel = doc.companyCode === 'ARIELMC' 
      ? 'ArielMC (Global Export Trade)'
      : doc.companyCode === 'BIZMAN'
      ? 'Bizman Media Limited (DOOH Media)'
      : doc.companyCode === 'LINDA'
      ? 'Linda Resort Limited (Eco-Resort)'
      : doc.companyCode === 'PERSONAL'
      ? 'Personal Vault (Confidential)'
      : 'Consolidated Group Master';

    return `📄 *EXECUTIVE DOCUMENT TRANSMISSION*
*Master CRM &bull; Document Center*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *Title:* ${doc.title}
🏢 *Affiliated Entity:* ${entityLabel}
📁 *File Name:* ${doc.fileName} (${doc.fileSize})
🔖 *Category:* ${doc.category.replace(/_/g, ' ')}
🔒 *Security Level:* ${doc.securityLevel}
📅 *Uploaded:* ${doc.uploadDate} ${doc.expiryDate ? `| *Valid Until:* ${doc.expiryDate}` : ''}
${doc.notes ? `\n📝 *Notes:* ${doc.notes}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 *Secure Master CRM Vault ID:* ${doc.id}
Attested: Syed Akramul Hassan`;
  };

  const handleLaunchWhatsApp = (doc: DocumentRecord) => {
    const text = generateWhatsAppText(doc);
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = (doc: DocumentRecord) => {
    const text = generateWhatsAppText(doc);
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Icon Helper by File Type
  const getFileIcon = (type: DocumentFileType) => {
    switch (type) {
      case 'PDF':
        return <FileText className="h-5 w-5 text-rose-600" />;
      case 'DOCX':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'XLSX':
        return <FileSpreadsheet className="h-5 w-5 text-emerald-600" />;
      case 'IMAGE':
        return <ImageIcon className="h-5 w-5 text-purple-600" />;
      case 'ZIP':
        return <Archive className="h-5 w-5 text-amber-600" />;
      default:
        return <File className="h-5 w-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* =================================================================== */}
      {/* 1. TOP HEADER & PRIMARY ACTION CONTROLS */}
      {/* =================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE3DD] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8A96A]">
            <FolderKanban className="h-4 w-4" />
            <span>Centralized Corporate Repository & Vault</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-[#1F3A2E] tracking-tight">
            Document Center
          </h1>
          <p className="text-xs text-[#6B7269]">
            Secure repository for contracts, export LCs, ground leases, architectural deeds, board resolutions, and confidential personal records
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Grid vs Table View Toggle */}
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

          {/* Primary Action: Upload Document */}
          <button
            onClick={handleOpenUpload}
            className="flex items-center gap-2 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white px-4 py-2 text-xs font-extrabold shadow-sm transition-all border border-[#1F3A2E]"
          >
            <Upload className="h-4 w-4 text-[#C8A96A]" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. EXECUTIVE REPOSITORY METRICS OVERVIEW */}
      {/* =================================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        {/* Total Documents */}
        <div 
          onClick={() => { setSelectedEntity('CONSOLIDATED'); setSelectedCategory('ALL'); }}
          className={`cursor-pointer rounded-xl border p-3.5 transition-all shadow-xs ${
            selectedEntity === 'CONSOLIDATED'
              ? 'border-[#1F3A2E] bg-white ring-2 ring-[#1F3A2E]/10'
              : 'border-[#DDE3DD] bg-white hover:border-[#1F3A2E]/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[#556055] font-semibold">
            <span>Total Vault</span>
            <Layers className="h-3.5 w-3.5 text-[#1F3A2E]" />
          </div>
          <div className="mt-1 text-2xl font-black text-[#1F3A2E] font-mono">{stats.total}</div>
          <div className="text-[10px] text-[#6B7269] mt-0.5">Encrypted Records</div>
        </div>

        {/* ArielMC */}
        <div 
          onClick={() => { setSelectedEntity('ARIELMC'); setSelectedCategory('ALL'); }}
          className={`cursor-pointer rounded-xl border p-3.5 transition-all shadow-xs ${
            selectedEntity === 'ARIELMC'
              ? 'border-[#1E6B3A] bg-white ring-2 ring-[#1E6B3A]/20'
              : 'border-[#DDE3DD] bg-white hover:border-[#1E6B3A]/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[#1E6B3A] font-bold">
            <span>ArielMC</span>
            <Globe2 className="h-3.5 w-3.5" />
          </div>
          <div className="mt-1 text-2xl font-black text-[#1E6B3A] font-mono">{stats.ariel}</div>
          <div className="text-[10px] text-[#556055] mt-0.5">Export LCs & Port BLs</div>
        </div>

        {/* Bizman Media */}
        <div 
          onClick={() => { setSelectedEntity('BIZMAN'); setSelectedCategory('ALL'); }}
          className={`cursor-pointer rounded-xl border p-3.5 transition-all shadow-xs ${
            selectedEntity === 'BIZMAN'
              ? 'border-[#1F5FA8] bg-white ring-2 ring-[#1F5FA8]/20'
              : 'border-[#DDE3DD] bg-white hover:border-[#1F5FA8]/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[#1F5FA8] font-bold">
            <span>Bizman Media</span>
            <Tv2 className="h-3.5 w-3.5" />
          </div>
          <div className="mt-1 text-2xl font-black text-[#1F5FA8] font-mono">{stats.bizman}</div>
          <div className="text-[10px] text-[#556055] mt-0.5">DOOH & City Leases</div>
        </div>

        {/* Linda Resort */}
        <div 
          onClick={() => { setSelectedEntity('LINDA'); setSelectedCategory('ALL'); }}
          className={`cursor-pointer rounded-xl border p-3.5 transition-all shadow-xs ${
            selectedEntity === 'LINDA'
              ? 'border-[#8A5A00] bg-white ring-2 ring-[#8A5A00]/20'
              : 'border-[#DDE3DD] bg-white hover:border-[#8A5A00]/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[#8A5A00] font-bold">
            <span>Linda Resort</span>
            <Building2 className="h-3.5 w-3.5" />
          </div>
          <div className="mt-1 text-2xl font-black text-[#8A5A00] font-mono">{stats.linda}</div>
          <div className="text-[10px] text-[#556055] mt-0.5">Deeds & Blueprints</div>
        </div>

        {/* Personal Vault */}
        <div 
          onClick={() => { setSelectedEntity('PERSONAL'); setSelectedCategory('ALL'); }}
          className={`cursor-pointer rounded-xl border p-3.5 transition-all shadow-xs col-span-2 sm:col-span-1 ${
            selectedEntity === 'PERSONAL'
              ? 'border-purple-600 bg-white ring-2 ring-purple-600/20'
              : 'border-[#DDE3DD] bg-white hover:border-purple-400'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-purple-700 font-bold">
            <span>Personal Vault</span>
            <Lock className="h-3.5 w-3.5" />
          </div>
          <div className="mt-1 text-2xl font-black text-purple-800 font-mono">{stats.personal}</div>
          <div className="text-[10px] text-[#556055] mt-0.5">NBR Tax & Passports</div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. SEARCH, FILTERS & ENTITY TABS (Strict Order: ArielMC - Bizman - Linda) */}
      {/* =================================================================== */}
      <div className="space-y-3">
        {/* Entity Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedEntity('CONSOLIDATED')}
            className={`rounded-lg px-3.5 py-1.5 font-bold whitespace-nowrap transition-all border ${
              selectedEntity === 'CONSOLIDATED'
                ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow-xs'
                : 'bg-white border-[#DDE3DD] text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]'
            }`}
          >
            All Entities ({stats.total})
          </button>
          <button
            onClick={() => setSelectedEntity('ARIELMC')}
            className={`rounded-lg px-3.5 py-1.5 font-bold whitespace-nowrap transition-all border ${
              selectedEntity === 'ARIELMC'
                ? 'bg-[#1E6B3A] text-white border-[#1E6B3A] shadow-xs'
                : 'bg-white border-[#DDE3DD] text-[#556055] hover:text-[#1E6B3A] hover:bg-[#F4F6F4]'
            }`}
          >
            ArielMC ({stats.ariel})
          </button>
          <button
            onClick={() => setSelectedEntity('BIZMAN')}
            className={`rounded-lg px-3.5 py-1.5 font-bold whitespace-nowrap transition-all border ${
              selectedEntity === 'BIZMAN'
                ? 'bg-[#1F5FA8] text-white border-[#1F5FA8] shadow-xs'
                : 'bg-white border-[#DDE3DD] text-[#556055] hover:text-[#1F5FA8] hover:bg-[#F4F6F4]'
            }`}
          >
            Bizman Media ({stats.bizman})
          </button>
          <button
            onClick={() => setSelectedEntity('LINDA')}
            className={`rounded-lg px-3.5 py-1.5 font-bold whitespace-nowrap transition-all border ${
              selectedEntity === 'LINDA'
                ? 'bg-[#8A5A00] text-white border-[#8A5A00] shadow-xs'
                : 'bg-white border-[#DDE3DD] text-[#556055] hover:text-[#8A5A00] hover:bg-[#F4F6F4]'
            }`}
          >
            Linda Resort ({stats.linda})
          </button>
          <button
            onClick={() => setSelectedEntity('PERSONAL')}
            className={`rounded-lg px-3.5 py-1.5 font-bold whitespace-nowrap transition-all border ${
              selectedEntity === 'PERSONAL'
                ? 'bg-purple-800 text-white border-purple-800 shadow-xs'
                : 'bg-white border-[#DDE3DD] text-[#556055] hover:text-purple-800 hover:bg-[#F4F6F4]'
            }`}
          >
            Personal / Director ({stats.personal})
          </button>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8FA899]" />
            <input
              type="text"
              placeholder="Search by title, filename, tags, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#DDE3DD] bg-white pl-9 pr-3 py-2 text-xs text-[#1A1A1A] placeholder:text-[#8FA899] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[#8FA899] hover:text-[#1A1A1A]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-[#556055]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-[#DDE3DD] bg-white px-3 py-2 text-xs text-[#1A1A1A] font-semibold focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="CONTRACT_AGREEMENT">Contracts & Agreements</option>
              <option value="EXPORT_SHIPPING_LC">Export & Shipping (LC / BL)</option>
              <option value="GOVT_REGULATORY_TAX">Govt, Permits & Tax</option>
              <option value="BANKING_FINANCIAL">Banking & Financial</option>
              <option value="CORPORATE_GOVERNANCE">Corporate Governance</option>
              <option value="MARKETING_CATALOG">Catalogs & Blueprints</option>
              <option value="PERSONAL_VAULT">Personal Vault</option>
            </select>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 4. SELECTION ACTION BAR (Appears when 1+ items are selected) */}
      {/* =================================================================== */}
      {selectedIds.length > 0 && (
        <div className="sticky top-20 z-30 rounded-xl bg-[#1F3A2E] text-white px-4 py-3 shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#C8A96A] animate-pulse" />
            <span className="font-extrabold text-xs">
              {selectedIds.length} {selectedIds.length === 1 ? 'Document' : 'Documents'} Selected
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Bulk WhatsApp Share */}
            <button
              onClick={() => {
                const selectedDocs = documents.filter(d => selectedIds.includes(d.id));
                const text = `📁 *BATCH DOCUMENT BUNDLE TRANSMISSION*\n*Master CRM Center*\n━━━━━━━━━━━━━━━━━━━━\nSelected ${selectedDocs.length} Documents:\n` +
                  selectedDocs.map((d, i) => `${i + 1}. *${d.title}* (${d.fileName}) - [${d.companyCode === 'ARIELMC' ? 'ArielMC' : d.companyCode}]`).join('\n') +
                  `\n━━━━━━━━━━━━━━━━━━━━\nAttested: Syed Akramul Hassan`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 font-bold transition-all"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Share Selected via WhatsApp</span>
            </button>

            {/* Bulk Delete */}
            <button
              onClick={() => setBulkDeleteConfirmOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 font-bold transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Selected</span>
            </button>

            {/* Clear Selection */}
            <button
              onClick={handleClearSelection}
              className="rounded-lg bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 font-semibold transition-all"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 5. DOCUMENTS DISPLAY: GRID VIEW (Cards) */}
      {/* =================================================================== */}
      {viewMode === 'GRID' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => {
            const isSelected = selectedIds.includes(doc.id);
            return (
              <div
                key={doc.id}
                className={`rounded-xl border p-6 space-y-4 transition-all bg-white relative shadow-xs ${
                  isSelected 
                    ? 'border-[#1F3A2E] ring-2 ring-[#1F3A2E]/10 bg-[#F4F6F4]/30' 
                    : 'border-[#DDE3DD] hover:border-[#1F3A2E]/50 hover:shadow-sm'
                }`}
              >
                {/* Top Row: Checkbox, File Icon, Entity Badge & Quick Actions */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleSelect(doc.id)}
                      className="text-[#6B7269] hover:text-[#1F3A2E]"
                      title="Select Document"
                    >
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4 text-[#1F3A2E]" />
                      ) : (
                        <Square className="h-4 w-4 text-[#8FA899] hover:text-[#1F3A2E]" />
                      )}
                    </button>

                    <div className="h-9 w-9 rounded-lg bg-[#F4F6F4] border border-[#DDE3DD] flex items-center justify-center shrink-0">
                      {getFileIcon(doc.fileType)}
                    </div>

                    {/* Entity Affiliation Badge */}
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      doc.companyCode === 'ARIELMC' ? 'bg-[#E4F3E9] text-[#1E6B3A] border border-[#B6E2C5]' :
                      doc.companyCode === 'BIZMAN' ? 'bg-[#E8F0FA] text-[#1F5FA8] border border-[#BBD5F2]' :
                      doc.companyCode === 'LINDA' ? 'bg-[#FFF3D6] text-[#8A5A00] border border-[#FBE0A8]' :
                      doc.companyCode === 'PERSONAL' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                      'bg-slate-100 text-slate-800 border border-slate-300'
                    }`}>
                      {doc.companyCode === 'ARIELMC' ? 'ArielMC' : doc.companyCode === 'LINDA' ? 'Linda Resort' : doc.companyCode}
                    </span>
                  </div>

                  {/* Security Badge */}
                  <span className={`px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-md font-mono ${
                    doc.securityLevel === 'CONFIDENTIAL' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    doc.securityLevel === 'RESTRICTED' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    doc.securityLevel === 'INTERNAL' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {doc.securityLevel}
                  </span>
                </div>

                {/* Title & File Name - Generous spacing, no clamp */}
                <div className="pt-1">
                  <h3 
                    onClick={() => setPreviewDoc(doc)}
                    className="text-base font-extrabold text-[#1F3A2E] hover:text-[#C8A96A] cursor-pointer leading-snug transition-colors"
                  >
                    {doc.title}
                  </h3>
                  <div className="text-xs font-mono text-[#6B7269] flex items-center gap-2 mt-1.5">
                    <span className="truncate">{doc.fileName}</span>
                    <span>&bull;</span>
                    <span className="shrink-0 font-semibold">{doc.fileSize}</span>
                  </div>
                </div>

                {/* Notes or Category */}
                {doc.notes && (
                  <p className="text-xs leading-relaxed text-[#444] bg-[#F8F9F8] p-3 rounded-lg border border-[#DDE3DD]">
                    {doc.notes}
                  </p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 text-xs pt-0.5">
                  {doc.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="rounded-md bg-[#F4F6F4] text-[#1F3A2E] border border-[#DDE3DD] px-2.5 py-1 text-[11px] font-semibold">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Footer Metadata & Action Buttons */}
                <div className="flex items-center justify-between border-t border-[#DDE3DD] pt-3 text-xs text-[#6B7269]">
                  <div className="text-[11px] font-mono">
                    <span>Uploaded: {doc.uploadDate}</span>
                    {doc.expiryDate && (
                      <span className="text-[#8A5A00] font-semibold block">Exp: {doc.expiryDate}</span>
                    )}
                  </div>

                  {/* Actions: View, Share, Edit, Delete */}
                  <div className="flex items-center gap-1">
                    {/* Preview */}
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      title="Preview Document"
                      className="p-1.5 rounded-md hover:bg-[#F4F6F4] text-[#556055] hover:text-[#1F3A2E] transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => setSharingDoc(doc)}
                      title="Share Document"
                      className="p-1.5 rounded-md hover:bg-emerald-50 text-[#556055] hover:text-emerald-700 transition-colors"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleOpenEdit(doc)}
                      title="Edit Document Details"
                      className="p-1.5 rounded-md hover:bg-[#F4F6F4] text-[#556055] hover:text-[#1F3A2E] transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteConfirmDoc(doc)}
                      title="Delete Document"
                      className="p-1.5 rounded-md hover:bg-rose-50 text-[#556055] hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =================================================================== */}
      {/* 6. DOCUMENTS DISPLAY: TABLE VIEW */}
      {/* =================================================================== */}
      {viewMode === 'TABLE' && (
        <div className="rounded-xl border border-[#DDE3DD] bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F6F4] border-b border-[#DDE3DD] text-[#1F3A2E] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 text-center w-10">
                    <button onClick={handleSelectAll} title="Select/Deselect All">
                      {selectedIds.length === filteredDocuments.length && filteredDocuments.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-[#1F3A2E]" />
                      ) : (
                        <Square className="h-4 w-4 text-[#8FA899] hover:text-[#1F3A2E]" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Document Title & Filename</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Type / Size</th>
                  <th className="py-3 px-4">Security</th>
                  <th className="py-3 px-4">Upload / Expiry</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3DD] text-[#1A1A1A]">
                {filteredDocuments.map((doc) => {
                  const isSelected = selectedIds.includes(doc.id);
                  return (
                    <tr 
                      key={doc.id} 
                      className={`hover:bg-[#F9FAF9] transition-colors ${isSelected ? 'bg-[#F4F6F4]/50' : ''}`}
                    >
                      <td className="py-3 px-3 text-center">
                        <button onClick={() => handleToggleSelect(doc.id)}>
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-[#1F3A2E]" />
                          ) : (
                            <Square className="h-4 w-4 text-[#8FA899] hover:text-[#1F3A2E]" />
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4">
                        <div 
                          onClick={() => setPreviewDoc(doc)}
                          className="font-bold text-[#1F3A2E] hover:text-[#C8A96A] cursor-pointer flex items-center gap-2"
                        >
                          <div className="shrink-0">{getFileIcon(doc.fileType)}</div>
                          <span>{doc.title}</span>
                        </div>
                        <div className="text-[11px] font-mono text-[#6B7269] pl-7">{doc.fileName}</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          doc.companyCode === 'ARIELMC' ? 'bg-[#E4F3E9] text-[#1E6B3A] border border-[#B6E2C5]' :
                          doc.companyCode === 'BIZMAN' ? 'bg-[#E8F0FA] text-[#1F5FA8] border border-[#BBD5F2]' :
                          doc.companyCode === 'LINDA' ? 'bg-[#FFF3D6] text-[#8A5A00] border border-[#FBE0A8]' :
                          doc.companyCode === 'PERSONAL' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                          'bg-slate-100 text-slate-800 border border-slate-300'
                        }`}>
                          {doc.companyCode === 'ARIELMC' ? 'ArielMC' : doc.companyCode === 'LINDA' ? 'Linda Resort' : doc.companyCode}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-[#556055] font-medium">
                        {doc.category.replace(/_/g, ' ')}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-[#556055]">
                        <span className="font-bold text-[#1F3A2E]">{doc.fileType}</span> &bull; {doc.fileSize}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded font-mono ${
                          doc.securityLevel === 'CONFIDENTIAL' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          doc.securityLevel === 'RESTRICTED' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          doc.securityLevel === 'INTERNAL' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {doc.securityLevel}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-[#6B7269]">
                        <div>{doc.uploadDate}</div>
                        {doc.expiryDate && (
                          <div className="text-[10px] text-[#8A5A00]">Exp: {doc.expiryDate}</div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            title="Preview"
                            className="p-1 rounded text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setSharingDoc(doc)}
                            title="Share"
                            className="p-1 rounded text-[#556055] hover:text-emerald-700 hover:bg-emerald-50"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(doc)}
                            title="Edit"
                            className="p-1 rounded text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmDoc(doc)}
                            title="Delete"
                            className="p-1 rounded text-[#556055] hover:text-rose-600 hover:bg-rose-50"
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

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#DDE3DD] bg-white p-12 text-center space-y-3">
          <FolderKanban className="h-10 w-10 text-[#8FA899] mx-auto" />
          <h3 className="text-base font-bold text-[#1F3A2E]">No documents found</h3>
          <p className="text-xs text-[#6B7269] max-w-sm mx-auto">
            No files match your current entity filter or search criteria. Upload a new document to this category.
          </p>
          <button
            onClick={handleOpenUpload}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1F3A2E] text-white px-3.5 py-1.5 text-xs font-bold shadow-sm"
          >
            <Upload className="h-3.5 w-3.5 text-[#C8A96A]" />
            <span>Upload Document</span>
          </button>
        </div>
      )}

      {/* =================================================================== */}
      {/* 7. UPLOAD DOCUMENT MODAL */}
      {/* =================================================================== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-[#DDE3DD] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#F4F6F4] text-[#1F3A2E] flex items-center justify-center font-bold">
                  <Upload className="h-4 w-4 text-[#C8A96A]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1F3A2E]">Upload to Document Center</h3>
                  <p className="text-xs text-[#6B7269]">Add contracts, export LCs, deeds, or personal records</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="rounded-lg p-1 text-[#6B7269] hover:bg-[#F4F6F4] hover:text-[#1A1A1A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitUpload} className="space-y-4 text-xs">
              <div>
                <label className="text-[#556055] font-bold block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Irrevocable Commercial Letter of Credit (LC)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#556055] font-bold block mb-1">Affiliated Business Entity *</label>
                  <select
                    value={formData.companyCode}
                    onChange={(e) => setFormData({ ...formData, companyCode: e.target.value as any })}
                    className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                  >
                    <option value="ARIELMC">ArielMC (Global Export Trade)</option>
                    <option value="BIZMAN">Bizman Media Limited (DOOH / Media)</option>
                    <option value="LINDA">Linda Resort Limited (Eco-Resort / Land)</option>
                    <option value="PERSONAL">Personal / Director Vault</option>
                    <option value="CONSOLIDATED">Consolidated Group Master</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#556055] font-bold block mb-1">Document Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                  >
                    <option value="CONTRACT_AGREEMENT">Contracts & Agreements</option>
                    <option value="EXPORT_SHIPPING_LC">Export & Shipping (LC / BL)</option>
                    <option value="GOVT_REGULATORY_TAX">Govt, Permits & Tax</option>
                    <option value="BANKING_FINANCIAL">Banking & Financial</option>
                    <option value="CORPORATE_GOVERNANCE">Corporate Governance</option>
                    <option value="MARKETING_CATALOG">Catalogs & Blueprints</option>
                    <option value="PERSONAL_VAULT">Personal Vault</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#556055] font-bold block mb-1">File Type</label>
                  <select
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value as any })}
                    className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="DOCX">Word (.docx)</option>
                    <option value="XLSX">Excel (.xlsx)</option>
                    <option value="IMAGE">Image Scan</option>
                    <option value="ZIP">Archive (.zip)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#556055] font-bold block mb-1">File Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 2.4 MB"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#556055] font-bold block mb-1">Security Level</label>
                  <select
                    value={formData.securityLevel}
                    onChange={(e) => setFormData({ ...formData, securityLevel: e.target.value as any })}
                    className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                  >
                    <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                    <option value="RESTRICTED">RESTRICTED</option>
                    <option value="INTERNAL">INTERNAL</option>
                    <option value="PUBLIC">PUBLIC</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#556055] font-bold block mb-1">File Name</label>
                <input
                  type="text"
                  placeholder="e.g. LC-Munich-Living-GmbH.pdf"
                  value={formData.fileName}
                  onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                  className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#556055] font-bold block mb-1">Expiration / Renewal Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#556055] font-bold block mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Export, Germany, LC, High-Value"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#556055] font-bold block mb-1">Confidential Notes / Scope</label>
                <textarea
                  rows={2}
                  placeholder="Enter context, bank branch, counterparty terms, or renewal details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDE3DD]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="rounded-lg border border-[#DDE3DD] px-4 py-2 font-bold text-[#556055] hover:bg-[#F4F6F4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1F3A2E] text-white px-5 py-2 font-extrabold hover:bg-[#2C5240]"
                >
                  Save & Index Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 8. EDIT DOCUMENT MODAL */}
      {/* =================================================================== */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-[#DDE3DD] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#F4F6F4] text-[#1F3A2E] flex items-center justify-center font-bold">
                  <Edit2 className="h-4 w-4 text-[#C8A96A]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1F3A2E]">Edit Document Metadata</h3>
                  <p className="text-xs text-[#6B7269]">Update document classification, tags, or renewal dates</p>
                </div>
              </div>
              <button
                onClick={() => setEditingDoc(null)}
                className="rounded-lg p-1 text-[#6B7269] hover:bg-[#F4F6F4] hover:text-[#1A1A1A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-4 text-xs">
              <div>
                <label className="text-[#556055] font-bold block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#556055] font-bold block mb-1">Entity Affiliation</label>
                  <select
                    value={formData.companyCode}
                    onChange={(e) => setFormData({ ...formData, companyCode: e.target.value as any })}
                    className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                  >
                    <option value="ARIELMC">ArielMC (Global Export)</option>
                    <option value="BIZMAN">Bizman Media Limited</option>
                    <option value="LINDA">Linda Resort Limited</option>
                    <option value="PERSONAL">Personal / Director Vault</option>
                    <option value="CONSOLIDATED">Consolidated Group Master</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#556055] font-bold block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                  >
                    <option value="CONTRACT_AGREEMENT">Contracts & Agreements</option>
                    <option value="EXPORT_SHIPPING_LC">Export & Shipping (LC / BL)</option>
                    <option value="GOVT_REGULATORY_TAX">Govt, Permits & Tax</option>
                    <option value="BANKING_FINANCIAL">Banking & Financial</option>
                    <option value="CORPORATE_GOVERNANCE">Corporate Governance</option>
                    <option value="MARKETING_CATALOG">Catalogs & Blueprints</option>
                    <option value="PERSONAL_VAULT">Personal Vault</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#556055] font-bold block mb-1">Security Level</label>
                  <select
                    value={formData.securityLevel}
                    onChange={(e) => setFormData({ ...formData, securityLevel: e.target.value as any })}
                    className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                  >
                    <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                    <option value="RESTRICTED">RESTRICTED</option>
                    <option value="INTERNAL">INTERNAL</option>
                    <option value="PUBLIC">PUBLIC</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#556055] font-bold block mb-1">Expiry / Renewal Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#556055] font-bold block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#556055] font-bold block mb-1">Notes / Scope</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-lg border border-[#DDE3DD] p-2 text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDE3DD]">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="rounded-lg border border-[#DDE3DD] px-4 py-2 font-bold text-[#556055] hover:bg-[#F4F6F4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1F3A2E] text-white px-5 py-2 font-extrabold hover:bg-[#2C5240]"
                >
                  Update Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 9. SHARE DOCUMENT MODAL (WhatsApp & Copy Link) */}
      {/* =================================================================== */}
      {sharingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-[#DDE3DD] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Share2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1F3A2E]">Share Document</h3>
                  <p className="text-xs text-[#6B7269]">Transmitting <strong>{sharingDoc.title}</strong></p>
                </div>
              </div>
              <button
                onClick={() => setSharingDoc(null)}
                className="rounded-lg p-1 text-[#6B7269] hover:bg-[#F4F6F4] hover:text-[#1A1A1A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Document Card Summary */}
            <div className="rounded-xl bg-[#F4F6F4] border border-[#DDE3DD] p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1F3A2E] flex items-center gap-1.5">
                  {getFileIcon(sharingDoc.fileType)}
                  {sharingDoc.title}
                </span>
                <span className="font-mono text-[#6B7269]">{sharingDoc.fileSize}</span>
              </div>
              <div className="text-[11px] text-[#556055] font-mono">
                {sharingDoc.fileName} &bull; Entity: {sharingDoc.companyCode}
              </div>
            </div>

            {/* WhatsApp Formatted Message Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#556055]">
                <span>WhatsApp Message Preview</span>
                <span className="text-[10px] text-[#8FA899] font-mono">Markdown Ready</span>
              </div>
              <textarea
                readOnly
                rows={8}
                value={generateWhatsAppText(sharingDoc)}
                className="w-full font-mono text-xs rounded-xl border border-[#DDE3DD] bg-[#F4F6F4] p-3 text-[#1A1A1A] leading-relaxed resize-none focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-[#DDE3DD]">
              <button
                onClick={() => handleCopyLink(sharingDoc)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg border border-[#DDE3DD] bg-white px-4 py-2 text-xs font-bold text-[#1F3A2E] hover:bg-[#F4F6F4] transition-colors"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-[#C8A96A]" />}
                <span>{copiedLink ? 'Copied to Clipboard!' : 'Copy Formatted Memo'}</span>
              </button>

              <button
                onClick={() => handleLaunchWhatsApp(sharingDoc)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-extrabold shadow-sm transition-all"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Share via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 10. PREVIEW / INSPECTOR DRAWER MODAL */}
      {/* =================================================================== */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-[#DDE3DD] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#F4F6F4] border border-[#DDE3DD] flex items-center justify-center">
                  {getFileIcon(previewDoc.fileType)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1F3A2E]">{previewDoc.title}</h3>
                  <p className="text-xs font-mono text-[#6B7269]">{previewDoc.fileName}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="rounded-lg p-1 text-[#6B7269] hover:bg-[#F4F6F4] hover:text-[#1A1A1A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Document Attributes Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-[#F4F6F4] p-3 border border-[#DDE3DD]/60">
                <span className="text-[#6B7269] block text-[10px] uppercase font-bold">Affiliated Entity</span>
                <span className="font-extrabold text-[#1F3A2E] text-xs">
                  {previewDoc.companyCode === 'ARIELMC' ? 'ArielMC' : previewDoc.companyCode === 'LINDA' ? 'Linda Resort' : previewDoc.companyCode}
                </span>
              </div>
              <div className="rounded-lg bg-[#F4F6F4] p-3 border border-[#DDE3DD]/60">
                <span className="text-[#6B7269] block text-[10px] uppercase font-bold">Security Classification</span>
                <span className="font-extrabold text-rose-700 font-mono text-xs">
                  {previewDoc.securityLevel}
                </span>
              </div>
              <div className="rounded-lg bg-[#F4F6F4] p-3 border border-[#DDE3DD]/60">
                <span className="text-[#6B7269] block text-[10px] uppercase font-bold">Category</span>
                <span className="font-semibold text-[#1A1A1A] text-xs">
                  {previewDoc.category.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="rounded-lg bg-[#F4F6F4] p-3 border border-[#DDE3DD]/60">
                <span className="text-[#6B7269] block text-[10px] uppercase font-bold">Size & Format</span>
                <span className="font-mono font-bold text-[#1F3A2E] text-xs">
                  {previewDoc.fileType} &bull; {previewDoc.fileSize}
                </span>
              </div>
            </div>

            {/* Description / Notes */}
            {previewDoc.notes && (
              <div className="space-y-1 text-xs">
                <span className="text-[#556055] font-bold">Document Executive Notes:</span>
                <p className="bg-[#F4F6F4] p-3 rounded-xl border border-[#DDE3DD] text-[#1A1A1A] leading-relaxed">
                  {previewDoc.notes}
                </p>
              </div>
            )}

            {/* Tags */}
            <div className="space-y-1 text-xs">
              <span className="text-[#556055] font-bold">Indexed Search Tags:</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {previewDoc.tags.map((t, idx) => (
                  <span key={idx} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-[#556055] font-mono">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions: Download & Share */}
            <div className="flex items-center justify-between pt-4 border-t border-[#DDE3DD]">
              <div className="text-[11px] text-[#6B7269] font-mono">
                Uploaded by {previewDoc.uploadedBy} on {previewDoc.uploadDate}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = generateWhatsAppText(previewDoc);
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    alert(`Simulated Download: ${previewDoc.fileName} has been securely fetched from Master CRM vault.`);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white px-3.5 py-1.5 text-xs font-extrabold transition-all shadow-xs"
                >
                  <Download className="h-3.5 w-3.5 text-[#C8A96A]" />
                  <span>Download Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 11. SINGLE DELETE CONFIRMATION DIALOG */}
      {/* =================================================================== */}
      {deleteConfirmDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#DDE3DD] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1F3A2E]">Delete Document?</h3>
                <p className="text-xs text-[#6B7269]">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-[#556055] bg-[#F4F6F4] p-3 rounded-lg border border-[#DDE3DD]">
              Are you sure you want to delete <strong>"{deleteConfirmDoc.title}"</strong> ({deleteConfirmDoc.fileName}) from the {deleteConfirmDoc.companyCode} vault?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDE3DD]">
              <button
                onClick={() => setDeleteConfirmDoc(null)}
                className="rounded-lg border border-[#DDE3DD] px-4 py-2 text-xs font-bold text-[#556055] hover:bg-[#F4F6F4]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-xs font-extrabold shadow-xs transition-all"
              >
                Yes, Delete Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 12. BULK DELETE CONFIRMATION DIALOG */}
      {/* =================================================================== */}
      {bulkDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#DDE3DD] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1F3A2E]">Bulk Delete Documents?</h3>
                <p className="text-xs text-[#6B7269]">Irreversible bulk action.</p>
              </div>
            </div>

            <p className="text-xs text-[#556055] bg-[#F4F6F4] p-3 rounded-lg border border-[#DDE3DD]">
              Are you sure you want to permanently remove <strong>{selectedIds.length} selected documents</strong> from the Master CRM repository?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDE3DD]">
              <button
                onClick={() => setBulkDeleteConfirmOpen(false)}
                className="rounded-lg border border-[#DDE3DD] px-4 py-2 text-xs font-bold text-[#556055] hover:bg-[#F4F6F4]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBulkDelete}
                className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-xs font-extrabold shadow-xs transition-all"
              >
                Yes, Delete {selectedIds.length} Items
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

