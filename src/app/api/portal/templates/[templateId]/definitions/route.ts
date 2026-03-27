import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fastapiRequest } from "@/lib/server/fastapiClient";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const { templateId } = await params;
  const url = new URL(req.url);
  const queryTenant = url.searchParams.get("tenantId");
  const store = await cookies();
  const tenantId = queryTenant ?? store.get("active_tenant_id")?.value;
  if (!tenantId) return NextResponse.json({ error: "tenantId required" }, { status: 400 });

  try {
    const data = await fastapiRequest({
      path: `/api/v1/templates/${encodeURIComponent(templateId)}/definitions`,
      method: "GET",
      tenantId,
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to fetch definitions" },
      { status: error?.status ?? 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const { templateId } = await params;
  const url = new URL(req.url);
  const queryTenant = url.searchParams.get("tenantId");
  const store = await cookies();
  
  const json = await req.json();
  const bodyTenant = json.tenantId;
  
  const tenantId = queryTenant ?? bodyTenant ?? store.get("active_tenant_id")?.value;
  if (!tenantId) return NextResponse.json({ error: "tenantId required" }, { status: 400 });

  try {
    const data = await fastapiRequest({
      path: `/api/v1/templates/${encodeURIComponent(templateId)}/definitions`,
      method: "POST",
      tenantId,
      json,
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to create definition" },
      { status: error?.status ?? 500 }
    );
  }
}
