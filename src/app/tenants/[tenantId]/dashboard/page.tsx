import { api } from "@/lib/api";
import Link from "next/link";
import React from "react";

export default async function TenantDashboardPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  const [productsRes, templatesRes, casesRes] = await Promise.allSettled([
    api.listProducts(tenantId),
    api.listTemplatesForTenant(tenantId),
    api.listSubmissions(tenantId),
  ]);

  const productsCount  = productsRes.status  === "fulfilled" ? productsRes.value.length  : null;
  const templatesCount = templatesRes.status === "fulfilled" ? templatesRes.value.length : null;
  const submissionsCount = casesRes.status   === "fulfilled" ? casesRes.value.length     : null;
  const pendingReviews =
    casesRes.status === "fulfilled"
      ? casesRes.value.filter((c) => {
          const s = String((c as any).status ?? "").toLowerCase();
          return s === "submitted" || s === "under_review" || s === "pending_review";
        }).length
      : null;

  return (
    <div className="space-y-6">

      {/* Hero row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Workspace Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Overview for workspace{" "}
            <code className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600 text-xs">{tenantId}</code>
          </p>
        </div>
        <Link
          href={`/tenants/${tenantId}/submissions/new`}
          className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors self-start sm:self-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          New Submission
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Active Products"   value={fmtCount(productsCount)}   href={`/tenants/${tenantId}/products`}    icon={<CubeIcon />} />
        <MetricCard label="Templates"         value={fmtCount(templatesCount)}  href={`/tenants/${tenantId}/templates/extensions`} icon={<DocIcon />}  />
        <MetricCard label="Total Submissions" value={fmtCount(submissionsCount)} href={`/tenants/${tenantId}/submissions`} icon={<InboxIcon />} />
        <MetricCard label="Pending Review"    value={fmtCount(pendingReviews)}  href={`/tenants/${tenantId}/submissions`} icon={<ClockIcon />} highlight={!!(pendingReviews && pendingReviews > 0)} />
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: `/tenants/${tenantId}/products`,           label: "Manage Products" },
            { href: `/tenants/${tenantId}/templates/extensions`, label: "Configure Templates" },
            { href: `/tenants/${tenantId}/templates/transform-rules`, label: "Transform Rules" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50 transition-colors group"
            >
              <span className="text-sm font-medium text-zinc-800">{label}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors">
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function fmtCount(v: number | null) {
  return v === null ? "—" : String(v);
}

function MetricCard({ label, value, href, highlight, icon }: {
  label: string; value: string; href?: string; highlight?: boolean; icon?: React.ReactNode;
}) {
  const inner = (
    <div className={`rounded-lg border p-5 transition-colors ${
      highlight
        ? "border-zinc-900 bg-zinc-900 text-white"
        : "border-zinc-200 bg-white hover:border-zinc-400"
    }`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-medium uppercase tracking-wider ${highlight ? "text-zinc-300" : "text-zinc-400"}`}>
          {label}
        </span>
        <span className={`${highlight ? "text-zinc-300" : "text-zinc-300"}`}>{icon}</span>
      </div>
      <div className={`text-3xl font-bold tracking-tight ${highlight ? "text-white" : "text-zinc-900"}`}>
        {value}
      </div>
    </div>
  );
  return href ? <Link href={href} className="block">{inner}</Link> : inner;
}

// ── Icon set (Heroicons outline, 20px) ──────────────────────────────────────

function CubeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  );
}
function DocIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
}
function InboxIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
