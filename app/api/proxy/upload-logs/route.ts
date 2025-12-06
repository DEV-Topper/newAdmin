import { NextRequest, NextResponse } from 'next/server';

const REMOTE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://amapi-uz5a.onrender.com";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization token' }, { status: 401 });
    }

    const res = await fetch(`${REMOTE}/api/v1/items`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: formData,
    });

    const data = await res.json().catch(() => null) || await res.text();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Upload failed' },
      { status: 500 }
    );
  }
}