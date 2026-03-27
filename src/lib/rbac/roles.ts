import type { Role } from "@/lib/types/domain";

export const allRoles: Role[] = ["super_admin", "tenant_admin", "agent", "auditor"];

export function canAccessRoute(role: Role, routeKey: RouteKey): boolean {
  const allowed = routePermissions[routeKey];
  return allowed.includes(role);
}

export type RouteKey =
  | "tenants"
  | "tenant_dashboard"
  | "tenant_products"
  | "tenant_templates_baseline"
  | "tenant_templates_extensions"
  | "tenant_cases";

const routePermissions: Record<RouteKey, Role[]> = {
  tenants: ["super_admin"],
  tenant_dashboard: ["super_admin", "tenant_admin", "agent", "auditor"],
  tenant_products: ["super_admin", "tenant_admin"],
  tenant_templates_baseline: ["super_admin"],
  tenant_templates_extensions: ["super_admin", "tenant_admin"],
  tenant_cases: ["super_admin", "tenant_admin", "agent", "auditor"],
};

