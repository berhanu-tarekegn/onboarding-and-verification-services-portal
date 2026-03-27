import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { fastapiRequest, FastApiError } from "@/lib/server/fastapiClient";

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

  // Map UI field name `target_status` → FastAPI field `to_status`
  const payload: Record<string, unknown> = { ...json };
  if (payload.target_status !== undefined && payload.to_status === undefined) {
    payload.to_status = payload.target_status;
    delete payload.target_status;
  }

  try {
    const data = await fastapiRequest({
      path: `/api/v1/submissions/${encodeURIComponent(submissionId)}/transition`,
      method: "POST",
      tenantId,
      json: payload,
    });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof FastApiError) {
      const body = err.bodyText ? JSON.parse(err.bodyText).error : { message: err.message };
      return NextResponse.json({ error: body }, { status: err.status });
    }
    throw err;
  }
}
