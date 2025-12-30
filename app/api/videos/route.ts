import { NextResponse } from 'next/server';
import { getAllVideos } from '@/lib/db';

export async function GET() {
  try {
    const videos = getAllVideos();
    return NextResponse.json({ success: true, videos });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
