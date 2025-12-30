import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/youtube';

export async function GET() {
  try {
    const authenticated = isAuthenticated();
    return NextResponse.json({ success: true, authenticated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
