import { auth0 } from '@/app/lib/auth0';
import { NextResponse } from 'next/server';

export const GET = async function shows() {
  try {
    const session = await auth0.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const res = new NextResponse();
    const { token: accessToken } = await auth0.getAccessToken();

    console.log(accessToken)
    const apiPort = 5138;
    const response = await fetch(`http://localhost:${apiPort}/api/test/test-auth`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const shows = await response.json();

    return NextResponse.json(shows, res);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ err: "api call error" });
  }
};


export async function POST() {
  try {
    const session = await auth0.getSession();

    console.log("Calling POST")
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const res = new NextResponse();
    const { token: accessToken } = await auth0.getAccessToken();

    const apiPort = 5138;
    const response = await fetch(`http://localhost:${apiPort}/api/test/test-auth-post`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      method: "POST"
    });
    
    console.log(response)
    
    return NextResponse.json({}, res);
  } catch (error) {
    console.error('Error getting access token:', error);
    return NextResponse.json(
      { error: 'Failed to get access token' },
      { status: 500 }
    );
  }
}