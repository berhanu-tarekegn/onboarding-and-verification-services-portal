export async function portalFetch<T>(
  path: string,
  opts?: {
    method?: string;
    json?: unknown;
    headers?: Record<string, string>;
  }
): Promise<T> {
  const url = await toAbsoluteUrl(path);
  const res = await fetch(url, {
    method: opts?.method ?? "GET",
    headers: {
      ...(opts?.json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(opts?.headers ?? {}),
    },
    body: opts?.json !== undefined ? JSON.stringify(opts.json) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Portal API failed: ${opts?.method ?? "GET"} ${path} -> ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

async function toAbsoluteUrl(path: string): Promise<string> {
  // Browser fetch supports relative URLs; Node.js fetch (server components) does not.
  if (typeof window !== "undefined") return path;
  if (/^https?:\/\//i.test(path)) return path;
  if (!path.startsWith("/")) return path;

  // next/headers is server-only, so import dynamically.
  const { headers } = await import("next/headers");
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}${path}`;
}

