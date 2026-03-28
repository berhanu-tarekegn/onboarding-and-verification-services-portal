"use client";

import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SubmissionActions({
  tenantId,
  submissionId,
  status,
  isOwner = false,
}: {
  tenantId: string;
  submissionId: string;
  status: string;
  /** True when the current user is the one who created this submission (four-eyes rule). */
  isOwner?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // Set to true when the backend confirms a four-eyes violation so buttons hide immediately.
  const [fourEyesBlocked, setFourEyesBlocked] = useState(false);

  const norm = (status || "DRAFT").toUpperCase();
  /** True if this user must not be shown review actions. */
  const ownerBlocked = isOwner || fourEyesBlocked;

  const handleAction = async (action: "submit" | "resubmit" | "approve" | "reject" | "return") => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (action === "submit") {
        await api.submitSubmission(tenantId, submissionId);
        setSuccess("Application submitted for review!");
      } else if (action === "resubmit") {
        await api.transitionSubmission(tenantId, submissionId, "submitted", "Re-submitted after corrections");
        setSuccess("Application re-submitted for review!");
      } else {
        const targetStatus = action === "approve" ? "approved" : action === "reject" ? "rejected" : "returned";
        await api.transitionSubmission(tenantId, submissionId, targetStatus, `Transitioned to ${targetStatus} via portal UI`);
        setSuccess(`Application ${targetStatus} successfully!`);
      }
      router.refresh();
    } catch (e: any) {
      const msg = e?.message ?? `Failed to ${action} submission`;
      if (msg.includes("four_eyes_violation")) {
        setFourEyesBlocked(true);
        setError(null); // banner replaces the error message
      } else if (
        msg.includes("already") ||
        msg.includes("validation_error") ||
        msg.includes("Cannot transition from") ||
        msg.includes("bad_request")
      ) {
        setSuccess("Refreshing current status...");
        router.refresh();
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  /** Review actions (approve/reject/return) blocked for the submission owner. */
  const ReviewBlockedBanner = () => (
    <div className="rounded-lg border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 px-4 py-3 flex items-start gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500 shrink-0 mt-0.5">
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 1.838a1.75 1.75 0 0 0 3.391.851.75.75 0 0 0-1.483-.243l-.459-1.838a1.75 1.75 0 0 0-3.391-.851.75.75 0 0 0 1.483.243L9 10.5V9Z" clipRule="evenodd" />
      </svg>
      <div>
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Awaiting a second reviewer</p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
          Four-eyes policy: this submission was created by you and must be reviewed by a different user.
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4.13-5.69Z" clipRule="evenodd" /></svg>
          {success}
        </div>
      )}

      {/* DRAFT: can submit */}
      {norm === "DRAFT" && (
        <button disabled={loading} onClick={() => handleAction("submit")}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-900 dark:bg-white px-4 py-2.5 text-sm font-semibold text-white dark:text-zinc-900 shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-50 transition-all">
          {loading ? "Processing..." : "Submit for Review"}
        </button>
      )}

      {/* SUBMITTED: awaiting admin review */}
      {norm === "SUBMITTED" && (
        <>
          <div className="rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-3 py-2 text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" /></svg>
            Awaiting admin review
          </div>
          {ownerBlocked ? (
            <ReviewBlockedBanner />
          ) : (
            <>
              <button disabled={loading} onClick={() => handleAction("approve")}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50 transition-all">
                {loading ? "Processing..." : "Approve Application"}
              </button>
              <div className="flex gap-2">
                <button disabled={loading} onClick={() => handleAction("reject")}
                  className="flex-1 flex items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm font-semibold hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 disabled:opacity-50">
                  Reject
                </button>
                <button disabled={loading} onClick={() => handleAction("return")}
                  className="flex-1 flex items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-700 px-3 py-2 text-sm font-semibold hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 disabled:opacity-50">
                  Return
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* UNDER_REVIEW: same review actions */}
      {norm === "UNDER_REVIEW" && (
        <>
          {ownerBlocked ? (
            <ReviewBlockedBanner />
          ) : (
            <>
              <button disabled={loading} onClick={() => handleAction("approve")}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50 transition-all">
                {loading ? "Processing..." : "Approve Application"}
              </button>
              <div className="flex gap-2">
                <button disabled={loading} onClick={() => handleAction("reject")}
                  className="flex-1 flex items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm font-semibold hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 disabled:opacity-50">
                  Reject
                </button>
                <button disabled={loading} onClick={() => handleAction("return")}
                  className="flex-1 flex items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-700 px-3 py-2 text-sm font-semibold hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 disabled:opacity-50">
                  Return
                </button>
              </div>
            </>
          )}
        </>
      )}

      {norm === "RETURNED" && (
        <button disabled={loading} onClick={() => handleAction("resubmit")}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-900 dark:bg-white px-4 py-2.5 text-sm font-semibold text-white dark:text-zinc-900 shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-50 transition-all">
          {loading ? "Processing..." : "Re-Submit for Review"}
        </button>
      )}

      {["APPROVED", "REJECTED", "COMPLETED", "CANCELLED"].includes(norm) && (
        <p className="text-xs text-zinc-500 dark:text-slate-400 text-center py-1">
          No further actions available for this {norm.toLowerCase()} submission.
        </p>
      )}
    </div>
  );
}

