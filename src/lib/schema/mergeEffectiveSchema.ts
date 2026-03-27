import type { FormSchema } from "@/lib/types/domain";

export function mergeEffectiveSchema({
  baseline,
  extension,
}: {
  baseline: FormSchema;
  extension?: FormSchema;
}): FormSchema {
  const baseFields = baseline.fields ?? [];
  const extFields = extension?.fields ?? [];

  const seen = new Set<string>();
  const merged = [];

  for (const f of baseFields) {
    if (seen.has(f.id)) continue;
    seen.add(f.id);
    merged.push(f);
  }

  for (const f of extFields) {
    if (seen.has(f.id)) {
      // Tenant extension cannot override baseline fields.
      continue;
    }
    seen.add(f.id);
    merged.push(f);
  }

  return {
    ...baseline,
    title: baseline.title,
    fields: merged,
  };
}

