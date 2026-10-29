import { NextResponse } from 'next/server';
import { INITIAL_LEADS } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get('company');

  let result = INITIAL_LEADS;
  if (company && company !== 'CONSOLIDATED') {
    result = INITIAL_LEADS.filter(l => l.companyCode === company);
  }

  return NextResponse.json({ success: true, count: result.length, data: result });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, message: 'Lead created successfully', data: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

