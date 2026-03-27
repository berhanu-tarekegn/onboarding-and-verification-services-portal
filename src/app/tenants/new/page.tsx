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

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PortalShell } from "@/components/portal/PortalShell";
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
    <PortalShell
      title="Create Workspace"
      subtitle="Provision a new tenant environment and database schema."
      nav={[
        { label: "Workspaces", href: "/tenants", routeKey: "tenants" }
      ]}
    >
      <div className="max-w-xl mx-auto sleek-card glass p-8 mt-4">
        <form 
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!canSave) return;
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
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
              <p className="text-sm text-red-600 dark:text-red-400"><span className="font-bold">Error:</span> {error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">Workspace Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              placeholder="e.g. Acme Corporation"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">Database Schema Name</label>
            <input
              type="text"
              value={schemaName}
              onChange={(e) => setSchemaName(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all font-mono"
              placeholder={suggestedSchema || "e.g. acme_corp"}
            />
            <p className="mt-2 text-xs text-zinc-500 dark:text-slate-400">
              Will create a Postgres schema like <code>{effectiveSchema || "…"}</code>.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={saving}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 dark:text-slate-300 hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !canSave}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 shadow-sm disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Workspace"
              )}
            </button>
          </div>
        </form>
      </div>
    </PortalShell>
  );
}

