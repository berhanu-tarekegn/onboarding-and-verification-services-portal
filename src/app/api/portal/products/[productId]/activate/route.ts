import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fastapiRequest } from "@/lib/server/fastapiClient";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const body = await req.json().catch(() => ({}));
  const url = new URL(req.url);
  const queryTenant = url.searchParams.get("tenantId");
  const store = await cookies();
  const tenantId = body.tenantId || queryTenant || store.get("active_tenant_id")?.value;
  if (!tenantId) return NextResponse.json({ error: "tenantId required" }, { status: 400 });

  const data = await fastapiRequest({
    path: `/api/v1/products/${encodeURIComponent(productId)}/activate`,
    method: "POST",
    tenantId,
  });
  return NextResponse.json(data);
}
