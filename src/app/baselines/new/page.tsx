"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateBaselinePage() {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 text-sm font-medium text-zinc-500 mb-6">
        <Link href="/baselines" className="hover:text-zinc-900 transition-colors">
          Baselines
        </Link>
        <span className="text-zinc-300">/</span>
        <span className="text-zinc-900">Create New</span>
      </div>

      <div className="bg-white p-8 rounded-xl border border-zinc-200 shadow-sm text-center">
        <div className="mx-auto flex h-16 w-16 mb-4 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-zinc-900">Configuration Editor</h2>
        <p className="mt-2 text-sm text-zinc-500 max-w-sm mx-auto">
          The baseline schema editor is currently under development. Please configure global baselines via the JSON REST API directly.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
