"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Template } from "@/lib/types/domain";
import Link from "next/link";

export default function TemplatesPage() {
  const { tenantId } = useParams() as { tenantId: string };
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const t = await api.listTemplatesForTenant(tenantId);
        setTemplates(t);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [tenantId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Templates &amp; Questionnaires</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage your KYC configurations by extending global baselines.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href={`/tenants/${tenantId}/templates/baseline`}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            View Baselines
          </Link>
          <Link
            href={`/tenants/${tenantId}/templates/new`}
            className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            Create New Template
          </Link>
        </div>
      </div>

      {/* Template list */}
      <div className="rounded-lg border border-zinc-200 overflow-hidden">
        <div className="border-b border-zinc-100 bg-zinc-50 px-5 py-3.5">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Your Custom Templates</h2>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : templates.length > 0 ? (
          <div className="divide-y divide-zinc-100">
            {templates.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-5 py-4 hover:bg-zinc-50 transition-colors group">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-medium text-zinc-900">{t.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide border ${
                      t.is_active
                        ? "border-zinc-800 bg-zinc-900 text-white"
                        : "border-zinc-200 text-zinc-500"
                    }`}>
                      {t.is_active ? "Active" : "Draft"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-zinc-400">
                    <span className="uppercase font-medium">{t.template_type}</span>
                    <span>·</span>
                    <span>Level {t.baseline_level}</span>
                    <span>·</span>
                    <span className="font-mono">ID: {t.id.substring(0, 8)}…</span>
                  </div>
                </div>
                <Link
                  href={`/tenants/${tenantId}/templates/extensions`}
                  className="p-2 rounded-md text-zinc-300 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                  title="View & Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-10 w-10 rounded-full border border-zinc-200 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-700">No custom templates yet</p>
            <p className="mt-1 text-sm text-zinc-400 max-w-xs">Create your first template by extending a baseline KYC questionnaire.</p>
            <Link
              href={`/tenants/${tenantId}/templates/new`}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
            >
              Create New Template
            </Link>
          </div>
        )}
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-zinc-200 p-5">
          <h3 className="text-sm font-medium text-zinc-900 mb-3">How it works</h3>
          <ol className="space-y-2.5 text-sm text-zinc-500">
            {[
              ["Pick a Baseline", "Global standard questionnaire"],
              ["Create an Extension", "Add your custom questions"],
              ["Attach to a Product", "Start collecting submissions"],
            ].map(([title, desc], i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white mt-0.5">
                  {i + 1}
                </span>
                <span><b className="font-medium text-zinc-700">{title}</b> — {desc}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border border-zinc-200 p-5">
          <h3 className="text-sm font-medium text-zinc-900 mb-2">System Admin Info</h3>
          <p className="text-sm text-zinc-400 mb-4">
            Baseline templates are managed at the system level and provide the foundation for all tenant questionnaires.
          </p>
          <Link
            href={`/tenants/${tenantId}/templates/baseline`}
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-700 hover:underline"
          >
            View available baselines
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
