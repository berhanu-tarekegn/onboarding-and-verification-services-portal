import Link from "next/link";
import { api } from "@/lib/api";

function StatusBadge({ status }: { status: string }) {
  const norm = (status || "DRAFT").toUpperCase();
  let cls = "border-zinc-200 text-zinc-500 bg-white";
  let dot = "bg-zinc-400";

  switch (norm) {
    case "DRAFT":
      cls = "border-zinc-300 text-zinc-600 bg-zinc-50";
      dot = "bg-zinc-400";
      break;
    case "SUBMITTED":
    case "RETURNED":
      cls = "border-zinc-400 text-zinc-800 bg-zinc-100";
      dot = "bg-zinc-600";
      break;
    case "UNDER_REVIEW":
      cls = "border-zinc-600 text-zinc-900 bg-zinc-100";
      dot = "bg-zinc-900 animate-pulse";
      break;
    case "APPROVED":
    case "COMPLETED":
      cls = "border-zinc-900 bg-zinc-900 text-white";
      dot = "bg-white";
      break;
    case "REJECTED":
    case "CANCELLED":
      cls = "border-zinc-300 text-zinc-500 bg-zinc-50 line-through decoration-zinc-400";
      dot = "bg-zinc-300";
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      {norm.replace("_", " ")}
    </span>
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Submissions</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Review and manage KYC applications for workspace{" "}
            <code className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600 text-xs">{tenantId}</code>
          </p>
        </div>
        <Link
          className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors self-start sm:self-auto"
          href={`/tenants/${tenantId}/submissions/new`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          New Submission
        </Link>
      </div>

      <div className="rounded-lg border border-zinc-200 overflow-hidden bg-white">
        {submissions.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="h-10 w-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-900">No submissions found</p>
            <p className="mt-1 text-sm text-zinc-500 max-w-sm">When users apply for products, their data will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="px-5 py-3.5 font-semibold text-xs text-zinc-500 uppercase tracking-wider">ID</th>
                  <th className="px-5 py-3.5 font-semibold text-xs text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-xs text-zinc-500 uppercase tracking-wider">Template</th>
                  <th className="px-5 py-3.5 font-semibold text-xs text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {submissions.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="font-mono text-sm font-medium text-zinc-900">
                        {s.id.substring(0, 8)}
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5 font-mono">
                        {s.id.substring(0, 32)}…
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium text-zinc-900">
                        {s.template_id?.substring(0, 8) ?? "—"}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/tenants/${tenantId}/submissions/${s.id}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
                      >
                        Details
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors">
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
