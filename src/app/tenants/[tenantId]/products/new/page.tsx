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
    <div className="mx-auto w-full max-w-xl space-y-4">
      <div className="rounded-xl border bg-white p-5">
        <div className="text-sm font-semibold">Create product</div>
        <div className="mt-1 text-sm text-zinc-600">
          Creates a product under tenant <code>{tenantId}</code>.
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 space-y-4">
        <div>
          <div className="text-sm font-medium">Product code</div>
          <input
            className="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            placeholder="e.g. KYC_BASIC"
          />
        </div>
        <div>
          <div className="text-sm font-medium">Name</div>
          <input
            className="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Basic KYC"
          />
        </div>
        <div>
          <div className="text-sm font-medium">Description (optional)</div>
          <textarea
            className="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this product is used for…"
          />
        </div>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <div className="flex items-center gap-2">
          <button
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            type="button"
            disabled={saving || !canSave}
            onClick={async () => {
              setSaving(true);
              setError(null);
              try {
                await api.createProduct(tenantId, {
                  product_code: productCode.trim(),
                  name: name.trim(),
                  description: description.trim() ? description.trim() : undefined,
                });
                router.replace(`/tenants/${tenantId}/products`);
                router.refresh();
              } catch (e: any) {
                setError(e?.message ?? "Failed to create product");
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Creating…" : "Create"}
          </button>
          <button
            className="rounded-md border px-3 py-2 text-sm hover:bg-zinc-50"
            type="button"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

