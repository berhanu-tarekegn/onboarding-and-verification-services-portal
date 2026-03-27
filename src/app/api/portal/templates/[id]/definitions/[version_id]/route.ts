import { NextResponse } from "next/server";
import { fastapiRequest } from "@/lib/server/fastapiClient";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; version_id: string }> }
) {
  const { id, version_id } = await params;
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get("tenantId");

  if (!tenantId) {
    return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
  }

  try {
    const data = await fastapiRequest({
      path: `/api/v1/templates/${encodeURIComponent(
        id
      )}/definitions/${encodeURIComponent(version_id)}`,
      method: "GET",
      headers: {
        "X-Tenant-ID": tenantId,
      },
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to fetch template definition" },
      { status: error?.status ?? 500 }
    );
  }
}
