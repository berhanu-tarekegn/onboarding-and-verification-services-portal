import Link from "next/link";
import { api } from "@/lib/api";

function StatusBadge({ status }: { status: string }) {
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
    <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${bg} ${text} ${border} w-fit`}>
      <div className={`w-1.5 h-1.5 rounded-full ${dot}`}></div>
      {norm.replace("_", " ")}
    </div>
  );
}

export default async function SubmissionsListPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  let submissions: Awaited<ReturnType<typeof api.listSubmissions>> = [];
  try {
    submissions = await api.listSubmissions(tenantId);
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-xl border border-zinc-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-300">
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-brand-500">
              <path fillRule="evenodd" d="M4.5 2A2.5 2.5 0 0 0 2 4.5v11A2.5 2.5 0 0 0 4.5 18h11a2.5 2.5 0 0 0 2.5-2.5V7.621a2.5 2.5 0 0 0-.732-1.768l-2.621-2.621A2.5 2.5 0 0 0 12.879 2.5H4.5ZM16 11.23a.75.75 0 0 0-1.077-1.06l-4.223 4.283-1.639-1.639a.75.75 0 0 0-1.06 1.06l2.17 2.17a.75.75 0 0 0 1.061-.001L16 11.23Z" clipRule="evenodd" />
            </svg>
            Submissions
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">
            Create and review applications for workspace <code className="font-mono bg-zinc-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-zinc-700 dark:text-slate-300">{tenantId}</code>
          </p>
        </div>
        <Link
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-500 active:scale-[0.98] shadow-sm shadow-brand-500/30 transition-all flex items-center gap-2 uppercase tracking-wider"
          href={`/tenants/${tenantId}/submissions/new`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          New Submission
        </Link>
      </div>

      <div className="sleek-card glass overflow-hidden">
        {submissions.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-brand-50 dark:bg-slate-800 flex items-center justify-center text-brand-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">No submissions found</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400 max-w-sm">When users apply for products, their data will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50/50 dark:bg-slate-950/50 border-b border-zinc-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-zinc-500 dark:text-slate-400">ID</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-zinc-500 dark:text-slate-400">Status</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-zinc-500 dark:text-slate-400">Template</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-zinc-500 dark:text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-slate-800 bg-transparent">
                {submissions.map((s) => (
                  <tr key={s.id} className="hover:bg-brand-500/[0.02] dark:hover:bg-brand-500/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-slate-800 px-2 py-1 rounded w-fit">
                        {s.id.substring(0, 8)}
                      </div>
                      <div className="text-[10px] text-zinc-400 dark:text-slate-500 mt-1 font-mono">
                        {s.id.substring(0, 32)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-zinc-900 dark:text-white">
                        {s.template_id?.substring(0, 8) ?? "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/tenants/${tenantId}/submissions/${s.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-zinc-700 dark:text-slate-300 hover:bg-zinc-50 dark:hover:bg-slate-700 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-500/50 transition-all shadow-sm active:scale-[0.98]"
                      >
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform">
                          <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

