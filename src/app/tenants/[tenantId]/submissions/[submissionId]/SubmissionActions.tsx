"use client";

import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SubmissionActions({
  tenantId,
  submissionId,
  status,
}: {
  tenantId: string;
  submissionId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const norm = (status || "DRAFT").toUpperCase();

  const handleAction = async (action: "submit" | "approve" | "reject" | "return") => {
    setLoading(true);
    setError(null);
    try {
      if (action === "submit") {
        await api.submitSubmission(tenantId, submissionId);
      } else {
        const targetStatus = action === "approve" ? "approved" : action === "reject" ? "rejected" : "returned";
        await api.transitionSubmission(tenantId, submissionId, targetStatus, `Automatically transitioned to ${targetStatus} via portal UI`);
      }
      router.refresh(); // Reload server data
    } catch (e: any) {
      setError(e?.message ?? `Failed to ${action} submission`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}
      
      {norm === "DRAFT" && (
        <button
          disabled={loading}
          onClick={() => handleAction("submit")}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Submit for Review"}
        </button>
      )}

      {norm === "UNDER_REVIEW" && (
        <>
          <button
            disabled={loading}
            onClick={() => handleAction("approve")}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Approve Application"}
          </button>
          
          <div className="flex gap-3 mt-3">
            <button
              disabled={loading}
              onClick={() => handleAction("reject")}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-2 text-sm font-semibold shadow-sm hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 disabled:opacity-50"
            >
              Reject
            </button>
            <button
              disabled={loading}
              onClick={() => handleAction("return")}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 px-4 py-2 text-sm font-semibold shadow-sm hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 disabled:opacity-50"
            >
              Return
            </button>
          </div>
        </>
      )}

      {["APPROVED", "REJECTED", "RETURNED", "COMPLETED", "CANCELLED"].includes(norm) && (
        <p className="text-xs text-zinc-500 text-center">
          No further actions available for {norm.toLowerCase()} submissions.
        </p>
      )}
    </div>
  );
}
