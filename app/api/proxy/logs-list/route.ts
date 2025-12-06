import { NextRequest, NextResponse } from 'next/server';

const REMOTE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://amapi-uz5a.onrender.com";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization token' }, { status: 401 });
    }

    const res = await fetch(`${REMOTE}/api/v1/items`, {
      headers: {
        'Authorization': authHeader,
      },
    });

    const data = await res.json();
    console.log('Proxy Logs Response:', data); // Log in server console

    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error('Proxy Error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}