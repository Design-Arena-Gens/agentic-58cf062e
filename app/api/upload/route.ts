import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { addVideo } from '@/lib/db';
import { generateVideoMetadata } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const scheduledTime = formData.get('scheduled_time') as string;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!scheduledTime) {
      return NextResponse.json({ success: false, error: 'No scheduled time provided' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'data', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    const metadata = await generateVideoMetadata(file.name);

    const videoId = addVideo({
      filename: file.name,
      filepath,
      scheduled_time: new Date(scheduledTime).toISOString(),
      status: 'pending',
      title: metadata.title,
      description: metadata.description,
    });

    return NextResponse.json({
      success: true,
      videoId,
      message: 'Video scheduled successfully',
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
