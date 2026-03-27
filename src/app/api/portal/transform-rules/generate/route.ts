import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { fastapiRequest } from "@/lib/server/fastapiClient";

export async function POST(req: Request) {
  const body = await req.json();
  const tenantId = String(body?.tenantId ?? "");
  const templateId = String(body?.templateId ?? "");
  if (!tenantId) {
    const store = await cookies();
    const cookieTenant = store.get("active_tenant_id")?.value;
    if (cookieTenant) {
      // eslint-disable-next-line no-param-reassign
      (body as any).tenantId = cookieTenant;
    }
  }
  const finalTenant = String(body?.tenantId ?? "");
  if (!finalTenant) return NextResponse.json({ error: "tenantId required" }, { status: 400 });
  if (!templateId) return NextResponse.json({ error: "templateId required" }, { status: 400 });

  const payload = { ...body };
  delete (payload as any).tenantId;
  delete (payload as any).templateId;

  const data = await fastapiRequest({
    path: `/api/v1/templates/${encodeURIComponent(templateId)}/transform-rules/generate`,
    method: "POST",
    tenantId: finalTenant,
    json: payload,
  });
  return NextResponse.json(data, { status: 201 });
}

