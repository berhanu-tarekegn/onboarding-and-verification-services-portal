import "server-only";

import { cookies } from "next/headers";

export type SessionTokens = {
  accessToken: string;
  refreshToken?: string;
  realm?: string;
};

export async function setSessionCookies(tokens: SessionTokens) {
  const store = await cookies();
  store.set("access_token", tokens.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set true behind HTTPS
    path: "/",
  });

  if (tokens.refreshToken) {
    store.set("refresh_token", tokens.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });
  }

  if (tokens.realm) {
    store.set("realm", tokens.realm, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });
  }
}

export async function clearSessionCookies() {
  const store = await cookies();
  for (const name of ["access_token", "refresh_token", "realm"]) {
    store.set(name, "", { httpOnly: true, sameSite: "lax", secure: false, path: "/", maxAge: 0 });
  }
}

export async function getSessionCookies() {
  const store = await cookies();
  return {
    accessToken: store.get("access_token")?.value,
    refreshToken: store.get("refresh_token")?.value,
    realm: store.get("realm")?.value,
  };
}

