import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fastapiRequest } from "@/lib/server/fastapiClient";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ ruleSetId: string }> }
) {
  const { ruleSetId } = await params;
  const body = await req.json();
  const tenantId = body?.tenantId;
  const templateId = body?.templateId;

  if (!tenantId || !templateId) {
    return NextResponse.json({ error: "tenantId and templateId required" }, { status: 400 });
  }

  try {
    const data = await fastapiRequest({
      path: `/api/v1/templates/${encodeURIComponent(templateId)}/transform-rules/${encodeURIComponent(ruleSetId)}/publish`,
      method: "POST",
      tenantId,
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to publish rule set" },
      { status: error?.status ?? 500 }
    );
  }
}
