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
    <div className="space-y-4">
      <div className="rounded-xl border bg-white p-5">
        <div className="text-sm font-semibold">New submission</div>
        <div className="mt-1 text-sm text-zinc-600">
          Select a product, fill the resolved KYC config, and submit.
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5">
        {loadingProducts ? (
          <div className="text-sm text-zinc-500">Loading products…</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium">Product</div>
              <select
                className="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                {products.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({String(p.status ?? "").toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {kycSchema ? (
              <DynamicFormRenderer
                schema={kycSchema}
                submitLabel={submitting ? "Submitting..." : "Create submission"}
                onSubmit={async (values) => {
                  if (submitting) return;
                  setSubmitting(true);
                  try {
                    const created = await portalFetch<any>("/api/portal/submissions", {
                      method: "POST",
                      json: { 
                        tenantId, 
                        payload: values, 
                        productId,
                        templateId: (kycSchema as any)._templateId 
                      },
                    });
                    router.push(`/tenants/${tenantId}/submissions/${created.id ?? "new"}`);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              />
            ) : (
              <div className="text-sm text-zinc-500">
                No KYC schema resolved yet for this product.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

