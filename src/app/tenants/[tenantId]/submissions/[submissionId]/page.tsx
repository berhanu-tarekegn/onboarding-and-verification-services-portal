import { api } from "@/lib/api";
import { cookies } from "next/headers";
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

  // Determine the current logged-in user from the session cookie.
  // We decode the JWT `sub` claim client-side to avoid an extra /me round-trip.
  let currentUserId: string | null = null;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (token) {
      // Safely decode the JWT payload (base64url, middle segment).
      const payloadB64 = token.split(".")[1];
      if (payloadB64) {
        const json = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
        currentUserId = json?.sub ?? json?.preferred_username ?? null;
      }
    }
  } catch {
    // Auth disabled or token absent — isOwner stays false.
  }

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
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-xl border border-zinc-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-300">
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex items-center gap-4">
          <Link 
            href={`/tenants/${tenantId}/submissions`}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-slate-800 text-zinc-500 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-slate-700 active:scale-95"
            title="Back to submissions"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              Submission Details
            </h1>
            <p className="mt-1 text-[10px] font-mono text-zinc-400 dark:text-slate-500 bg-zinc-50 dark:bg-slate-950 px-2 py-0.5 rounded border border-zinc-100 dark:border-slate-800 w-fit">
              ID: {s.id}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-[10px] text-zinc-400 dark:text-slate-500 uppercase tracking-widest font-bold mb-1.5">Runtime Status</p>
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
          <div className="sleek-card glass p-6 border-brand-500/10 dark:border-brand-500/5">
             <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-brand-500">
                 <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 1.838a1.75 1.75 0 0 0 3.391.851.75.75 0 0 0-1.483-.243l-.459-1.838a1.75 1.75 0 0 0-3.391-.851.75.75 0 0 0 1.483.243L9 10.5V9Z" clipRule="evenodd" />
               </svg>
               System Context
             </h3>
             <ul className="space-y-5">
                <li>
                  <div className="text-[10px] font-bold text-zinc-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Template Instance</div>
                  <div className="text-xs font-mono text-brand-600 dark:text-brand-400 truncate bg-brand-50 dark:bg-brand-500/5 px-2.5 py-1.5 rounded-lg border border-brand-100 dark:border-brand-500/10">
                    {s.template_id}
                  </div>
                </li>
                {s.template_version_id && (
                  <li>
                    <div className="text-[10px] font-bold text-zinc-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Version Ref</div>
                    <div className="text-xs font-mono text-zinc-700 dark:text-slate-300 truncate bg-zinc-50 dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-zinc-100 dark:border-slate-800">
                      {s.template_version_id}
                    </div>
                  </li>
                )}
                {s.product_id && (
                  <li>
                    <div className="text-[10px] font-bold text-zinc-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Origin Product</div>
                    <div className="text-xs font-mono text-zinc-700 dark:text-slate-300 truncate bg-zinc-50 dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-zinc-100 dark:border-slate-800">
                      {s.product_id}
                    </div>
                  </li>
                )}
                {s.created_at && (
                  <li>
                    <div className="text-[10px] font-bold text-zinc-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Creation Timestamp</div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-400">
                          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
                        </svg>
                        {new Date((s as any).created_at).toLocaleString()}
                    </div>
                  </li>
                )}
             </ul>
          </div>

          <div className="sleek-card p-6 bg-brand-500/5 dark:bg-brand-500/10 border-brand-500/20">
             <h3 className="text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-5 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                 <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
               </svg>
               Workflow Actions
             </h3>
             <SubmissionActions
                tenantId={tenantId}
                submissionId={submissionId}
                status={s.status}
                isOwner={!!(currentUserId && (s as any).created_by && currentUserId === (s as any).created_by)}
              />
          </div>
        </div>
      </div>
    </div>
  );
}

