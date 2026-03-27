import { api } from "@/lib/api";
import { mergeEffectiveSchema } from "@/lib/schema/mergeEffectiveSchema";
import type { FormSchema } from "@/lib/types/domain";
import Link from "next/link";

export default async function TemplateExtensionsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const baseline = await api.getBaselineTemplate();
  const extension = await api.getTenantExtensionTemplate(tenantId);

  const effective: FormSchema | undefined =
    baseline && extension && baseline.schema && extension.schema
      ? mergeEffectiveSchema({
          baseline: baseline.schema as FormSchema,
          extension: extension.schema as FormSchema,
        })
      : baseline?.schema
        ? (baseline.schema as FormSchema)
        : undefined;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Tenant extensions</div>
            <div className="mt-1 text-sm text-zinc-600">
              Tenant admins can add fields on top of the baseline. This page shows
              the tenant extension and an effective schema preview.
            </div>
          </div>
          <Link
            className="shrink-0 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            href={`/tenants/${tenantId}/templates/new`}
          >
            New template
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-white">
          <div className="border-b px-5 py-4">
            <div className="text-sm font-semibold">Tenant extension</div>
            <div className="text-sm text-zinc-500">
              tenant: <code>{tenantId}</code>
            </div>
          </div>
          <div className="p-5">
            {extension ? (
              <>
                <div className="text-sm font-medium">{extension.name}</div>
                <div className="mt-1 text-sm text-zinc-500">
                  version {extension.version} · published
                </div>
                <pre className="mt-4 overflow-auto rounded-lg border bg-zinc-50 p-4 text-xs leading-5">
                  {JSON.stringify(extension.schema ?? {}, null, 2)}
                </pre>
              </>
            ) : (
              <div className="text-sm text-zinc-500">
                No extension template found for this tenant.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-white">
          <div className="border-b px-5 py-4">
            <div className="text-sm font-semibold">Effective schema preview</div>
            <div className="text-sm text-zinc-500">
              baseline + extension merged in UI
            </div>
          </div>
          <div className="p-5">
            {effective ? (
              <pre className="overflow-auto rounded-lg border bg-zinc-50 p-4 text-xs leading-5">
                {JSON.stringify(effective, null, 2)}
              </pre>
            ) : (
              <div className="text-sm text-zinc-500">
                No baseline template available to preview.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

