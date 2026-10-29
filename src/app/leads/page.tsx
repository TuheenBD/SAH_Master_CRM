'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  CheckSquare,
  Mail,
  Phone,
  Briefcase,
  UserPlus,
  FolderPlus,
  Building
} from 'lucide-react';
import { 
  CompanyCode, 
  LeadItem, 
  CompanyLead, 
  LeadContact, 
  ParallelProject, 
  ContactRoleType, 
  PipelineStage, 
  CustomerPaymentStatus, 
  EntityPayoutStatus 
} from '@/lib/types';
import { INITIAL_LEADS, INITIAL_COMPANY_LEADS, INITIAL_CONTACTS } from '@/lib/mock-data';

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
  const [viewMode, setViewMode] = useState<'COMPANIES' | 'GRID' | 'TABLE' | 'KANBAN'>('COMPANIES');
  const [searchQuery, setSearchQuery] = useState('');
  const [notepadContent, setNotepadContent] = useState<string>(INITIAL_LEADS[0]?.notepadMarkdown || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Bizman CRM Model: Corporate Company Leads & Contacts State
  const [companyLeads, setCompanyLeads] = useState<CompanyLead[]>(INITIAL_COMPANY_LEADS);
  const [selectedCompany, setSelectedCompany] = useState<CompanyLead | null>(INITIAL_COMPANY_LEADS[0]);
  const [companyNotepadContent, setCompanyNotepadContent] = useState<string>(
    '### Corporate Account Intelligence\n- Master corporate client file for Syed Akramul Hassan transactions.\n- Track parallel running campaigns, procurement contacts, and direct commission terms.'
  );
  const [companySaveStatus, setCompanySaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Modal: Add Corporate Company / Account (Customer, Supplier, Buyer, Vendor)
  const [isCreateCompanyModalOpen, setIsCreateCompanyModalOpen] = useState(false);
  const [showOptionalContactInCompanyModal, setShowOptionalContactInCompanyModal] = useState(false);
  const [newCompanyData, setNewCompanyData] = useState({
    companyName: '',
    companyCode: (activeCompany === 'CONSOLIDATED' ? 'BIZMAN' : activeCompany) as 'ARIELMC' | 'BIZMAN' | 'LINDA',
    clientType: 'Direct Brand' as string,
    industry: 'Telecommunications',
    priorityTemp: 'WARM' as 'HOT' | 'WARM' | 'COLD',
    country: 'Bangladesh',
    city: 'Dhaka',
    website: '',
    address: '',
    notes: '',
    // Optional initial contact if known
    initialContactName: '',
    initialContactDesignation: '',
    initialContactPhone: '',
    initialContactEmail: '',
  });

  // Load saved corporate company leads from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('sah_master_crm_company_leads');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCompanyLeads(parsed);
            setSelectedCompany(parsed[0]);
          }
        }
      } catch (e) {
        console.error('Failed to load company leads from localStorage', e);
      }
    }
  }, []);

  // Helper to update company leads and persist to localStorage
  const updateAndPersistCompanyLeads = (updater: (prev: CompanyLead[]) => CompanyLead[]) => {
    setCompanyLeads(prev => {
      const updated = updater(prev);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('sah_master_crm_company_leads', JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to persist company leads to localStorage', e);
        }
      }
      return updated;
    });
  };

  // Modal: Add Contact Person to Corporate Lead
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    designation: '',
    department: '',
    roleType: 'PRIMARY_DECISION_MAKER' as ContactRoleType,
    phone: '',
    pabxPhone: '',
    email: '',
    whatsapp: '',
    notes: '',
    isPrimary: false,
  });

  // Modal: Add Parallel Project to Corporate Lead
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    pipelineType: 'DOOH Screen Advertising',
    stage: 'NEW_INQUIRY' as PipelineStage,
    estimatedValue: 1500000,
    currency: 'BDT' as 'USD' | 'BDT',
    probability: 60,
    expectedCloseDate: '2026-12-15',
    contactPersonId: '',
    commissionRate: 10,
    directCustomerFee: 0,
    notepadMarkdown: '',
  });

  // Create Modal State: Organization & Contact Dropdown controls
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCustomOrg, setIsCustomOrg] = useState(false);
  const [isCustomContact, setIsCustomContact] = useState(false);
  const [formData, setFormData] = useState({
    companyCode: (activeCompany === 'CONSOLIDATED' ? 'BIZMAN' : activeCompany) as 'ARIELMC' | 'BIZMAN' | 'LINDA',
    title: '',
    projectName: '',
    customerName: '',
    contactPerson: '',
    phone: '',
    whatsapp: '',
    email: '',
    country: 'Bangladesh',
    estimatedValue: 500000,
    currency: 'BDT' as 'USD' | 'BDT',
    commissionRate: 10,
    directCustomerFee: 0,
    stage: 'NEW_INQUIRY' as PipelineStage,
    probability: 40,
    expectedCloseDate: '2026-11-30',
    pipelineType: 'DOOH Screen Advertising',
    notepadMarkdown: '',
  });

  // Corporate companies registered under the selected operating entity
  const entityMatchingCompanies = useMemo(() => {
    return companyLeads
      .filter(c => !formData.companyCode || c.companyCode === formData.companyCode)
      .map(c => c.companyName.trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [companyLeads, formData.companyCode]);

  // All other registered corporate companies
  const otherRegisteredCompanies = useMemo(() => {
    const matchingSet = new Set(entityMatchingCompanies.map(n => n.toLowerCase()));
    return companyLeads
      .map(c => c.companyName.trim())
      .filter(Boolean)
      .filter(name => !matchingSet.has(name.toLowerCase()))
      .sort((a, b) => a.localeCompare(b));
  }, [companyLeads, entityMatchingCompanies]);

  // Additional organizations from Master Contact Database
  const otherMasterContactOrgs = useMemo(() => {
    const regSet = new Set(companyLeads.map(c => c.companyName.trim().toLowerCase()));
    const orgs = INITIAL_CONTACTS
      .map(c => c.organization?.trim())
      .filter(Boolean)
      .filter(org => !regSet.has(org.toLowerCase()));
    return Array.from(new Set(orgs)).sort((a, b) => a.localeCompare(b));
  }, [companyLeads]);

  // Contacts belonging to the currently chosen Client Organization
  const contactsForSelectedOrg = useMemo(() => {
    if (!formData.customerName.trim()) {
      return [];
    }
    const q = formData.customerName.trim().toLowerCase();

    // 1. From companyLeads (Company Accounts)
    const matchedComp = companyLeads.find(c => c.companyName.trim().toLowerCase() === q);
    const compContacts = matchedComp ? matchedComp.contacts.map(c => ({
      id: c.id,
      name: c.name,
      designation: c.designation,
      phone: c.phone,
      whatsapp: c.whatsapp,
      email: c.email,
      source: 'Company Account',
    })) : [];

    // 2. From Master Contact Database
    const masterContacts = INITIAL_CONTACTS
      .filter(c => c.organization && c.organization.trim().toLowerCase() === q)
      .map(c => ({
        id: c.id,
        name: c.fullName,
        designation: c.designation,
        phone: c.primaryPhone,
        whatsapp: c.whatsappNumber,
        email: c.email,
        source: 'Master Contacts',
      }));

    // Deduplicate by name + phone
    const combined = [...compContacts, ...masterContacts];
    const seen = new Set<string>();
    const unique: typeof combined = [];
    for (const c of combined) {
      const key = `${c.name.toLowerCase()}-${c.phone}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(c);
      }
    }
    return unique;
  }, [formData.customerName, companyLeads]);

  const handleSelectOrganization = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__CUSTOM__') {
      setIsCustomOrg(true);
      setIsCustomContact(true);
      setFormData(prev => ({
        ...prev,
        customerName: '',
        contactPerson: '',
        phone: '',
        whatsapp: '',
        email: '',
      }));
      return;
    }

    setIsCustomOrg(false);

    // Look up company and contacts
    const matchedComp = companyLeads.find(c => c.companyName.toLowerCase() === val.toLowerCase());
    let firstContact = matchedComp?.contacts[0];
    if (!firstContact) {
      const masterC = INITIAL_CONTACTS.find(c => c.organization && c.organization.toLowerCase() === val.toLowerCase());
      if (masterC) {
        firstContact = {
          id: masterC.id,
          name: masterC.fullName,
          designation: masterC.designation,
          phone: masterC.primaryPhone,
          whatsapp: masterC.whatsappNumber,
          email: masterC.email,
          department: '',
          roleType: 'PRIMARY_DECISION_MAKER',
          isPrimary: true,
        };
      }
    }

    setFormData(prev => ({
      ...prev,
      customerName: val,
      country: matchedComp?.country || prev.country,
      currency: matchedComp?.companyCode === 'ARIELMC' ? 'USD' : prev.currency,
      contactPerson: firstContact ? `${firstContact.name}${firstContact.designation ? ` (${firstContact.designation})` : ''}` : '',
      phone: firstContact?.phone || '',
      whatsapp: firstContact?.whatsapp || (firstContact?.phone ? firstContact.phone.replace(/[^0-9]/g, '') : ''),
      email: firstContact?.email || '',
    }));

    setIsCustomContact(!firstContact);
  };

  const handleSelectContactPerson = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__CUSTOM__') {
      setIsCustomContact(true);
      setFormData(prev => ({ ...prev, contactPerson: '' }));
      return;
    }

    const matched = contactsForSelectedOrg.find(c => c.name === val);
    if (matched) {
      setIsCustomContact(false);
      setFormData(prev => ({
        ...prev,
        contactPerson: `${matched.name}${matched.designation ? ` (${matched.designation})` : ''}`,
        phone: matched.phone || prev.phone,
        whatsapp: matched.whatsapp || (matched.phone ? matched.phone.replace(/[^0-9]/g, '') : prev.whatsapp),
        email: matched.email || prev.email,
      }));
    }
  };

  // Automatically open modal when navigated from Quick Action (?action=new or ?action=new-company)
  useEffect(() => {
    if (actionParam === 'new') {
      setIsCreateModalOpen(true);
    } else if (actionParam === 'new-company') {
      setViewMode('COMPANIES');
      setIsCreateCompanyModalOpen(true);
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
        (l.projectName && l.projectName.toLowerCase().includes(q)) ||
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

  const handleUpdateCustomerPayment = (leadId: string, status: CustomerPaymentStatus) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const nextEntityPayout: EntityPayoutStatus = 
          status === 'RECEIVED' 
            ? (l.entityPayoutStatus === 'SETTLED' ? 'SETTLED' : 'READY_FOR_SETTLEMENT')
            : (status === 'PARTIAL' ? 'READY_FOR_SETTLEMENT' : 'AWAITING_CUSTOMER_PAYMENT');

        const updated: LeadItem = {
          ...l,
          customerPaymentStatus: status,
          entityPayoutStatus: nextEntityPayout,
        };
        if (selectedLead?.id === leadId) setSelectedLead(updated);
        return updated;
      }
      return l;
    }));
  };

  const handleUpdateEntityPayout = (leadId: string, status: EntityPayoutStatus) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const updated: LeadItem = {
          ...l,
          entityPayoutStatus: status,
          payoutAmountReceived: status === 'SETTLED' ? (l.commissionAmount || Math.round(l.estimatedValue * (l.commissionRate / 100))) : 0,
        };
        if (selectedLead?.id === leadId) setSelectedLead(updated);
        return updated;
      }
      return l;
    }));
  };

  const handleUpdateDirectCustomerPayment = (leadId: string, status: 'PENDING' | 'RECEIVED') => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const updated: LeadItem = {
          ...l,
          directCustomerPaymentStatus: status,
        };
        if (selectedLead?.id === leadId) setSelectedLead(updated);
        return updated;
      }
      return l;
    }));
  };

  // ==============================================================================
  // BIZMAN CRM MODEL HANDLERS: CORPORATE COMPANIES, CONTACTS & PARALLEL DEALS
  // ==============================================================================
  const filteredCompanyLeads = companyLeads
    .filter(c => activeCompany === 'CONSOLIDATED' || c.companyCode === activeCompany)
    .filter(c => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.companyName.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        (c.city && c.city.toLowerCase().includes(q)) ||
        c.country.toLowerCase().includes(q) ||
        c.contacts.some(cnt => cnt.name.toLowerCase().includes(q) || cnt.designation.toLowerCase().includes(q)) ||
        c.projects.some(p => p.title.toLowerCase().includes(q))
      );
    });

  const handleSelectCompany = (comp: CompanyLead) => {
    setSelectedCompany(comp);
    setCompanySaveStatus('idle');
  };

  const handleSaveCompanyNotepad = () => {
    if (!selectedCompany) return;
    setCompanySaveStatus('saving');
    setTimeout(() => {
      setCompanySaveStatus('saved');
      setTimeout(() => setCompanySaveStatus('idle'), 2000);
    }, 400);
  };

  const handleAddContactToCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;
    if (!contactFormData.name.trim() || !contactFormData.phone.trim()) {
      alert('Please enter Contact Person Name and Phone.');
      return;
    }

    const newContact: LeadContact = {
      id: `cnt-${Date.now()}`,
      name: contactFormData.name,
      designation: contactFormData.designation,
      department: contactFormData.department,
      roleType: contactFormData.roleType,
      phone: contactFormData.phone,
      pabxPhone: contactFormData.pabxPhone,
      email: contactFormData.email,
      whatsapp: contactFormData.whatsapp || contactFormData.phone.replace(/[^0-9]/g, ''),
      notes: contactFormData.notes,
      isPrimary: contactFormData.isPrimary,
    };

    const updatedCompany: CompanyLead = {
      ...selectedCompany,
      contacts: [...selectedCompany.contacts, newContact],
    };

    updateAndPersistCompanyLeads(prev => prev.map(c => c.id === selectedCompany.id ? updatedCompany : c));
    setSelectedCompany(updatedCompany);
    setIsAddContactModalOpen(false);
    setContactFormData({
      name: '',
      designation: '',
      department: '',
      roleType: 'PRIMARY_DECISION_MAKER',
      phone: '',
      pabxPhone: '',
      email: '',
      whatsapp: '',
      notes: '',
      isPrimary: false,
    });
  };

  const handleAddProjectToCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;
    if (!projectFormData.title.trim()) {
      alert('Please enter Project Title.');
      return;
    }

    const assignedContact = selectedCompany.contacts.find(c => c.id === projectFormData.contactPersonId) || selectedCompany.contacts[0];
    const val = Number(projectFormData.estimatedValue) || 0;
    const rate = Number(projectFormData.commissionRate) || 10;
    const commAmount = Math.round(val * (rate / 100));
    const directFee = Number(projectFormData.directCustomerFee) || 0;

    const newProject: ParallelProject = {
      id: `proj-${Date.now()}`,
      projectCode: `${selectedCompany.companyCode}-${Date.now().toString().slice(-4)}`,
      title: projectFormData.title,
      pipelineType: projectFormData.pipelineType,
      stage: projectFormData.stage,
      estimatedValue: val,
      currency: projectFormData.currency,
      probability: Number(projectFormData.probability) || 50,
      expectedCloseDate: projectFormData.expectedCloseDate,
      contactPersonId: assignedContact?.id,
      contactPersonName: assignedContact?.name || 'Assigned Lead',
      contactPersonPhone: assignedContact?.phone,
      commissionRate: rate,
      commissionAmount: commAmount,
      directCustomerFee: directFee,
      directCustomerPaymentStatus: directFee > 0 ? 'PENDING' : undefined,
      customerPaymentStatus: 'PENDING',
      entityPayoutStatus: 'AWAITING_CUSTOMER_PAYMENT',
      payoutAmountReceived: 0,
      notepadMarkdown: projectFormData.notepadMarkdown,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedCompany: CompanyLead = {
      ...selectedCompany,
      projects: [newProject, ...selectedCompany.projects],
    };

    updateAndPersistCompanyLeads(prev => prev.map(c => c.id === selectedCompany.id ? updatedCompany : c));
    setSelectedCompany(updatedCompany);
    setIsAddProjectModalOpen(false);
    setProjectFormData({
      title: '',
      pipelineType: selectedCompany.companyCode === 'ARIELMC' ? 'Export Jute Goods' : selectedCompany.companyCode === 'LINDA' ? 'Resort Banquet & Retreat' : 'DOOH Screen Advertising',
      stage: 'NEW_INQUIRY',
      estimatedValue: selectedCompany.companyCode === 'ARIELMC' ? 45000 : 1500000,
      currency: selectedCompany.companyCode === 'ARIELMC' ? 'USD' : 'BDT',
      probability: 60,
      expectedCloseDate: '2026-12-15',
      contactPersonId: selectedCompany.contacts[0]?.id || '',
      commissionRate: 10,
      directCustomerFee: 0,
      notepadMarkdown: '',
    });
  };

  const handleUpdateCompanyProjectStage = (companyId: string, projectId: string, newStage: PipelineStage) => {
    updateAndPersistCompanyLeads(prev => prev.map(c => {
      if (c.id === companyId) {
        const updatedProjects = c.projects.map(p => p.id === projectId ? { ...p, stage: newStage } : p);
        const updated = { ...c, projects: updatedProjects };
        if (selectedCompany?.id === companyId) setSelectedCompany(updated);
        return updated;
      }
      return c;
    }));
  };

  const handleAdvanceCompanyProjectStage = (companyId: string, projectId: string, currentStage: PipelineStage) => {
    const currentIndex = KANBAN_STAGES.indexOf(currentStage);
    if (currentIndex >= 0 && currentIndex < KANBAN_STAGES.length - 1) {
      handleUpdateCompanyProjectStage(companyId, projectId, KANBAN_STAGES[currentIndex + 1]);
    }
  };

  const handleUpdateCompanyProjectCustomerPayment = (companyId: string, projectId: string, status: CustomerPaymentStatus) => {
    updateAndPersistCompanyLeads(prev => prev.map(c => {
      if (c.id === companyId) {
        const updatedProjects = c.projects.map(p => {
          if (p.id === projectId) {
            const nextEntityPayout: EntityPayoutStatus = 
              status === 'RECEIVED' 
                ? (p.entityPayoutStatus === 'SETTLED' ? 'SETTLED' : 'READY_FOR_SETTLEMENT')
                : (status === 'PARTIAL' ? 'READY_FOR_SETTLEMENT' : 'AWAITING_CUSTOMER_PAYMENT');
            return {
              ...p,
              customerPaymentStatus: status,
              entityPayoutStatus: nextEntityPayout,
            };
          }
          return p;
        });
        const updated = { ...c, projects: updatedProjects };
        if (selectedCompany?.id === companyId) setSelectedCompany(updated);
        return updated;
      }
      return c;
    }));
  };

  const handleUpdateCompanyProjectEntityPayout = (companyId: string, projectId: string, status: EntityPayoutStatus) => {
    updateAndPersistCompanyLeads(prev => prev.map(c => {
      if (c.id === companyId) {
        const updatedProjects = c.projects.map(p => {
          if (p.id === projectId) {
            return {
              ...p,
              entityPayoutStatus: status,
              payoutAmountReceived: status === 'SETTLED' ? p.commissionAmount : 0,
            };
          }
          return p;
        });
        const updated = { ...c, projects: updatedProjects };
        if (selectedCompany?.id === companyId) setSelectedCompany(updated);
        return updated;
      }
      return c;
    }));
  };

  const handleUpdateCompanyProjectDirectPayment = (companyId: string, projectId: string, status: 'PENDING' | 'RECEIVED') => {
    updateAndPersistCompanyLeads(prev => prev.map(c => {
      if (c.id === companyId) {
        const updatedProjects = c.projects.map(p => {
          if (p.id === projectId) {
            return {
              ...p,
              directCustomerPaymentStatus: status,
            };
          }
          return p;
        });
        const updated = { ...c, projects: updatedProjects };
        if (selectedCompany?.id === companyId) setSelectedCompany(updated);
        return updated;
      }
      return c;
    }));
  };

  // Handler: Register New Company Account (Customer, Supplier, Buyer, Vendor)
  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyData.companyName.trim()) {
      alert('Please enter Company / Organization Name');
      return;
    }

    const newComp: CompanyLead = {
      id: `comp-${Date.now()}`,
      companyCode: newCompanyData.companyCode,
      companyName: newCompanyData.companyName.trim(),
      industry: newCompanyData.industry.trim() || 'Corporate Enterprise',
      clientType: newCompanyData.clientType,
      priorityTemp: newCompanyData.priorityTemp,
      country: newCompanyData.country.trim() || 'Bangladesh',
      city: newCompanyData.city.trim() || undefined,
      website: newCompanyData.website.trim() || undefined,
      address: newCompanyData.address.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0],
      contacts: newCompanyData.initialContactName.trim() ? [
        {
          id: `cnt-${Date.now()}`,
          name: newCompanyData.initialContactName.trim(),
          designation: newCompanyData.initialContactDesignation.trim() || 'Key Representative',
          department: 'Management / Procurement',
          roleType: 'PRIMARY_DECISION_MAKER',
          phone: newCompanyData.initialContactPhone.trim() || '+880',
          email: newCompanyData.initialContactEmail.trim() || '',
          whatsapp: (newCompanyData.initialContactPhone || '').replace(/[^0-9]/g, ''),
          notes: newCompanyData.notes.trim() || 'Initial contact recorded at company registration',
          isPrimary: true,
        }
      ] : [],
      projects: [],
    };

    updateAndPersistCompanyLeads(prev => [newComp, ...prev]);
    setSelectedCompany(newComp);
    setViewMode('COMPANIES');
    setIsCreateCompanyModalOpen(false);
    setNewCompanyData({
      companyName: '',
      companyCode: (activeCompany === 'CONSOLIDATED' ? 'BIZMAN' : activeCompany) as 'ARIELMC' | 'BIZMAN' | 'LINDA',
      clientType: 'Direct Brand',
      industry: 'Telecommunications',
      priorityTemp: 'WARM',
      country: 'Bangladesh',
      city: 'Dhaka',
      website: '',
      address: '',
      notes: '',
      initialContactName: '',
      initialContactDesignation: '',
      initialContactPhone: '',
      initialContactEmail: '',
    });
  };

  const handleOpenParallelProjectModal = (parentLead: LeadItem) => {
    setFormData({
      companyCode: parentLead.companyCode,
      title: '',
      projectName: '',
      customerName: parentLead.customerName,
      contactPerson: '',
      phone: '',
      whatsapp: '',
      email: '',
      country: parentLead.country,
      estimatedValue: 1200000,
      currency: parentLead.currency as 'USD' | 'BDT',
      commissionRate: parentLead.commissionRate || 10,
      directCustomerFee: 0,
      stage: 'NEW_INQUIRY',
      probability: 50,
      expectedCloseDate: '2026-12-15',
      pipelineType: parentLead.pipelineType,
      notepadMarkdown: `### Parallel Project for ${parentLead.customerName}\n- Dedicated Project Manager/Contact:\n- Agreed Commission Rate:\n- Extra Direct Customer Fee:`,
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.customerName) {
      alert('Please enter Opportunity / Project Title and Customer Name.');
      return;
    }

    const estVal = Number(formData.estimatedValue) || 100000;
    const commRate = Number(formData.commissionRate) || 10;
    const commAmount = Math.round(estVal * (commRate / 100));
    const directFee = Number(formData.directCustomerFee) || 0;

    const newLead: LeadItem = {
      id: `lead-user-${Date.now()}`,
      companyCode: formData.companyCode,
      title: formData.title,
      projectName: formData.projectName || formData.title,
      customerName: formData.customerName,
      contactPerson: formData.contactPerson || formData.customerName,
      phone: formData.phone || '+880 1711 000000',
      whatsapp: formData.whatsapp || formData.phone || '+880 1711 000000',
      email: formData.email || 'lead@client.com',
      country: formData.country || 'Bangladesh',
      estimatedValue: estVal,
      currency: formData.currency,
      commissionRate: commRate,
      commissionAmount: commAmount,
      directCustomerFee: directFee,
      directCustomerPaymentStatus: 'PENDING',
      customerPaymentStatus: 'PENDING',
      entityPayoutStatus: 'AWAITING_CUSTOMER_PAYMENT',
      payoutAmountReceived: 0,
      stage: formData.stage,
      probability: Number(formData.probability) || 50,
      expectedCloseDate: formData.expectedCloseDate || '2026-11-30',
      pipelineType: formData.pipelineType || 'General Commercial Lead',
      notepadMarkdown: formData.notepadMarkdown || `### Project Brief: ${formData.title}\n- Client Organization: ${formData.customerName}\n- Project Contact: ${formData.contactPerson}\n- Agreed Commission: ${commRate}%\n- Direct Customer Contract Fee: ${formData.currency === 'USD' ? '$' : '৳'}${directFee.toLocaleString()}`,
      specifics: {
        createdVia: 'Master CRM Parallel Project Engine',
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
      projectName: '',
      customerName: '',
      contactPerson: '',
      phone: '',
      whatsapp: '',
      email: '',
      country: 'Bangladesh',
      estimatedValue: 500000,
      currency: 'BDT',
      commissionRate: 10,
      directCustomerFee: 0,
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

        {/* Top Actions: 4-Way View Switcher & + Create New Lead Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Switcher: Companies (Bizman Model) vs Grid vs Table vs Kanban */}
          <div className="flex items-center rounded-xl bg-white border border-[#DDE3DD] p-1 text-xs shadow-xs">
            <button
              onClick={() => setViewMode('COMPANIES')}
              title="Bizman CRM Method: Corporate Lead Companies with Contact Persons & Parallel Projects"
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-extrabold text-xs ${
                viewMode === 'COMPANIES' 
                  ? 'bg-[#1F3A2E] text-[#C8A96A] border border-[#1F3A2E] shadow-sm' 
                  : 'text-[#556055] hover:text-[#1F3A2E] hover:bg-[#F4F6F4]'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Company Accounts</span>
            </button>
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
              <span>Deals Grid</span>
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

          {/* Quick Actions: Add Company Account + Create New Lead Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateCompanyModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-white hover:bg-[#F4F6F4] text-[#1F3A2E] px-3.5 py-2 text-xs font-bold border border-[#1F3A2E] shadow-xs transition-all"
              title="List a new corporate account, supplier, buyer or vendor without needing a campaign or contact person yet"
            >
              <Building2 className="h-4 w-4 text-[#C8A96A]" />
              <span>+ Add Company Account</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] px-3.5 py-2 text-xs font-bold border border-[#1F3A2E] shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Lead</span>
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* FILTER & EXECUTIVE COMMISSION PIPELINE SUMMARY STRIP */}
      {/* =================================================================== */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total Contract Pipeline */}
          <div className="rounded-xl border border-[#DDE3DD] bg-white p-3 shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7269]">
              Total Deals Contract Value
            </div>
            <div className="text-sm font-black font-mono text-[#1F3A2E] mt-1">
              ৳ {filteredLeads.filter(l => l.currency === 'BDT').reduce((s, l) => s + l.estimatedValue, 0).toLocaleString()}
              <span className="text-xs text-[#6B7269] font-normal"> + </span>
              ${filteredLeads.filter(l => l.currency === 'USD').reduce((s, l) => s + l.estimatedValue, 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-[#6B7269] mt-0.5">{filteredLeads.length} Personal Project Deals</div>
          </div>

          {/* My Total Personal Earnings Pipeline */}
          <div className="rounded-xl border border-[#C8A96A]/50 bg-[#FBF9F4] p-3 shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D2D]">
              My Total Expected Yield
            </div>
            <div className="text-sm font-black font-mono text-[#8C6D2D] mt-1">
              ৳ {filteredLeads.filter(l => l.currency === 'BDT').reduce((s, l) => s + (l.commissionAmount || Math.round(l.estimatedValue * ((l.commissionRate || 10) / 100))) + (l.directCustomerFee || 0), 0).toLocaleString()}
              <span className="text-xs text-[#8C6D2D]/70 font-normal"> + </span>
              ${filteredLeads.filter(l => l.currency === 'USD').reduce((s, l) => s + (l.commissionAmount || Math.round(l.estimatedValue * ((l.commissionRate || 10) / 100))) + (l.directCustomerFee || 0), 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-[#8C6D2D] mt-0.5 font-semibold">
              Entity Comm % + Direct Cust Fees
            </div>
          </div>

          {/* Ready for Entity Payout to Me */}
          <div className="rounded-xl border border-[#D8B4FE] bg-[#FAF5FF] p-3 shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B21A8]">
              Ready for Entity Payout to Me
            </div>
            <div className="text-sm font-black font-mono text-[#7E22CE] mt-1">
              ৳ {filteredLeads.filter(l => l.currency === 'BDT' && l.entityPayoutStatus === 'READY_FOR_SETTLEMENT').reduce((s, l) => s + (l.commissionAmount || Math.round(l.estimatedValue * ((l.commissionRate || 10) / 100))), 0).toLocaleString()}
              <span className="text-xs text-[#6B21A8]/70 font-normal"> + </span>
              ${filteredLeads.filter(l => l.currency === 'USD' && l.entityPayoutStatus === 'READY_FOR_SETTLEMENT').reduce((s, l) => s + (l.commissionAmount || Math.round(l.estimatedValue * ((l.commissionRate || 10) / 100))), 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-[#6B21A8] mt-0.5 font-medium">Customer Paid &bull; Entity Settlement Due</div>
          </div>

          {/* Realized / Settled to My Account */}
          <div className="rounded-xl border border-[#A7F3D0] bg-[#F0FDF4] p-3 shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
              Realized & Settled to Me
            </div>
            <div className="text-sm font-black font-mono text-[#15803D] mt-1">
              ৳ {filteredLeads.filter(l => l.currency === 'BDT' && l.entityPayoutStatus === 'SETTLED').reduce((s, l) => s + (l.payoutAmountReceived || l.commissionAmount || Math.round(l.estimatedValue * ((l.commissionRate || 10) / 100))), 0).toLocaleString()}
              <span className="text-xs text-[#166534]/70 font-normal"> + </span>
              ${filteredLeads.filter(l => l.currency === 'USD' && l.entityPayoutStatus === 'SETTLED').reduce((s, l) => s + (l.payoutAmountReceived || l.commissionAmount || Math.round(l.estimatedValue * ((l.commissionRate || 10) / 100))), 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-[#15803D] mt-0.5 font-bold">100% Disbursed to My Personal Funds</div>
          </div>
        </div>

        {/* Search Bar Strip */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-[#DDE3DD] shadow-xs text-xs">
          <div className="relative w-full">
            <Search className="h-3.5 w-3.5 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by deal/project title, client company, contact person..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#DDE3DD] bg-[#F4F6F4] pl-9 pr-3 py-1.5 text-xs text-[#1A1A1A] placeholder:text-[#888] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
            />
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* BIZMAN CRM VIEW: CORPORATE LEAD COMPANIES (COMPANIES & CONTACTS) */}
      {/* =================================================================== */}
      {viewMode === 'COMPANIES' && (
        filteredCompanyLeads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#DDE3DD] bg-white p-12 text-center space-y-4 shadow-sm">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#F4F6F4] flex items-center justify-center text-[#1F3A2E] border border-[#DDE3DD]">
              <Building2 className="h-7 w-7 text-[#C8A96A]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-[#1F3A2E]">Corporate Client Database is Clean</h2>
              <p className="text-xs text-[#6B7269] max-w-md mx-auto">
                No corporate accounts recorded yet. You can list a company account (e.g. Grameenphone, Robi, Unilever, or an export supplier/buyer) without needing a campaign or contact person upfront.
              </p>
            </div>
            <button
              onClick={() => setIsCreateCompanyModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] px-4 py-2 text-xs font-black shadow-sm transition-all"
            >
              <Building2 className="h-4 w-4" />
              <span>+ List New Company Account</span>
            </button>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Corporate Leads Roster (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#6B7269] px-1 font-semibold">
              <span className="flex items-center gap-1.5 font-bold text-[#1F3A2E]">
                <Building2 className="h-3.5 w-3.5 text-[#C8A96A]" />
                <span>Showing {filteredCompanyLeads.length} Corporate Accounts</span>
              </span>
              <button
                type="button"
                onClick={() => setIsCreateCompanyModalOpen(true)}
                className="flex items-center gap-1 text-[11px] font-extrabold text-[#1F3A2E] bg-white hover:bg-[#F4F6F4] border border-[#DDE3DD] rounded-lg px-2.5 py-1 transition-colors shadow-xs"
              >
                <Plus className="h-3 w-3 text-[#C8A96A]" />
                <span>Add Company</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
              {filteredCompanyLeads.map((comp) => {
                const isSelected = selectedCompany?.id === comp.id;
                const totalVal = comp.projects.reduce((acc, p) => acc + p.estimatedValue, 0);
                const totalYield = comp.projects.reduce((acc, p) => acc + (p.commissionAmount || Math.round(p.estimatedValue * (p.commissionRate / 100))) + (p.directCustomerFee || 0), 0);
                const currSymbol = comp.projects[0]?.currency === 'USD' ? '$' : '৳';

                return (
                  <div
                    key={comp.id}
                    onClick={() => handleSelectCompany(comp)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all relative ${
                      isSelected
                        ? 'border-[#1F3A2E] bg-white shadow-md ring-2 ring-[#1F3A2E]/20'
                        : 'border-[#DDE3DD] bg-white hover:border-[#1F3A2E] hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      {/* Entity Badge */}
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded shadow-xs ${
                        comp.companyCode === 'BIZMAN' ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' :
                        comp.companyCode === 'LINDA' ? 'bg-black text-white px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider' :
                        'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                      }`}>
                        {comp.companyCode === 'ARIELMC' ? 'ArielMC' : comp.companyCode === 'LINDA' ? 'Linda Resort' : comp.companyCode}
                      </span>

                      {/* Priority Temp Badge */}
                      <span className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        comp.priorityTemp === 'HOT'
                          ? 'bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]'
                          : comp.priorityTemp === 'WARM'
                          ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
                          : 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]'
                      }`}>
                        {comp.priorityTemp === 'HOT' ? '🔥 HOT' : comp.priorityTemp === 'WARM' ? '☀️ WARM' : '❄️ COLD'}
                      </span>
                    </div>

                    <h3 className="mt-2 text-base font-extrabold text-[#1F3A2E]">{comp.companyName}</h3>
                    <div className="text-xs text-[#556055] font-medium mt-0.5">
                      <span>{comp.industry}</span> &bull; <span>{comp.city ? `${comp.city}, ` : ''}{comp.country}</span>
                    </div>

                    {/* Stats Badges: Contacts & Parallel Deals */}
                    <div className="mt-2.5 flex items-center gap-2 text-xs flex-wrap">
                      <span className="flex items-center gap-1 rounded-md bg-[#EEF2FF] text-[#4338CA] px-2 py-0.5 font-bold text-[10.5px] border border-[#C7D2FE]">
                        <Users className="h-3 w-3" />
                        <span>{comp.contacts.length} Contacts</span>
                      </span>

                      <span className="flex items-center gap-1 rounded-md bg-[#FAF5FF] text-[#7E22CE] px-2 py-0.5 font-bold text-[10.5px] border border-[#E9D5FF]">
                        <Layers className="h-3 w-3" />
                        <span>{comp.projects.length} Parallel Projects</span>
                      </span>
                    </div>

                    {/* Yield Strip */}
                    <div className="mt-3 rounded-lg bg-[#FBF9F4] border border-[#C8A96A]/40 p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-[#6B7269]">Active Contracts Total:</div>
                        <div className="font-mono font-bold text-[#1A1A1A]">
                          {currSymbol}{totalVal.toLocaleString()}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-[#8C6D2D] font-extrabold uppercase">My Realizable Yield:</div>
                        <div className="font-mono font-black text-[#8C6D2D] text-sm">
                          {currSymbol}{totalYield.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Corporate Account Command Hub (7 Cols) */}
          {selectedCompany && (
            <div className="lg:col-span-7 space-y-5">
              {/* Card 1: Company Profile Header */}
              <div className="rounded-xl border border-[#DDE3DD] bg-white p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DDE3DD] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded shadow-xs ${
                        selectedCompany.companyCode === 'BIZMAN' ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' :
                        selectedCompany.companyCode === 'LINDA' ? 'bg-black text-white px-2 py-0.5 text-[10px] font-extrabold tracking-wider' :
                        'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                      }`}>
                        {selectedCompany.companyCode === 'ARIELMC' ? 'ArielMC' : selectedCompany.companyCode === 'LINDA' ? 'Linda Resort Limited' : 'Bizman Media'}
                      </span>
                      <span className="text-xs font-mono font-semibold text-[#6B7269] bg-[#F4F6F4] px-2 py-0.5 rounded border border-[#DDE3DD]">
                        {selectedCompany.clientType}
                      </span>
                    </div>
                    <h2 className="mt-2 text-2xl font-black text-[#1F3A2E]">{selectedCompany.companyName}</h2>
                    <div className="text-xs text-[#556055] mt-1 flex items-center gap-2 flex-wrap">
                      <span>{selectedCompany.industry}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#C8A96A]" />
                        <span>{selectedCompany.address || `${selectedCompany.city}, ${selectedCompany.country}`}</span>
                      </span>
                      {selectedCompany.website && (
                        <>
                          <span>&bull;</span>
                          <a 
                            href={`https://${selectedCompany.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#1F5FA8] hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>{selectedCompany.website}</span>
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quick Action Buttons for Company */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddContactModalOpen(true)}
                      className="flex items-center gap-1.5 rounded-lg bg-[#EEF2FF] hover:bg-[#4338CA] text-[#4338CA] hover:text-white border border-[#C7D2FE] px-3 py-1.5 text-xs font-bold transition-all shadow-xs"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>+ Add Contact</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsAddProjectModalOpen(true)}
                      className="flex items-center gap-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] px-3.5 py-1.5 text-xs font-extrabold transition-all shadow-xs"
                    >
                      <FolderPlus className="h-3.5 w-3.5" />
                      <span>+ New Project</span>
                    </button>
                  </div>
                </div>

                {/* Account Commercial Highlights Strip */}
                {(() => {
                  const currSym = selectedCompany.projects[0]?.currency === 'USD' ? '$' : '৳';
                  const totalContractVal = selectedCompany.projects.reduce((s, p) => s + p.estimatedValue, 0);
                  const totalComm = selectedCompany.projects.reduce((s, p) => s + (p.commissionAmount || Math.round(p.estimatedValue * (p.commissionRate / 100))), 0);
                  const totalDirectFee = selectedCompany.projects.reduce((s, p) => s + (p.directCustomerFee || 0), 0);
                  const netYield = totalComm + totalDirectFee;

                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="bg-[#F8FAF8] p-2.5 rounded-lg border border-[#DDE3DD]">
                        <div className="text-[10px] text-[#6B7269] font-medium">Total Contract Value:</div>
                        <div className="text-sm font-black font-mono text-[#1F3A2E] mt-0.5">
                          {currSym}{totalContractVal.toLocaleString()}
                        </div>
                      </div>

                      <div className="bg-[#FAF5FF] p-2.5 rounded-lg border border-[#D8B4FE]">
                        <div className="text-[10px] text-[#7E22CE] font-bold">Entity Commissions:</div>
                        <div className="text-sm font-black font-mono text-[#7E22CE] mt-0.5">
                          {currSym}{totalComm.toLocaleString()}
                        </div>
                      </div>

                      <div className="bg-[#F0FDF4] p-2.5 rounded-lg border border-[#86EFAC]">
                        <div className="text-[10px] text-[#166534] font-bold">Direct Customer Fees:</div>
                        <div className="text-sm font-black font-mono text-[#166534] mt-0.5">
                          {currSym}{totalDirectFee.toLocaleString()}
                        </div>
                      </div>

                      <div className="bg-[#FBF9F4] p-2.5 rounded-lg border-2 border-[#C8A96A]">
                        <div className="text-[10px] text-[#8C6D2D] font-black uppercase">My Total Account Yield:</div>
                        <div className="text-sm font-black font-mono text-[#8C6D2D] mt-0.5">
                          {currSym}{netYield.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Card 2: Contact Persons Under this Lead (The Bizman Contact Hierarchy) */}
              <div className="rounded-xl border border-[#DDE3DD] bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#4338CA]" />
                    <h3 className="text-xs font-black text-[#1F3A2E] uppercase tracking-wide">
                      Contact Persons Under this Corporate Lead ({selectedCompany.contacts.length})
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddContactModalOpen(true)}
                    className="flex items-center gap-1 text-xs text-[#4338CA] hover:underline font-bold"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Contact Person</span>
                  </button>
                </div>

                {/* Contacts Grid */}
                {selectedCompany.contacts.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-[#DDE3DD] bg-[#FAFAF8] p-5 text-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4338CA] mx-auto flex items-center justify-center">
                      <UserPlus className="h-4 w-4" />
                    </div>
                    <div className="text-xs font-bold text-[#1F3A2E]">No Contact Persons Added Yet</div>
                    <p className="text-[11px] text-[#6B7269] max-w-sm mx-auto">
                      This company was listed without an upfront contact. As business discussions start, click below to add key decision makers or procurement managers.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAddContactModalOpen(true)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#4338CA] hover:underline pt-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>+ Add First Contact Person</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {selectedCompany.contacts.map((cnt) => {
                      const roleBadge = 
                        cnt.roleType === 'PRIMARY_DECISION_MAKER' ? 'bg-[#EEF2FF] text-[#4338CA] border-[#C7D2FE]' :
                        cnt.roleType === 'PROCUREMENT' ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]' :
                        cnt.roleType === 'MEDIA_BUYER' ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]' :
                        cnt.roleType === 'FINANCE_ACCOUNTS' ? 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]' :
                        cnt.roleType === 'OPERATIONS' ? 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]' :
                        'bg-[#F4F6F4] text-[#556055] border-[#DDE3DD]';

                      const roleLabel = 
                        cnt.roleType === 'PRIMARY_DECISION_MAKER' ? 'Primary Decision Maker' :
                        cnt.roleType === 'PROCUREMENT' ? 'Procurement / RFP' :
                        cnt.roleType === 'MEDIA_BUYER' ? 'Media Buyer / Planning' :
                        cnt.roleType === 'FINANCE_ACCOUNTS' ? 'Finance & Invoicing' :
                        cnt.roleType === 'OPERATIONS' ? 'Operations & Sourcing' :
                        'Key Contact';

                      return (
                        <div 
                          key={cnt.id} 
                          className="rounded-lg border border-[#DDE3DD] bg-[#FAFAF8] p-3 space-y-2 hover:border-[#1F3A2E] transition-all"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <div className="font-extrabold text-sm text-[#1F3A2E] flex items-center gap-1.5">
                                <span>{cnt.name}</span>
                                {cnt.isPrimary && (
                                  <span className="text-[9px] font-black uppercase bg-[#1F3A2E] text-[#C8A96A] px-1.5 py-0.2 rounded">
                                    Primary
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-[#556055] font-semibold">{cnt.designation}</div>
                              {cnt.department && (
                                <div className="text-[10.5px] text-[#888]">{cnt.department}</div>
                              )}
                            </div>

                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${roleBadge}`}>
                              {roleLabel}
                            </span>
                          </div>

                          {/* Contact Channels */}
                          <div className="pt-2 border-t border-[#DDE3DD] flex items-center justify-between gap-2 text-xs">
                            <div className="text-[11px] font-mono text-[#333] space-y-0.5">
                              <div>📞 {cnt.phone}</div>
                              {cnt.pabxPhone && (
                                <div className="text-[10px] text-[#666]">PABX: {cnt.pabxPhone}</div>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <a
                                href={`tel:${cnt.phone}`}
                                title="Direct Phone Call"
                                className="h-7 w-7 rounded-md bg-[#E0F2FE] hover:bg-[#0284C7] text-[#0369A1] hover:text-white border border-[#BAE6FD] flex items-center justify-center transition-colors shadow-xs"
                              >
                                <Phone className="h-3.5 w-3.5" />
                              </a>

                              <a
                                href={`https://wa.me/${cnt.whatsapp || cnt.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Direct WhatsApp"
                                className="h-7 w-7 rounded-md bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center transition-colors shadow-xs"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                              </a>

                              <a
                                href={`mailto:${cnt.email}`}
                                title={`Email ${cnt.email}`}
                                className="h-7 w-7 rounded-md bg-[#F4F6F4] hover:bg-[#1F3A2E] text-[#556055] hover:text-[#C8A96A] border border-[#DDE3DD] flex items-center justify-center transition-colors shadow-xs"
                              >
                                <Mail className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          </div>

                          {cnt.notes && (
                            <div className="text-[10.5px] text-[#666] italic bg-white p-1.5 rounded border border-[#EBEBEB]">
                              &ldquo;{cnt.notes}&rdquo;
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Card 3: Parallel Commercial Projects Under this Lead */}
              <div className="rounded-xl border border-[#DDE3DD] bg-white p-5 shadow-sm space-y-3.5">
                <div className="flex flex-wrap items-center justify-between border-b border-[#DDE3DD] pb-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#C8A96A]" />
                    <h3 className="text-xs font-black text-[#1F3A2E] uppercase tracking-wide">
                      Parallel Active Projects ({selectedCompany.projects.length})
                    </h3>
                    <span className="text-[10px] text-[#6B7269]">
                      Multiple parallel campaigns running with distinct contact managers & agreed yields
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddProjectModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] px-3 py-1 text-xs font-bold transition-all shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>+ New Project</span>
                  </button>
                </div>

                {/* Projects List */}
                {selectedCompany.projects.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#DDE3DD] bg-[#FAFAF8] p-6 text-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-[#F4F6F4] text-[#1F3A2E] mx-auto flex items-center justify-center border border-[#DDE3DD]">
                      <Layers className="h-4 w-4 text-[#C8A96A]" />
                    </div>
                    <div className="text-xs font-bold text-[#1F3A2E]">No Active Campaigns or Deals Yet</div>
                    <p className="text-[11px] text-[#6B7269] max-w-sm mx-auto">
                      This company is registered in your corporate directory. Commercial campaigns, DOOH media slots, or export purchase orders can be launched step-by-step whenever inquiries arrive.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAddProjectModalOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] px-3.5 py-1.5 text-xs font-extrabold transition-all shadow-xs mt-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Initiate First Project / Campaign</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedCompany.projects.map((proj) => {
                    const stageCfg = STAGE_CONFIG[proj.stage] || STAGE_CONFIG.NEW_INQUIRY;
                    const curr = proj.currency === 'USD' ? '$' : '৳';
                    const commAmount = proj.commissionAmount || Math.round(proj.estimatedValue * (proj.commissionRate / 100));
                    const totalProjYield = commAmount + (proj.directCustomerFee || 0);

                    return (
                      <div 
                        key={proj.id}
                        className="rounded-xl border border-[#DDE3DD] bg-white p-4 space-y-3 shadow-xs hover:border-[#C8A96A] transition-all"
                      >
                        {/* Project Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0F2F0] pb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-black text-[#1F3A2E] bg-[#F4F6F4] px-2 py-0.5 rounded border border-[#DDE3DD]">
                                {proj.projectCode}
                              </span>
                              <span className="text-xs text-[#888]">&bull;</span>
                              <span className="text-xs font-semibold text-[#6B7269]">
                                {proj.pipelineType}
                              </span>
                            </div>
                            <h4 className="mt-1 text-sm font-black text-[#1F3A2E]">{proj.title}</h4>
                            <div className="text-xs text-[#556055] mt-0.5">
                              Dedicated Contact: <strong className="text-[#1A1A1A]">{proj.contactPersonName}</strong> {proj.contactPersonPhone && `(${proj.contactPersonPhone})`}
                            </div>
                          </div>

                          {/* Stage Badge & Advance Action */}
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded shadow-xs ${stageCfg.badge}`}>
                              {stageCfg.label}
                            </span>

                            {proj.stage !== 'WON' && proj.stage !== 'LOST' && (
                              <button
                                type="button"
                                onClick={() => handleAdvanceCompanyProjectStage(selectedCompany.id, proj.id, proj.stage)}
                                className="flex items-center gap-1 rounded bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] px-2 py-1 text-[10px] font-bold shadow-xs transition-colors"
                                title="Advance to Next Stage"
                              >
                                <span>Advance</span>
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Financial Strip: Contract Value & My Agreed Yields */}
                        <div className="rounded-lg bg-[#FBF9F4] border border-[#C8A96A]/40 p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-[#6B7269]">Contract Valuation: </span>
                            <span className="font-mono font-black text-[#1A1A1A] text-xs">
                              {curr}{proj.estimatedValue.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div>
                              <span className="text-[10px] text-[#7E22CE] font-bold">Entity Comm ({proj.commissionRate}%): </span>
                              <span className="font-mono font-black text-[#7E22CE]">
                                {curr}{commAmount.toLocaleString()}
                              </span>
                            </div>

                            {(proj.directCustomerFee || 0) > 0 && (
                              <div>
                                <span className="text-[10px] text-[#166534] font-bold">+ Direct Cust Fee: </span>
                                <span className="font-mono font-black text-[#166534]">
                                  {curr}{(proj.directCustomerFee || 0).toLocaleString()}
                                </span>
                              </div>
                            )}

                            <div className="border-l border-[#C8A96A]/40 pl-3">
                              <span className="text-[10px] text-[#8C6D2D] font-black uppercase">My Total Yield: </span>
                              <span className="font-mono font-black text-[#8C6D2D] text-sm">
                                {curr}{totalProjYield.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 3-Way Real-time Settlement Controls */}
                        <div className="pt-1 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          {/* Control 1: Customer Payment to Entity */}
                          <div className="bg-[#F8FAF8] p-2 rounded-lg border border-[#DDE3DD] space-y-1">
                            <div className="text-[10px] font-bold text-[#6B7269]">1. Customer Pay to {selectedCompany.companyCode}:</div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleUpdateCompanyProjectCustomerPayment(selectedCompany.id, proj.id, 'PENDING')}
                                className={`flex-1 py-1 rounded text-[10px] font-bold border ${
                                  (proj.customerPaymentStatus || 'PENDING') === 'PENDING'
                                    ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
                                    : 'bg-white text-[#6B7269] border-[#DDE3DD]'
                                }`}
                              >
                                Pending
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateCompanyProjectCustomerPayment(selectedCompany.id, proj.id, 'PARTIAL')}
                                className={`flex-1 py-1 rounded text-[10px] font-bold border ${
                                  proj.customerPaymentStatus === 'PARTIAL'
                                    ? 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]'
                                    : 'bg-white text-[#6B7269] border-[#DDE3DD]'
                                }`}
                              >
                                Partial
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateCompanyProjectCustomerPayment(selectedCompany.id, proj.id, 'RECEIVED')}
                                className={`flex-1 py-1 rounded text-[10px] font-black border ${
                                  proj.customerPaymentStatus === 'RECEIVED'
                                    ? 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
                                    : 'bg-white text-[#6B7269] border-[#DDE3DD]'
                                }`}
                              >
                                ✓ Paid
                              </button>
                            </div>
                          </div>

                          {/* Control 2: Entity Commission Payout to Syed Akramul Hassan */}
                          <div className="bg-[#FAF5FF] p-2 rounded-lg border border-[#D8B4FE] space-y-1">
                            <div className="text-[10px] font-bold text-[#7E22CE]">2. Entity Payout to Me:</div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleUpdateCompanyProjectEntityPayout(selectedCompany.id, proj.id, 'READY_FOR_SETTLEMENT')}
                                className={`flex-1 py-1 rounded text-[10px] font-bold border ${
                                  proj.entityPayoutStatus === 'READY_FOR_SETTLEMENT'
                                    ? 'bg-[#F3E8FF] text-[#7E22CE] border-[#D8B4FE]'
                                    : 'bg-white text-[#6B7269] border-[#DDE3DD]'
                                }`}
                              >
                                Ready Due
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateCompanyProjectEntityPayout(selectedCompany.id, proj.id, 'SETTLED')}
                                className={`flex-1 py-1 rounded text-[10px] font-black border ${
                                  proj.entityPayoutStatus === 'SETTLED'
                                    ? 'bg-[#15803D] text-white border-[#15803D]'
                                    : 'bg-white text-[#15803D] border-[#86EFAC]'
                                }`}
                              >
                                ✓ Settled to Me
                              </button>
                            </div>
                          </div>

                          {/* Control 3: Direct Customer Fee Payment */}
                          <div className="bg-[#F0FDF4] p-2 rounded-lg border border-[#86EFAC] space-y-1">
                            <div className="text-[10px] font-bold text-[#166534]">3. Direct Customer Fee:</div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleUpdateCompanyProjectDirectPayment(selectedCompany.id, proj.id, 'PENDING')}
                                className={`flex-1 py-1 rounded text-[10px] font-bold border ${
                                  (proj.directCustomerPaymentStatus || 'PENDING') === 'PENDING'
                                    ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
                                    : 'bg-white text-[#6B7269] border-[#DDE3DD]'
                                }`}
                              >
                                Pending
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateCompanyProjectDirectPayment(selectedCompany.id, proj.id, 'RECEIVED')}
                                className={`flex-1 py-1 rounded text-[10px] font-black border ${
                                  proj.directCustomerPaymentStatus === 'RECEIVED'
                                    ? 'bg-[#15803D] text-white border-[#15803D]'
                                    : 'bg-white text-[#15803D] border-[#86EFAC]'
                                }`}
                              >
                                ✓ Received
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

              {/* Card 4: Corporate Account Executive Intelligence Notes */}
              <div className="rounded-xl border border-[#DDE3DD] bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-2">
                  <div className="flex items-center gap-2">
                    <FileEdit className="h-4 w-4 text-[#C8A96A]" />
                    <h3 className="text-xs font-black text-[#1F3A2E] uppercase tracking-wide">
                      Corporate Account Intelligence & Commercial Strategy
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveCompanyNotepad}
                    className="flex items-center gap-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] px-3 py-1 text-xs font-bold transition-all shadow-xs"
                  >
                    {companySaveStatus === 'saving' ? (
                      <Clock className="h-3.5 w-3.5 animate-spin" />
                    ) : companySaveStatus === 'saved' ? (
                      <Check className="h-3.5 w-3.5 text-[#86EFAC]" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    <span>{companySaveStatus === 'saving' ? 'Saving...' : companySaveStatus === 'saved' ? 'Saved' : 'Save Notes'}</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={companyNotepadContent}
                  onChange={(e) => setCompanyNotepadContent(e.target.value)}
                  placeholder="Record strategic account background, procurement cycles, key board connections, or vendor agreements..."
                  className="w-full rounded-lg border border-[#DDE3DD] bg-[#FAFAF8] p-3 text-xs text-[#1A1A1A] font-mono leading-relaxed focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                />
              </div>
            </div>
          )}
        </div>
        )
      )}

      {/* =================================================================== */}
      {/* VIEW 2: GRID VIEW (Two-Column Cards & Inspector) */}
      {/* =================================================================== */}
      {viewMode === 'GRID' && (
        filteredLeads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#DDE3DD] bg-white p-12 text-center space-y-4 shadow-sm">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#F4F6F4] flex items-center justify-center text-[#1F3A2E] border border-[#DDE3DD]">
              <Layers className="h-7 w-7 text-[#C8A96A]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-[#1F3A2E]">No Project Deals in Pipeline</h2>
              <p className="text-xs text-[#6B7269] max-w-md mx-auto">
                Deal pipeline is clean. Click &quot;+ Create New Lead&quot; above to log your first commercial project contract.
              </p>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Opportunity List Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#6B7269] px-1 font-semibold">
              <span>Showing {filteredLeads.length} Personal Project Deals</span>
              <span>Click to inspect & settle</span>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
              {filteredLeads.map((lead) => {
                const isSelected = selectedLead?.id === lead.id;
                const stageCfg = STAGE_CONFIG[lead.stage] || STAGE_CONFIG.NEW_INQUIRY;
                const commRate = lead.commissionRate || 10;
                const commAmount = lead.commissionAmount || Math.round(lead.estimatedValue * (commRate / 100));

                return (
                  <div
                    key={lead.id}
                    onClick={() => handleSelectLead(lead)}
                    className={`cursor-pointer rounded-xl border p-3.5 transition-all relative ${
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
                      <span className="font-mono text-[#556055] font-semibold text-xs">
                        Contract: <strong className="text-[#1A1A1A] font-black">{lead.currency === 'USD' ? '$' : '৳'}{lead.estimatedValue.toLocaleString()}</strong>
                      </span>
                    </div>

                    <h3 className="mt-1.5 text-sm font-extrabold text-[#1F3A2E] line-clamp-1">{lead.title}</h3>
                    <div className="text-xs text-[#556055] font-medium mt-0.5">
                      <strong className="text-[#1A1A1A]">{lead.customerName}</strong> &bull; {lead.country}
                    </div>

                    {/* My Yield Strip (Entity Comm + Direct Cust Fee) */}
                    <div className="mt-2.5 rounded-lg bg-[#FBF9F4] border border-[#C8A96A]/40 p-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase text-[#8C6D2D] bg-[#C8A96A]/20 px-1.5 py-0.5 rounded">
                          Comm ({commRate}%)
                        </span>
                        <span className="font-mono font-black text-[#8C6D2D]">
                          {lead.currency === 'USD' ? '$' : '৳'}{commAmount.toLocaleString()}
                        </span>
                        {(lead.directCustomerFee || 0) > 0 && (
                          <span className="text-[10px] font-mono font-black text-[#166534] bg-[#DCFCE7] px-1.5 py-0.5 rounded border border-[#86EFAC]">
                            + {lead.currency === 'USD' ? '$' : '৳'}{(lead.directCustomerFee || 0).toLocaleString()} Direct Cust
                          </span>
                        )}
                      </div>

                      {/* Customer Payment & Entity Settlement Badges */}
                      <div className="flex items-center gap-1 shrink-0">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                          lead.customerPaymentStatus === 'RECEIVED'
                            ? 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
                            : lead.customerPaymentStatus === 'PARTIAL'
                            ? 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]'
                            : 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
                        }`}>
                          Cust: {lead.customerPaymentStatus === 'RECEIVED' ? 'Paid' : lead.customerPaymentStatus === 'PARTIAL' ? 'Partial' : 'Pending'}
                        </span>

                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
                          lead.entityPayoutStatus === 'SETTLED'
                            ? 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
                            : lead.entityPayoutStatus === 'READY_FOR_SETTLEMENT'
                            ? 'bg-[#F3E8FF] text-[#7E22CE] border-[#D8B4FE] animate-pulse'
                            : 'bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]'
                        }`}>
                          Entity: {lead.entityPayoutStatus === 'SETTLED' ? 'Settled' : lead.entityPayoutStatus === 'READY_FOR_SETTLEMENT' ? 'Due to Me' : 'Awaiting Cust'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between border-t border-[#DDE3DD] pt-2 text-[11px]">
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
                          Close: {lead.expectedCloseDate}
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
            <div className="lg:col-span-7 rounded-xl border border-[#DDE3DD] bg-white p-6 space-y-5 shadow-sm">
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

              {/* =================================================================== */}
              {/* DEDICATED SECTION: MY EXECUTIVE COMMISSION & DIRECT CUSTOMER FEES */}
              {/* =================================================================== */}
              <div className="rounded-xl border-2 border-[#C8A96A] bg-gradient-to-br from-[#FBF9F4] to-white p-4 space-y-3.5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between border-b border-[#C8A96A]/30 pb-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-[#1F3A2E] text-[#C8A96A] flex items-center justify-center font-bold shadow-xs">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#1F3A2E] uppercase tracking-wide">
                        My Executive Project Earnings & Settlement Engine
                      </div>
                      <div className="text-[10px] text-[#6B7269]">
                        Dual-stream revenue: Entity Commission % + Direct Contractual Customer Fees
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10.5px] font-mono font-extrabold text-[#8C6D2D] bg-[#C8A96A]/20 px-2.5 py-0.5 rounded-full border border-[#C8A96A]/40">
                      Entity Comm: {selectedLead.commissionRate || 10}%
                    </span>
                    {(selectedLead.directCustomerFee || 0) > 0 && (
                      <span className="text-[10.5px] font-mono font-extrabold text-[#1E6B3A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full border border-[#86EFAC]">
                        + Direct Cust Fee
                      </span>
                    )}
                  </div>
                </div>

                {/* Key Numbers Grid: 3 Streams */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                  {/* Total Contract Value */}
                  <div className="bg-white p-2.5 rounded-lg border border-[#DDE3DD]">
                    <div className="text-[10px] text-[#6B7269] font-medium">Contract Valuation:</div>
                    <div className="text-sm font-black font-mono text-[#1F3A2E] mt-0.5">
                      {selectedLead.currency === 'USD' ? '$' : '৳'}{selectedLead.estimatedValue.toLocaleString()}
                    </div>
                  </div>

                  {/* Entity Commission */}
                  <div className="bg-[#FAF5FF] p-2.5 rounded-lg border border-[#D8B4FE]">
                    <div className="text-[10px] text-[#7E22CE] font-bold">Entity Commission:</div>
                    <div className="text-sm font-black font-mono text-[#7E22CE] mt-0.5">
                      {selectedLead.currency === 'USD' ? '$' : '৳'}
                      {(selectedLead.commissionAmount || Math.round(selectedLead.estimatedValue * ((selectedLead.commissionRate || 10) / 100))).toLocaleString()}
                    </div>
                  </div>

                  {/* Extra Direct Customer Contract Fee */}
                  <div className="bg-[#F0FDF4] p-2.5 rounded-lg border border-[#86EFAC]">
                    <div className="text-[10px] text-[#166534] font-bold">Direct Customer Fee:</div>
                    <div className="text-sm font-black font-mono text-[#166534] mt-0.5">
                      {selectedLead.currency === 'USD' ? '$' : '৳'}
                      {(selectedLead.directCustomerFee || 0).toLocaleString()}
                    </div>
                  </div>

                  {/* Total Personal Yield */}
                  <div className="bg-[#FBF9F4] p-2.5 rounded-lg border-2 border-[#C8A96A]">
                    <div className="text-[10px] text-[#8C6D2D] font-black uppercase">My Total Project Yield:</div>
                    <div className="text-sm font-black font-mono text-[#8C6D2D] mt-0.5">
                      {selectedLead.currency === 'USD' ? '$' : '৳'}
                      {((selectedLead.commissionAmount || Math.round(selectedLead.estimatedValue * ((selectedLead.commissionRate || 10) / 100))) + (selectedLead.directCustomerFee || 0)).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Stream 1: Entity Payout Lifecycle (Customer Pays Entity -> Entity Pays Me) */}
                <div className="pt-1 border-t border-[#C8A96A]/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#556055]">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#7E22CE]" />
                      <span>Stream A: Entity Commission Payout ({selectedLead.commissionRate || 10}%)</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#6B7269]">
                      Customer: {selectedLead.customerPaymentStatus || 'PENDING'} &bull; Entity: {selectedLead.entityPayoutStatus || 'AWAITING_CUSTOMER_PAYMENT'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Customer -> Entity */}
                    <div className="bg-white p-2 rounded-lg border border-[#DDE3DD] space-y-1">
                      <div className="text-[10.5px] font-bold text-[#6B7269]">1. Customer Payment to {selectedLead.companyCode === 'ARIELMC' ? 'ArielMC' : selectedLead.companyCode === 'LINDA' ? 'Linda Resort' : 'Bizman'}:</div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateCustomerPayment(selectedLead.id, 'PENDING')}
                          className={`flex-1 py-1 px-1.5 rounded text-[10.5px] font-bold border ${
                            (selectedLead.customerPaymentStatus || 'PENDING') === 'PENDING'
                              ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
                              : 'bg-white text-[#6B7269] border-[#DDE3DD]'
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateCustomerPayment(selectedLead.id, 'PARTIAL')}
                          className={`flex-1 py-1 px-1.5 rounded text-[10.5px] font-bold border ${
                            selectedLead.customerPaymentStatus === 'PARTIAL'
                              ? 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]'
                              : 'bg-white text-[#6B7269] border-[#DDE3DD]'
                          }`}
                        >
                          Partial
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateCustomerPayment(selectedLead.id, 'RECEIVED')}
                          className={`flex-1 py-1 px-1.5 rounded text-[10.5px] font-black border ${
                            selectedLead.customerPaymentStatus === 'RECEIVED'
                              ? 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
                              : 'bg-white text-[#6B7269] border-[#DDE3DD]'
                          }`}
                        >
                          ✓ Paid
                        </button>
                      </div>
                    </div>

                    {/* Entity -> Syed Akramul Hassan */}
                    <div className="bg-white p-2 rounded-lg border border-[#DDE3DD] space-y-1">
                      <div className="text-[10.5px] font-bold text-[#6B7269]">2. Entity Commission Payout to Me:</div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateEntityPayout(selectedLead.id, 'READY_FOR_SETTLEMENT')}
                          className={`flex-1 py-1 px-1.5 rounded text-[10.5px] font-bold border ${
                            selectedLead.entityPayoutStatus === 'READY_FOR_SETTLEMENT'
                              ? 'bg-[#F3E8FF] text-[#7E22CE] border-[#D8B4FE]'
                              : 'bg-white text-[#6B7269] border-[#DDE3DD]'
                          }`}
                        >
                          Ready Due
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateEntityPayout(selectedLead.id, 'SETTLED')}
                          className={`flex-1 py-1 px-1.5 rounded text-[10.5px] font-black border ${
                            selectedLead.entityPayoutStatus === 'SETTLED'
                              ? 'bg-[#15803D] text-white border-[#15803D]'
                              : 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
                          }`}
                        >
                          ✓ Settled to Me
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stream 2: Direct Contractual Customer Payment to Syed Akramul Hassan */}
                <div className="pt-2 border-t border-[#C8A96A]/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#556055]">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#166534]" />
                      <span>Stream B: Extra Contractual Payment Directly from Customer</span>
                    </span>
                    <span className="font-mono font-black text-[#166534]">
                      {selectedLead.currency === 'USD' ? '$' : '৳'}{(selectedLead.directCustomerFee || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-[#DDE3DD] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#1F3A2E]">
                        Customer Direct Fee: <span className="font-mono font-black text-[#166534]">{selectedLead.currency === 'USD' ? '$' : '৳'}{(selectedLead.directCustomerFee || 0).toLocaleString()}</span>
                      </div>
                      <div className="text-[10px] text-[#6B7269]">
                        Contracted fee/retainer paid directly to Syed Akramul Hassan
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateDirectCustomerPayment(selectedLead.id, 'PENDING')}
                        className={`px-3 py-1 rounded text-xs font-bold border transition-all ${
                          (selectedLead.directCustomerPaymentStatus || 'PENDING') === 'PENDING'
                            ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
                            : 'bg-white text-[#6B7269] border-[#DDE3DD]'
                        }`}
                      >
                        Pending Direct Pay
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateDirectCustomerPayment(selectedLead.id, 'RECEIVED')}
                        className={`px-3 py-1 rounded text-xs font-black border transition-all ${
                          selectedLead.directCustomerPaymentStatus === 'RECEIVED'
                            ? 'bg-[#15803D] text-white border-[#15803D] shadow-xs'
                            : 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
                        }`}
                      >
                        ✓ Received Directly
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================================== */}
              {/* PARALLEL ACTIVE PROJECTS WITH THIS CLIENT ORGANIZATION */}
              {/* =================================================================== */}
              <div className="rounded-xl border border-[#DDE3DD] bg-white p-4 space-y-3 shadow-xs">
                <div className="flex flex-wrap items-center justify-between border-b border-[#DDE3DD] pb-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#C8A96A]" />
                    <h3 className="text-xs font-extrabold text-[#1F3A2E] uppercase tracking-wide">
                      Parallel Active Projects for <span className="text-[#1F5FA8]">{selectedLead.customerName}</span>
                    </h3>
                    <span className="rounded-full bg-[#E8F0FA] text-[#1F5FA8] px-2 py-0.5 text-[10px] font-bold">
                      {leads.filter(l => l.customerName === selectedLead.customerName).length} Projects Running
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenParallelProjectModal(selectedLead)}
                    className="flex items-center gap-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] px-2.5 py-1 text-[11px] font-bold transition-all shadow-xs"
                    title={`Create another parallel project for ${selectedLead.customerName} with different contact person`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>+ Add Parallel Project</span>
                  </button>
                </div>

                {/* List of Parallel Projects for this Customer */}
                <div className="space-y-2">
                  {leads
                    .filter(l => l.customerName === selectedLead.customerName)
                    .map((proj) => {
                      const isCurrent = proj.id === selectedLead.id;
                      const projYield = (proj.commissionAmount || Math.round(proj.estimatedValue * ((proj.commissionRate || 10) / 100))) + (proj.directCustomerFee || 0);

                      return (
                        <div
                          key={proj.id}
                          onClick={() => handleSelectLead(proj)}
                          className={`cursor-pointer rounded-lg p-2.5 transition-all border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                            isCurrent
                              ? 'bg-[#F4F6F4] border-[#1F3A2E] ring-1 ring-[#1F3A2E]'
                              : 'bg-white border-[#DDE3DD] hover:border-[#1F3A2E]'
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-[#1F3A2E] truncate">
                                {proj.projectName || proj.title}
                              </span>
                              {isCurrent && (
                                <span className="text-[9px] font-black uppercase text-[#1F3A2E] bg-[#DDE3DD] px-1.5 py-0.2 rounded">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#6B7269]">
                              Dedicated Contact: <strong className="text-[#1A1A1A]">{proj.contactPerson}</strong> &bull; {proj.phone}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <div className="font-mono font-bold text-[11px] text-[#556055]">
                                {proj.currency === 'USD' ? '$' : '৳'}{proj.estimatedValue.toLocaleString()}
                              </div>
                              <div className="font-mono font-black text-xs text-[#8C6D2D]">
                                Yield: {proj.currency === 'USD' ? '$' : '৳'}{projYield.toLocaleString()}
                              </div>
                            </div>

                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              STAGE_CONFIG[proj.stage]?.badge || 'bg-gray-100'
                            }`}>
                              {STAGE_CONFIG[proj.stage]?.label || proj.stage}
                            </span>
                          </div>
                        </div>
                      );
                    })}
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
        )
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
                  <th className="py-3 px-4">Project & Customer</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Contract Value</th>
                  <th className="py-3 px-4 text-center">Comm %</th>
                  <th className="py-3 px-4">My Total Yield</th>
                  <th className="py-3 px-4">Customer Pay</th>
                  <th className="py-3 px-4">Entity Payout</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3DD] font-mono text-[#1A1A1A]">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-xs text-[#6B7269] font-sans">
                      No project deals in pipeline yet. Click &quot;+ Create New Lead&quot; above to log your first contract.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                  const stageCfg = STAGE_CONFIG[lead.stage] || STAGE_CONFIG.NEW_INQUIRY;
                  const commRate = lead.commissionRate || 10;
                  const commAmount = lead.commissionAmount || Math.round(lead.estimatedValue * (commRate / 100));

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

                      {/* Contract Value */}
                      <td className="py-3.5 px-4 font-black text-[#1E6B3A] text-xs">
                        {lead.currency === 'USD' ? '$' : '৳'}{lead.estimatedValue.toLocaleString()}
                      </td>

                      {/* Commission Rate */}
                      <td className="py-3.5 px-4 text-center font-bold text-[#8C6D2D]">
                        <span className="bg-[#C8A96A]/20 px-2 py-0.5 rounded font-mono">
                          {commRate}%
                        </span>
                      </td>

                      {/* My Personal Yield (Comm + Direct Cust Fee) */}
                      <td className="py-3.5 px-4 font-mono font-black text-xs">
                        <div className="text-[#8C6D2D]">
                          {lead.currency === 'USD' ? '$' : '৳'}{(commAmount + (lead.directCustomerFee || 0)).toLocaleString()}
                        </div>
                        {(lead.directCustomerFee || 0) > 0 && (
                          <div className="text-[10px] text-[#166534] font-semibold">
                            +{lead.currency === 'USD' ? '$' : '৳'}{(lead.directCustomerFee || 0).toLocaleString()} direct
                          </div>
                        )}
                      </td>

                      {/* Customer Payment Status */}
                      <td className="py-3.5 px-4 font-sans">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border inline-block ${
                          lead.customerPaymentStatus === 'RECEIVED'
                            ? 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
                            : lead.customerPaymentStatus === 'PARTIAL'
                            ? 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]'
                            : 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
                        }`}>
                          {lead.customerPaymentStatus === 'RECEIVED' ? '✓ Paid' : lead.customerPaymentStatus === 'PARTIAL' ? 'Partial' : 'Pending'}
                        </span>
                      </td>

                      {/* Entity Payout Status */}
                      <td className="py-3.5 px-4 font-sans">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border inline-block ${
                          lead.entityPayoutStatus === 'SETTLED'
                            ? 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
                            : lead.entityPayoutStatus === 'READY_FOR_SETTLEMENT'
                            ? 'bg-[#F3E8FF] text-[#7E22CE] border-[#D8B4FE]'
                            : 'bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]'
                        }`}>
                          {lead.entityPayoutStatus === 'SETTLED' ? '✓ Settled' : lead.entityPayoutStatus === 'READY_FOR_SETTLEMENT' ? '⚡ Due to Me' : 'Awaiting Cust'}
                        </span>
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

                          {/* Primary Inspect & Settle Button */}
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setViewMode('GRID');
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] border border-[#1F3A2E] text-xs font-bold transition-all shadow-sm"
                            title="Inspect Deal, Stages & Commission Settlement"
                          >
                            <FileEdit className="h-3.5 w-3.5 text-[#C8A96A]" />
                            <span>Settle</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }))}
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
                      {stageLeads.map((lead) => {
                        const commRate = lead.commissionRate || 10;
                        const commAmount = lead.commissionAmount || Math.round(lead.estimatedValue * (commRate / 100));

                        return (
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
                              <span className="font-mono text-[#556055] font-semibold text-[11px]">
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

                            {/* My Yield Pill */}
                            <div className="rounded bg-[#FBF9F4] border border-[#C8A96A]/40 px-2 py-1 flex items-center justify-between text-[10px]">
                              <span className="font-bold text-[#8C6D2D]">My Yield:</span>
                              <div className="text-right">
                                <span className="font-mono font-black text-[#8C6D2D]">
                                  {lead.currency === 'USD' ? '$' : '৳'}{(commAmount + (lead.directCustomerFee || 0)).toLocaleString()}
                                </span>
                                {(lead.directCustomerFee || 0) > 0 && (
                                  <span className="text-[9px] text-[#166534] font-bold block">
                                    +{lead.currency === 'USD' ? '$' : '৳'}{(lead.directCustomerFee || 0).toLocaleString()} direct
                                  </span>
                                )}
                              </div>
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
                        );
                      })}

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
                {/* Client Organization Dropdown */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-extrabold text-[#1F3A2E]">
                      Client Organization <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomOrg(!isCustomOrg);
                        if (!isCustomOrg) {
                          setFormData(prev => ({ ...prev, customerName: '', contactPerson: '' }));
                        }
                      }}
                      className="text-[10.5px] text-[#8C6D2D] hover:underline font-bold"
                    >
                      {isCustomOrg ? 'Choose from list' : '+ Enter custom'}
                    </button>
                  </div>

                  {!isCustomOrg ? (
                    <select
                      required
                      value={formData.customerName}
                      onChange={handleSelectOrganization}
                      className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2.5 text-xs text-[#1A1A1A] font-semibold focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                    >
                      <option value="">-- Select Listed Client Organization --</option>

                      {entityMatchingCompanies.length > 0 && (
                        <optgroup label={`🏢 ${formData.companyCode} Company Accounts (${entityMatchingCompanies.length})`}>
                          {entityMatchingCompanies.map(name => (
                            <option key={`match-${name}`} value={name}>
                              {name}
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {otherRegisteredCompanies.length > 0 && (
                        <optgroup label={`🌐 Other Registered Company Accounts (${otherRegisteredCompanies.length})`}>
                          {otherRegisteredCompanies.map(name => (
                            <option key={`other-${name}`} value={name}>
                              {name}
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {otherMasterContactOrgs.length > 0 && (
                        <optgroup label={`📋 Organizations from Master Contacts (${otherMasterContactOrgs.length})`}>
                          {otherMasterContactOrgs.map(name => (
                            <option key={`morg-${name}`} value={name}>
                              {name}
                            </option>
                          ))}
                        </optgroup>
                      )}

                      <option value="__CUSTOM__">➕ Enter New / Unlisted Organization...</option>
                    </select>
                  ) : (
                    <div className="space-y-1">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Unilever Bangladesh Limited, Robi Axiata..."
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full rounded-lg border border-[#1F3A2E] bg-[#FBF9F4] p-2.5 text-xs text-[#1A1A1A] font-bold focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                      />
                      <div className="text-[10px] text-[#6B7269]">
                        Custom organization mode. Click &ldquo;Choose from list&rdquo; to pick from listed accounts.
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Person Name Dropdown */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-extrabold text-[#1F3A2E]">
                      Contact Person Name
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomContact(!isCustomContact)}
                      className="text-[10.5px] text-[#8C6D2D] hover:underline font-bold"
                    >
                      {isCustomContact ? 'Choose from list' : '+ Enter custom'}
                    </button>
                  </div>

                  {!isCustomContact && contactsForSelectedOrg.length > 0 ? (
                    <select
                      value={contactsForSelectedOrg.find(c => formData.contactPerson.startsWith(c.name))?.name || ''}
                      onChange={handleSelectContactPerson}
                      className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2.5 text-xs text-[#1A1A1A] font-semibold focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                    >
                      <option value="">
                        -- Select Contact ({contactsForSelectedOrg.length} listed for {formData.customerName || 'org'}) --
                      </option>
                      {contactsForSelectedOrg.map((cnt) => (
                        <option key={cnt.id} value={cnt.name}>
                          {cnt.name} {cnt.designation ? `(${cnt.designation})` : ''} - {cnt.phone}
                        </option>
                      ))}
                      <option value="__CUSTOM__">➕ Enter Other Contact Person...</option>
                    </select>
                  ) : (
                    <div className="space-y-1">
                      <input
                        type="text"
                        placeholder="e.g. Sajjad Hossain (Head of Media)"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                      />
                      {contactsForSelectedOrg.length > 0 ? (
                        <div className="text-[10px] text-[#4338CA]">
                          💡 {contactsForSelectedOrg.length} contacts found for {formData.customerName}. Click &ldquo;Choose from list&rdquo; to pick.
                        </div>
                      ) : (
                        <div className="text-[10px] text-[#6B7269]">
                          No pre-listed contacts for this organization. You can type the contact person directly.
                        </div>
                      )}
                    </div>
                  )}
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

              {/* Agreed Personal Commission % (Mandatory for My Projects) */}
              <div className="rounded-xl border-2 border-[#C8A96A] bg-[#FBF9F4] p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-black text-[#1F3A2E] text-xs uppercase tracking-wide">
                    My Agreed Commission Rate (%) *
                  </label>
                  <span className="text-[10px] text-[#8C6D2D] font-bold">
                    Per-Project Negotiated Payout
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-32">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      required
                      value={formData.commissionRate}
                      onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                      className="w-full rounded-lg border border-[#C8A96A] bg-white p-2 text-xs font-mono font-black text-[#8C6D2D] text-center focus:outline-none focus:ring-2 focus:ring-[#C8A96A]"
                    />
                  </div>

                  {/* Preset Quick Click Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 flex-1">
                    {[5, 8, 10, 12, 15, 20, 25].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setFormData({ ...formData, commissionRate: rate })}
                        className={`px-2 py-1 rounded text-xs font-bold border transition-all ${
                          formData.commissionRate === rate
                            ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow-xs'
                            : 'bg-white border-[#DDE3DD] text-[#6B7269] hover:border-[#C8A96A] hover:text-[#1F3A2E]'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Extra Direct Contractual Payment from Customer */}
                <div className="pt-2 border-t border-[#C8A96A]/30">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-black text-[#1F3A2E] text-xs">
                      Extra Direct Contractual Payment from Customer (Optional)
                    </label>
                    <span className="text-[10px] text-[#166534] font-bold">
                      Direct Retainer / Advisory Fee
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={formData.directCustomerFee}
                      onChange={(e) => setFormData({ ...formData, directCustomerFee: Number(e.target.value) })}
                      placeholder="e.g. 50000"
                      className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 pr-12 text-xs font-mono font-bold text-[#166534] focus:outline-none focus:ring-1 focus:ring-[#166534]"
                    />
                    <span className="absolute right-3 top-2 text-[#6B7269] font-mono text-xs">
                      {formData.currency}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#6B7269] mt-0.5">
                    Contracted fee or retainer paid directly by Customer to Syed Akramul Hassan (separate from entity commission).
                  </p>
                </div>

                {/* Combined Total Personal Yield Box */}
                <div className="rounded-lg bg-gradient-to-r from-[#FBF9F4] to-white border-2 border-[#C8A96A] p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#8C6D2D] font-extrabold text-[11px] uppercase tracking-wide">
                      My Total Realizable Project Yield:
                    </span>
                    <div className="font-mono font-black text-base text-[#1F3A2E] mt-0.5">
                      {formData.currency === 'USD' ? '$' : '৳'}
                      {(
                        Math.round((Number(formData.estimatedValue) || 0) * ((Number(formData.commissionRate) || 0) / 100)) +
                        (Number(formData.directCustomerFee) || 0)
                      ).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-[10px] text-right text-[#6B7269] space-y-0.5">
                    <div>Entity Commission: <strong className="text-[#8C6D2D]">{formData.currency === 'USD' ? '$' : '৳'}{Math.round((Number(formData.estimatedValue) || 0) * ((Number(formData.commissionRate) || 0) / 100)).toLocaleString()}</strong></div>
                    {(Number(formData.directCustomerFee) || 0) > 0 && (
                      <div>Direct Cust Fee: <strong className="text-[#166534]">+{formData.currency === 'USD' ? '$' : '৳'}{(Number(formData.directCustomerFee) || 0).toLocaleString()}</strong></div>
                    )}
                  </div>
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
      {/* =================================================================== */}
      {/* BIZMAN CRM MODAL 1: ADD CONTACT PERSON TO CORPORATE LEAD */}
      {/* =================================================================== */}
      {isAddContactModalOpen && selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border-2 border-[#1F3A2E] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#EEF2FF] text-[#4338CA] flex items-center justify-center font-bold">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1F3A2E] text-base">Add Contact Person</h3>
                  <div className="text-xs text-[#6B7269]">
                    To Lead Account: <strong className="text-[#1A1A1A]">{selectedCompany.companyName}</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddContactModalOpen(false)}
                className="rounded-lg p-1 text-[#888] hover:bg-[#F4F6F4] hover:text-[#1A1A1A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddContactToCompany} className="space-y-3.5 text-xs">
              {/* Full Name & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanveer Ahmed"
                    value={contactFormData.name}
                    onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Designation / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Commercial Brand Director"
                    value={contactFormData.designation}
                    onChange={(e) => setContactFormData({ ...contactFormData, designation: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
              </div>

              {/* Department & Role Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Media Planning / Procurement"
                    value={contactFormData.department}
                    onChange={(e) => setContactFormData({ ...contactFormData, department: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Role Type (Bizman CRM)</label>
                  <select
                    value={contactFormData.roleType}
                    onChange={(e) => setContactFormData({ ...contactFormData, roleType: e.target.value as ContactRoleType })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] font-bold focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  >
                    <option value="PRIMARY_DECISION_MAKER">Primary Decision Maker</option>
                    <option value="PROCUREMENT">Procurement / RFP Officer</option>
                    <option value="MEDIA_BUYER">Media Buyer / Brand Planner</option>
                    <option value="FINANCE_ACCOUNTS">Finance & Accounts / Billing</option>
                    <option value="OPERATIONS">Operations & Sourcing</option>
                    <option value="GENERAL">General Liaison</option>
                  </select>
                </div>
              </div>

              {/* Phone, PABX & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Direct Mobile *</label>
                  <input
                    type="text"
                    required
                    placeholder="+8801711..."
                    value={contactFormData.phone}
                    onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] font-mono focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">PABX / Ext</label>
                  <input
                    type="text"
                    placeholder="ext 341"
                    value={contactFormData.pabxPhone}
                    onChange={(e) => setContactFormData({ ...contactFormData, pabxPhone: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] font-mono focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="contact@client.com"
                    value={contactFormData.email}
                    onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
              </div>

              {/* WhatsApp Number & Primary Checkbox */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">WhatsApp Number (Digits only)</label>
                  <input
                    type="text"
                    placeholder="8801711000000"
                    value={contactFormData.whatsapp}
                    onChange={(e) => setContactFormData({ ...contactFormData, whatsapp: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] font-mono focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="isPrimaryContact"
                    checked={contactFormData.isPrimary}
                    onChange={(e) => setContactFormData({ ...contactFormData, isPrimary: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-[#1F3A2E] focus:ring-[#1F3A2E]"
                  />
                  <label htmlFor="isPrimaryContact" className="font-extrabold text-[#1F3A2E] cursor-pointer">
                    Set as Primary Account Liaison
                  </label>
                </div>
              </div>

              {/* Contact Notes */}
              <div>
                <label className="block font-extrabold text-[#1F3A2E] mb-1">Liaison Notes / Direct Line Info</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Prefers WhatsApp messaging before 11 AM; approves screen locations."
                  value={contactFormData.notes}
                  onChange={(e) => setContactFormData({ ...contactFormData, notes: e.target.value })}
                  className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DDE3DD]">
                <button
                  type="button"
                  onClick={() => setIsAddContactModalOpen(false)}
                  className="rounded-lg border border-[#DDE3DD] bg-white px-4 py-2 text-xs font-bold text-[#556055] hover:bg-[#F4F6F4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-[#4338CA] hover:bg-[#3730A3] text-white px-5 py-2 text-xs font-bold shadow-sm transition-all"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Contact Person</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* BIZMAN CRM MODAL 2: ADD PARALLEL PROJECT UNDER CORPORATE LEAD */}
      {/* =================================================================== */}
      {isAddProjectModalOpen && selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-2xl border-2 border-[#1F3A2E] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#1F3A2E] text-[#C8A96A] flex items-center justify-center font-bold">
                  <FolderPlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1F3A2E] text-base">New Parallel Project / Campaign</h3>
                  <div className="text-xs text-[#6B7269]">
                    Under Lead Account: <strong className="text-[#1F5FA8]">{selectedCompany.companyName}</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddProjectModalOpen(false)}
                className="rounded-lg p-1 text-[#888] hover:bg-[#F4F6F4] hover:text-[#1A1A1A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddProjectToCompany} className="space-y-3.5 text-xs">
              {/* Project Title */}
              <div>
                <label className="block font-extrabold text-[#1F3A2E] mb-1">Project / Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5G Network Rollout 15 Mega Screens"
                  value={projectFormData.title}
                  onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                  className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2.5 text-xs text-[#1A1A1A] font-bold focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                />
              </div>

              {/* Dedicated Project Contact Person (Dropdown from Company Roster) */}
              <div>
                <label className="block font-extrabold text-[#1F3A2E] mb-1">
                  Dedicated Contact Person for this Project *
                </label>
                <select
                  value={projectFormData.contactPersonId}
                  onChange={(e) => setProjectFormData({ ...projectFormData, contactPersonId: e.target.value })}
                  className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2.5 text-xs text-[#1A1A1A] font-bold focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                >
                  <option value="">Select from {selectedCompany.companyName} Contact Roster...</option>
                  {selectedCompany.contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} &bull; {c.designation} ({c.phone})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#6B7269] mt-0.5">
                  Bizman Model: Each parallel project has its own dedicated contact manager from this corporate account.
                </p>
              </div>

              {/* Pipeline Type & Target Close Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Pipeline / Deal Type</label>
                  <input
                    type="text"
                    value={projectFormData.pipelineType}
                    onChange={(e) => setProjectFormData({ ...projectFormData, pipelineType: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Target Close Date</label>
                  <input
                    type="date"
                    value={projectFormData.expectedCloseDate}
                    onChange={(e) => setProjectFormData({ ...projectFormData, expectedCloseDate: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] font-mono focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
              </div>

              {/* Contract Valuation & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Contract Valuation *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={projectFormData.estimatedValue}
                    onChange={(e) => setProjectFormData({ ...projectFormData, estimatedValue: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs font-mono font-bold text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Currency</label>
                  <select
                    value={projectFormData.currency}
                    onChange={(e) => setProjectFormData({ ...projectFormData, currency: e.target.value as 'USD' | 'BDT' })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs font-mono font-bold text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  >
                    <option value="BDT">BDT (৳) - Bizman / Linda Resort</option>
                    <option value="USD">USD ($) - ArielMC Global Export</option>
                  </select>
                </div>
              </div>

              {/* Commission Rate (%) & Direct Customer Fee */}
              <div className="rounded-xl border-2 border-[#C8A96A] bg-[#FBF9F4] p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-black text-[#1F3A2E] text-xs uppercase tracking-wide">
                    My Agreed Commission Rate (%) *
                  </label>
                  <span className="text-[10px] text-[#8C6D2D] font-bold">
                    Paid by {selectedCompany.companyCode}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-28">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      required
                      value={projectFormData.commissionRate}
                      onChange={(e) => setProjectFormData({ ...projectFormData, commissionRate: Number(e.target.value) })}
                      className="w-full rounded-lg border border-[#C8A96A] bg-white p-2 text-xs font-mono font-black text-[#8C6D2D] text-center focus:outline-none focus:ring-2 focus:ring-[#C8A96A]"
                    />
                  </div>

                  {/* Preset Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 flex-1">
                    {[5, 8, 10, 12, 15, 20, 25].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setProjectFormData({ ...projectFormData, commissionRate: rate })}
                        className={`px-2 py-1 rounded text-xs font-bold border transition-all ${
                          projectFormData.commissionRate === rate
                            ? 'bg-[#1F3A2E] text-[#C8A96A] border-[#1F3A2E] shadow-xs'
                            : 'bg-white border-[#DDE3DD] text-[#6B7269] hover:border-[#C8A96A] hover:text-[#1F3A2E]'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct Customer Contractual Fee */}
                <div className="pt-2 border-t border-[#C8A96A]/30">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-black text-[#1F3A2E] text-xs">
                      Extra Direct Contractual Payment from Customer (Optional)
                    </label>
                    <span className="text-[10px] text-[#166534] font-bold">
                      Direct Retainer / Advisory
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={projectFormData.directCustomerFee}
                      onChange={(e) => setProjectFormData({ ...projectFormData, directCustomerFee: Number(e.target.value) })}
                      placeholder="e.g. 50000"
                      className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 pr-12 text-xs font-mono font-bold text-[#166534] focus:outline-none focus:ring-1 focus:ring-[#166534]"
                    />
                    <span className="absolute right-3 top-2 text-[#6B7269] font-mono text-xs">
                      {projectFormData.currency}
                    </span>
                  </div>
                </div>

                {/* Real-time Project Yield Strip */}
                <div className="rounded-lg bg-gradient-to-r from-[#FBF9F4] to-white border-2 border-[#C8A96A] p-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#8C6D2D] font-extrabold text-[10.5px] uppercase">
                      My Total Realizable Yield for this Project:
                    </span>
                    <div className="font-mono font-black text-sm text-[#1F3A2E] mt-0.5">
                      {projectFormData.currency === 'USD' ? '$' : '৳'}
                      {(
                        Math.round((Number(projectFormData.estimatedValue) || 0) * ((Number(projectFormData.commissionRate) || 0) / 100)) +
                        (Number(projectFormData.directCustomerFee) || 0)
                      ).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-[10px] text-right text-[#6B7269]">
                    <div>Entity Comm: <strong className="text-[#8C6D2D]">{projectFormData.currency === 'USD' ? '$' : '৳'}{Math.round((Number(projectFormData.estimatedValue) || 0) * ((Number(projectFormData.commissionRate) || 0) / 100)).toLocaleString()}</strong></div>
                    {(Number(projectFormData.directCustomerFee) || 0) > 0 && (
                      <div>Direct Cust Fee: <strong className="text-[#166534]">+{projectFormData.currency === 'USD' ? '$' : '৳'}{(Number(projectFormData.directCustomerFee) || 0).toLocaleString()}</strong></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Initial Notes */}
              <div>
                <label className="block font-extrabold text-[#1F3A2E] mb-1">Project Notes / Deliverables</label>
                <textarea
                  rows={2}
                  placeholder="Enter screen counts, activation dates, or contract specifications..."
                  value={projectFormData.notepadMarkdown}
                  onChange={(e) => setProjectFormData({ ...projectFormData, notepadMarkdown: e.target.value })}
                  className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DDE3DD]">
                <button
                  type="button"
                  onClick={() => setIsAddProjectModalOpen(false)}
                  className="rounded-lg border border-[#DDE3DD] bg-white px-4 py-2 text-xs font-bold text-[#556055] hover:bg-[#F4F6F4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] px-5 py-2 text-xs font-bold border border-[#1F3A2E] shadow-sm transition-all"
                >
                  <Check className="h-4 w-4" />
                  <span>Launch Parallel Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: LIST NEW COMPANY ACCOUNT (CUSTOMER, VENDOR, SUPPLIER, BUYER) */}
      {/* Allows listing companies without upfront campaign or contact person */}
      {/* =================================================================== */}
      {isCreateCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border-2 border-[#1F3A2E] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#1F3A2E] text-[#C8A96A] flex items-center justify-center font-bold shadow-xs">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1F3A2E]">List New Corporate / Company Account</h3>
                  <p className="text-xs text-[#6B7269]">
                    Register a client brand, customer, supplier, or buyer. Campaigns and contacts can be linked step-by-step later.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateCompanyModalOpen(false)}
                className="rounded-lg p-1 text-[#6B7269] hover:bg-[#F4F6F4] hover:text-[#1A1A1A] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Zero-Pressure Clarification Banner */}
            <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] p-3 text-xs text-[#166534] flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-[#166534] shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold">Clean Listing (No Campaign or Contact Required Upfront)</strong>
                <p className="text-[11px] text-[#166534]/90 mt-0.5">
                  You can register enterprise customers (e.g. Grameenphone, Robi, Unilever), media partners, vendors, or international buyers immediately. Contact persons and parallel deals can be added progressively as negotiations develop.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-4 text-xs">
              {/* Company Name */}
              <div>
                <label className="block font-black text-[#1F3A2E] mb-1">
                  Company / Organization Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grameenphone Ltd., Robi Axiata, Unilever Bangladesh, Apex Tannery..."
                  value={newCompanyData.companyName}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, companyName: e.target.value })}
                  className="w-full rounded-lg border border-[#DDE3DD] bg-white px-3 py-2 text-xs text-[#1A1A1A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1F3A2E]"
                />
              </div>

              {/* Operating Entity & Client Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Operating Business Entity</label>
                  <select
                    value={newCompanyData.companyCode}
                    onChange={(e) => setNewCompanyData({ ...newCompanyData, companyCode: e.target.value as any })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  >
                    <option value="BIZMAN">Bizman Media (DOOH, Media & Advertising)</option>
                    <option value="ARIELMC">ArielMC (Global Export, Jute, Commodities)</option>
                    <option value="LINDA">Linda Resort Limited (Eco-Resort & Events)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Account Category / Role</label>
                  <select
                    value={newCompanyData.clientType}
                    onChange={(e) => setNewCompanyData({ ...newCompanyData, clientType: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  >
                    <option value="Direct Brand">Direct Brand (e.g. Grameenphone, Robi, Unilever)</option>
                    <option value="Corporate Client">Corporate Client</option>
                    <option value="Media Agency">Media Agency (e.g. Wavemaker, Asiatic, Mediacom)</option>
                    <option value="Vendor / Supplier">Vendor / Screen Partner / Supplier</option>
                    <option value="Raw Material Supplier">Raw Material Supplier (Jute, Leather, Steel)</option>
                    <option value="International Buyer">International Buyer (Export Buyer)</option>
                    <option value="Government / Institutional">Government / Institutional</option>
                  </select>
                </div>
              </div>

              {/* Industry & Priority Temperature */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Industry / Sector</label>
                  <input
                    type="text"
                    list="company-industry-suggestions"
                    placeholder="e.g. Telecommunications, FMCG, Banking..."
                    value={newCompanyData.industry}
                    onChange={(e) => setNewCompanyData({ ...newCompanyData, industry: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                  <datalist id="company-industry-suggestions">
                    <option value="Telecommunications" />
                    <option value="FMCG & Consumer Goods" />
                    <option value="Banking & Financial Services" />
                    <option value="Ready-Made Garments & Textiles" />
                    <option value="Real Estate & Construction" />
                    <option value="Pharmaceuticals & Healthcare" />
                    <option value="E-commerce & Digital" />
                    <option value="Food & Beverage" />
                    <option value="Jute & Biodegradable Products" />
                    <option value="Leather & Tannery" />
                    <option value="Hospitality & Tourism" />
                    <option value="Government & Semi-Government" />
                  </datalist>
                </div>

                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Priority Level / Lead Heat</label>
                  <select
                    value={newCompanyData.priorityTemp}
                    onChange={(e) => setNewCompanyData({ ...newCompanyData, priorityTemp: e.target.value as any })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  >
                    <option value="HOT">🔥 HOT (Immediate discussions / High priority)</option>
                    <option value="WARM">☀️ WARM (Active relationship / Recurring)</option>
                    <option value="COLD">❄️ COLD (Target prospect / Listed vendor)</option>
                  </select>
                </div>
              </div>

              {/* Geographic Coordinates & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Country</label>
                  <input
                    type="text"
                    placeholder="Bangladesh"
                    value={newCompanyData.country}
                    onChange={(e) => setNewCompanyData({ ...newCompanyData, country: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">City / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Dhaka, Chittagong, London..."
                    value={newCompanyData.city}
                    onChange={(e) => setNewCompanyData({ ...newCompanyData, city: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-[#1F3A2E] mb-1">Corporate Website</label>
                  <input
                    type="text"
                    placeholder="e.g. grameenphone.com"
                    value={newCompanyData.website}
                    onChange={(e) => setNewCompanyData({ ...newCompanyData, website: e.target.value })}
                    className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
              </div>

              {/* Corporate Address */}
              <div>
                <label className="block font-extrabold text-[#1F3A2E] mb-1">Headquarters / Physical Address (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. GP House, Bashundhara R/A, Dhaka-1229 or Gulshan-1, Dhaka"
                  value={newCompanyData.address}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, address: e.target.value })}
                  className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                />
              </div>

              {/* Optional Initial Contact Toggle */}
              <div className="pt-2 border-t border-[#DDE3DD]">
                <button
                  type="button"
                  onClick={() => setShowOptionalContactInCompanyModal(!showOptionalContactInCompanyModal)}
                  className="flex items-center gap-2 text-xs font-bold text-[#1F3A2E] hover:underline"
                >
                  <UserPlus className="h-3.5 w-3.5 text-[#C8A96A]" />
                  <span>
                    {showOptionalContactInCompanyModal ? 'Hide Initial Contact Person Form' : '+ Add an initial contact person now? (Optional)'}
                  </span>
                </button>

                {showOptionalContactInCompanyModal && (
                  <div className="mt-3 p-3.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-3">
                    <div className="text-[11px] font-bold text-[#6B7269]">
                      Key Contact Details (Can also be added later anytime):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-[#1A1A1A] mb-1">Contact Person Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Sajjad Hossain / Head of Marketing"
                          value={newCompanyData.initialContactName}
                          onChange={(e) => setNewCompanyData({ ...newCompanyData, initialContactName: e.target.value })}
                          className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#1A1A1A] mb-1">Designation</label>
                        <input
                          type="text"
                          placeholder="e.g. Head of Media / Procurement Manager"
                          value={newCompanyData.initialContactDesignation}
                          onChange={(e) => setNewCompanyData({ ...newCompanyData, initialContactDesignation: e.target.value })}
                          className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#1A1A1A] mb-1">Direct Phone / Mobile</label>
                        <input
                          type="text"
                          placeholder="+880 1711..."
                          value={newCompanyData.initialContactPhone}
                          onChange={(e) => setNewCompanyData({ ...newCompanyData, initialContactPhone: e.target.value })}
                          className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#1A1A1A] mb-1">Email Address</label>
                        <input
                          type="email"
                          placeholder="contact@company.com"
                          value={newCompanyData.initialContactEmail}
                          onChange={(e) => setNewCompanyData({ ...newCompanyData, initialContactEmail: e.target.value })}
                          className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Notes */}
              <div>
                <label className="block font-extrabold text-[#1F3A2E] mb-1">Account Intelligence / Executive Notes</label>
                <textarea
                  rows={2}
                  placeholder="Record strategic context, brand agency affiliations, preferred screen locations, or business notes..."
                  value={newCompanyData.notes}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, notes: e.target.value })}
                  className="w-full rounded-lg border border-[#DDE3DD] bg-white p-2 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DDE3DD]">
                <button
                  type="button"
                  onClick={() => setIsCreateCompanyModalOpen(false)}
                  className="rounded-lg border border-[#DDE3DD] bg-white px-4 py-2 text-xs font-bold text-[#556055] hover:bg-[#F4F6F4] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] px-5 py-2 text-xs font-black border border-[#1F3A2E] shadow-sm transition-all"
                >
                  <Building2 className="h-4 w-4" />
                  <span>List Company Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
