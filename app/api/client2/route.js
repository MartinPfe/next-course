import { NextResponse } from "next/server";
import { auth0 } from '../../../lib/auth0';

export const GET = async function client2() {
  try {
    const session = await auth0.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    const endpoint = 'asd'

    const res = new NextResponse();
    const { token: accessToken } = await auth0.getAccessToken();
    const apiPort = 5138
    const response = await fetch(`http://localhost:${apiPort}/api/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    console.log("Call from client 2")

    const shows = await response.json();

    return NextResponse.json(shows, res);
  } catch (error) {
    console.log("err Call from client 2")

    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
};
