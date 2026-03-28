import React from "react";

type SchemaQuestion = {
  id?: string;
  unique_key?: string;
  label?: string;
  name?: string;
  field_type?: string;
  type?: string;
  required?: boolean;
  is_tenant_editable?: boolean;
};

type SchemaGroup = {
  id?: string;
  unique_key?: string;
  title?: string;
  name?: string;
  questions?: SchemaQuestion[];
  is_tenant_editable?: boolean;
};

type FormSchema = {
  title?: string;
  fields?: SchemaGroup[];
  question_groups?: SchemaGroup[];
};

const fieldTypeColors: Record<string, string> = {
  text: "bg-blue-50 text-blue-700 border-blue-200",
  email: "bg-purple-50 text-purple-700 border-purple-200",
  phone: "bg-green-50 text-green-700 border-green-200",
  number: "bg-amber-50 text-amber-700 border-amber-200",
  date: "bg-rose-50 text-rose-700 border-rose-200",
  file: "bg-indigo-50 text-indigo-700 border-indigo-200",
  select: "bg-teal-50 text-teal-700 border-teal-200",
};

function getTypeColor(type?: string) {
  return fieldTypeColors[type ?? "text"] ?? "bg-zinc-100 text-zinc-600 border-zinc-200";
}

const fieldTypeIcons: Record<string, React.ReactNode> = {
  text: <span title="Text">Aa</span>,
  email: <span title="Email">@</span>,
  phone: <span title="Phone">📞</span>,
  number: <span title="Number">#</span>,
  date: <span title="Date">📅</span>,
  file: <span title="File">📎</span>,
  select: <span title="Select">▾</span>,
};

function getTypeIcon(type?: string) {
  return fieldTypeIcons[type ?? "text"] ?? <span>?</span>;
}

export function SchemaTreePreview({ schema }: { schema: FormSchema }) {
  const groups: SchemaGroup[] = schema.fields ?? schema.question_groups ?? [];

  // De-duplicate groups by unique_key (keeping the last occurrence which usually has is_tenant_editable)
  const seen = new Set<string>();
  const deduped: SchemaGroup[] = [];
  for (const group of [...groups].reverse()) {
    const key = group.unique_key ?? group.title ?? group.id ?? "";
    if (!seen.has(key)) {
      seen.add(key);
      deduped.unshift(group);
    }
  }

  if (!deduped.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-zinc-500">
        <p className="text-sm font-medium">No fields defined</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {deduped.map((group, gi) => {
        const groupLabel = group.title ?? group.name ?? group.unique_key ?? `Group ${gi + 1}`;
        const questions = group.questions ?? [];

        return (
          <div key={group.id ?? gi} className="rounded-lg overflow-hidden border border-zinc-200 bg-white shadow-sm">
            {/* Group Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 flex items-center justify-center rounded bg-zinc-900 text-white text-xs font-bold">
                  {gi + 1}
                </div>
                <span className="text-sm font-semibold text-zinc-900">{groupLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                {group.is_tenant_editable !== undefined && (
                  <span className={`text-[10px] font-semibold border px-1.5 py-0.5 rounded uppercase tracking-wider ${group.is_tenant_editable ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-zinc-100 text-zinc-500 border-zinc-200"}`}>
                    {group.is_tenant_editable ? "Extendable" : "Baseline"}
                  </span>
                )}
                <span className="text-xs text-zinc-400">{questions.length} field{questions.length !== 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Questions */}
            {questions.length > 0 ? (
              <ul className="divide-y divide-zinc-100">
                {questions.map((q, qi) => {
                  const label = q.label ?? q.name ?? q.unique_key ?? `Field ${qi + 1}`;
                  const type = q.field_type ?? q.type ?? "text";
                  return (
                    <li key={q.id ?? qi} className="flex items-center justify-between px-4 py-2.5 hover:bg-zinc-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex items-center justify-center h-7 w-7 shrink-0 rounded border text-xs font-bold ${getTypeColor(type)}`}>
                          {getTypeIcon(type)}
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-zinc-900 truncate block">{label}</span>
                          {q.unique_key && (
                            <span className="text-[10px] font-mono text-zinc-400">{q.unique_key}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <span className={`text-[10px] font-semibold border px-1.5 py-0.5 rounded uppercase tracking-wider ${getTypeColor(type)}`}>
                          {type}
                        </span>
                        {q.required && (
                          <span className="text-[10px] font-bold text-red-500 border border-red-200 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Required
                          </span>
                        )}
                        {q.is_tenant_editable === false && (
                          <span className="text-[10px] font-semibold text-zinc-500 border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Locked
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-4 py-3 text-sm text-zinc-400 italic">No questions in this group</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
