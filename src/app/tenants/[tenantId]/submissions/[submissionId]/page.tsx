import { api } from "@/lib/api";

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ tenantId: string; submissionId: string }>;
}) {
  const { tenantId, submissionId } = await params;
  const s = await api.getSubmission(tenantId, submissionId);

  if (!s) {
    return (
      <div className="rounded-xl border bg-white p-5 text-sm text-zinc-500">
        Submission not found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-white p-5">
        <div className="text-sm font-semibold">Submission {s.id}</div>
        <div className="mt-1 text-sm text-zinc-600">
          status: <code>{s.status}</code>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-white">
          <div className="border-b px-5 py-4">
            <div className="text-sm font-semibold">Payload</div>
          </div>
          <pre className="overflow-auto p-5 text-xs leading-5">
            {JSON.stringify(s.payload, null, 2)}
          </pre>
        </div>

        <div className="rounded-xl border bg-white">
          <div className="border-b px-5 py-4">
            <div className="text-sm font-semibold">Decision</div>
          </div>
          <pre className="overflow-auto p-5 text-xs leading-5">
            {JSON.stringify(s.decision ?? {}, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

