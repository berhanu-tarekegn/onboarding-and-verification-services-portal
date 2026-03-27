import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fastapiRequest } from "@/lib/server/fastapiClient";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ templateId: string; versionId: string }> }
) {
  const { templateId, versionId } = await params;
  const url = new URL(req.url);
  const queryTenant = url.searchParams.get("tenantId");
  const store = await cookies();
  const tenantId = queryTenant ?? store.get("active_tenant_id")?.value;
  if (!tenantId) return NextResponse.json({ error: "tenantId required" }, { status: 400 });

  const data = await fastapiRequest({
    path: `/api/v1/templates/${encodeURIComponent(templateId)}/definitions/${encodeURIComponent(versionId)}/publish`,
    method: "POST",
    tenantId,
  });
  return NextResponse.json(data);
}
