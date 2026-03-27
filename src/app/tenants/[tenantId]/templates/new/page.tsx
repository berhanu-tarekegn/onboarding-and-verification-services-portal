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
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <div className="rounded-xl border bg-white p-5">
        <div className="text-sm font-semibold">Create template</div>
        <div className="mt-1 text-sm text-zinc-600">
          Creates a template under tenant <code>{tenantId}</code>.
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 space-y-4">
        <div>
          <div className="text-sm font-medium">Name</div>
          <input
            className="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. KYC Extension v1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">Template Type</div>
            <select
              className="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm"
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value)}
            >
              <option value="kyc">KYC</option>
              <option value="kyb">KYB</option>
            </select>
          </div>
          <div>
            <div className="text-sm font-medium">Baseline Level</div>
            <input
              type="number"
              min={1}
              className="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm"
              value={baselineLevel}
              onChange={(e) => setBaselineLevel(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>

        <div>
          <div className="text-sm font-medium">Schema (JSON)</div>
          <textarea
            className="mt-2 w-full rounded-md border bg-white px-3 py-2 font-mono text-xs leading-5"
            rows={14}
            value={schemaText}
            onChange={(e) => setSchemaText(e.target.value)}
          />
          {!parsed.ok ? (
            <div className="mt-2 text-sm text-red-600">JSON error: {parsed.error}</div>
          ) : null}
        </div>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <div className="flex items-center gap-2">
          <button
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
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
            {saving ? "Creating…" : "Create"}
          </button>
          <button
            className="rounded-md border px-3 py-2 text-sm hover:bg-zinc-50"
            type="button"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

