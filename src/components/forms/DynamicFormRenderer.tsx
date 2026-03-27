"use client";

/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import type { FieldSchema, FormSchema } from "@/lib/types/domain";
import { isFieldVisible } from "@/lib/schema/visibility";

type Values = Record<string, unknown>;

export function DynamicFormRenderer({
  schema,
  onSubmit,
  submitLabel = "Submit",
}: {
  schema: FormSchema;
  onSubmit: (values: Values) => Promise<void> | void;
  submitLabel?: string;
}) {
  const validator = useMemo(() => buildZodSchema(schema), [schema]);

  const methods = useForm<Values>({
    // Dynamic schemas don't have a stable static TypeScript shape.
    resolver: zodResolver(validator as any) as any,
    defaultValues: schema.fields.reduce<Values>((acc, f) => {
      if (f.defaultValue !== undefined) acc[f.id] = f.defaultValue;
      return acc;
    }, {}),
    mode: "onBlur",
  });

  const values = methods.watch();
  const visibleFields = schema.fields.filter((f) => isFieldVisible(f, values));

  return (
    <FormProvider {...methods}>
      <form
        className="space-y-4"
        onSubmit={methods.handleSubmit(async (vals) => {
          await onSubmit(vals);
        })}
      >
        {visibleFields.map((field) => (
          <Field key={field.id} field={field} />
        ))}

        <div className="pt-4 border-t border-zinc-100 dark:border-slate-800">
          <button
            type="submit"
            className="w-full sm:w-auto rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-500 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand-500/50 shadow-sm shadow-brand-500/20 transition-all font-bold uppercase tracking-wider disabled:opacity-50"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

function Field({ field }: { field: FieldSchema }) {
  const { register, formState } = useFormContextCompat();
  const error = formState.errors[field.id];
  const message = typeof error?.message === "string" ? error.message : undefined;

  switch (field.type) {
    case "text":
      return (
        <LabeledField label={field.label} required={field.required} error={message}>
          <input
            className={inputClass(!!message)}
            {...register(field.id)}
            placeholder={field.label}
          />
        </LabeledField>
      );

    case "date":
      return (
        <LabeledField label={field.label} required={field.required} error={message}>
          <input className={inputClass(!!message)} type="date" {...register(field.id)} />
        </LabeledField>
      );

    case "dropdown":
      return (
        <LabeledField label={field.label} required={field.required} error={message}>
          <select className={inputClass(!!message)} {...register(field.id)}>
            <option value="">Select…</option>
            {(field.options ?? []).map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </LabeledField>
      );

    case "radio":
      return (
        <LabeledField label={field.label} required={field.required} error={message}>
          <div className="grid gap-2">
            {(field.options ?? []).map((o) => (
              <label key={o} className="flex items-center gap-2 text-sm">
                <input type="radio" value={o} {...register(field.id)} />
                <span>{o}</span>
              </label>
            ))}
          </div>
        </LabeledField>
      );

    case "checkbox":
      return (
        <div className="rounded-xl border border-zinc-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 hover:bg-zinc-50 dark:hover:bg-slate-800/50 transition-colors group">
          <label className="flex items-start gap-4 cursor-pointer">
            <div className="mt-1 flex items-center justify-center">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-zinc-300 text-brand-600 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 transition-all" 
                {...register(field.id)} 
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {field.label}
                {field.required ? <span className="text-red-500 ml-1">*</span> : null}
              </div>
              {message ? (
                <div className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  {message}
                </div>
              ) : null}
            </div>
          </label>
        </div>
      );

    // Placeholders for later integrations
    case "fileUpload":
    case "signature":
    case "imageCapture":
      return (
        <LabeledField label={field.label} required={field.required} error={message}>
          <input
            className={inputClass(!!message)}
            {...register(field.id)}
            placeholder={`(${field.type}) placeholder`}
          />
          <div className="mt-2 text-xs text-zinc-500">
            {field.type} input is not implemented yet.
          </div>
        </LabeledField>
      );
  }
}

function LabeledField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 shadow-sm">
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <label className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
          {label}
          {required ? <span className="text-red-500 ml-1">*</span> : null}
        </label>
        {error ? (
          <div className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded border border-red-200 dark:border-red-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        ) : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 shadow-sm",
    "bg-white dark:bg-slate-950 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-slate-600",
    hasError 
      ? "border-red-500 focus:ring-2 focus:ring-red-500/20" 
      : "border-zinc-200 dark:border-slate-700 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:focus:border-brand-500",
  ].join(" ");
}

function buildZodSchema(schema: FormSchema): z.ZodTypeAny {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of schema.fields) {
    let s: z.ZodTypeAny;
    switch (field.type) {
      case "checkbox":
        s = z.coerce.boolean();
        if (field.required) {
          s = s.refine((v) => v === true, { message: `${field.label} is required` });
        }
        break;

      default:
        {
          let str: any = z.coerce.string();
          if (field.required) {
            str = str.min(1, { message: `${field.label} is required` });
          } else {
            str = str.optional();
          }
          s = str as unknown as z.ZodTypeAny;
        }
        if (field.regex) {
          const re = new RegExp(field.regex);
          s = s.refine((v) => (v ? re.test(String(v)) : true), {
            message: `${field.label} format is invalid`,
          });
        }
        break;
    }
    shape[field.id] = s;
  }

  return z.object(shape);
}

function useFormContextCompat() {
  return useFormContext<Values>();
}

