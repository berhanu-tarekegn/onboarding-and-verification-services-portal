import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { FastApiError, fastapiRequest } from "@/lib/server/fastapiClient";

async function tenantFromQueryOrCookie(req: Request) {
  const url = new URL(req.url);
  const queryTenant = url.searchParams.get("tenantId");
  if (queryTenant) return queryTenant;
  const store = await cookies();
  return store.get("active_tenant_id")?.value;
}

export async function GET(req: Request) {
  const tenantId = await tenantFromQueryOrCookie(req);
  if (!tenantId) return NextResponse.json({ error: "tenantId required" }, { status: 400 });

  try {
    const data = await fastapiRequest({
      path: "/api/v1/products",
      method: "GET",
      tenantId,
    });
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof FastApiError) {
      return new NextResponse(e.bodyText ?? "", {
        status: e.status,
        headers: { "content-type": "application/json" },
      });
    }
    throw e;
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const tenantId = String(body?.tenantId ?? "");
  if (!tenantId) return NextResponse.json({ error: "tenantId required" }, { status: 400 });
  const payload = { ...body };
  delete (payload as any).tenantId;

  try {
    const created = await fastapiRequest({
      path: "/api/v1/products",
      method: "POST",
      tenantId,
      json: payload,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    if (e instanceof FastApiError) {
      return new NextResponse(e.bodyText ?? "", {
        status: e.status,
        headers: { "content-type": "application/json" },
      });
    }
    throw e;
  }
}

