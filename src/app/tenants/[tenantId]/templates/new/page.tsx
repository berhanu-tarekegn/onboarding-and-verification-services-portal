"use client";

import React, { useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { api } from "@/lib/api";

function tryParseJson(text: string): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    const v = JSON.parse(text);
    return { ok: true, value: v };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Invalid JSON" };
  }
}

type FieldType = "text" | "dropdown" | "date" | "checkbox" | "radio" | "fileUpload" | "signature";

interface Field {
  unique_key: string;
  label: string;
  field_type: FieldType;
  required: boolean;
  options?: { value: string; display_order: number }[];
}

function TemplateBuilderForm({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const existingTemplateId = searchParams.get("templateId");
  const baselineIdFromQuery = searchParams.get("baselineId");
  
  const [baselineId, setBaselineId] = useState<string | null>(baselineIdFromQuery);
  const isNewVersion = !!existingTemplateId && !baselineId;

  const [name, setName] = useState("");
  const [templateType, setTemplateType] = useState("kyc");
  const [baselineLevel, setBaselineLevel] = useState(1);
  const [schemaText, setSchemaText] = useState("{\n  \"fields\": []\n}\n");
  const [fields, setFields] = useState<Field[]>([]);
  const [viewMode, setViewMode] = useState<"builder" | "json">("builder");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New field state
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<FieldType>("text");
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  const parsed = useMemo(() => tryParseJson(schemaText), [schemaText]);

  // Handle seeding from baseline
  React.useEffect(() => {
    if (baselineId) {
      api.getBaselineTemplate(baselineId).then(b => {
        if (b) {
          setTemplateType(b.template_type);
          setBaselineLevel(b.baseline_level);
          setName(`Extension of ${b.name}`);
        }
      });
    }
  }, [baselineId]);

  // Handle loading existing template version if editing
  React.useEffect(() => {
    if (existingTemplateId && !baselineId) { // Only try if we don't already have baselineId
        api.getTemplate(tenantId, existingTemplateId).then(t => {
            if (t) {
                setName(t.name);
                setTemplateType(t.template_type);
                setBaselineLevel(t.baseline_level);
            }
        }).catch(async (err) => {
            // If fetching as a tenant template fails, maybe it's a baseline ID (migration/link error)
            const b = await api.getBaselineTemplate(existingTemplateId).catch(() => null);
            if (b) {
                // Auto-correct: treat this as a baseline seed
                console.log("Auto-correcting: Template ID is actually a baseline ID");
                setBaselineId(existingTemplateId);
                setTemplateType(b.template_type);
                setBaselineLevel(b.baseline_level);
                setName(`Extension of ${b.name}`);
            }
        });
    }
  }, [existingTemplateId, baselineId, tenantId]);

  const syncToJson = (currentFields: Field[]) => {
    const json = {
      fields: currentFields.map((f, idx) => ({
        unique_key: f.unique_key || f.label.toLowerCase().replace(/\s+/g, "_"),
        label: f.label,
        field_type: f.field_type,
        required: f.required,
        display_order: idx + 1,
        options: f.options
      }))
    };
    setSchemaText(JSON.stringify(json, null, 2));
  };

  const syncFromJson = () => {
    if (parsed.ok && typeof parsed.value === 'object' && parsed.value !== null) {
        const val = parsed.value as any;
        const groups = val.fields || [];
        // Flatten fields for simplicity in builder
        const flatFields: Field[] = groups.flatMap((g: any) => {
            if (g.questions) return g.questions; // Handle nested groups if any
            return [g];
        });
        setFields(flatFields.map((f: any) => ({
            unique_key: f.unique_key || f.key || "",
            label: f.label || f.title || "",
            field_type: f.field_type || f.type || "text",
            required: !!f.required,
            options: f.options
        })));
    }
  };

  const addField = () => {
    if (!newFieldLabel.trim()) return;
    const newField: Field = {
        label: newFieldLabel.trim(),
        unique_key: newFieldLabel.trim().toLowerCase().replace(/\s+/g, "_"),
        field_type: newFieldType,
        required: newFieldRequired
    };
    const updated = [...fields, newField];
    setFields(updated);
    syncToJson(updated);
    setNewFieldLabel("");
    setNewFieldRequired(false);
  };

  const removeField = (index: number) => {
    const updated = fields.filter((_, i) => i !== index);
    setFields(updated);
    syncToJson(updated);
  };

  const canSave = viewMode === 'builder' ? true : parsed.ok;
  const isFormValid = isNewVersion ? canSave : (name.trim().length > 0 && canSave);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-xl border border-zinc-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-300">
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-brand-500">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            {isNewVersion ? "Add Draft Definition" : "Create Extension Template"}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">
            {isNewVersion ? "Create a new draft version for your existing template." : "Define a new KYC configuration by extending global standards."}
          </p>
        </div>
      </div>

      <div className="sleek-card glass p-6 space-y-6">
        {!isNewVersion && (
          <>
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

            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 p-4 flex items-start gap-3 mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 1.838A1.75 1.75 0 0012.428 13.5a.75.75 0 00-1.483-.243l-.459-1.838a1.75 1.75 0 00-3.391-.851A.75.75 0 009 9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Automatic Baseline Inheritance</h4>
                <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1 leading-relaxed">
                  Your new extension will automatically inherit all standards and fields from the published baseline template matching the <span className="font-semibold">Type</span> and <span className="font-semibold">Level</span> selected above. You only need to define your workspace-specific custom fields below.
                </p>
              </div>
            </div>
          </>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-slate-800 pb-2">
            <label className="block text-xs font-bold text-zinc-700 dark:text-slate-300 uppercase tracking-wider">
              {viewMode === "builder" ? "Field Builder" : "Schema Definition (JSON)"}
            </label>
            <div className="flex bg-zinc-100 dark:bg-slate-800 p-1 rounded-lg">
                <button 
                    onClick={() => {
                        syncFromJson();
                        setViewMode("builder");
                    }}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${viewMode === 'builder' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-zinc-500'}`}
                >
                    Builder
                </button>
                <button 
                    onClick={() => {
                        syncToJson(fields);
                        setViewMode("json");
                    }}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${viewMode === 'json' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-zinc-500'}`}
                >
                    JSON
                </button>
            </div>
          </div>

          {viewMode === "builder" ? (
            <div className="space-y-6">
                {/* Field List */}
                <div className="space-y-3">
                  {fields.length === 0 ? (
                    <div className="py-12 border-2 border-dashed border-zinc-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-zinc-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 opacity-50">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <p className="text-sm font-medium">No custom fields added yet</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {fields.map((f, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-slate-900/50 rounded-xl border border-zinc-200 dark:border-slate-800 group transition-all">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-200 dark:bg-slate-800 text-zinc-500 text-[10px] font-bold">
                              {idx + 1}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                    {f.label}
                                    {f.required && <span className="text-red-500">*</span>}
                                </div>
                                <div className="text-[10px] font-mono text-zinc-500 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                                    {f.field_type} / {f.unique_key}
                                </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeField(idx)}
                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* New Field Form */}
                <div className="p-5 rounded-xl border border-brand-200/50 dark:border-brand-500/20 bg-brand-50/30 dark:bg-brand-500/5 flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-[10px] font-bold text-zinc-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Field Label</label>
                      <input 
                        className="w-full rounded-lg border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                        placeholder="e.g. Identity Number"
                        value={newFieldLabel}
                        onChange={e => setNewFieldLabel(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addField()}
                      />
                    </div>
                    <div className="w-40">
                      <label className="block text-[10px] font-bold text-zinc-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Type</label>
                      <select 
                        className="w-full rounded-lg border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-zinc-900 dark:text-white outline-none"
                        value={newFieldType}
                        onChange={e => setNewFieldType(e.target.value as FieldType)}
                      >
                        <option value="text">Short Text</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="date">Date</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="radio">Radio</option>
                        <option value="fileUpload">File Upload</option>
                        <option value="signature">Signature</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 pb-2.5">
                        <input 
                          type="checkbox" 
                          id="req" 
                          className="w-4 h-4 rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
                          checked={newFieldRequired}
                          onChange={e => setNewFieldRequired(e.target.checked)}
                        />
                        <label htmlFor="req" className="text-xs font-bold text-zinc-600 dark:text-slate-400 uppercase tracking-wide cursor-pointer select-none">Required</label>
                    </div>
                    <button 
                        onClick={addField}
                        disabled={!newFieldLabel.trim()}
                        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-500 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                        Add Field
                    </button>
                </div>
            </div>
          ) : (
            <div>
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
          )}
        </div>

        {error ? (
          <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-5 text-sm text-red-600 dark:text-red-400">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 mt-0.5">
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="font-bold underline mb-2 uppercase tracking-wide text-xs">Creation Failed</p>
                <p className="mb-3 leading-relaxed">{error}</p>
                
                {error.includes("tenant_schema_outdated") && (
                  <div className="mt-4 p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-red-200/50 dark:border-red-500/20 space-y-3">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white uppercase flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-brand-500">
                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 1.838a1.75 1.75 0 0 0 3.391.851.75.75 0 0 0-1.483-.243l-.459-1.838a1.75 1.75 0 0 0-3.391-.851.75.75 0 0 0 1.483.243L9 10.5V9Z" clipRule="evenodd" />
                      </svg>
                      Technical Resolution Required
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-slate-400 leading-relaxed font-medium">
                      The workspace database schema for <code className="font-mono text-brand-600 dark:text-brand-400 bg-brand-500/5 px-1 rounded">{tenantId}</code> has not been provisioned yet.
                    </p>
                    <div className="bg-zinc-950 p-3 rounded-md border border-zinc-800">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2 tracking-widest">Run Migration Command</p>
                      <code className="text-[11px] text-emerald-400 font-mono block break-all leading-relaxed">
                        alembic -x tenant_schema=tenant_{tenantId.split('-').join('_')} upgrade head
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
            disabled={saving || !isFormValid}
            onClick={async () => {
              setSaving(true);
              setError(null);
              try {
                let currentTemplateId = existingTemplateId;
                
                // If creating a brand new template, do that first
                if (!isNewVersion) {
                  const template = await api.createTemplate(tenantId, {
                    name: name.trim(),
                    template_type: templateType as any,
                    baseline_level: baselineLevel,
                  });
                  currentTemplateId = template.id;
                }

                if (!currentTemplateId) throw new Error("Template ID missing");

                // Then create the definition for the template (whether new or existing)
                if (viewMode === 'builder') {
                    // For builder mode, we need to generate a valid group structure
                    const groups = [{
                        unique_key: "additional_fields",
                        title: "Additional Information",
                        display_order: 1,
                        questions: fields.map((f, idx) => ({
                            unique_key: f.unique_key,
                            label: f.label,
                            field_type: f.field_type,
                            required: f.required,
                            display_order: idx + 1
                        }))
                    }];
                    // Create as DRAFT (isDraft=true)
                    await api.createTemplateDefinition(tenantId, currentTemplateId, true, groups);
                } else if (parsed.ok && parsed.value) {
                  const val: any = parsed.value;
                  const groups = val.fields ? val.fields : val;
                  // Create as DRAFT (isDraft=true)
                  await api.createTemplateDefinition(tenantId, currentTemplateId, true, Array.isArray(groups) ? groups : []);
                }

                if (isNewVersion) {
                    router.replace(`/tenants/${tenantId}/templates/${existingTemplateId}`);
                } else {
                    router.replace(`/tenants/${tenantId}/templates/extensions`);
                }
                router.refresh();
              } catch (e: any) {
                setError(e?.message ?? (isNewVersion ? "Failed to add definition" : "Failed to create template"));
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              isNewVersion ? "Save Draft Version" : "Create Template"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewTemplatePage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = React.use(params);
  
  return (
    <Suspense fallback={<div className="p-12 text-center text-zinc-500 animate-pulse">Loading builder...</div>}>
      <TemplateBuilderForm tenantId={tenantId} />
    </Suspense>
  );
}

