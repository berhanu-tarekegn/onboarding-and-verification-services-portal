import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fastapiRequest } from "@/lib/server/fastapiClient";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const tenantId = String(body?.tenantId ?? "");
  const store = await cookies();
  const finalTenantId = tenantId || store.get("active_tenant_id")?.value;
  if (!finalTenantId) return NextResponse.json({ error: "tenantId required" }, { status: 400 });

  const payload = { ...body };
  delete (payload as any).tenantId;

  const data = await fastapiRequest({
    path: `/api/v1/templates/${encodeURIComponent(id)}/definitions`,
    method: "POST",
    tenantId: finalTenantId,
    json: payload,
  });
  return NextResponse.json(data);
}
