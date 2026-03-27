import { api } from "@/lib/api";
import { mergeEffectiveSchema } from "@/lib/schema/mergeEffectiveSchema";
import type { FormSchema } from "@/lib/types/domain";
import Link from "next/link";
import React from "react";

export default async function TemplateExtensionsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const baseline = await api.getBaselineTemplate();
  const extension = await api.getTenantExtensionTemplate(tenantId);

  const effective: FormSchema | undefined =
    baseline && extension && baseline.schema && extension.schema
      ? mergeEffectiveSchema({
          baseline: baseline.schema as FormSchema,
          extension: extension.schema as FormSchema,
        })
      : baseline?.schema
        ? (baseline.schema as FormSchema)
        : undefined;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-xl border border-zinc-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Workspace Configuration</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">
            Combine your workspace-specific fields with global <span className="font-bold text-indigo-500">Baseline</span> standards.
          </p>
        </div>
        <Link
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 shadow-sm shadow-brand-500/30 transition-all flex items-center gap-2"
          href={`/tenants/${tenantId}/templates/new`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          Edit Extension
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Side: Tenant Extension */}
        <div className="sleek-card glass flex flex-col h-[700px]">
          <div className="border-b border-zinc-200 dark:border-slate-700 bg-zinc-50/50 dark:bg-slate-900/50 px-6 py-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10.75 6.75a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z" />
                  </svg>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Workspace Add-ons</h2>
                </div>
                {extension && (
                    <span className="text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-500/10 dark:text-brand-400 px-2 py-0.5 rounded uppercase tracking-wider">
                        Compliance Level {extension.baseline_level}
                    </span>
                )}
            </div>
            <div className="text-[10px] font-medium text-zinc-500 dark:text-slate-400 uppercase tracking-widest">
              Custom fields defined by <code className="bg-zinc-100 dark:bg-slate-800 px-1 rounded">{tenantId}</code>
            </div>
          </div>
          <div className="p-6 flex-1 overflow-auto bg-zinc-50/30 dark:bg-slate-900/30">
            {extension ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-slate-700 pb-4">
                  <div className="flex-1">
                    <div className="text-base font-bold text-zinc-900 dark:text-white mb-1">{extension.name}</div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        PUBLISHED
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">vID: {extension.active_version_id ?? "unknown"}</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xs font-bold text-zinc-500 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   Raw Extension JSON
                   <span className="h-px flex-1 bg-zinc-200 dark:bg-slate-800"></span>
                </h3>
                {(!extension.schema || Object.keys(extension.schema).length === 0) ? (
                   <div className="p-10 rounded-xl border border-dashed border-zinc-200 dark:border-slate-800 text-center bg-zinc-50/50 dark:bg-slate-950/50">
                      <p className="text-xs text-zinc-500 dark:text-slate-400 font-medium italic">No custom fields defined in this extension.</p>
                   </div>
                ) : (
                  <pre className="overflow-auto rounded-xl border border-zinc-200 dark:border-slate-700 bg-zinc-900 p-5 text-xs text-zinc-300 font-mono shadow-inner max-h-[450px]">
                    {JSON.stringify(extension.schema ?? {}, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-slate-800 flex items-center justify-center text-zinc-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-zinc-700 dark:text-slate-300">No extension defined</div>
                <div className="mt-2 text-xs text-zinc-500 max-w-xs">
                  This workspace is only using the baseline schema. Click "Edit Extension" to add custom fields.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Effective Schema Preview */}
        <div className="sleek-card glass flex flex-col h-[700px] border-indigo-200 dark:border-indigo-800/50 shadow-indigo-100/50 dark:shadow-indigo-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-bl-full -z-10 blur-2xl"></div>
          
          <div className="border-b border-indigo-100 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-900/20 px-6 py-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16.5 2h-1Z" />
                    <path d="M8.5 2A1.5 1.5 0 0 0 7 3.5v13a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 9.5 2h-1Z" />
                    <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v13A1.5 1.5 0 0 0 1.5 18h1A1.5 1.5 0 0 0 4 16.5v-13A1.5 1.5 0 0 0 2.5 2h-1Z" />
                  </svg>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Effective Schema Preview</h2>
                </div>
                {effective && (
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 px-2 py-0.5 rounded">
                        MERGED
                    </span>
                )}
            </div>
            <div className="text-[10px] font-medium text-indigo-600/80 dark:text-indigo-400/80 uppercase tracking-widest">
              Merged Runtime Result: Global Baseline {extension ? "+ Your Extension" : ""}
            </div>
          </div>
          
          <div className="p-6 flex-1 overflow-auto bg-zinc-50/10 dark:bg-slate-900/10">
            {effective ? (
              <pre className="overflow-auto rounded-xl border border-zinc-200 dark:border-slate-700 bg-zinc-900 p-5 text-xs text-zinc-300 font-mono shadow-inner h-full">
                {JSON.stringify(effective, null, 2)}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-red-800 dark:text-red-400">Preview Unavailable</div>
                <div className="mt-2 text-xs text-red-600/80 dark:text-red-400/80 max-w-xs">
                  Could not merge baseline and extension. The baseline template might be missing.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

