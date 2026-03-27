import { PortalShell } from "@/components/portal/PortalShell";
import Link from "next/link";
import { api } from "@/lib/api";

export default async function TenantsPage() {
  const tenants = await api.listTenants();

  return (
    <PortalShell
      title="Workspaces"
      subtitle="Manage all tenant workspaces and configurations centrally."
      nav={[
        { label: "Workspaces", href: "/tenants", routeKey: "tenants" }
      ]}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Active Tenants</h2>
          <p className="text-sm text-zinc-500 dark:text-slate-400">You have {tenants.length} running workspaces</p>
        </div>
        <Link
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 shadow-sm shadow-brand-500/30 transition-all flex items-center gap-2"
          href="/tenants/new"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          New Workspace
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((t) => (
          <div key={t.id} className="sleek-card glass flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-indigo-100 dark:from-brand-900/40 dark:to-indigo-900/40 text-brand-700 dark:text-brand-300 font-bold text-xl mb-4 shadow-inner">
                  {t.name.substring(0, 1)}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-200/50 dark:border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  Active
                </div>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white truncate">{t.name}</h3>
              <div className="mt-1 flex items-center text-xs text-zinc-500 dark:text-slate-400 font-mono">
                ID: {t.id}
              </div>
              {t.schema_name && (
                <div className="mt-4 inline-flex items-center rounded-md bg-zinc-100 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-zinc-600 dark:text-slate-300">
                  Schema: {t.schema_name}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-zinc-100 dark:border-slate-800 bg-zinc-50/50 dark:bg-slate-900/50 rounded-b-xl">
              <Link
                className="w-full flex justify-center items-center gap-2 rounded-lg bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-zinc-900 dark:text-white border border-zinc-200 dark:border-slate-700 hover:bg-zinc-50 dark:hover:bg-slate-700 hover:border-zinc-300 dark:hover:border-slate-600 transition-colors shadow-sm"
                href={`/tenants/${t.id}/dashboard`}
              >
                Enter Workspace
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-400">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </PortalShell>
  );
}

