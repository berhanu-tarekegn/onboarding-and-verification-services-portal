import { api } from "@/lib/api";
import Link from "next/link";
import React from "react";

export default async function AdminDashboardPage() {
  const tenants = await api.listTenants();
  const baselines = await api.listBaselineTemplates();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Overview Block */}
      <div className="bg-white p-6 rounded-lg border border-zinc-200">
        <h1 className="text-xl font-semibold text-zinc-900">Platform Overview</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Super Admin dashboard for managing global operations, tenants, and baseline schemas.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tenants Card */}
        <div className="sleek-card p-6 flex flex-col group hover:border-zinc-800 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-100 text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-zinc-900">Total Tenants</h2>
          </div>
          <div className="mb-4">
            <span className="text-4xl font-bold text-zinc-900">{tenants.length}</span>
          </div>
          <Link
            href="/tenants"
            className="mt-auto text-sm font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors"
          >
            Manage workspaces <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* Baseline Templates Card */}
        <div className="sleek-card p-6 flex flex-col group hover:border-zinc-800 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-zinc-900">Baseline Templates</h2>
          </div>
          <div className="mb-4">
            <span className="text-4xl font-bold text-zinc-900">{baselines.length}</span>
          </div>
          <Link
            href="/baselines"
            className="mt-auto text-sm font-medium text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          >
            Manage global forms <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
