import { api } from "@/lib/api";
import { mergeEffectiveSchema } from "@/lib/schema/mergeEffectiveSchema";
import type { FormSchema } from "@/lib/types/domain";
import Link from "next/link";
import React from "react";
import { portalFetch } from "@/lib/api/client";

export default async function TemplateExtensionsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const baselines = await api.listBaselineTemplates();
  const baseline = baselines[0] ? await api.getBaselineTemplate(baselines[0].id) : null;
  const templates = await api.listTemplatesForTenant(tenantId);

  const firstActive = templates.find(t => t.active_version_id);

  let firstExtensionWithSchema = null;
  if (firstActive) {
    const def = await portalFetch<{ question_groups: any }>(
      `/api/portal/templates/${firstActive.id}/definitions/${firstActive.active_version_id}?tenantId=${encodeURIComponent(tenantId)}`
    ).catch(() => null);

    if (def && typeof def === 'object' && 'question_groups' in def) {
      firstExtensionWithSchema = {
        ...firstActive,
        schema: { title: firstActive.name, fields: def.question_groups }
      };
    }
  }

  const effective: FormSchema | undefined =
    baseline && firstExtensionWithSchema && baseline.schema && firstExtensionWithSchema.schema
      ? mergeEffectiveSchema({
        baseline: baseline.schema as FormSchema,
        extension: firstExtensionWithSchema.schema as FormSchema,
      })
      : baseline?.schema
        ? (baseline.schema as FormSchema)
        : undefined;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Workspace Configuration</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Combine your workspace-specific fields with global{" "}
            <Link href={`/tenants/${tenantId}/templates/baseline`} className="font-medium text-zinc-900 underline decoration-zinc-300 hover:decoration-zinc-900 transition-colors">
              Baseline
            </Link>{" "}
            standards.
          </p>
        </div>
        <Link
          className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors self-start sm:self-auto"
          href={`/tenants/${tenantId}/templates/new`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          New Extension
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Side: Tenant Extensions List */}
        <div className="rounded-lg border border-zinc-200 bg-white flex flex-col h-[700px] overflow-hidden">
          <div className="border-b border-zinc-100 bg-zinc-50 px-5 py-4">
            <div className="flex items-center gap-2 text-zinc-900 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <h2 className="text-sm font-semibold text-zinc-900">Workspace Add-ons</h2>
            </div>
            <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">
              Extensions for <code className="lowercase bg-zinc-200 px-1 rounded text-zinc-700">{tenantId}</code>
            </p>
          </div>

          <div className="p-5 flex-1 overflow-auto bg-white space-y-3">
            {templates.length > 0 ? (
              templates.map(ext => (
                <Link key={ext.id} href={`/tenants/${tenantId}/templates/${ext.id}`} className="block group">
                  <div className="p-4 rounded-lg border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-zinc-900 group-hover:underline decoration-zinc-300">
                        {ext.name}
                      </h3>
                      {ext.active_version_id ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold bg-zinc-900 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                      <div className="flex items-center gap-1.5 bg-zinc-100 px-1.5 py-0.5 rounded">
                        <span className="font-medium">{ext.template_type.toUpperCase()}</span>
                        <span className="text-zinc-300">•</span>
                        <span>L{ext.baseline_level}</span>
                      </div>
                      <span className="font-mono truncate max-w-[120px]">ID: {ext.active_version_id ?? ext.id}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="h-10 w-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-zinc-700">No extensions defined</div>
                <div className="mt-1 text-xs text-zinc-400 max-w-[200px]">
                  Only using the baseline. Click "New Extension" to add fields.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Effective Schema Preview */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-900 flex flex-col h-[700px] overflow-hidden">
          <div className="border-b border-zinc-800 bg-zinc-950 px-5 py-4 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                </svg>
                <h2 className="text-sm font-semibold text-white">Effective Schema Preview</h2>
              </div>
              {effective && (
                <span className="text-[10px] font-bold bg-white text-zinc-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Merged
                </span>
              )}
            </div>
            <div className="text-xs text-zinc-500 font-medium">
              Baseline {firstExtensionWithSchema ? "+ Active Extension" : "Only"}
            </div>
          </div>

          <div className="p-4 flex-1 overflow-auto bg-zinc-900">
            {effective ? (
              <pre className="text-[11px] leading-snug text-zinc-300 font-mono h-full">
                {JSON.stringify(effective, null, 2)}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="h-10 w-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-zinc-400">Preview Unavailable</div>
                <div className="mt-1 text-xs text-zinc-600 max-w-[200px]">
                  Could not merge baseline. It might be missing.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
