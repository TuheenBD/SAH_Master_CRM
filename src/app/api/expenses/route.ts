import { NextResponse } from 'next/server';
import { INITIAL_EXPENSES } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get('company');

  let result = INITIAL_EXPENSES;
  if (company && company !== 'CONSOLIDATED') {
    result = INITIAL_EXPENSES.filter(e => e.companyCode === company);
  }

  return NextResponse.json({ success: true, count: result.length, data: result });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validate required fields
    if (!body.amount || !body.description || !body.companyCode) {
      return NextResponse.json({ success: false, error: 'Missing required expense fields' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Expense recorded and automatically posted to General Ledger',
      journalEntryCreated: true,
      data: body,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

