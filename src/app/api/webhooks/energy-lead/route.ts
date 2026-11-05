import { NextResponse, NextRequest } from 'next/server';
import { INITIAL_LEADS } from '@/lib/mock-data';
import { LeadItem } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ERP_SYNC_URL = process.env.ARIELMC_ERP_SYNC_URL || 'http://127.0.0.1:3001/api/crm/sync';
const SYNC_SECRET = process.env.ARIELMC_SYNC_SECRET || 'arielmc-sovereign-sync-key-2026';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const companyName = body.companyName || body.customerName || 'Industrial Prospect';
    const contactName = body.contactName || body.contactPerson || 'Managing Director';
    const phone = body.phone || '';
    const email = body.email || '';
    const location = body.location || 'Dhaka / Gazipur Corridor';
    const roofType = body.roofType || 'Corrugated Metal Shed';
    const roofAreaSqFt = Number(body.roofAreaSqFt) || 36500;
    const monthlyBillBdt = Number(body.monthlyBillBdt) || 1200000;
    const capacityKwp = Number(body.capacityKwp) || Math.round(roofAreaSqFt / 78);
    const estimatedValue = Number(body.estimatedValue) || capacityKwp * 49000;

    const leadId = `LEAD-NRG-${Date.now().toString().slice(-6)}`;

    const newLead: LeadItem = {
      id: leadId,
      companyCode: 'ARIEL_ENERGY',
      title: `${companyName} — ${capacityKwp} kWp Turnkey Solar EPC Audit`,
      customerName: companyName,
      contactPerson: contactName,
      phone,
      whatsapp: phone,
      email,
      country: 'Bangladesh',
      pipelineType: 'C&I Factory Rooftop Solar EPC (SREDA Net-Metering)',
      stage: 'NEW_INQUIRY',
      estimatedValue,
      currency: 'BDT',
      probability: 35,
      expectedCloseDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      commissionRate: 5,
      commissionAmount: estimatedValue * 0.05,
      customerPaymentStatus: 'PENDING',
      entityPayoutStatus: 'AWAITING_CUSTOMER_PAYMENT',
      createdAt: new Date().toISOString(),
      notepadMarkdown: `### Inbound Solar Feasibility Audit Request\n- **Client:** ${companyName}\n- **Executive Contact:** ${contactName} (${body.designation || 'Director'})\n- **Phone / WhatsApp:** ${phone}\n- **Email:** ${email}\n- **Site Location:** ${location}\n- **Roof Profile:** ${roofType} (~${roofAreaSqFt.toLocaleString()} sq ft)\n- **Connected Monthly Bill:** Tk ${monthlyBillBdt.toLocaleString()} BDT\n- **Estimated Solar Capacity:** **${capacityKwp} kWp** (~Tk ${(estimatedValue / 10000000).toFixed(2)} Crore Turnkey EPC)\n- **SREDA Net-Metering Estimate:** ~${Math.round(capacityKwp * 130).toLocaleString()} kWh/month clean daylight generation\n- **Refinancing:** Eligible for 80% Bangladesh Bank 4.5% Green Refinance Scheme.`,
      specifics: {
        roofAreaSqFt,
        monthlyBillBdt,
        capacityKwp,
        annualSavingsBdt: body.annualSavingsBdt || Math.round(capacityKwp * 130 * 12 * 8.5),
        location,
        roofType,
        source: 'energy.arielmc.com / Web Feasibility Audit Modal',
      },
    };

    // 1. Save to Master-CRM active leads
    INITIAL_LEADS.unshift(newLead);

    // 2. Dispatch real-time ERP sync webhook (ERP is the Heart of ArielMC!)
    let erpSyncStatus = 'PENDING';
    let erpSyncMessage = '';
    try {
      const erpRes = await fetch(ERP_SYNC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-arielmc-sync-key': SYNC_SECRET,
        },
        body: JSON.stringify({
          action: 'UPSERT_LEAD',
          company_id: 'ARIEL_ENERGY',
          payload: {
            id: newLead.id,
            company: newLead.customerName,
            contact: newLead.contactPerson,
            phone: newLead.phone,
            email: newLead.email,
            stage: newLead.stage,
            capacityKwp,
            roofAreaSqFt,
            monthlyBillBdt,
            estimatedValueBdt: newLead.estimatedValue,
            companyCode: 'ARIEL_ENERGY',
            source: 'Master-CRM Webhook',
          },
        }),
      });

      if (erpRes.ok) {
        const erpData = await erpRes.json();
        erpSyncStatus = 'SUCCESS';
        erpSyncMessage = erpData.message || 'Synchronized with ArielMC-ERP';
      } else {
        erpSyncStatus = 'ERP_REJECTED';
        erpSyncMessage = `HTTP ${erpRes.status}`;
      }
    } catch (erpErr: any) {
      erpSyncStatus = 'ERP_NETWORK_FAIL';
      erpSyncMessage = erpErr.message || 'ERP connection error';
    }

    return NextResponse.json({
      success: true,
      leadId: newLead.id,
      entity: 'ARIEL_ENERGY',
      message: 'Solar audit lead captured into Master-CRM and synchronized with ArielMC-ERP',
      lead: newLead,
      erpSync: {
        status: erpSyncStatus,
        message: erpSyncMessage,
      },
    });
  } catch (error: any) {
    console.error('Failed to process energy lead webhook:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal webhook error' },
      { status: 500 }
    );
  }
}

