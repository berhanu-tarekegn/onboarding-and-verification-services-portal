import Link from "next/link";
import { api } from "@/lib/api";

export default async function SubmissionsListPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const submissions = await api.listSubmissions(tenantId);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">Submissions</div>
            <div className="mt-1 text-sm text-zinc-600">
              Create and review submissions for <code>{tenantId}</code>.
            </div>
          </div>
          <Link
            href={`/tenants/${tenantId}/submissions/new`}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            New submission
          </Link>
        </div>
      </div>

      <div className="rounded-xl border bg-white">
        <div className="border-b px-5 py-4">
          <div className="text-sm font-semibold">Recent</div>
        </div>
        {submissions.length === 0 ? (
          <div className="px-5 py-8 text-sm text-zinc-500">No submissions yet.</div>
        ) : (
          <ul className="divide-y">
            {submissions.map((s) => (
              <li key={s.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{s.id}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      status: <code>{s.status}</code> · template: <code>{s.templateId}</code>
                    </div>
                  </div>
                  <Link
                    href={`/tenants/${tenantId}/submissions/${s.id}`}
                    className="shrink-0 rounded-md border px-3 py-2 text-sm hover:bg-zinc-50"
                  >
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

