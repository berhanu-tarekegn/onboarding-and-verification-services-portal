import { NextResponse } from "next/server";
import { fastapiRequest } from "@/lib/server/fastapiClient";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ templateId: string; versionId: string }> }
) {
  const { templateId, versionId } = await params;
  const data = await fastapiRequest({
    path: `/api/v1/baseline-templates/${encodeURIComponent(templateId)}/definitions/${encodeURIComponent(versionId)}`,
    method: "GET",
  });
  return NextResponse.json(data);
}
