"use client";

import React, { useEffect, useState } from "react";
import { portalFetch } from "@/lib/api/client";

type TemplateRow = { id: string; name: string };

export default function TransformRulesPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = React.use(params);
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [templateId, setTemplateId] = useState("");
  const [sourceVersionId, setSourceVersionId] = useState("");
  const [targetVersionId, setTargetVersionId] = useState("");
  const [versions, setVersions] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const tpls = await portalFetch<any[]>(
          `/api/portal/templates?tenantId=${encodeURIComponent(tenantId)}`
        );
        const rows = tpls.map((t: any) => ({ id: t.id, name: t.name }));
        setTemplates(rows);
        if (rows[0]?.id) setTemplateId(rows[0].id);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load templates");
      }
    })();
  }, [tenantId]);

  async function refreshList() {
    if (!templateId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await portalFetch<any[]>(
        `/api/portal/transform-rules?tenantId=${encodeURIComponent(tenantId)}&templateId=${encodeURIComponent(templateId)}`
      );
      setList(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load transform rule sets");
    } finally {
      setLoading(false);
    }
  }

  async function fetchVersions() {
    if (!templateId) {
      setVersions([]);
      return;
    }
    setLoadingVersions(true);
    try {
      const data = await portalFetch<any>(
        `/api/portal/templates/${templateId}?tenantId=${encodeURIComponent(tenantId)}`
      );
      setVersions(data.versions || []);
    } catch (e: any) {
      console.error("Failed to fetch versions:", e);
      setVersions([]);
    } finally {
      setLoadingVersions(false);
    }
  }

  useEffect(() => {
    refreshList();
    fetchVersions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      await portalFetch(`/api/portal/transform-rules/generate`, {
        method: "POST",
        json: {
          tenantId,
          templateId,
          source_version_id: sourceVersionId,
          target_version_id: targetVersionId,
        },
      });
      await refreshList();
      setSourceVersionId("");
      setTargetVersionId("");
    } catch (e: any) {
      setError(e?.message ?? "Generate failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-xl border border-zinc-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-indigo-500">
              <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.438a.75.75 0 0 0 0-1.5H4.25a.75.75 0 0 0-.75.75v3.987a.75.75 0 0 0 1.5 0v-2.04l.311.311a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .208-1.04A7 7 0 0 0 5.038 3.522L4.727 3.211v2.04a.75.75 0 0 0 1.5 0V1.263a.75.75 0 0 0-.75-.75H1.49a.75.75 0 0 0 0 1.5h2.438l-.312.311a5.5 5.5 0 0 1 9.201-2.466.75.75 0 0 0 1.044.208Z" clipRule="evenodd" />
            </svg>
            Transform Rules
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">
            Define migration paths for data automatically mapping between template versions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="sleek-card glass p-6">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-brand-500">
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              Generate New Ruleset
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Template Context</label>
                <select
                  className="w-full rounded-lg border border-zinc-200 dark:border-slate-700 bg-zinc-50/50 dark:bg-slate-900/50 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                >
                  <option value="">Select Template...</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Source Version</label>
                <select
                  className="w-full rounded-lg border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all disabled:opacity-50"
                  value={sourceVersionId}
                  onChange={(e) => setSourceVersionId(e.target.value)}
                  disabled={loadingVersions || versions.length === 0}
                >
                  <option value="">Select version...</option>
                  {versions.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.version_tag} ({v.id.substring(0, 8)})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Target Version</label>
                <select
                  className="w-full rounded-lg border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all disabled:opacity-50"
                  value={targetVersionId}
                  onChange={(e) => setTargetVersionId(e.target.value)}
                  disabled={loadingVersions || versions.length === 0}
                >
                  <option value="">Select version...</option>
                  {versions.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.version_tag} ({v.id.substring(0, 8)})
                    </option>
                  ))}
                </select>
                {versions.length === 0 && templateId && !loadingVersions && (
                  <p className="mt-1.5 text-[10px] text-amber-600 dark:text-amber-400 font-medium">No versions found for this template.</p>
                )}
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-3 text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                className="w-full mt-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-500 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand-500/50 shadow-sm shadow-brand-500/20 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                type="button"
                disabled={!templateId || !sourceVersionId || !targetVersionId || isGenerating}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>Generate Draft</>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">Active Rule Sets</h2>
            <button
              className="rounded-lg border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-slate-300 hover:bg-zinc-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              type="button"
              onClick={refreshList}
              disabled={loading || !templateId}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refresh
            </button>
          </div>

          <div className="sleek-card glass overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-zinc-500">
                <svg className="animate-spin h-8 w-8 text-brand-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div className="text-sm font-medium">Loading rulesets...</div>
              </div>
            ) : list.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2 border-zinc-200 dark:border-slate-700 m-4 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-slate-800 flex items-center justify-center text-zinc-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">No transform rules found</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400 max-w-sm">
                  {templateId ? "Generate a new ruleset using the form on the left." : "Select a template container to view its transform rules."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-200 dark:divide-slate-800">
                {list.map((ruleSet, i) => (
                  <div key={ruleSet.id ?? i} className="p-0 flex flex-col group">
                    <div className="p-5 flex items-start justify-between bg-zinc-50/30 dark:bg-slate-900/30 hover:bg-zinc-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-1 min-w-[120px]">
                          <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white bg-white dark:bg-slate-950 px-2 py-1 rounded border border-zinc-200 dark:border-slate-700 shadow-sm">{ruleSet.source_version_id}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-400">
                            <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-mono font-bold text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-2 py-1 rounded border border-brand-200 dark:border-brand-500/20">{ruleSet.target_version_id}</span>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">Status</p>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            ruleSet.status?.toLowerCase() === 'draft' 
                              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                          }`}>
                            {ruleSet.status === 'draft' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                            {ruleSet.status ?? "DRAFT"}
                          </span>
                        </div>
                      </div>
                      
                      {ruleSet.auto_generated && (
                        <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M14.5 2A1.5 1.5 0 0 1 16 3.5v13a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 16.5v-13A1.5 1.5 0 0 1 4.5 2h10ZM5 14.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5Zm0-2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5Zm0-2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5Zm0-2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5Z" clipRule="evenodd" />
                          </svg>
                          Auto
                        </span>
                      )}
                    </div>
                    
                    <details className="border-t border-zinc-100 dark:border-slate-800">
                      <summary className="px-5 py-3 text-xs font-semibold text-brand-600 dark:text-brand-400 cursor-pointer hover:bg-zinc-50 dark:hover:bg-slate-800/30 w-full text-left outline-none list-none flex items-center justify-between">
                        <span>View JSON Definition</span>
                        <svg className="w-4 h-4 text-zinc-400 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                        </svg>
                      </summary>
                      <div className="p-4 bg-zinc-950 border-t border-zinc-200 dark:border-slate-700">
                        <pre className="text-xs text-zinc-300 font-mono leading-relaxed overflow-auto max-h-[300px]">
                          {JSON.stringify(ruleSet.rules ?? ruleSet, null, 2)}
                        </pre>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

