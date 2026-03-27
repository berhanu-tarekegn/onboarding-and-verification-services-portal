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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ templateId: string; versionId: string }> }
) {
  const tenantId = await tenantFromQueryOrCookie(req);
  if (!tenantId) return NextResponse.json({ error: "tenantId required" }, { status: 400 });

  const { templateId, versionId } = await params;
  const data = await fastapiRequest({
    path: `/api/v1/templates/${encodeURIComponent(templateId)}/definitions/${encodeURIComponent(versionId)}`,
    method: "GET",
    tenantId,
  });
  return NextResponse.json(data);
}
