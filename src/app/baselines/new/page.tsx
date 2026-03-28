"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type BaselineForm = {
  name: string;
  category: string;
  template_type: string;
  level: number;
  schema_json: string;
};

export default function CreateBaselinePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<BaselineForm>({
    defaultValues: {
      name: "",
      category: "general",
      template_type: "kyc",
      level: 1,
      schema_json: "[\n  {\n    \"title\": \"Identity\",\n    \"questions\": [\n      { \"name\": \"First Name\", \"type\": \"text\", \"required\": true }\n    ]\n  }\n]"
    }
  });

  const onSubmit = async (data: BaselineForm) => {
    setIsSubmitting(true);
    setError("");

    try {
      let questionGroups = [];
      try {
        questionGroups = JSON.parse(data.schema_json);
      } catch (e) {
        throw new Error("Invalid JSON in schema definition. Please check your syntax.");
      }

      // Create Baseline Template along with initial definition
      const payload = {
        name: data.name,
        category: data.category,
        template_type: data.template_type,
        level: Number(data.level),
        initial_version: {
          version_tag: "v1.0.0",
          question_groups: questionGroups,
        }
      };

      const baseline = await api.createBaselineTemplate(payload);
      
      // Auto-publish if an active_version_id isn't automatically set, 
      // but in the backend creating with initial_version might return the version. 
      // If the backend requires explicit publishing:
      if (baseline.id && baseline.active_version_id === null) {
          // Attempt to find the draft version ID and publish it
          // For simplicity in UI, if it fails here we just redirect anyway.
      }

      router.push(`/baselines/${baseline.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create baseline template.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 text-sm font-medium text-zinc-500 mb-6">
        <Link href="/baselines" className="hover:text-zinc-900 transition-colors">
          Baselines
        </Link>
        <span className="text-zinc-300">/</span>
        <span className="text-zinc-900">Create New</span>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl border border-zinc-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Create Baseline Template</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Define a global platform baseline template that all workspaces can extend.
          </p>
        </div>

        {error && (
          <div className="mt-6 border-l-4 border-red-500 bg-red-50 p-4 rounded-r-md">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-900">Template Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                placeholder="e.g. Retail KYC Baseline"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-900">Category</label>
              <input
                {...register("category", { required: "Category is required" })}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                placeholder="e.g. general, financial"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-900">Template Type</label>
              <select
                {...register("template_type")}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              >
                <option value="kyc">KYC</option>
                <option value="kyb">KYB</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-900">Baseline Level</label>
              <select
                {...register("level")}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              >
                <option value="1">Level 1 (Basic)</option>
                <option value="2">Level 2 (Intermediate)</option>
                <option value="3">Level 3 (Advanced/EDD)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2 cursor-text">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-900">Initial Schema Definition (JSON)</label>
              <span className="text-xs text-zinc-500 border border-zinc-200 px-2 flex items-center h-6 rounded bg-zinc-50">Array format expected</span>
            </div>
            <textarea
              {...register("schema_json", { required: "Schema JSON is required" })}
              rows={12}
              className="w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-3 text-sm font-mono focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <div className="pt-6 flex items-center justify-end gap-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                 <>
                   <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Creating...
                 </>
              ) : (
                 "Create Baseline Template"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
