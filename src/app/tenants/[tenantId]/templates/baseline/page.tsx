import { api } from "@/lib/api";
import Link from "next/link";
import React from "react";

export default async function BaselineTemplatesListPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const baselines = await api.listBaselineTemplates();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-lg border border-zinc-200">
        <h1 className="text-xl font-semibold text-zinc-900">Baseline Templates</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Platform-defined questionnaires. Tenants may extend these baseline components, but cannot modify the root definition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {baselines.map((baseline) => (
          <Link
            key={baseline.id}
            href={`/tenants/${tenantId}/templates/baseline/${baseline.id}`}
            className="sleek-card p-5 hover:border-zinc-800 transition-colors group flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-100 text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M14.5 2A1.5 1.5 0 0 1 16 3.5v13a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 16.5v-13A1.5 1.5 0 0 1 4.5 2h10ZM5 14.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5Zm0-2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5Zm0-2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5Zm0-2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold bg-zinc-900 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                Published
              </span>
            </div>
            
            <h3 className="text-sm font-semibold text-zinc-900 group-hover:underline decoration-zinc-300">
              {baseline.name}
            </h3>
            
            <div className="mt-4 space-y-2 mb-4">
              <div className="flex justify-between text-xs text-zinc-500 font-mono border-b border-zinc-100 pb-2">
                <span>Type</span>
                <span className="text-zinc-900 font-medium uppercase">{baseline.template_type}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-500 font-mono">
                <span>Level</span>
                <span className="text-zinc-900 font-medium tracking-wide">L{baseline.baseline_level}</span>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-medium text-zinc-500 group-hover:text-zinc-900 transition-colors">
              View Schema
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform">
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        ))}
        
        {baselines.length === 0 && (
          <div className="col-span-full border border-zinc-200 bg-white rounded-lg p-16 text-center">
            <p className="text-sm text-zinc-500 font-medium">No baseline templates found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
