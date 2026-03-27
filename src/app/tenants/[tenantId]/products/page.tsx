import { api } from "@/lib/api";
import Link from "next/link";
import { ProductActions } from "./ProductActions";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  let products: Awaited<ReturnType<typeof api.listProducts>> = [];
  let error: string | null = null;
  try {
    products = await api.listProducts(tenantId);
  } catch (e: any) {
    error = e?.message ?? "Failed to load products";
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Products</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage KYC products for workspace{" "}
            <code className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600 text-xs">{tenantId}</code>
          </p>
        </div>
        <Link
          className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors self-start sm:self-auto"
          href={`/tenants/${tenantId}/products/new`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          New Product
        </Link>
      </div>

      {error ? (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6">
          <p className="text-sm font-medium text-zinc-900">Couldn't load products</p>
          <p className="mt-1 text-sm text-zinc-500">{error}</p>
          <p className="mt-3 text-xs text-zinc-400">
            If you just created a tenant, the backend may need a moment to provision the schema.
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-200 rounded-lg text-center">
          <div className="h-10 w-10 rounded-full border border-zinc-200 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-700">No products created</p>
          <p className="mt-1 text-sm text-zinc-400 max-w-xs">Products define what templates are used for onboarding and how submissions are handled.</p>
          <Link
            href={`/tenants/${tenantId}/products/new`}
            className="mt-5 text-sm font-medium text-zinc-900 hover:underline"
          >
            Create your first product →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((p) => {
            const status = (p.status ?? "unknown").toLowerCase();
            const isActive   = status === "active";
            const isDraft    = status === "draft";
            const isInactive = status === "inactive";

            return (
              <div key={p.id} className="sleek-card flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-900 text-white text-sm font-semibold">
                      {p.name.substring(0, 1).toUpperCase()}
                    </div>
                    <StatusBadge status={status} isActive={isActive} isDraft={isDraft} isInactive={isInactive} raw={p.status} />
                  </div>

                  <h3 className="text-sm font-semibold text-zinc-900 truncate">{p.name}</h3>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-zinc-400">
                    <code className="bg-zinc-100 px-1.5 py-0.5 rounded font-mono text-zinc-600">{p.product_code ?? "NO_CODE"}</code>
                    <span>·</span>
                    <span className="font-mono truncate">ID: {p.id.substring(0, 8)}…</span>
                  </div>

                  {p.description && (
                    <p className="mt-3 text-sm text-zinc-500 line-clamp-2">{p.description}</p>
                  )}

                  {p.template_id && (
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      Tpl: {p.template_id.substring(0, 8)}…
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-100 p-3">
                  <ProductActions tenantId={tenantId} productId={p.id} isDraft={isDraft} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, isActive, isDraft, isInactive, raw }: {
  status: string; isActive: boolean; isDraft: boolean; isInactive: boolean; raw?: string;
}) {
  let cls = "border-zinc-200 text-zinc-500";
  let dot = "bg-zinc-400";
  if (isActive)   { cls = "border-zinc-800 bg-zinc-800 text-white"; dot = "bg-white"; }
  if (isDraft)    { cls = "border-zinc-300 text-zinc-600"; dot = "bg-zinc-400"; }
  if (isInactive) { cls = "border-zinc-200 text-zinc-400"; dot = "bg-zinc-300"; }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {(raw ?? status).toUpperCase()}
    </span>
  );
}
