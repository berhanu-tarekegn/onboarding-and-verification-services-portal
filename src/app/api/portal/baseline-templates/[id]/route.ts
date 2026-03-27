import { NextResponse } from "next/server";
import { fastapiRequest } from "@/lib/server/fastapiClient";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const data = await fastapiRequest({
      path: `/api/v1/baseline-templates/${encodeURIComponent(id)}`,
      method: "GET",
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to fetch baseline template" },
      { status: error?.status ?? 500 }
    );
  }
}
