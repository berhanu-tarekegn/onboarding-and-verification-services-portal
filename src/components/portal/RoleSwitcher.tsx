"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import type { Role } from "@/lib/types/domain";
import { allRoles } from "@/lib/rbac/roles";
import { getMockRole, setMockRole } from "@/lib/rbac/mockRole";

export function RoleSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<Role>("tenant_admin");

  useEffect(() => {
    setMounted(true);
    setRole(getMockRole());
  }, []);

  return (
    <div className="rounded-lg border bg-zinc-50 p-3">
      <div className="text-xs font-medium text-zinc-700">Mock role</div>
      <div className="mt-2">
        <select
          className="w-full rounded-md border bg-white px-2 py-1.5 text-sm"
          value={role}
          disabled={!mounted}
          onChange={(e) => {
            const next = e.target.value as Role;
            setRole(next);
            setMockRole(next);
            window.location.reload();
          }}
        >
          {allRoles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-2 text-xs text-zinc-500">
        Controls sidebar visibility (mock-first).
      </div>
    </div>
  );
}

