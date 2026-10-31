import { NextResponse, NextRequest } from 'next/server';
import { INITIAL_LEADS } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Strict Entity Lock: This endpoint is cryptographically and logically locked to ARIELMC
const STRICT_COMPANY_CODE = 'ARIELMC';
const SYNC_SECRET = process.env.ARIELMC_SYNC_SECRET || 'arielmc-sovereign-sync-key-2026';
const ERP_WEBHOOK_URL = process.env.ARIELMC_ERP_SYNC_URL || 'https://erp.arielmc.com/api/crm/sync';

// In-memory sync store (backed by initial ArielMC leads, updated at runtime)
let arielmcLiveLeads = INITIAL_LEADS.filter((l) => l.companyCode === STRICT_COMPANY_CODE);

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('x-arielmc-sync-key') || request.headers.get('authorization');
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '').trim();
  return token === SYNC_SECRET;
}

/**
 * GET /api/sync/arielmc
 * Strictly fetches ArielMC leads & buyer deals.
 * HARD ISOLATION: Bizman Media, Linda Resort, and Personal Finance are physically filtered out.
 */
export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Invalid or missing x-arielmc-sync-key' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    entity: STRICT_COMPANY_CODE,
    isolationGuard: 'STRICT_ACTIVE',
    count: arielmcLiveLeads.length,
    data: arielmcLiveLeads,
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST /api/sync/arielmc
 * Bi-directional sync hook between Master CRM and ArielMC ERP.
 * Strictly accepts and processes records with company_id = 'ARIELMC'.
 */
export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Invalid or missing x-arielmc-sync-key' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { action, payload, id, forwardToErp } = body;

    // 1. Strict Entity Security Verification
    if (payload) {
      const requestedCompany = payload.companyCode || payload.company_id || payload.companyAffiliation;
      if (requestedCompany && requestedCompany !== STRICT_COMPANY_CODE) {
        return NextResponse.json(
          {
            success: false,
            error: `Security Violation: This sync hook only processes entity '${STRICT_COMPANY_CODE}'. Access to '${requestedCompany}' is strictly prohibited.`,
          },
          { status: 403 }
        );
      }
      // Force entity tagging
      payload.companyCode = STRICT_COMPANY_CODE;
      payload.companyAffiliation = STRICT_COMPANY_CODE;
    }

    // 2. Perform Synced CRUD
    switch (action) {
      case 'UPSERT_LEAD': {
        if (!payload || !payload.id) {
          return NextResponse.json({ success: false, error: 'Lead payload with ID required' }, { status: 400 });
        }

        const existingIdx = arielmcLiveLeads.findIndex((l) => l.id === payload.id);
        if (existingIdx >= 0) {
          arielmcLiveLeads[existingIdx] = {
            ...arielmcLiveLeads[existingIdx],
            ...payload,
            companyCode: STRICT_COMPANY_CODE,
            updatedAt: new Date().toISOString(),
          };
        } else {
          arielmcLiveLeads.unshift({
            ...payload,
            companyCode: STRICT_COMPANY_CODE,
            createdAt: payload.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }

        // Forward to ERP if initiated from Master CRM
        if (forwardToErp && ERP_WEBHOOK_URL) {
          try {
            await fetch(ERP_WEBHOOK_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-arielmc-sync-key': SYNC_SECRET,
              },
              body: JSON.stringify({
                action: 'UPSERT_LEAD',
                company_id: STRICT_COMPANY_CODE,
                payload,
              }),
            });
          } catch (erpErr) {
            console.warn('ERP webhook relay warning (non-blocking):', erpErr);
          }
        }

        return NextResponse.json({
          success: true,
          action,
          entity: STRICT_COMPANY_CODE,
          leadId: payload.id,
          totalArielLeads: arielmcLiveLeads.length,
        });
      }

      case 'DELETE_LEAD': {
        const leadId = id || payload?.id;
        if (!leadId) {
          return NextResponse.json({ success: false, error: 'Lead ID required' }, { status: 400 });
        }

        arielmcLiveLeads = arielmcLiveLeads.filter((l) => l.id !== leadId);

        if (forwardToErp && ERP_WEBHOOK_URL) {
          try {
            await fetch(ERP_WEBHOOK_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-arielmc-sync-key': SYNC_SECRET,
              },
              body: JSON.stringify({
                action: 'DELETE_LEAD',
                company_id: STRICT_COMPANY_CODE,
                id: leadId,
              }),
            });
          } catch (erpErr) {
            console.warn('ERP webhook delete warning:', erpErr);
          }
        }

        return NextResponse.json({
          success: true,
          action,
          entity: STRICT_COMPANY_CODE,
          deletedId: leadId,
          totalArielLeads: arielmcLiveLeads.length,
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unsupported sync action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal sync failure' },
      { status: 500 }
    );
  }
}
