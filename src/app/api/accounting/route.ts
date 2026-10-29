import { NextResponse } from 'next/server';
import { generatePLStatement, generateBalanceSheet, validateJournalEntry } from '@/lib/accounting-engine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const company = (searchParams.get('company') || 'BIZMAN') as 'BIZMAN' | 'LINDA' | 'ARIELMC';
  const type = searchParams.get('type') || 'PL';

  if (type === 'BALANCE_SHEET') {
    const report = generateBalanceSheet(company);
    return NextResponse.json({ success: true, data: report });
  }

  const report = generatePLStatement(company);
  return NextResponse.json({ success: true, data: report });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lines } = body;

    const validation = validateJournalEntry(lines || []);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: `Double-entry violation: Debits (${validation.totalDebit}) do not equal Credits (${validation.totalCredit}). Difference: ${validation.diff}`,
      }, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      message: 'Journal entry verified & posted successfully',
      audit: validation,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

