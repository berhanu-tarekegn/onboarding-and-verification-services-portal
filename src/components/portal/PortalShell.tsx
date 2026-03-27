"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type NavItem = {
  label: string;
  href: string;
  routeKey?: string;
};

export function PortalShell({
  title,
  subtitle,
  nav,
  children,
}: {
  title: string;
  subtitle?: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh flex bg-zinc-50 dark:bg-slate-900 transition-colors duration-300">
      <aside className="w-64 shrink-0 border-r border-zinc-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col transition-colors duration-300">
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-slate-800 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm shadow-brand-500/50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">eKYC Portal</div>
            <div className="text-xs text-zinc-500 dark:text-slate-400 font-medium">Administration</div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const isActive = pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400" 
                    : "text-zinc-600 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-slate-800/50 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-zinc-200 dark:border-slate-800">
          <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 shrink-0 shadow-sm" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-zinc-900 dark:text-white truncate">Admin User</div>
              <div className="text-xs text-zinc-500 dark:text-slate-400 trruncate">admin@kifiya.com</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 glass transition-colors duration-300">
          <div className="px-8 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
               {/* Header Actions Space */}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
