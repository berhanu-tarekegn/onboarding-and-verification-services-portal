import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { fastapiRequest } from "@/lib/server/fastapiClient";

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

  const data = await fastapiRequest({
    path: "/api/v1/submissions",
    method: "GET",
    tenantId,
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const tenantId = String(body?.tenantId ?? "");
  if (!tenantId) return NextResponse.json({ error: "tenantId required" }, { status: 400 });

  const payload: Record<string, any> = { ...body };
  delete payload.tenantId;
  
  // Map UI fields to FastAPI fields
  if (payload.payload) {
    payload.form_data = payload.payload;
    delete payload.payload;
  }
  if (payload.productId) {
    payload.product_id = payload.productId;
    delete payload.productId;
  }
  if (payload.templateId) {
    payload.template_id = payload.templateId;
    delete payload.templateId;
  }

  const created = await fastapiRequest({
    path: "/api/v1/submissions",
    method: "POST",
    tenantId,
    json: payload,
  });
  return NextResponse.json(created, { status: 201 });
}

