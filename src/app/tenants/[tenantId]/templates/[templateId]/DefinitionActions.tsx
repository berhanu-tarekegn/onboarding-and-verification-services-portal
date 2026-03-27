"use client";

import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DefinitionActions({
  tenantId,
  templateId,
  versionId,
  status,
  isLocked,
}: {
  tenantId: string;
  templateId: string;
  versionId: string;
  status: string;
  isLocked: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normStatus = (status || "DRAFT").toUpperCase();

  const handleAction = async (action: "submit" | "approve") => {
    setLoading(true);
    setError(null);
    try {
      if (action === "submit") {
        await api.submitTemplateDefinition(tenantId, templateId, versionId);
      } else if (action === "approve") {
        await api.approveAndPublishTemplateDefinition(tenantId, templateId, versionId);
      }
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? `Failed to ${action} definition`);
    } finally {
      setLoading(false);
    }
  };

  if (isLocked || normStatus === "APPROVED" || normStatus === "ACTIVE") {
    return (
      <span className="text-xs text-zinc-500 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
        </svg>
        Locked
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && (
        <span className="text-[10px] text-red-500 max-w-[150px] truncate" title={error}>
          Error: {error}
        </span>
      )}
      
      {normStatus === "DRAFT" && (
        <button
          disabled={loading}
          onClick={() => handleAction("submit")}
          className="rounded-md bg-zinc-900 border border-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors shadow-sm"
        >
          {loading ? "..." : "Submit for Review"}
        </button>
      )}

      {normStatus === "SUBMITTED" && (
        <button
          disabled={loading}
          onClick={() => handleAction("approve")}
          className="rounded-md bg-emerald-600 border border-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-1.5"
        >
          {loading ? "..." : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4.13-5.69Z" clipRule="evenodd" />
              </svg>
              Approve & Publish
            </>
          )}
        </button>
      )}
    </div>
  );
}
