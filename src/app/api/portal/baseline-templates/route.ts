import { NextResponse } from "next/server";

import { fastapiRequest } from "@/lib/server/fastapiClient";

export async function GET() {
  const data = await fastapiRequest({
    path: "/api/v1/baseline-templates",
    method: "GET",
  });
  return NextResponse.json(data);
}

