import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    domain: process.env.AUTH0_DOMAIN ? 'SET' : 'NOT SET',
    clientId: process.env.AUTH0_CLIENT_ID ? 'SET' : 'NOT SET',
    secret: process.env.AUTH0_SECRET ? 'SET' : 'NOT SET',
    appBaseUrl: process.env.APP_BASE_URL ? 'SET' : 'NOT SET',
    clientSecret: process.env.AUTH0_CLIENT_SECRET ? 'SET' : 'NOT SET',
    audience: process.env.AUTH0_AUDIENCE ? 'SET' : 'NOT SET'
  });
}