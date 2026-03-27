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
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Reuse tenant templates list endpoint (BFF)
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

  useEffect(() => {
    refreshList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-white p-5">
        <div className="text-sm font-semibold">Transform rules</div>
        <div className="mt-1 text-sm text-zinc-600">
          Minimal UI for listing and generating transform rule sets.
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 space-y-4">
        <div>
          <div className="text-sm font-medium">Template</div>
          <select
            className="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
          >
            <option value="">Choose…</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.id})
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div>
            <div className="text-sm font-medium">Source version id</div>
            <input
              className="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm"
              value={sourceVersionId}
              onChange={(e) => setSourceVersionId(e.target.value)}
              placeholder="e.g. 069c... (required)"
            />
          </div>
          <div>
            <div className="text-sm font-medium">Target version id</div>
            <input
              className="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm"
              value={targetVersionId}
              onChange={(e) => setTargetVersionId(e.target.value)}
              placeholder="e.g. 069c... (required)"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="rounded-md border px-3 py-2 text-sm hover:bg-zinc-50"
            type="button"
            onClick={refreshList}
            disabled={loading || !templateId}
          >
            Refresh
          </button>
          <button
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            type="button"
            disabled={!templateId || !sourceVersionId || !targetVersionId}
            onClick={async () => {
              setLoading(true);
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
              } catch (e: any) {
                setError(e?.message ?? "Generate failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            Generate (draft)
          </button>
        </div>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}
      </div>

      <div className="rounded-xl border bg-white">
        <div className="border-b px-5 py-4">
          <div className="text-sm font-semibold">Rule sets</div>
        </div>
        {loading ? (
          <div className="px-5 py-8 text-sm text-zinc-500">Loading…</div>
        ) : list.length === 0 ? (
          <div className="px-5 py-8 text-sm text-zinc-500">No rule sets.</div>
        ) : (
          <pre className="overflow-auto p-5 text-xs leading-5">
            {JSON.stringify(list, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

