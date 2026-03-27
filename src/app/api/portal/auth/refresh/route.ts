import { NextResponse } from "next/server";

import { getSessionCookies, setSessionCookies } from "@/lib/auth/cookies";
import { fastapiRequest } from "@/lib/server/fastapiClient";

function pickToken(json: any) {
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

export async function POST() {
  const session = await getSessionCookies();
  if (!session.realm) {
    return NextResponse.json({ error: "No realm in session" }, { status: 401 });
  }
  if (!session.refreshToken) {
    return NextResponse.json({ error: "No refresh token in session" }, { status: 401 });
  }

  const json = await fastapiRequest({
    path: `/api/auth/refresh/${encodeURIComponent(session.realm)}`,
    method: "POST",
    json: { refresh_token: session.refreshToken },
  });

  const { access, refresh } = pickToken(json);
  if (!access) {
    return NextResponse.json(
      { error: "Refresh succeeded but no access token returned", raw: json },
      { status: 502 }
    );
  }

  await setSessionCookies({
    accessToken: access,
    refreshToken: refresh ?? session.refreshToken,
    realm: session.realm,
  });
  return NextResponse.json({ ok: true });
}

