"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

function toSchemaName(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
}

export default function NewTenantPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [schemaName, setSchemaName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestedSchema = useMemo(() => toSchemaName(name), [name]);
  const effectiveSchema = schemaName.trim().length ? schemaName.trim() : suggestedSchema;
  const canSave = name.trim().length > 0 && effectiveSchema.length > 0;

  return (
    <div className="mx-auto w-full max-w-xl space-y-4">
      <div className="rounded-xl border bg-white p-5">
        <div className="text-sm font-semibold">Create tenant</div>
        <div className="mt-1 text-sm text-zinc-600">
          Creates a new tenant in the backend (requires a unique schema name).
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 space-y-4">
        <div>
          <div className="text-sm font-medium">Tenant name</div>
          <input
            className="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme Bank"
          />
        </div>

        <div>
          <div className="text-sm font-medium">Schema name</div>
          <input
            className="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm"
            value={schemaName}
            onChange={(e) => setSchemaName(e.target.value)}
            placeholder={suggestedSchema || "e.g. commercial_bank"}
          />
          <div className="mt-2 text-xs text-zinc-500">
            Will create a Postgres schema like <code>{effectiveSchema || "…"}</code>.
          </div>
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
                const created = await api.createTenant({
                  name: name.trim(),
                  schema_name: effectiveSchema,
                });
                router.replace(`/tenants/${created.id}/dashboard`);
                router.refresh();
              } catch (e: any) {
                setError(e?.message ?? "Failed to create tenant");
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

