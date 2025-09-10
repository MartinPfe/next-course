import { NextResponse } from 'next/server';
import { auth0 } from '@/app/lib/auth0';

export async function GET() {
  try {
    const session = await auth0.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const tokenData = await auth0.getAccessToken();
    
    return NextResponse.json({ 
      token: tokenData.token,
      expiresAt: tokenData.expiresAt,
      scope: tokenData.scope 
    });
  } catch (error) {
    console.error('Error getting access token:', error);
    return NextResponse.json(
      { error: 'Failed to get access token' },
      { status: 500 }
    );
  }
}
