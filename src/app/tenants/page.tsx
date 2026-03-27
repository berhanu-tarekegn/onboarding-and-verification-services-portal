import { PortalShell } from "@/components/portal/PortalShell";
import Link from "next/link";
import { api } from "@/lib/api";

export default async function TenantsPage() {
  const tenants = await api.listTenants();

  return (
    <PortalShell
      title="Tenants"
      subtitle="Select a tenant to manage products, templates, and submissions."
      nav={[
        { label: "Tenants", href: "/tenants", routeKey: "tenants" },
        { label: "Docs (later)", href: "#" },
      ]}
    >
      <div className="rounded-xl border bg-white">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="text-sm font-semibold">All tenants</div>
          <Link
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            href="/tenants/new"
          >
            New tenant
          </Link>
        </div>
        <ul className="divide-y">
          {tenants.map((t) => (
            <li key={t.id} className="px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-zinc-950">
                    {t.name}
                  </div>
                  <div className="text-xs text-zinc-500">{t.id}</div>
                </div>
                <Link
                  className="shrink-0 rounded-md border px-3 py-2 text-sm hover:bg-zinc-50"
                  href={`/tenants/${t.id}/dashboard`}
                >
                  Open
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </PortalShell>
  );
}

