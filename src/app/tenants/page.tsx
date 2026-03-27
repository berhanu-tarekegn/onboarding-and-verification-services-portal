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
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Active Tenants</h2>
          <p className="text-sm text-zinc-400 mt-0.5">You have {tenants.length} running workspaces</p>
        </div>
        <Link
          className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          href="/tenants/new"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          New Workspace
        </Link>
      </div>

      {/* Tenant grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((t) => (
          <div key={t.id} className="sleek-card flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-900 text-white font-semibold text-sm">
                  {t.name.substring(0, 1).toUpperCase()}
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-900 inline-block" />
                  Active
                </span>
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 truncate">{t.name}</h3>
              <p className="mt-1 text-xs text-zinc-400 font-mono truncate">ID: {t.id}</p>
              {t.schema_name && (
                <div className="mt-3 inline-flex items-center rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                  Schema: {t.schema_name}
                </div>
              )}
            </div>
            <div className="border-t border-zinc-100 p-3">
              <Link
                className="flex w-full items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
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

        {tenants.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="h-12 w-12 rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-400">No workspaces yet</p>
            <Link
              href="/tenants/new"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 hover:underline"
            >
              Create your first workspace →
            </Link>
          </div>
        )}
      </div>
    </PortalShell>
  );
}
