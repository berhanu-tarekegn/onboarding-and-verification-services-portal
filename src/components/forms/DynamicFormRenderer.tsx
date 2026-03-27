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

        <div className="pt-2">
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
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
        <div className="rounded-lg border bg-white p-4">
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" {...register(field.id)} />
            <div>
              <div className="text-sm font-medium">
                {field.label}
                {field.required ? <span className="text-red-600"> *</span> : null}
              </div>
              {message ? <div className="mt-1 text-sm text-red-600">{message}</div> : null}
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
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-sm font-medium">
          {label}
          {required ? <span className="text-red-600"> *</span> : null}
        </label>
        {error ? <div className="text-sm text-red-600">{error}</div> : null}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full rounded-md border px-3 py-2 text-sm outline-none",
    "bg-white",
    hasError ? "border-red-500" : "border-zinc-200 focus:border-zinc-900",
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

