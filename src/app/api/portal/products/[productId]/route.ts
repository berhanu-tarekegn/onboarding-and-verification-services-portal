import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fastapiRequest } from "@/lib/server/fastapiClient";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const url = new URL(req.url);
  const tenantId = url.searchParams.get("tenantId");
  const store = await cookies();
  const finalTenantId = tenantId || store.get("active_tenant_id")?.value;
  if (!finalTenantId) return NextResponse.json({ error: "tenantId required" }, { status: 400 });

  const data = await fastapiRequest({
    path: `/api/v1/products/${encodeURIComponent(productId)}`,
    method: "GET",
    tenantId: finalTenantId,
  });
  return NextResponse.json(data);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const body = await req.json();
  const tenantId = String(body?.tenantId ?? "");
  const store = await cookies();
  const finalTenantId = tenantId || store.get("active_tenant_id")?.value;
  if (!finalTenantId) return NextResponse.json({ error: "tenantId required" }, { status: 400 });

  const payload = { ...body };
  delete (payload as any).tenantId;

  const data = await fastapiRequest({
    path: `/api/v1/products/${encodeURIComponent(productId)}`,
    method: "PATCH",
    tenantId: finalTenantId,
    json: payload,
  });
  return NextResponse.json(data);
}
