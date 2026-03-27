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
  const url = new URL(req.url);
  const templateId = url.searchParams.get("templateId");
  const tenantId = await tenantFromQueryOrCookie(req);
  if (!tenantId) return NextResponse.json({ error: "tenantId required" }, { status: 400 });
  if (!templateId) return NextResponse.json({ error: "templateId required" }, { status: 400 });

  const data = await fastapiRequest({
    path: `/api/v1/templates/${encodeURIComponent(templateId)}/transform-rules`,
    method: "GET",
    tenantId,
  });
  return NextResponse.json(data);
}

