import { api } from "@/lib/api";
import Link from "next/link";
import React from "react";

function StatusBadge({ status }: { status?: string }) {
  const norm = (status || "DRAFT").toUpperCase();
  let bg = "bg-zinc-100 dark:bg-slate-800";
  let text = "text-zinc-700 dark:text-slate-300";
  let border = "border-zinc-200 dark:border-slate-700";
  let dot = "bg-zinc-400";

  switch (norm) {
    case "DRAFT":
      bg = "bg-slate-50 dark:bg-slate-800/50";
      text = "text-slate-700 dark:text-slate-300";
      border = "border-slate-200 dark:border-slate-700";
      dot = "bg-slate-400";
      break;
    case "SUBMITTED":
    case "RETURNED":
      bg = "bg-amber-50 dark:bg-amber-500/10";
      text = "text-amber-700 dark:text-amber-400";
      border = "border-amber-200 dark:border-amber-500/20";
      dot = "bg-amber-500";
      break;
    case "UNDER_REVIEW":
      bg = "bg-blue-50 dark:bg-blue-500/10";
      text = "text-blue-700 dark:text-blue-400";
      border = "border-blue-200 dark:border-blue-500/20";
      dot = "bg-blue-500 animate-pulse";
      break;
    case "APPROVED":
    case "COMPLETED":
      bg = "bg-emerald-50 dark:bg-emerald-500/10";
      text = "text-emerald-700 dark:text-emerald-400";
      border = "border-emerald-200 dark:border-emerald-500/20";
      dot = "bg-emerald-500";
      break;
    case "REJECTED":
    case "CANCELLED":
      bg = "bg-red-50 dark:bg-red-500/10";
      text = "text-red-700 dark:text-red-400";
      border = "border-red-200 dark:border-red-500/20";
      dot = "bg-red-500";
      break;
  }

  return (
    <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border ${bg} ${text} ${border} w-fit`}>
      <div className={`w-2 h-2 rounded-full ${dot}`}></div>
      {norm.replace("_", " ")}
    </div>
  );
}

import { SubmissionActions } from "./SubmissionActions";

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ tenantId: string; submissionId: string }>;
}) {
  const { tenantId, submissionId } = await params;
  let s;
  try {
    s = await api.getSubmission(tenantId, submissionId);
  } catch (error) {
    s = null;
  }

  if (!s) {
    return (
      <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 flex flex-col items-center justify-center min-h-[400px]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-red-500 mb-4">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
        </svg>
        <div className="font-semibold text-red-800 dark:text-red-400 text-lg">Submission Not Found</div>
        <div className="mt-2 text-sm text-red-700 dark:text-red-300">The requested submission ID could not be located in this workspace.</div>
        <Link href={`/tenants/${tenantId}/submissions`} className="mt-6 text-sm font-medium text-brand-600 hover:text-brand-700 underline">
            &larr; Back to submissions
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Panel */}
      <div className="sleek-card glass p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link 
                href={`/tenants/${tenantId}/submissions`}
                className="p-1.5 -ml-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-slate-800 text-zinc-500 transition-colors"
                title="Back to submissions"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Submission Details</h1>
          </div>
          <p className="text-sm font-mono text-zinc-500 dark:text-slate-400 pl-8">
            {s.id}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-xs text-zinc-500 dark:text-slate-400 uppercase tracking-widest font-semibold mb-1">Status</p>
                <StatusBadge status={s.status} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (Form Data) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="sleek-card glass overflow-hidden">
            <div className="border-b border-zinc-200 dark:border-slate-700 bg-zinc-50/50 dark:bg-slate-900/50 px-6 py-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-brand-500">
                <path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 0 1 8.75 1h2.5A2.75 2.75 0 0 1 14 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 0 1 6 4.193V3.75Zm6.5 0v.328a41.623 41.623 0 0 0-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25ZM10 10a1 1 0 0 0-1 1v5.028a1.5 1.5 0 0 0 2 0V11a1 1 0 0 0-1-1Z" clipRule="evenodd" />
              </svg>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Form Data</h2>
            </div>
            
            <div className="p-0">
              {s.form_data && typeof s.form_data === 'object' && Object.keys(s.form_data).length > 0 ? (
                <div className="divide-y divide-zinc-100 dark:divide-slate-800">
                  {Object.entries(s.form_data).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-start p-6 hover:bg-zinc-50/50 dark:hover:bg-slate-800/20 transition-colors gap-2 sm:gap-6">
                      <div className="sm:w-1/3 flex-shrink-0">
                        <span className="text-sm font-medium text-zinc-700 dark:text-slate-300">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{key}</div>
                      </div>
                      <div className="sm:w-2/3">
                        {typeof value === 'object' ? (
                          <pre className="text-xs bg-zinc-100 dark:bg-slate-900 p-3 rounded-lg overflow-x-auto text-zinc-800 dark:text-slate-200 border border-zinc-200 dark:border-slate-800">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        ) : (
                          <div className="text-sm text-zinc-900 dark:text-white font-medium bg-zinc-50 dark:bg-slate-800/50 px-3 py-2 rounded-lg border border-zinc-100 dark:border-slate-700/50">
                            {String(value)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-zinc-500">
                  No form data available for this submission.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar (Context & Actions) */}
        <div className="space-y-6">
          <div className="sleek-card glass p-6">
             <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">Metadata</h3>
             <ul className="space-y-4">
                <li>
                  <div className="text-xs text-zinc-500 dark:text-slate-400 mb-1">Template ID</div>
                  <div className="text-sm font-mono text-indigo-600 dark:text-indigo-400 truncate">{s.template_id}</div>
                </li>
                {s.template_version_id && (
                  <li>
                    <div className="text-xs text-zinc-500 dark:text-slate-400 mb-1">Version ID</div>
                    <div className="text-sm font-mono text-zinc-700 dark:text-slate-300 truncate">{s.template_version_id}</div>
                  </li>
                )}
                {s.product_id && (
                  <li>
                    <div className="text-xs text-zinc-500 dark:text-slate-400 mb-1">Product ID</div>
                    <div className="text-sm font-mono text-zinc-700 dark:text-slate-300 truncate">{s.product_id}</div>
                  </li>
                )}
                {s.created_at && (
                  <li>
                    <div className="text-xs text-zinc-500 dark:text-slate-400 mb-1">Created</div>
                    <div className="text-sm text-zinc-900 dark:text-white">
                        {new Date((s as any).created_at).toLocaleString()}
                    </div>
                  </li>
                )}
             </ul>
          </div>

          <div className="sleek-card glass p-6">
             <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">Actions</h3>
             <SubmissionActions tenantId={tenantId} submissionId={submissionId} status={s.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

