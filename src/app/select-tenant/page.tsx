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
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-br from-zinc-50 to-brand-50 dark:from-slate-950 dark:to-brand-950/20 p-4 sm:p-6 transition-colors duration-500">
      
      {/* Branding Header */}
      <div className="mb-8 flex flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/40 mb-4 ring-4 ring-brand-100 dark:ring-brand-900/30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Kifiya Vault</h1>
        <p className="mt-2 text-zinc-500 dark:text-slate-400 font-medium tracking-wide uppercase text-sm">Identity & Verification Platform</p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-lg sleek-card glass p-8">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Select Workspace</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-slate-400">
            Choose a tenant to manage configurations and submissions
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-slate-800/50" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-center">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 text-xs font-semibold text-red-700 dark:text-red-300 hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tenants.map((t) => {
              const isActive = t.status?.toUpperCase() === 'ACTIVE';
              const isSelectingThis = selecting === t.id;
              
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t.id)}
                  disabled={selecting !== null}
                  className={`w-full text-left group flex items-center justify-between p-4 rounded-xl border transition-all duration-200
                    ${isSelectingThis 
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 ring-2 ring-brand-500 ring-opacity-50' 
                      : 'border-zinc-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/20 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 hover:shadow-md'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold uppercase
                      ${isSelectingThis 
                        ? 'bg-brand-600 text-white' 
                        : 'bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-slate-300 group-hover:bg-brand-100 dark:group-hover:bg-brand-900 group-hover:text-brand-700 dark:group-hover:text-brand-300'
                      }`}
                    >
                      {t.name.substring(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                        {t.name}
                        {isActive && (
                          <span className="flex h-2 w-2 rounded-full bg-emerald-500" title="Active"></span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-slate-400 mt-0.5 max-w-[200px] truncate">
                        ID: {t.id}
                      </div>
                    </div>
                  </div>
                  <div className="text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isSelectingThis ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
            
            {tenants.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-zinc-500 dark:text-slate-400">No workspaces available.</p>
              </div>
            )}

            <div className="pt-4 border-t border-zinc-100 dark:border-slate-800 mt-2">
              <button
                onClick={() => router.push("/tenants/new")}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-zinc-200 dark:border-slate-700 text-zinc-600 dark:text-slate-400 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-all font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                </svg>
                Create New Workspace
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center text-xs text-zinc-500 dark:text-slate-500">
        <p>&copy; {new Date().getFullYear()} Kifiya Financial Technology</p>
        <p className="mt-1">Secure Identity Platform • v2.0.0</p>
      </div>
    </div>
  );
}

