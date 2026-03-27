import { NextResponse } from "next/server";

import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const tenantId = String(body?.tenantId ?? "");
  if (!tenantId) {
    return NextResponse.json({ error: "tenantId is required" }, { status: 400 });
  }
  const store = await cookies();
  store.set("active_tenant_id", tenantId, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const store = await cookies();
  return NextResponse.json({ tenantId: store.get("active_tenant_id")?.value ?? null });
}

