import { NextResponse } from "next/server";

const REMOTE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://amapi-uz5a.onrender.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${REMOTE.replace(/\/$/, "")}/api/v1/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    // try parse JSON, otherwise return text
    let data;
    try { data = JSON.parse(text); } catch { data = text; }

    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Proxy error" }, { status: 500 });
  }
}