"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface ProductActionsProps {
  tenantId: string;
  productId: string;
  isDraft: boolean;
}

export function ProductActions({ tenantId, productId, isDraft }: ProductActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async () => {
    if (!confirm("Are you sure you want to activate this product? Once active, it will be visible to users.")) return;
    setLoading(true);
    setError(null);
    try {
      await api.activateProduct(tenantId, productId);
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Failed to activate product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2 w-full">
        <button
          onClick={() => router.push(`/tenants/${tenantId}/products/${productId}/edit`)}
          className="flex-1 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors disabled:opacity-50"
          type="button"
          disabled={loading}
        >
          Edit
        </button>
        {isDraft && (
          <button
            onClick={handleActivate}
            className="flex-1 rounded-md bg-zinc-900 border border-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors disabled:opacity-50"
            type="button"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 mx-auto" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              "Activate"
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-zinc-500 mt-0.5">{error}</p>
      )}
    </div>
  );
}
