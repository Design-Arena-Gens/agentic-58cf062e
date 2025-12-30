import { NextResponse } from 'next/server';
import { processScheduledVideos } from '@/lib/scheduler';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
  try {
    console.log('Cron job triggered');
    await processScheduledVideos();
    return NextResponse.json({ success: true, message: 'Processed scheduled videos' });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
