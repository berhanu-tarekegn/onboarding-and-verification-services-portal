import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { fastapiRequest } from "@/lib/server/fastapiClient";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  const { submissionId } = await params;
  const url = new URL(req.url);
  const queryTenant = url.searchParams.get("tenantId");
  const store = await cookies();
  const tenantId = queryTenant ?? store.get("active_tenant_id")?.value;
  if (!tenantId) return NextResponse.json({ error: "tenantId required" }, { status: 400 });

  const json = await req.json();
  const data = await fastapiRequest({
    path: `/api/v1/submissions/${encodeURIComponent(submissionId)}/transition`,
    method: "POST",
    tenantId,
    json,
  });
  return NextResponse.json(data);
}

