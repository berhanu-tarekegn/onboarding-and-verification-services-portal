import "server-only";

import { cookies } from "next/headers";

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

export class FastApiError extends Error {
  status: number;
  bodyText?: string;

  constructor(message: string, status: number, bodyText?: string) {
    super(message);
    this.name = "FastApiError";
    this.status = status;
    this.bodyText = bodyText;
  }
}

function baseUrl() {
  const url = process.env.FASTAPI_BASE_URL;
  if (!url) {
    throw new Error("Missing FASTAPI_BASE_URL env var");
  }
  return url.replace(/\/+$/, "");
}

export type FastApiRequest = {
  path: string; // e.g. "/api/v1/tenants"
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  query?: Record<string, string | number | boolean | undefined>;
  json?: Json;
  tenantId?: string;
  accessToken?: string;
  accept?: string;
  headers?: Record<string, string | undefined>;
};

export async function fastapiRequest<T = unknown>({
  path,
  method = "GET",
  query,
  json,
  tenantId,
  accessToken,
  accept,
  headers: extraHeaders,
}: FastApiRequest): Promise<T> {
  const url = new URL(baseUrl() + path);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined) continue;
      url.searchParams.set(k, String(v));
    }
  }

  const headers: Record<string, string> = {
    "ngrok-skip-browser-warning": "1",
  };
  if (extraHeaders) {
    for (const [k, v] of Object.entries(extraHeaders)) {
      if (v === undefined) continue;
      headers[k] = v;
    }
  }

  const cookieStore = await cookies();
  const token = accessToken ?? cookieStore.get("access_token")?.value;
  if (token) headers.Authorization = `Bearer ${token}`;
  if (tenantId) headers["X-Tenant-ID"] = tenantId;
  if (accept) headers.Accept = accept;

  const hasBody = json !== undefined && method !== "GET";
  if (hasBody) headers["Content-Type"] = "application/json";

  const maxAttempts = 2;
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url.toString(), {
        method,
        headers,
        body: hasBody ? JSON.stringify(json) : undefined,
        cache: "no-store",
      });

      if (!res.ok) {
        const bodyText = await res.text().catch(() => undefined);
        throw new FastApiError(
          `FastAPI request failed: ${method} ${path} -> ${res.status}`,
          res.status,
          bodyText
        );
      }

      // Handle empty responses
      const ct = res.headers.get("content-type") ?? "";
      if (!ct.includes("application/json")) {
        return (await res.text()) as unknown as T;
      }
      return (await res.json()) as T;
    } catch (e: any) {
      // Retry only transient socket errors from undici (Node fetch)
      const code = e?.cause?.code ?? e?.code;
      const isTransient =
        code === "UND_ERR_SOCKET" || code === "ECONNRESET" || code === "ETIMEDOUT";
      lastErr = e;
      if (!isTransient || attempt === maxAttempts) break;
      await new Promise((r) => setTimeout(r, 250 * attempt));
    }
  }

  throw lastErr;
}

