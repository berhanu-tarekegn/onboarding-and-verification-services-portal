"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useFieldArray, Control, UseFormRegister } from "react-hook-form";

type Question = {
  name: string;
  type: string;
  required: boolean;
};

type QuestionGroup = {
  title: string;
  questions: Question[];
};

type BaselineForm = {
  name: string;
  category: string;
  template_type: string;
  level: number;
  question_groups: QuestionGroup[];
};

function GroupEditor({
  groupIndex,
  control,
  register,
  removeGroup,
}: {
  groupIndex: number;
  control: Control<BaselineForm>;
  register: UseFormRegister<BaselineForm>;
  removeGroup: (index: number) => void;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `question_groups.${groupIndex}.questions`,
  });

  return (
    <div className="border border-zinc-200 rounded-lg bg-zinc-50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <input
          {...register(`question_groups.${groupIndex}.title` as const, { required: true })}
          className="bg-transparent border-b border-zinc-300 px-1 py-1 text-base font-semibold text-zinc-900 focus:border-zinc-900 focus:outline-none placeholder:text-zinc-400"
          placeholder="Group Title (e.g., Identity)"
        />
        <button
          type="button"
          onClick={() => removeGroup(groupIndex)}
          className="text-red-500 hover:text-red-700 p-1 transition-colors"
          title="Remove Group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {fields.map((question, qIndex) => (
          <div key={question.id} className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-md border border-zinc-200 items-start sm:items-center">
            <div className="flex-1">
              <input
                {...register(`question_groups.${groupIndex}.questions.${qIndex}.name` as const, { required: true })}
                className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-900 focus:outline-none"
                placeholder="Question Name"
              />
            </div>
            <div className="w-full sm:w-32">
              <select
                {...register(`question_groups.${groupIndex}.questions.${qIndex}.type` as const)}
                className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm bg-white focus:border-zinc-900 focus:outline-none"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="file">File Upload</option>
              </select>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register(`question_groups.${groupIndex}.questions.${qIndex}.required` as const)}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                />
                <span className="text-xs font-medium text-zinc-700">Required</span>
              </label>
              <button
                type="button"
                onClick={() => remove(qIndex)}
                className="ml-auto text-zinc-400 hover:text-red-500 transition-colors p-1"
                title="Remove Question"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => append({ name: "", type: "text", required: false })}
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Question
      </button>
    </div>
  );
}

export default function CreateBaselinePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, control, handleSubmit, formState: { errors } } = useForm<BaselineForm>({
    defaultValues: {
      name: "",
      category: "general",
      template_type: "kyc",
      level: 1,
      question_groups: [
        {
          title: "Identity",
          questions: [
            { name: "First Name", type: "text", required: true },
            { name: "Last Name", type: "text", required: true }
          ]
        }
      ]
    }
  });

  const { fields: groupFields, append: appendGroup, remove: removeGroup } = useFieldArray({
    control,
    name: "question_groups",
  });

  const onSubmit = async (data: BaselineForm) => {
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        name: data.name,
        category: data.category,
        template_type: data.template_type,
        level: Number(data.level),
        initial_version: {
          version_tag: "v1.0.0",
          question_groups: data.question_groups,
        }
      };

      const baseline = await api.createBaselineTemplate(payload);
      router.push(`/baselines/${baseline.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create baseline template.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
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

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 p-6 rounded-lg border border-zinc-100">
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
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              >
                <option value="kyc">KYC</option>
                <option value="kyb">KYB</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-900">Baseline Level</label>
              <select
                {...register("level")}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              >
                <option value="1">Level 1 (Basic)</option>
                <option value="2">Level 2 (Intermediate)</option>
                <option value="3">Level 3 (Advanced/EDD)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
              <h3 className="text-base font-semibold text-zinc-900">Schema Builder</h3>
              <span className="text-xs text-zinc-500 px-2 py-1 rounded bg-zinc-100">Visual Editor</span>
            </div>
            
            <div className="space-y-6">
              {groupFields.map((group, index) => (
                <GroupEditor
                  key={group.id}
                  groupIndex={index}
                  control={control}
                  register={register}
                  removeGroup={removeGroup}
                />
              ))}

              <button
                type="button"
                onClick={() => appendGroup({ title: "New Group", questions: [] })}
                className="w-full py-4 border-2 border-dashed border-zinc-300 rounded-lg text-sm font-medium text-zinc-600 hover:border-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Question Group
              </button>
            </div>
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
              className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                 <>
                   <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Creating Baseline...
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
