import { api } from "@/lib/api";

export default async function TenantDashboardPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  const [productsRes, templatesRes, casesRes] = await Promise.allSettled([
    api.listProducts(tenantId),
    api.listTemplatesForTenant(tenantId),
    api.listSubmissions(tenantId),
  ]);

  const productsCount = productsRes.status === "fulfilled" ? productsRes.value.length : null;
  const templatesCount = templatesRes.status === "fulfilled" ? templatesRes.value.length : null;
  const submissionsCount = casesRes.status === "fulfilled" ? casesRes.value.length : null;
  const pendingReviews =
    casesRes.status === "fulfilled"
      ? casesRes.value.filter((c) => {
          const s = String((c as any).status ?? "").toLowerCase();
          return s.includes("pending") || s.includes("review");
        }).length
      : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-white p-5">
        <div className="text-sm font-semibold">Dashboard</div>
        <div className="mt-1 text-sm text-zinc-600">
          Tenant dashboard for <b>{tenantId}</b>.
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Products" value={fmtCount(productsCount)} />
        <MetricCard label="Templates" value={fmtCount(templatesCount)} />
        <MetricCard label="Submissions" value={fmtCount(submissionsCount)} />
        <MetricCard label="Pending reviews" value={fmtCount(pendingReviews)} />
      </div>
    </div>
  );
}

function fmtCount(v: number | null) {
  return v === null ? "!" : String(v);
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

