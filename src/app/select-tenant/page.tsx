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
  const [selecting, setSelecting] = useState<string | null>(null);

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

  const handleSelect = async (tenantId: string) => {
    setSelecting(tenantId);
    try {
      await portalFetch("/api/portal/tenant/active", {
        method: "POST",
        json: { tenantId },
      });
      router.push(`/tenants/${tenantId}/dashboard`);
    } catch (e) {
      setSelecting(null);
      setError("Failed to set active tenant");
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-white p-4 sm:p-6">

      {/* Logo */}
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Kifiya Vault</h1>
        <p className="mt-1.5 text-sm text-zinc-400 tracking-wide uppercase font-medium">Identity &amp; Verification Platform</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md border border-zinc-200 rounded-xl bg-white shadow-sm p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-zinc-900">Select Workspace</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Choose a tenant to manage configurations and submissions
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 w-full rounded-lg bg-zinc-100 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center">
            <p className="text-sm font-medium text-zinc-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-xs font-semibold text-zinc-900 hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {tenants.map((t) => {
              const isSelectingThis = selecting === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t.id)}
                  disabled={selecting !== null}
                  className={`w-full text-left group flex items-center justify-between p-3.5 rounded-lg border transition-all duration-150 ${
                    isSelectingThis
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50 disabled:opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm font-bold uppercase ${
                      isSelectingThis ? "bg-white text-zinc-900" : "bg-zinc-900 text-white"
                    }`}>
                      {t.name.substring(0, 2)}
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${isSelectingThis ? "text-white" : "text-zinc-900"}`}>
                        {t.name}
                      </div>
                      <div className={`text-xs font-mono mt-0.5 truncate max-w-[200px] ${isSelectingThis ? "text-zinc-300" : "text-zinc-400"}`}>
                        ID: {t.id}
                      </div>
                    </div>
                  </div>
                  <div className={isSelectingThis ? "text-white" : "text-zinc-300 group-hover:text-zinc-500 transition-colors"}>
                    {isSelectingThis ? (
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}

            {tenants.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-sm text-zinc-400">No workspaces available.</p>
              </div>
            )}

            <div className="pt-3 mt-1 border-t border-zinc-100">
              <button
                onClick={() => router.push("/tenants/new")}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-zinc-200 text-sm font-medium text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                </svg>
                Create New Workspace
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-xs text-zinc-400">
        <p>&copy; {new Date().getFullYear()} Kifiya Financial Technology</p>
        <p className="mt-1">Secure Identity Platform • v2.0.0</p>
      </div>
    </div>
  );
}
