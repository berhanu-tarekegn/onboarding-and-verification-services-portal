"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Product, Template } from "@/lib/types/domain";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ tenantId: string; productId: string }>;
}) {
  const router = useRouter();
  const { tenantId, productId } = React.use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [p, tpls] = await Promise.all([
          api.getProduct(tenantId, productId),
          api.listTemplatesForTenant(tenantId)
        ]);
        if (p) {
          setProduct(p);
          setName(p.name);
          setDescription(p.description ?? "");
          setTemplateId(p.template_id ?? "");
        }
        setTemplates(tpls);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [tenantId, productId]);

  const canSave = name.trim() && !saving;

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
    </div>
  );

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
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Edit Product</h1>
          <p className="text-sm text-zinc-500 dark:text-slate-400">
            Modify product configuration for <code className="font-mono text-zinc-700 dark:text-slate-300">{product?.product_code}</code>
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
              await api.updateProduct(tenantId, productId, {
                name: name.trim(),
                description: description.trim() ? description.trim() : undefined,
                template_id: templateId || undefined,
              } as any);
              router.push(`/tenants/${tenantId}/products`);
              router.refresh();
            } catch (err: any) {
              setError(err?.message ?? "Failed to update product");
            } finally {
              setSaving(false);
            }
          }}
        >
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">Error: {error}</p>
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
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">KYC Template</label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            >
              <option value="">Select a template...</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.template_type.toUpperCase()} Level {t.baseline_level})</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">Description (Optional)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
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
              {saving ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
