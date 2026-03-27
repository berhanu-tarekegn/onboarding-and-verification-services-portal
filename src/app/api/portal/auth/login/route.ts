import { NextResponse } from "next/server";

import { fastapiRequest } from "@/lib/server/fastapiClient";
import { setSessionCookies } from "@/lib/auth/cookies";

function pickToken(json: any) {
  // FastAPI OpenAPI doesn't describe token shapes; handle common Keycloak-style fields.
  const access =
    json?.access_token ??
    json?.accessToken ??
    json?.token ??
    json?.data?.access_token;
  const refresh =
    json?.refresh_token ??
    json?.refreshToken ??
    json?.data?.refresh_token;
  return { access, refresh };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const realm = String(body?.realm ?? "");
  if (!realm) {
    return NextResponse.json({ error: "realm is required" }, { status: 400 });
  }

  // Forward all other fields as-is (username/password/grant params).
  const payload = { ...body };
  delete (payload as any).realm;

  const json = await fastapiRequest({
    path: `/api/auth/login/${encodeURIComponent(realm)}`,
    method: "POST",
    json: payload,
  });

  const { access, refresh } = pickToken(json);
  if (!access) {
    return NextResponse.json(
      { error: "Login succeeded but no access token returned", raw: json },
      { status: 502 }
    );
  }

  await setSessionCookies({ accessToken: access, refreshToken: refresh, realm });
  return NextResponse.json({ ok: true });
}

