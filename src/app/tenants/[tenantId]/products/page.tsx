import { api } from "@/lib/api";
import Link from "next/link";

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
    <div className="space-y-4">
      <div className="rounded-xl border bg-white">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <div className="text-sm font-semibold">Products</div>
            <div className="text-sm text-zinc-500">
              Tenant-scoped products under <code>{tenantId}</code>.
            </div>
          </div>
          <Link
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            href={`/tenants/${tenantId}/products/new`}
          >
            New product
          </Link>
        </div>

        {error ? (
          <div className="px-5 py-8 text-sm">
            <div className="font-medium text-zinc-900">Couldn’t load products</div>
            <div className="mt-1 text-zinc-600">{error}</div>
            <div className="mt-3 text-zinc-500">
              This is coming from the backend (FastAPI/DB). If you just created a tenant,
              the backend may need a restart to clear cached DB plans.
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="px-5 py-8 text-sm text-zinc-500">
            No products yet.
          </div>
        ) : (
          <ul className="divide-y">
            {products.map((p) => (
              <li key={p.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      <span className="rounded bg-zinc-100 px-2 py-1">
                        {p.product_code ?? p.code ?? ""}
                      </span>{" "}
                      <span className="ml-2">{p.id}</span>
                    </div>
                    {p.description ? (
                      <div className="mt-2 text-sm text-zinc-600">
                        {p.description}
                      </div>
                    ) : null}
                  </div>
                  <div className="shrink-0">
                    <button
                      className="rounded-md border px-3 py-2 text-sm hover:bg-zinc-50"
                      type="button"
                      disabled
                      title="Coming soon"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

