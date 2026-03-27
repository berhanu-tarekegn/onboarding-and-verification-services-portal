import { api } from "@/lib/api";
import Link from "next/link";
import React from "react";

export default async function BaselineTemplatePage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const baseline = await api.getBaselineTemplate();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-xl border border-zinc-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href={`/tenants/${tenantId}/templates/extensions`}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-slate-800 text-zinc-500 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-slate-700 active:scale-95"
            title="Back to Workspace Configuration"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Baseline Template</h1>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-slate-400">
              Platform-required baseline template. Tenants can only extend, not modify, this schema.
            </p>
          </div>
        </div>
        <Link
          href={`/tenants/${tenantId}/templates/extensions`}
          className="rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-brand-500/10 px-4 py-2 text-sm font-semibold text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10.75 6.75a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z" />
          </svg>
          My Extension
        </Link>
      </div>

      {baseline ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="sleek-card glass overflow-hidden">
              <div className="border-b border-zinc-200 dark:border-slate-700 bg-zinc-50/50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-brand-500">
                    <path fillRule="evenodd" d="M14.5 2A1.5 1.5 0 0 1 16 3.5v13a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 16.5v-13A1.5 1.5 0 0 1 4.5 2h10ZM5 14.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5Zm0-2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5Zm0-2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5Zm0-2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5Z" clipRule="evenodd" />
                  </svg>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Schema Definition</h2>
                </div>
                {baseline.schema && (
                    <span className="text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400 px-2 py-1 rounded">
                        {(baseline.schema as any).fields?.length || 0} Groups
                    </span>
                )}
              </div>
              
              <div className="p-0">
                {baseline.schema && (baseline.schema as any).fields && Array.isArray((baseline.schema as any).fields) ? (
                  <div className="divide-y divide-zinc-100 dark:divide-slate-800">
                    {(baseline.schema as any).fields.map((group: any, idx: number) => (
                      <div key={idx} className="p-6 hover:bg-zinc-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded bg-zinc-100 dark:bg-slate-800 text-xs font-bold text-zinc-500 dark:text-slate-400">{idx + 1}</span>
                          {group.title ?? group.name ?? `Group ${idx + 1}`}
                        </h3>
                        <div className="space-y-3 pl-8">
                          {group.questions && Array.isArray(group.questions) ? (
                            group.questions.map((q: any, qIdx: number) => (
                              <div key={qIdx} className="bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative shadow-sm">
                                <div>
                                  <div className="text-sm font-medium text-zinc-800 dark:text-slate-200">
                                    {q.title ?? q.name ?? q.key ?? `Question ${qIdx + 1}`}
                                    {q.required && <span className="ml-2 text-red-500 text-xs font-bold">*</span>}
                                  </div>
                                  {(q.description || q.id || q.key) && (
                                    <div className="mt-1 flex items-center gap-2 text-[11px] font-mono text-zinc-400 dark:text-slate-500">
                                      <span>key: {q.key ?? q.id ?? "unknown"}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="px-2 py-1 rounded text-xs font-semibold bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-slate-300 uppercase tracking-wider">
                                    {q.type ?? q.field_type ?? "text"}
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-zinc-500">No questions defined in this group.</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-zinc-500">
                    No schema fields found. The definition may be empty or failed to load.
                  </div>
                )}
              </div>
            </div>
            
            <details className="sleek-card glass group">
              <summary className="border-b border-zinc-200 dark:border-slate-700 bg-zinc-50/50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-zinc-600 dark:text-slate-300">Raw JSON Definition</h2>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform">
                  <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </summary>
              <div className="p-4">
                <pre className="overflow-auto rounded-lg bg-zinc-900 p-4 text-xs leading-5 text-zinc-300 font-mono shadow-inner max-h-[400px]">
                  {JSON.stringify(baseline.schema ?? baseline, null, 2)}
                </pre>
              </div>
            </details>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sleek-card glass p-6">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">Properties</h3>
              <ul className="space-y-4">
                <li>
                  <div className="text-xs text-zinc-500 dark:text-slate-400 mb-1">Name</div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-white">{baseline.name}</div>
                </li>
                <li>
                  <div className="text-xs text-zinc-500 dark:text-slate-400 mb-1">Status</div>
                  <div className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                    PUBLISHED
                  </div>
                </li>
                <li>
                  <div className="text-xs text-zinc-500 dark:text-slate-400 mb-1">Version</div>
                  <div className="text-sm font-mono text-zinc-700 dark:text-slate-300">
                    {baseline.version ?? baseline.active_version_id ?? "unknown"}
                  </div>
                </li>
                <li>
                  <div className="text-xs text-zinc-500 dark:text-slate-400 mb-1">Context</div>
                  <div className="text-sm font-mono text-zinc-700 dark:text-slate-300">{tenantId}</div>
                </li>
              </ul>
            </div>
            
            <div className="sleek-card glass p-6 bg-brand-50/50 dark:bg-brand-900/10 border-brand-100 dark:border-brand-900/30">
              <h3 className="text-sm font-semibold text-brand-900 dark:text-brand-300 mb-2">Can I edit this?</h3>
              <p className="text-xs text-brand-700 dark:text-brand-400/80 leading-relaxed">
                As a workspace tenant, you inherit this schema structure globally. You cannot edit it directly. Instead, create a <strong>Tenant Extension Template</strong> to add any additional fields you need.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="sleek-card glass p-12 text-center flex flex-col items-center justify-center border-dashed border-2">
            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">No baseline template</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400 max-w-sm">The platform admin has not published a baseline template yet, or it could not be fetched.</p>
        </div>
      )}
    </div>
  );
}

