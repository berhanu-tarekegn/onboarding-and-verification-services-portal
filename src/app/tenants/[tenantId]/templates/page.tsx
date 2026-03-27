"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Template } from "@/lib/types/domain";
import Link from "next/link";

export default function TemplatesPage() {
  const router = useRouter();
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
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-xl border border-zinc-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-300">
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-brand-500">
              <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v11.5A2.25 2.25 0 0 0 4.25 18h11.5A2.25 2.25 0 0 0 18 15.75V4.25A2.25 2.25 0 0 0 15.75 2H4.25ZM8.28 8.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l2.25-2.25a.75.75 0 0 0-1.06-1.06L10 9.94 8.28 8.22Z" clipRule="evenodd" />
            </svg>
            Templates & Questionnaires
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">
            Manage your KYC configurations by extending global baselines.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Link 
              href={`/tenants/${tenantId}/templates/baseline`}
              className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-slate-800 transition-colors"
            >
              View Global Baselines
            </Link>
          </div>
          <Link 
            href={`/tenants/${tenantId}/templates/new`}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 shadow-sm transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            Create New Template
          </Link>
        </div>

        {/* Templates List */}
        <div className="grid gap-6">
          <div className="sleek-card glass overflow-hidden">
            <div className="border-b border-zinc-200 dark:border-slate-800 bg-zinc-50/50 dark:bg-slate-900/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">Your Custom Templates</h2>
            </div>
            
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-zinc-500">Loading templates...</p>
              </div>
            ) : templates.length > 0 ? (
              <div className="divide-y divide-zinc-100 dark:divide-slate-800">
                {templates.map((t) => (
                  <div key={t.id} className="p-6 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-brand-900/5 transition-colors group">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-zinc-900 dark:text-white">{t.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${t.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                          {t.is_active ? 'Active' : 'Draft'}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-xs text-zinc-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                          {t.template_type.toUpperCase()}
                        </span>
                        <span>Level: {t.baseline_level}</span>
                        <span className="font-mono opacity-60">ID: {t.id.substring(0, 8)}...</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <Link 
                        href={`/tenants/${tenantId}/templates/extensions`}
                        className="p-2 rounded-lg text-zinc-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all"
                        title="View & Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                          <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                          <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center">
                <div className="h-16 w-16 bg-zinc-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>
                <h3 className="text-zinc-900 dark:text-white font-semibold">No custom templates yet</h3>
                <p className="mt-1 text-sm text-zinc-500 max-w-xs mx-auto mb-6">
                  Create your first template by extending a baseline KYC questionnaire.
                </p>
                <Link 
                  href={`/tenants/${tenantId}/templates/new`}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 transition-all"
                >
                  Create New Template
                </Link>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="sleek-card glass p-6">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">How it works</h3>
                <ul className="space-y-3 text-sm text-zinc-500 dark:text-slate-400">
                  <li className="flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900 text-[10px] font-bold text-brand-700 dark:text-brand-300">1</span>
                    <span>Pick a <b>Baseline</b> (Global standard)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900 text-[10px] font-bold text-brand-700 dark:text-brand-300">2</span>
                    <span>Create an <b>Extension</b> (Add your questions)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900 text-[10px] font-bold text-brand-700 dark:text-brand-300">3</span>
                    <span>Attach to a <b>Product</b> to start collecting submissions</span>
                  </li>
                </ul>
             </div>
             
             <div className="sleek-card glass p-6 border-indigo-100 dark:border-indigo-900/30">
                <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-2">System Admin Info</h3>
                <p className="text-sm text-indigo-700/70 dark:text-indigo-400/70 mb-4">
                  Baseline templates are managed at the system level and provide the foundation for all tenant questionnaires.
                </p>
                <Link 
                  href={`/tenants/${tenantId}/templates/baseline`}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                   View available baselines
                   <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
