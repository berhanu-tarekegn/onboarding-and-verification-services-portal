"use client";

import React, { useState } from "react";
import type { FormSchema } from "@/lib/types/domain";

export function SchemaTreeView({ schema }: { schema: FormSchema }) {
  // If there are no fields, nothing to render
  const schemaFields = Array.isArray(schema.fields) ? schema.fields : [];
  
  if (schemaFields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500">
        Schema is empty.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 text-sm font-sans">
      <div className="text-zinc-200 font-medium mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-brand-500">
            <path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 0 1 8.75 1h2.5A2.75 2.75 0 0 1 14 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 0 1 6 4.193V3.75Zm6.5 0v.328a41.623 41.623 0 0 0-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25ZM10 10a1 1 0 0 0-1 1v5.028a1.5 1.5 0 0 0 2 0V11a1 1 0 0 0-1-1Z" clipRule="evenodd" />
        </svg>
        {schema.title || "Form Schema"}
      </div>

      <div className="space-y-4">
        {schemaFields.map((group: any, gIdx: number) => (
          <GroupNode key={group.unique_key || gIdx} group={group} />
        ))}
      </div>
    </div>
  );
}

function GroupNode({ group }: { group: any }) {
  const [expanded, setExpanded] = useState(true);
  const questions = group.questions || [];

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 overflow-hidden">
      <div 
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-zinc-700/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 text-zinc-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''} text-zinc-500`}
          >
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
          <div className="font-semibold">{group.title || group.unique_key}</div>
        </div>
        <div className="flex gap-2 text-xs">
           <span className="bg-zinc-900 px-2 py-0.5 rounded text-zinc-400 font-mono">{group.unique_key}</span>
           {group.is_tenant_editable === false ? (
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" /></svg>
                Read-only
              </span>
           ) : (
             <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">Extension</span>
           )}
        </div>
      </div>
      
      {expanded && (
        <div className="bg-zinc-900 border-t border-zinc-700/50">
          {questions.length > 0 ? (
            <div className="divide-y divide-zinc-800">
              {questions.map((q: any, qIdx: number) => (
                <QuestionNode key={q.unique_key || qIdx} question={q} />
              ))}
            </div>
          ) : (
            <div className="p-4 text-xs text-zinc-500 text-center italic">No fields in this group</div>
          )}
        </div>
      )}
    </div>
  );
}

function QuestionNode({ question }: { question: any }) {
  return (
    <div className="flex items-start justify-between p-4 hover:bg-zinc-800/30 transition-colors group">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-zinc-200">{question.label || question.unique_key}</span>
          {question.required && (
            <span className="text-red-400 text-xs font-bold" title="Required">*</span>
          )}
        </div>
        <div className="text-xs text-zinc-500 font-mono mt-1">{question.unique_key}</div>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-1 rounded">
          {question.field_type}
        </span>
        {question.is_tenant_editable === false ? (
          <span className="text-[10px] uppercase font-bold text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded" title=" inherited from baseline">
            Baseline
          </span>
        ) : (
          <span className="text-[10px] uppercase font-bold text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded" title="added in extension">
            Extension
          </span>
        )}
      </div>
    </div>
  );
}
