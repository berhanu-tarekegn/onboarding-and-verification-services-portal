import { api } from "@/lib/api";
import Link from "next/link";
import React from "react";
import { DefinitionActions } from "./DefinitionActions";
import { SchemaTreeView } from "../extensions/SchemaTreeView";

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ tenantId: string; templateId: string }>;
}) {
  const { tenantId, templateId } = await params;
  
  const template: any = await api.getTemplate(tenantId, templateId).catch(() => null);
  const definitions = template?.versions || [];

  if (!template) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-zinc-500">
        Template not found.
      </div>
    );
  }

  // Normalise definition status for the UI.
  // Backend gives us: is_draft=true/false AND review_status (DRAFT, PENDING_REVIEW, APPROVED, REJECTED, SUPERSEDED)
  const getUiStatus = (def: any) => {
    if (def.is_draft) {
      const rv = (def.review_status || "DRAFT").toUpperCase();
      if (rv === "PENDING_REVIEW" || rv === "SUBMITTED") return "SUBMITTED";
      return "DRAFT";
    }
    // Published / locked
    return "APPROVED";
  };
  const sortedDefs = [...(definitions || [])].sort((a, b) => {
    return (b.version_tag || "").localeCompare(a.version_tag || "");
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-xl border border-zinc-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href={`/tenants/${tenantId}/templates/extensions`}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-slate-800 text-zinc-500 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-slate-700 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
              {template.name}
              {template.is_active && (
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-0.5 rounded uppercase tracking-wider">
                  Active
                </span>
              )}
            </h1>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-slate-400 font-mono text-xs">
              ID: {template.id}
            </p>
          </div>
        </div>
        <Link
          href={`/tenants/${tenantId}/templates/new?templateId=${template.id}`}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 shadow-sm shadow-brand-500/30 transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Version (Draft)
        </Link>
      </div>

      <div className="sleek-card glass">
        <div className="border-b border-zinc-200 dark:border-slate-700 bg-zinc-50/50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C4.93 2.317 4 3.192 4 4.22v11.554c0 1.033.93 1.908 1.93 1.912 3.336.013 6.806.013 10.14 0 1 .004 1.93-.88 1.93-1.912V4.22c0-1.033-.93-1.908-1.93-1.912A41.206 41.206 0 0 0 10 2Zm3.25 5a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75V7Zm-5.5 0a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75V7Zm-2.5 4.5a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-.5Zm5.5 0a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-.5Z" clipRule="evenodd" />
                </svg>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Version History</h2>
            </div>
        </div>
        
        {sortedDefs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-slate-800 flex items-center justify-center text-zinc-400 mx-auto mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-zinc-500 font-medium">No definitions found for this template.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-slate-800/50">
            {sortedDefs.map((def: any) => {
              const status = getUiStatus(def);
              const isDefault = template.active_version_id === def.id;
              
              const statusColors: Record<string, string> = {
                ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400",
                APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400",
                DRAFT: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-slate-800 dark:text-slate-300",
                SUBMITTED: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400",
                SUPERSEDED: "bg-zinc-50 text-zinc-500 border-zinc-200 dark:bg-slate-900/50 dark:text-slate-500",
                REJECTED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400",
              };
              
              const colorClass = statusColors[status.toUpperCase()] || statusColors.DRAFT;

              return (
                <div key={def.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/50 dark:hover:bg-slate-800/20 transition-colors last:rounded-b-2xl">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono font-bold text-zinc-900 dark:text-white">
                        {def.version_tag || "v1"}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${colorClass}`}>
                        {status}
                      </span>
                      {isDefault && (
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-0.5 rounded uppercase tracking-wider">
                          Live Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-slate-400 font-mono mt-1 flex items-center gap-2">
                        Definition ID: {def.id}
                        {def.is_locked && (
                           <span className="flex items-center gap-1 text-zinc-400">
                               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                               </svg>
                           </span>
                        )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <details className="text-xs group relative z-10">
                        <summary className="cursor-pointer text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium select-none flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                                <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
                            </svg>
                            View Fields
                        </summary>
                        <div className="absolute right-0 top-full mt-2 w-[450px] max-h-96 overflow-auto p-1 bg-zinc-950 rounded-xl shadow-2xl border border-zinc-800 hidden group-open:block origin-top-right z-50">
                           <SchemaTreeView schema={{ title: "Version Fields", fields: def.question_groups }} />
                        </div>
                    </details>
                    
                    <DefinitionActions 
                        tenantId={tenantId} 
                        templateId={templateId} 
                        versionId={def.id} 
                        status={status} 
                        isLocked={def.is_locked} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
