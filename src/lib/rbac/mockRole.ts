import type { Role } from "@/lib/types/domain";
import { allRoles } from "./roles";

const KEY = "mock_role";

export function getMockRole(): Role {
  if (typeof window === "undefined") return "tenant_admin";
  const raw = window.localStorage.getItem(KEY);
  if (raw && (allRoles as string[]).includes(raw)) return raw as Role;
  return "tenant_admin";
}

export function setMockRole(role: Role) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, role);
}

