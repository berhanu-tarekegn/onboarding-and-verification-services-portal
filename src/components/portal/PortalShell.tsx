"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { getMockRole } from "@/lib/rbac/mockRole";
import { canAccessRoute, type RouteKey } from "@/lib/rbac/roles";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState<string>("unknown");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setRole(getMockRole());
    setMounted(true);
  }, []);

  const NavLinks = () => {
    if (!mounted) return null;

    const visibleNav = nav.filter((item) => {
      if (!item.routeKey) return true;
      return canAccessRoute(role as any, item.routeKey as RouteKey);
    });

    return (
      <>
        {visibleNav.map((item) => {
        const isActive =
          pathname.startsWith(item.href) &&
          (item.href !== "/" || pathname === "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
              isActive
                ? "bg-zinc-900 text-white"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      </>
    );
  };

  return (
    <div className="min-h-dvh flex bg-zinc-50">
      {/* ── Sidebar (desktop) ───────────────────────────────── */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-zinc-200 bg-white">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight text-zinc-900">eKYC Portal</div>
            <div className="text-xs text-zinc-400">Administration</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <NavLinks />
        </nav>

        {/* User */}
        <div className="border-t border-zinc-200 p-3">
          <div className="flex items-center justify-between gap-2 rounded-md px-2 py-2 hover:bg-zinc-100 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white text-xs font-bold">
                {role === "unknown" ? "..." : role === "super_admin" ? "SA" : "TA"}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-zinc-900 truncate">
                  {role === "unknown" ? "Loading..." : role === "super_admin" ? "Super Admin" : "Tenant Admin"}
                </div>
                <div className="text-xs text-zinc-400 truncate">
                  {role === "unknown" ? "..." : role === "super_admin" ? "super@kifiya.com" : "admin@tenant.com"}
                </div>
              </div>
            </div>
            
            <Link href="/login" onClick={() => { localStorage.removeItem("mock_role"); }} className="text-zinc-400 hover:text-red-500 transition-colors p-1" title="Sign Out">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </Link>
          </div>
        </div>
      </aside>

      {/* ── Mobile sidebar overlay ──────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-zinc-900">eKYC Portal</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-zinc-400 hover:text-zinc-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <NavLinks />
        </nav>
      </aside>

      {/* ── Main content ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 glass">
          <div className="flex items-center justify-between px-5 sm:px-8 py-4">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                className="md:hidden mr-1 text-zinc-500 hover:text-zinc-900 transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <div>
                <h1 className="text-base font-semibold tracking-tight text-zinc-900">{title}</h1>
                {subtitle && (
                  <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
