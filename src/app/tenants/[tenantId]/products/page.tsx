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
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-xl border border-zinc-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Products</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">
            Manage KYC products for workspace <code className="font-mono bg-zinc-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-zinc-700 dark:text-slate-300">{tenantId}</code>
          </p>
        </div>
        <Link
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 shadow-sm shadow-brand-500/30 transition-all flex items-center gap-2"
          href={`/tenants/${tenantId}/products/new`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          New Product
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6">
          <div className="font-semibold text-red-800 dark:text-red-400">Couldn’t load products</div>
          <div className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</div>
          <div className="mt-4 text-xs text-red-600/80 dark:text-red-400/80">
            This error comes from the backend. If you just created a tenant, the backend may need a moment to provision the schema.
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="sleek-card glass p-12 text-center rounded-xl flex flex-col items-center justify-center border-dashed border-2">
            <div className="h-12 w-12 rounded-full bg-brand-50 dark:bg-slate-800 flex items-center justify-center text-brand-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">No products created</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400 max-w-sm">Products define what templates are used for onboarding and how submissions are handled.</p>
            <Link 
                href={`/tenants/${tenantId}/products/new`}
                className="mt-6 text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-500"
            >
                Create your first product &rarr;
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((p) => {
            const isDraft = p.status?.toLowerCase() === 'draft';
            const isActive = p.status?.toLowerCase() === 'active';
            const isInactive = p.status?.toLowerCase() === 'inactive';
            
            return (
              <div key={p.id} className="sleek-card glass flex flex-col h-full">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border border-indigo-100 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 text-lg font-bold">
                        {p.name.substring(0, 1)}
                    </div>
                    {/* Status Badge */}
                    <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border
                        ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : ''}
                        ${isDraft ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' : ''}
                        ${isInactive ? 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' : ''}
                        ${!isActive && !isDraft && !isInactive ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                    `}>
                        {(isActive || isDraft) && (
                            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                        )}
                        {p.status ? p.status.toUpperCase() : 'UNKNOWN'}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-1">{p.name}</h3>
                  <div className="mt-1.5 flex items-center text-xs text-zinc-500 dark:text-slate-400 gap-2">
                    <span className="font-mono bg-zinc-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-zinc-700 dark:text-slate-300">
                      {p.product_code ?? "NO_CODE"}
                    </span>
                    <span>•</span>
                    <span className="truncate" title={p.id}>ID: <span className="font-mono">{p.id.substring(0, 8)}...</span></span>
                  </div>
                  
                  {p.description && (
                    <p className="mt-4 text-sm text-zinc-600 dark:text-slate-300 line-clamp-2">
                      {p.description}
                    </p>
                  )}
                  
                  {p.template_id && (
                      <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-xs font-medium text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 w-fit">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                              <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v11.5A2.25 2.25 0 0 0 4.25 18h11.5A2.25 2.25 0 0 0 18 15.75V4.25A2.25 2.25 0 0 0 15.75 2H4.25Zm4.03 6.28a.75.75 0 0 0-1.06-1.06L4.97 9.47a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 0 0 1.06-1.06L6.56 10l1.72-1.72Zm4.5-1.06a.75.75 0 1 0-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06l2.25-2.25a.75.75 0 0 0 0-1.06l-2.25-2.25Z" clipRule="evenodd" />
                          </svg>
                          <span className="truncate max-w-[150px]" title={p.template_id}>Tpl: {p.template_id.substring(0, 8)}...</span>
                      </div>
                  )}
                </div>
                
                <div className="p-4 border-t border-zinc-100 dark:border-slate-800 bg-zinc-50/50 dark:bg-slate-900/50 rounded-b-xl">
                  <ProductActions 
                    tenantId={tenantId}
                    productId={p.id}
                    isDraft={isDraft}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

