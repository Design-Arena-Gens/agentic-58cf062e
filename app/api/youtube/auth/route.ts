import { NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/youtube';

export async function GET() {
  try {
    const authUrl = getAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
