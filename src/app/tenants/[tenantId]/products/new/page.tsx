"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function NewProductPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const router = useRouter();
  const { tenantId } = React.use(params);

  const [productCode, setProductCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = productCode.trim() && name.trim();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <button 
            onClick={() => router.back()}
            disabled={saving}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-slate-800 text-zinc-500 transition-colors disabled:opacity-50"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">New Product</h1>
          <p className="text-sm text-zinc-500 dark:text-slate-400">
            Define a new KYC product for workspace <code className="font-mono bg-zinc-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-zinc-700 dark:text-slate-300">{tenantId}</code>
          </p>
        </div>
      </div>

      <div className="sleek-card glass p-8">
        <form 
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!canSave) return;
            setSaving(true);
            setError(null);
            try {
              await api.createProduct(tenantId, {
                product_code: productCode.trim().toUpperCase().replace(/[^A-Z0-9_]/g, ''),
                name: name.trim(),
                description: description.trim() ? description.trim() : undefined,
              });
              router.replace(`/tenants/${tenantId}/products`);
              router.refresh();
            } catch (err: any) {
              setError(err?.message ?? "Failed to create product");
            } finally {
              setSaving(false);
            }
          }}
        >
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
              <p className="text-sm text-red-600 dark:text-red-400"><span className="font-bold">Error:</span> {error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">Product Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              placeholder="e.g. Basic KYC Account"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">Product Code</label>
            <input
              type="text"
              required
              value={productCode}
              onChange={(e) => setProductCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
              className="w-full rounded-lg border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all font-mono"
              placeholder="e.g. BASIC_KYC"
            />
            <p className="mt-2 text-xs text-zinc-500 dark:text-slate-400">
              Only uppercase letters, numbers, and underscores. Used to map to core banking systems.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">Description (Optional)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
              placeholder="Briefly describe this product and its requirements..."
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={saving}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 dark:text-slate-300 hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !canSave}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 shadow-sm disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

