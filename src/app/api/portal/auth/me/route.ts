import { NextResponse } from "next/server";

import { fastapiRequest } from "@/lib/server/fastapiClient";

export async function GET() {
  const me = await fastapiRequest({
    path: "/api/auth/me",
    method: "GET",
  });
  return NextResponse.json(me);
}

