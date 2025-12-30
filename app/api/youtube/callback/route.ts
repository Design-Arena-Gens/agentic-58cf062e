import { NextRequest, NextResponse } from 'next/server';
import { getOAuthClient } from '@/lib/youtube';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'No authorization code provided' },
        { status: 400 }
      );
    }

    const oauth2Client = getOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);

    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const tokensPath = path.join(dataDir, 'youtube-tokens.json');
    fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2));

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
