import { NextResponse } from "next/server";

import { FastApiError, fastapiRequest } from "@/lib/server/fastapiClient";

export async function GET() {
  const data = await fastapiRequest({
    path: "/api/v1/tenants",
    method: "GET",
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const json = await req.json();
  try {
    const created = await fastapiRequest({
      path: "/api/v1/tenants",
      method: "POST",
      json,
      headers: {
        // FastAPI requires this for provisioning new tenants.
        "X-Provisioning-Key": process.env.PLATFORM_PROVISIONING_API_KEY,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    if (e instanceof FastApiError) {
      return new NextResponse(e.bodyText ?? "", {
        status: e.status,
        headers: { "content-type": "application/json" },
      });
    }
    throw e;
  }
}

