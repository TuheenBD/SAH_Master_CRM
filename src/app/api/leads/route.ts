import { NextResponse, NextRequest } from 'next/server';
import { INITIAL_LEADS } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get('company');

  let result = INITIAL_LEADS;
  if (company && company !== 'CONSOLIDATED') {
    result = INITIAL_LEADS.filter(l => l.companyCode === company);
  }

  return NextResponse.json({ success: true, count: result.length, data: result });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // If it's an Ariel Energy lead or audit request, route through energy webhook logic
    if (body.companyCode === 'ARIEL_ENERGY' || body.capacityKwp || body.roofAreaSqFt) {
      const webhookUrl = new URL('/api/webhooks/energy-lead', request.url);
      const res = await fetch(webhookUrl.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    // Default lead creation
    if (body.id) {
      INITIAL_LEADS.unshift(body);
    }
    return NextResponse.json({ success: true, message: 'Lead created successfully', data: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
