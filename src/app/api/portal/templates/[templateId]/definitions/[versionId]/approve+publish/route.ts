import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fastapiRequest, FastApiError } from "@/lib/server/fastapiClient";

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

  try {
    const data = await fastapiRequest({
      path: `/api/v1/templates/${encodeURIComponent(templateId)}/definitions/${encodeURIComponent(versionId)}/approve+publish`,
      method: "POST",
      tenantId,
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
