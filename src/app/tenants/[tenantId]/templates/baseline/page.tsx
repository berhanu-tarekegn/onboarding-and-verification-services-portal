import { api } from "@/lib/api";
import Link from "next/link";
import React from "react";

export default async function BaselineTemplatesListPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const baselines = await api.listBaselineTemplates();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-zinc-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Baseline Templates</h1>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-slate-400">
          Platform-required baseline templates. Tenants can only extend, not modify, these schemas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {baselines.map((baseline) => (
          <Link
            key={baseline.id}
            href={`/tenants/${tenantId}/templates/baseline/${baseline.id}`}
            className="sleek-card glass p-6 hover:ring-2 hover:ring-brand-500/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M14.5 2A1.5 1.5 0 0 1 16 3.5v13a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 16.5v-13A1.5 1.5 0 0 1 4.5 2h10ZM5 14.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5Zm0-2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5Zm0-2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5Zm0-2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-0.5 rounded uppercase tracking-wider">
                Published
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {baseline.name}
            </h3>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-zinc-500 dark:text-slate-400 font-mono">
                <span>Type</span>
                <span className="text-zinc-900 dark:text-white uppercase">{baseline.template_type}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-500 dark:text-slate-400 font-mono">
                <span>Level</span>
                <span className="text-zinc-900 dark:text-white">L{baseline.baseline_level}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
              View Schema Definition
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        ))}
        
        {baselines.length === 0 && (
          <div className="col-span-full sleek-card glass p-12 text-center">
            <p className="text-zinc-500">No baseline templates found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
