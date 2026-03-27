"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { portalFetch } from "@/lib/api/client";
import type { Tenant } from "@/lib/types/domain";

export default function SelectTenantPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const t = await portalFetch<Tenant[]>("/api/portal/tenants");
        setTenants(t);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load tenants");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-lg rounded-xl border bg-white p-6">
        <div className="text-lg font-semibold">Select tenant</div>
        <div className="mt-1 text-sm text-zinc-600">
          We’ll store this as your active tenant and send it as{" "}
          <code>X-Tenant-ID</code>.
        </div>

        {loading ? (
          <div className="mt-6 text-sm text-zinc-500">Loading…</div>
        ) : error ? (
          <div className="mt-6 text-sm text-red-600">{error}</div>
        ) : (
          <div className="mt-6 space-y-4">
            <select
              className="w-full rounded-md border bg-white px-3 py-2 text-sm"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="">Choose…</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.id})
                </option>
              ))}
            </select>

            <button
              className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
              disabled={!selected}
              onClick={async () => {
                await portalFetch("/api/portal/tenant/active", {
                  method: "POST",
                  json: { tenantId: selected },
                });
                router.push(`/tenants/${selected}/dashboard`);
              }}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

