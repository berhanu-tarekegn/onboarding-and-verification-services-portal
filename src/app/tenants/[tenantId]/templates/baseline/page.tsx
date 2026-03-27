import { api } from "@/lib/api";

export default async function BaselineTemplatePage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const baseline = await api.getBaselineTemplate();

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-white p-5">
        <div className="text-sm font-semibold">Baseline template</div>
        <div className="mt-1 text-sm text-zinc-600">
          This is the platform-required baseline template. Tenants can only
          extend it.
        </div>
      </div>

      {baseline ? (
        <div className="rounded-xl border bg-white">
          <div className="border-b px-5 py-4">
            <div className="text-sm font-semibold">{baseline.name}</div>
            <div className="text-sm text-zinc-500">
              version {baseline.version} · published · tenant context:{" "}
              <code>{tenantId}</code>
            </div>
          </div>
          <div className="p-5">
            <div className="text-sm font-medium">Definition schema (raw)</div>
            <pre className="mt-3 overflow-auto rounded-lg border bg-zinc-50 p-4 text-xs leading-5">
              {JSON.stringify(baseline.schema ?? {}, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border bg-white p-5 text-sm text-zinc-500">
          No baseline template found.
        </div>
      )}
    </div>
  );
}

