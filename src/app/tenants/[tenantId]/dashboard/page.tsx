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

  const productsCount = productsRes.status === "fulfilled" ? productsRes.value.length : null;
  const templatesCount = templatesRes.status === "fulfilled" ? templatesRes.value.length : null;
  const submissionsCount = casesRes.status === "fulfilled" ? casesRes.value.length : null;
  const pendingReviews =
    casesRes.status === "fulfilled"
      ? casesRes.value.filter((c) => {
          const s = String((c as any).status ?? "").toLowerCase();
          // 'submitted' = awaiting review, 'under_review' = in progress
          return s === "submitted" || s === "under_review" || s === "pending_review";
        }).length
      : null;

  return (
    <div className="space-y-6">
      <div className="sleek-card glass p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Workspace Dashboard</h1>
          <p className="text-sm text-zinc-500 dark:text-slate-400">
            Overview and metrics for workspace <span className="font-mono bg-zinc-100 dark:bg-slate-800 px-2 py-0.5 rounded text-zinc-700 dark:text-slate-300">{tenantId}</span>
          </p>
        </div>
        <div className="flex gap-3">
            <Link href={`/tenants/${tenantId}/submissions/new`} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 shadow-sm shadow-brand-500/30 transition-all flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                </svg>
                New Submission
            </Link>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          label="Active Products" 
          value={fmtCount(productsCount)} 
          href={`/tenants/${tenantId}/products`}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm14.25 6a.75.75 0 0 1-.75.75h-5.25v5.25a.75.75 0 0 1-1.5 0v-5.25H4.5a.75.75 0 0 1 0-1.5h5.25V4.5a.75.75 0 0 1 1.5 0v5.25h5.25a.75.75 0 0 1 .75.75Z" clipRule="evenodd" /></svg>}
        />
        <MetricCard 
          label="Defined Templates" 
          value={fmtCount(templatesCount)} 
          href={`/tenants/${tenantId}/templates`}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm5.845 17.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V12a.75.75 0 0 0-1.5 0v4.19l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z" clipRule="evenodd" /><path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" /></svg>}
        />
        <MetricCard 
          label="Total Submissions" 
          value={fmtCount(submissionsCount)} 
          href={`/tenants/${tenantId}/submissions`}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" /></svg>}
        />
        <MetricCard 
          label="Pending Reviews" 
          value={fmtCount(pendingReviews)} 
          href={`/tenants/${tenantId}/submissions`}
          highlight={pendingReviews && pendingReviews > 0 ? true : false}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" /></svg>}
        />
      </div>
      
      {/* Recent Activity Mock */}
      <div className="sleek-card glass p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href={`/tenants/${tenantId}/products`} className="p-4 rounded-xl border border-zinc-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-700 bg-zinc-50/50 dark:bg-slate-800/50 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-all flex items-center justify-between group">
                <span className="font-medium text-zinc-800 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-300">Manage Products</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-400 group-hover:text-brand-500"><path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" /></svg>
            </Link>
            <Link href={`/tenants/${tenantId}/templates`} className="p-4 rounded-xl border border-zinc-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-700 bg-zinc-50/50 dark:bg-slate-800/50 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-all flex items-center justify-between group">
                <span className="font-medium text-zinc-800 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-300">Configure Templates</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-400 group-hover:text-brand-500"><path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" /></svg>
            </Link>
            <Link href={`/tenants/${tenantId}/transform-rules`} className="p-4 rounded-xl border border-zinc-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-700 bg-zinc-50/50 dark:bg-slate-800/50 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-all flex items-center justify-between group">
                <span className="font-medium text-zinc-800 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-300">Transform Rules</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-400 group-hover:text-brand-500"><path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" /></svg>
            </Link>
        </div>
      </div>
    </div>
  );
}

function fmtCount(v: number | null) {
  return v === null ? "—" : String(v);
}

function MetricCard({ label, value, href, highlight, icon }: { label: string; value: string; href?: string; highlight?: boolean; icon?: React.ReactNode }) {
  const Card = (
    <div className={`relative overflow-hidden rounded-xl border p-5 transition-all
       ${highlight 
         ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50' 
         : 'bg-white dark:bg-slate-900/50 border-zinc-200 dark:border-slate-800 hover:shadow-md hover:border-brand-300 dark:hover:border-slate-700'
       } sleek-card`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`text-sm font-medium ${highlight ? 'text-amber-800 dark:text-amber-500' : 'text-zinc-500 dark:text-slate-400'}`}>
            {label}
        </div>
        {icon && (
            <div className={`p-2 rounded-lg ${highlight ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400' : 'bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400'}`}>
                {icon}
            </div>
        )}
      </div>
      <div className={`text-3xl font-bold tracking-tight ${highlight ? 'text-amber-900 dark:text-amber-400' : 'text-zinc-900 dark:text-white'}`}>
        {value}
      </div>
      {href && (
          <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-zinc-400"><path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" /></svg>
          </div>
      )}
    </div>
  );

  return href ? (
      <Link href={href} className="group block h-full">
          {Card}
      </Link>
  ) : Card;
}

