"use client";

import Link from "next/link";
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";

import type { Role } from "@/lib/types/domain";
import { canAccessRoute, type RouteKey } from "@/lib/rbac/roles";
import { getMockRole } from "@/lib/rbac/mockRole";

export type GuardedNavItem = {
  label: string;
  href: string;
  routeKey: RouteKey;
};

export function RoleGuardedNav({ items }: { items: GuardedNavItem[] }) {
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<Role>("tenant_admin");

  useEffect(() => {
    setMounted(true);
    setRole(getMockRole());
  }, []);

  const visible = useMemo(
    () => items.filter((i) => canAccessRoute(role, i.routeKey)),
    [items, role]
  );

  // Avoid SSR/client mismatch by rendering role-gated nav only after mount.
  if (!mounted) return null;

  return (
    <ul className="space-y-1">
      {visible.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

