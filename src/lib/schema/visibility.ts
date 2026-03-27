import type { FieldSchema } from "@/lib/types/domain";

export function isFieldVisible(
  field: FieldSchema,
  values: Record<string, unknown>
): boolean {
  if (!field.dependsOn) return true;
  if (field.visibleWhenEquals === undefined || field.visibleWhenEquals === null) {
    return true;
  }

  const dependentValue = values[field.dependsOn];
  const condition = field.visibleWhenEquals;

  if (Array.isArray(condition)) {
    return condition.includes(dependentValue);
  }

  return dependentValue === condition;
}

