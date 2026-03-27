"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

function tryParseJson(text: string): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    const v = JSON.parse(text);
    return { ok: true, value: v };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Invalid JSON" };
  }
}

export default function NewTemplatePage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const router = useRouter();
  const { tenantId } = React.use(params);

  const [name, setName] = useState("");
  const [templateType, setTemplateType] = useState("kyc");
  const [baselineLevel, setBaselineLevel] = useState(1);
  const [schemaText, setSchemaText] = useState("{\n  \"fields\": []\n}\n");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsed = useMemo(() => tryParseJson(schemaText), [schemaText]);
  const canSave = name.trim().length > 0 && parsed.ok;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-xl border border-zinc-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-300">
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-brand-500">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            Create Extension Template
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">
            Define a new KYC configuration by extending global standards.
          </p>
        </div>
      </div>

      <div className="sleek-card glass p-6 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Template Name</label>
          <input
            className="w-full rounded-lg border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. KYC Extension v1"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Template Type</label>
            <select
              className="w-full rounded-lg border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all cursor-pointer"
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value)}
            >
              <option value="kyc">KYC</option>
              <option value="kyb">KYB</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Baseline Level</label>
            <input
              type="number"
              min={1}
              className="w-full rounded-lg border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-mono"
              value={baselineLevel}
              onChange={(e) => setBaselineLevel(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Schema definition (JSON)</label>
          <textarea
            className="w-full rounded-lg border border-zinc-200 dark:border-slate-700 bg-zinc-900 px-4 py-3 font-mono text-xs leading-5 text-zinc-300 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all shadow-inner"
            rows={14}
            value={schemaText}
            onChange={(e) => setSchemaText(e.target.value)}
          />
          {!parsed.ok ? (
            <div className="mt-2 text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded inline-flex border border-red-200 dark:border-red-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
              Syntax Error: {parsed.error}
            </div>
          ) : (
            <div className="mt-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4.13-5.69Z" clipRule="evenodd" />
              </svg>
              Valid JSON Schema
            </div>
          )}
        </div>

        {error ? (
          <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        ) : null}

        <div className="pt-6 border-t border-zinc-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 dark:text-slate-300 hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            type="button"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-bold text-white hover:bg-brand-500 active:scale-[0.98] shadow-sm shadow-brand-500/20 transition-all uppercase tracking-wider disabled:opacity-50 flex items-center gap-2"
            type="button"
            disabled={saving || !canSave}
            onClick={async () => {
              setSaving(true);
              setError(null);
              try {
                const template = await api.createTemplate(tenantId, {
                  name: name.trim(),
                  template_type: templateType as any,
                  baseline_level: baselineLevel,
                });

                if (parsed.ok && parsed.value) {
                  const val: any = parsed.value;
                  const groups = val.fields ? val.fields : val;
                  await api.createTemplateDefinition(tenantId, template.id, false, Array.isArray(groups) ? groups : []);
                }

                router.replace(`/tenants/${tenantId}/templates/extensions`);
                router.refresh();
              } catch (e: any) {
                setError(e?.message ?? "Failed to create template");
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Creating...
              </>
            ) : (
              "Create Template"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

