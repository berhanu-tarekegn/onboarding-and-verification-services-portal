"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { DynamicFormRenderer } from "@/components/forms/DynamicFormRenderer";
import type { FormSchema, Product } from "@/lib/types/domain";
import { portalFetch } from "@/lib/api/client";

export default function NewSubmissionPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = React.use(params);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [productId, setProductId] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [kycSchema, setKycSchema] = useState<FormSchema | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const list = await portalFetch<Product[]>(
          `/api/portal/products?tenantId=${encodeURIComponent(tenantId)}`
        );
        const activeProducts = list.filter((p: any) => String(p?.status ?? "").toUpperCase() === "ACTIVE");
        setProducts(activeProducts);
        const first = activeProducts[0]?.id;
        if (first) setProductId(first);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    })();
  }, [tenantId]);

  React.useEffect(() => {
    if (!productId) return;
    (async () => {
      try {
        setError(null);
        const cfg = await portalFetch<any>(
          `/api/portal/products/${encodeURIComponent(productId)}/kyc-config?tenantId=${encodeURIComponent(
            tenantId
          )}`
        );
        const groups = Array.isArray(cfg?.question_groups) ? cfg.question_groups : [];
        const fields = groups
          .flatMap((g: any) => (Array.isArray(g?.questions) ? g.questions : []))
          .sort((a: any, b: any) => (a?.display_order ?? 0) - (b?.display_order ?? 0))
          .map((q: any) => ({
            id: q.unique_key,
            type: q.field_type,
            label: q.label,
            required: q.required,
            regex: q.regex ?? undefined,
            minDate: q.min_date ?? undefined,
            maxDate: q.max_date ?? undefined,
            dependsOn: q.depends_on_unique_key ?? undefined,
            visibleWhenEquals: q.visible_when_equals ?? undefined,
            options: Array.isArray(q.options) ? q.options.map((o: any) => o.value) : undefined,
          }));
        setKycSchema({
          title: cfg?.template_name ?? "KYC",
          fields,
          _templateId: cfg?.template_id,
        } as any);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load KYC config");
        setKycSchema(null);
      }
    })();
  }, [productId, tenantId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-xl border border-zinc-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-300">
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-brand-500">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4.13-5.69Z" clipRule="evenodd" />
            </svg>
            New Submission
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">
            Submit a new KYC application for a specific product.
          </p>
        </div>
      </div>

      <div className="sleek-card glass p-6">
        {loadingProducts ? (
          <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-slate-400">
            <div className="animate-spin h-4 w-4 border-2 border-brand-500 border-t-transparent rounded-full font-bold"></div>
            Loading products...
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="max-w-md">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Target Product</label>
              <select
                className="w-full rounded-lg border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all cursor-pointer"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                {products.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({String(p.status ?? "").toUpperCase()})
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-zinc-500 dark:text-slate-400 font-medium">
                The KYC fields will automatically resolve based on the selected product's configuration.
              </p>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-slate-800">
              {kycSchema ? (
                <DynamicFormRenderer
                  schema={kycSchema}
                  submitLabel={submitting ? "Submitting..." : "Create Submission"}
                  onSubmit={async (values) => {
                    if (submitting) return;
                    setSubmitting(true);
                    try {
                      const created = await portalFetch<any>("/api/portal/submissions", {
                        method: "POST",
                        json: { 
                          tenantId, 
                          form_data: values, 
                          product_id: productId,
                          template_id: (kycSchema as any)._templateId 
                        },
                      });
                      router.push(`/tenants/${tenantId}/submissions/${created.id ?? "new"}`);
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 border-zinc-200 dark:border-slate-700 rounded-xl">
                  <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-slate-800 flex items-center justify-center text-zinc-400 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">No KYC schema resolved</h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-slate-400">
                    This product might not be attached to any active template.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

